import React from "react";
import {
  X, Calendar, MapPin, User, CreditCard,
  CheckCircle, AlertCircle, BedDouble, Receipt,
  Phone, Mail, UserCircle, Clock, ShieldAlert,
  RefreshCcw // Thêm icon hoàn tiền
} from "lucide-react";
import Button from "@/components/common/Button/Button"; // Đảm bảo đường dẫn import đúng

// --- HELPER XỬ LÝ ẢNH ---
const R2_PUBLIC_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";
const FALLBACK_IMAGE = "https://via.placeholder.com/800x400?text=Hotel";

const getImageUrl = (path) => {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  return `${R2_PUBLIC_URL}/${path.replace(/^\/+/, "")}`;
};


const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  onCancelClick,
  onRefundClick,
  onReviewClick,          // ⭐ thêm prop này
}) => {
  if (!isOpen || !booking) return null;

  // --- LOGIC TÍNH TOÁN MỚI ---
  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Xác định trạng thái
  const isCancelled = booking.status === "CANCELLED";
  const canReview = booking.status === "COMPLETED"; // ⭐ cho phép review khi hoàn thành

  // Lấy phí phạt (ưu tiên penaltyAmount, nếu không có thì lấy cancellationFee hoặc 0)
  const penaltyAmount = booking.penaltyAmount || booking.cancellationFee || 0;
  // Tính tổng thực nhận về
  const totalReceived = (booking.totalPrice || 0) - penaltyAmount;

  // Badge Booking Status
  const renderStatusBadge = () => {
    const config = {
      PENDING_PAYMENT: {
        text: "Chờ thanh toán",
        bg: "bg-amber-500",
        icon: AlertCircle,
      },
      CONFIRMED: {
        text: "Đã xác nhận",
        bg: "bg-blue-500",
        icon: CheckCircle,
      },
      CHECKED_IN: {
        text: "Đang lưu trú",
        bg: "bg-emerald-500",
        icon: BedDouble,
      },
      COMPLETED: {
        text: "Hoàn thành",
        bg: "bg-emerald-500",
        icon: CheckCircle,
      },
      CANCELLED: {
        text: "Đã hủy",
        bg: "bg-rose-500",
        icon: X,
      },
    };
    const current = config[booking.status] || config.PENDING_PAYMENT;
    const Icon = current.icon;

    return (
      <div
        className={`${current.bg} text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-md`}
      >
        <Icon size={16} /> {current.text}
      </div>
    );
  };

  // Badge Payment Status
  const renderPaymentBadge = () => {
    const status = booking.paymentStatus;
    let style = "bg-gray-100 text-gray-700";
    let label = "Chưa thanh toán";
    let Icon = AlertCircle;

    if (status === "APPROVED" || status === "PAID") {
      style = "bg-emerald-100 text-emerald-700";
      label = "Đã thanh toán";
      Icon = CheckCircle;
    } else if (status === "REFUNDED") {
      style = "bg-purple-100 text-purple-700";
      label = "Đã hoàn tiền";
      Icon = CheckCircle;
    } else if (status === "REFUND_REQUESTED") {
      style = "bg-orange-100 text-orange-700";
      label = "Chờ hoàn tiền";
      Icon = Clock;
    }

    return (
      <span
        className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${style}`}
      >
        <Icon size={12} /> {label}
      </span>
    );
  };

  const handlePayment = () => {
    alert("Vui lòng thanh toán qua ứng dụng hoặc tại quầy!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* --- 1. HEADER IMAGE --- */}
        <div className="relative h-40 shrink-0 bg-slate-800">
          <img
            src={getImageUrl(booking.propertyImage)}
            className="h-full w-full object-cover opacity-50"
            alt="header"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x400?text=Hotel";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-6">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-slate-300">
                <Receipt size={14} /> Mã đơn:{" "}
                <span className="font-mono font-bold text-white">
                  BK-{booking.bookingId}
                </span>
              </div>
              <h2 className="max-w-md truncate text-2xl font-bold text-white shadow-sm md:text-3xl">
                {booking.propertyName || "Tên khách sạn"}
              </h2>
            </div>
            <div className="hidden md:block">{renderStatusBadge()}</div>
          </div>
        </div>

        {/* --- 2. BODY CONTENT (Scrollable) --- */}
        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-slate-50/50 p-6">
          <div className="flex justify-center md:hidden">
            {renderStatusBadge()}
          </div>

          {/* Block 1: Thông tin Phòng */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 border-b pb-2 font-bold text-slate-800">
              <BedDouble size={18} className="text-[rgb(40,169,224)]" />{" "}
              Thông tin lưu trú
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-slate-500">Loại phòng</p>
                <p className="font-medium text-slate-800">
                  {booking.roomName}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm text-slate-500">Số lượng khách</p>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {booking.guestCount} người
                  </span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-slate-500">Nhận phòng</p>
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                  <Calendar size={16} />
                  <span className="font-bold">
                    {formatDate(booking.checkInDate)}
                  </span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-slate-500">Trả phòng</p>
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700">
                  <Calendar size={16} />
                  <span className="font-bold">
                    {formatDate(booking.checkOutDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 border-t border-dashed border-slate-200 pt-3 text-sm text-slate-500">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-slate-400"
              />
              {booking.propertyAddress || "Địa chỉ đang cập nhật"}
            </div>
          </div>

          {/* Block 2: Thông tin Khách hàng */}
          {booking.user && (
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 border-b pb-2 font-bold text-slate-800">
                <UserCircle size={18} className="text-[rgb(40,169,224)]" />{" "}
                Thông tin liên hệ
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Người đặt</p>
                    <p className="text-sm font-bold text-slate-800">
                      {booking.user.fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="max-w-[150px] truncate text-sm font-medium text-slate-800 sm:max-w-xs">
                      {booking.user.email}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Số điện thoại</p>
                    <p className="text-sm font-medium text-slate-800">
                      {booking.user.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Block 3: Thanh toán & Hoàn tiền */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <CreditCard size={18} className="text-[rgb(40,169,224)]" /> Chi
                tiết thanh toán
              </h3>
              {renderPaymentBadge()}
            </div>

            <div className="space-y-2">
              {/* Dòng 1: Giá gốc */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Giá trị đơn hàng</span>
                <span className="font-medium text-slate-700">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>

              {/* Dòng 2: Phí phạt (Chỉ hiện khi đã hủy) */}
              {isCancelled && penaltyAmount > 0 && (
                <div className="flex justify-between rounded bg-rose-50 p-2 text-sm text-rose-600">
                  <span>Phí phạt hủy</span>
                  <span>- {formatCurrency(penaltyAmount)}</span>
                </div>
              )}

              {/* Dòng 3: Tổng kết */}
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="font-bold text-slate-800">
                  {isCancelled ? "Tổng nhận được" : "Tổng thanh toán"}
                </span>
                <span
                  className={`text-xl font-bold ${
                    isCancelled ? "text-emerald-600" : "text-[rgb(40,169,224)]"
                  }`}
                >
                  {formatCurrency(
                    isCancelled ? totalReceived : booking.totalPrice
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Block 4: Policy */}
          <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-sm text-slate-600">
            <ShieldAlert
              size={20}
              className="shrink-0 text-[rgb(40,169,224)]"
            />
            <p>
              Miễn phí hủy phòng trong vòng 15 phút sau khi đặt. Sau đó áp dụng
              chính sách hoàn tiền của khách sạn. Vui lòng liên hệ bộ phận hỗ
              trợ nếu cần giúp đỡ.
            </p>
          </div>
        </div>

        {/* --- 3. FOOTER ACTIONS --- */}
        <div className="flex shrink-0 justify-end gap-3 border-t bg-white p-5">
          {/* Nút Hủy Phòng (Chỉ hiện khi chưa hủy) */}
          {!isCancelled &&
            (booking.status === "PENDING_PAYMENT" ||
              booking.status === "CONFIRMED") && (
              <Button
                className="border-none bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700"
                onClick={onCancelClick}
              >
                Hủy phòng
              </Button>
            )}

          {/* Nút Thanh toán (Chỉ hiện khi chờ thanh toán) */}
          {booking.status === "PENDING_PAYMENT" && (
            <Button variant="primary" onClick={handlePayment}>
              Thanh toán ngay
            </Button>
          )}

          {/* Nút Yêu Cầu Hoàn Tiền (Chỉ hiện khi Đã hủy + Đã thanh toán + Chưa hoàn) */}
          {isCancelled &&
            (booking.paymentStatus === "APPROVED" ||
              booking.paymentStatus === "PAID") &&
            booking.paymentStatus !== "REFUNDED" && (
              <Button
                onClick={onRefundClick}
                className="flex items-center gap-2 border-none bg-orange-500 text-white hover:bg-orange-600"
              >
                <RefreshCcw size={18} />
                Yêu cầu hoàn tiền
              </Button>
            )}

          {/* ⭐ Nút Đánh giá – tone xanh chủ đạo, chỉ khi COMPLETED */}
          {canReview && (
            <Button
              type="button"
              onClick={onReviewClick}
              className="rounded-full border border-[rgb(28,132,184)] bg-[rgb(40,169,224)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(30,145,198)]"
            >
              Đánh giá
            </Button>
          )}

          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
