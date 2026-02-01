import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Components UI
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import AccountMenu from "./AccountMenu";

// Modals
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";
import RequestRefundModal from "./RequestRefundModal";
import ReviewBookingModal from "./ReviewBookingModal";

// Services & Context
import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";
import { createRating, getRatingByBooking, updateRating } from "@/services/rating.service";
import { useAuth } from "@/context/AuthContext";

// Component BookingCard
import BookingCard from "./components/BookingCard";

const TABS = [
  { id: "upcoming", name: "Sắp tới" },
  { id: "cancelled", name: "Đã hủy" },
  { id: "all", name: "Tất cả" },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Data States
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
  const [activeTab, setActiveTab] = useState("upcoming");

  // Review
  const [reviewMode, setReviewMode] = useState("create"); // 'create' | 'view'
  const [existingReview, setExistingReview] = useState(null);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const showToast = (msg, type = "info") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "info" }), 3000);
  };

  // --- FETCH DATA ---
  const fetchBookings = async () => {
    if (!currentUser) return [];
    setLoading(true);
    try {
      const data = await bookingService.getBookingsByUserId(currentUser.userId);
      const list = (data || []).reverse();
      setBookings(list);
      return list;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // --- FILTER LOGIC ---
  const filteredBookings = useMemo(() => {
    if (activeTab === "upcoming") {
      return bookings.filter(
        (b) =>
          b.status === "CONFIRMED" ||
          b.status === "PENDING_PAYMENT" ||
          b.status === "CHECKED_IN"
      );
    }
    if (activeTab === "cancelled") {
      return bookings.filter((b) => b.status === "CANCELLED");
    }
    return bookings;
  }, [bookings, activeTab]);

  // ✅ LẤY BOOKING MỚI NHẤT CHO MODAL HOÀN TIỀN (TRÁNH DỮ LIỆU CŨ)
  const bookingForRefundModal = useMemo(() => {
    if (!selectedBooking?.bookingId) return null;
    return bookings.find((b) => b.bookingId === selectedBooking.bookingId) || selectedBooking;
  }, [bookings, selectedBooking]);

  // --- HANDLERS (Modal Control) ---
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleStartCancel = (booking) => {
    const targetBooking = booking || selectedBooking;
    setSelectedBooking(targetBooking);
    setIsDetailModalOpen(false);
    setTimeout(() => setIsCancelModalOpen(true), 200);
  };

  // ✅ HỦY & CHUYỂN HOÀN TIỀN
  const handleConfirmCancel = async (booking, reason) => {
    const targetBooking = booking || selectedBooking;
    if (!targetBooking) return;

    try {
      await bookingService.cancelBooking(targetBooking.bookingId, reason);
      showToast("Hủy đặt phòng thành công!", "success");

      // lấy list mới nhất
      const freshList = await fetchBookings();
      const updated = freshList.find((b) => b.bookingId === targetBooking.bookingId);

      // đóng modal hủy
      setIsCancelModalOpen(false);

      const pStatus = targetBooking.paymentStatus;
      const isPaid = pStatus === "APPROVED" || pStatus === "PAID" || pStatus === "COMPLETED";

      if (isPaid) {
        // ✅ set booking mới nhất (có refundAmount) rồi mở refund modal
        setSelectedBooking(updated || targetBooking);
        setTimeout(() => setIsRefundModalOpen(true), 300);
      } else {
        setTimeout(() => setSelectedBooking(null), 300);
      }
    } catch (err) {
      console.error("Cancel Error:", err);
      showToast(err?.message || "Lỗi khi hủy đơn.", "error");
    }
  };

  const handleOpenRefundModal = (booking) => {
    setSelectedBooking(booking);
    setIsRefundModalOpen(true);
    setIsDetailModalOpen(false);
  };

  // ✅ GỬI YÊU CẦU HOÀN TIỀN
  const handleConfirmRefundRequest = async (bookingId, refundData) => {
    if (!bookingId) return;

    try {
      const res = await paymentService.requestRefund(bookingId, refundData);
      showToast(res?.message || "Đã gửi yêu cầu hoàn tiền thành công!", "success");

      await fetchBookings();

      setIsRefundModalOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      const msg =
        err?.message ||
        err?.error ||
        err?.data?.message ||
        (typeof err === "string" ? err : null) ||
        "Lỗi khi gửi yêu cầu.";

      showToast(msg, "error");
    }
  };

  // --- REVIEW HANDLERS ---
  const handleOpenReviewModal = async (booking) => {
    setSelectedBooking(booking);

    const mode = booking.reviewed ? "view" : "create";
    setReviewMode(mode);

    if (mode === "view") {
      try {
        const res = await getRatingByBooking(booking.bookingId);
        const reviewData = res.content ? res.content[0] : (Array.isArray(res) ? res[0] : res);

        if (!reviewData) {
          console.warn("Backend says reviewed but no data found.");
          setReviewMode("create");
          setExistingReview(null);
        } else {
          setExistingReview(reviewData);
        }
      } catch (err) {
        console.error("Lỗi tải đánh giá:", err);
        showToast("Không thể tải đánh giá cũ.", "error");
        return;
      }
    } else {
      setExistingReview(null);
    }

    setIsDetailModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async ({ rating, comment, files }) => {
    try {
      if (!selectedBooking || !currentUser) throw new Error("Thiếu thông tin.");
      await createRating({
        bookingId: selectedBooking.bookingId,
        stars: rating,
        comment,
        files,
      });
      showToast("Cảm ơn bạn! Đánh giá đã được gửi thành công.", "success");
      setIsReviewModalOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      const uiMessage = err.response?.data?.message || err.message || "Gửi đánh giá thất bại.";
      throw new Error(uiMessage);
    }
  };

  const handleUpdateReview = async (ratingId, { rating, comment, files }) => {
    try {
      await updateRating(ratingId, {
        stars: rating,
        comment,
        files,
      });
      showToast("Đánh giá đã được cập nhật!", "success");
      setIsReviewModalOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error("Update error:", err);
      const uiMessage = err.response?.data?.message || err.message || "Cập nhật thất bại.";
      throw new Error(uiMessage);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* SIDEBAR */}
        <div className="lg:col-span-3">
          <AccountMenu activeSection="my-bookings" userData={currentUser} />
        </div>

        {/* MAIN */}
        <div className="space-y-6 lg:col-span-9">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Đặt chỗ của tôi</h2>
              <p className="text-sm text-slate-500">Quản lý các chuyến đi sắp tới và lịch sử đặt phòng.</p>
            </div>
          </div>

          <div className="border-b border-slate-200">
            <TabsComponent tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-10">
              <EmptyState title="Chưa có đơn đặt phòng nào" description="Bạn chưa có chuyến đi nào trong mục này." />
              <div className="mt-6 text-center">
                <Button size="lg" onClick={() => navigate("/hotels")}>
                  Tìm khách sạn ngay
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <BookingCard
                  key={b.bookingId}
                  booking={b}
                  onClick={() => handleViewDetails(b)}
                  onReviewClick={() => handleOpenReviewModal(b)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      <ToastPortal>
        {toast.show && (
          <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2">
            <Toast message={toast.msg} type={toast.type} />
          </div>
        )}
      </ToastPortal>

      {/* DETAIL MODAL */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
        onCancelClick={() => handleStartCancel(selectedBooking)}
        onRefundClick={() => handleOpenRefundModal(selectedBooking)}
        onReviewClick={() => handleOpenReviewModal(selectedBooking)}
      />

      {/* CANCEL MODAL */}
      <CancelBookingModal
        open={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          if (!isRefundModalOpen) setSelectedBooking(null);
        }}
        onConfirm={async (reason, otherReason) => {
          const finalReason = otherReason ? `${reason}: ${otherReason}` : reason;
          await handleConfirmCancel(selectedBooking, finalReason);
        }}
        booking={selectedBooking}
      />

      {/* REFUND MODAL */}
      <RequestRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={(data) => handleConfirmRefundRequest(bookingForRefundModal?.bookingId, data)}
        booking={bookingForRefundModal}
      />

      {/* REVIEW MODAL */}
      <ReviewBookingModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBooking}
        onSubmit={handleSubmitReview}
        onUpdate={handleUpdateReview}
        mode={reviewMode}
        initialData={existingReview}
      />
    </div>
  );
}
