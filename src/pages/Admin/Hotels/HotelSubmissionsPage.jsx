import React, { useState, useEffect, useMemo } from "react";
import { Hotel, Loader2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

// Components
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Sub-components
import SubmissionSearchBar from "./components/SubmissionSearchBar";
import SubmissionTypeFilter from "./components/SubmissionTypeFilter";
import SubmissionStatusFilter from "./components/SubmissionStatusFilter";
import HotelSubmissionCard from "./components/HotelSubmissionCard";

// Modals
import ViewHotelSubmissionModal from "./components/ViewHotelSubmissionModal";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";

// Services
import adminService from "@/services/admin.service";

const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1")
    .replace("/api/v1", "");

const HotelSubmissionsPage = () => {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [toastData, setToastData] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("PENDING");

  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const ITEMS_PER_PAGE = 8;

  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  // Fetch Submissions
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      let data = [];

      if (filterStatus === "ALL") {
        const [pending, approved, rejected] = await Promise.allSettled([
          adminService.getPropertiesByStatus("PENDING"),
          adminService.getPropertiesByStatus("APPROVE"),
          adminService.getPropertiesByStatus("REJECTED")
        ]);

        if (pending.status === "fulfilled") data = [...data, ...pending.value];
        if (approved.status === "fulfilled") data = [...data, ...approved.value];
        if (rejected.status === "fulfilled") data = [...data, ...rejected.value];

      } else {
        let status = filterStatus === "APPROVED" ? "APPROVE" : filterStatus;
        data = await adminService.getPropertiesByStatus(status);
      }

      // ============================
      // FIXED — SIGNED URL MAPPING
      // ============================
      const mappedData = data.map((hotel) => {
        let images = [];

        try {
          if (Array.isArray(hotel.images)) {
            // hotel.images = ["signedURL", "signedURL", ...]
            images = hotel.images.map(img =>
                typeof img === "string" ? img : img.imageUrl
            );
          } else if (hotel.imageUrlsJson) {
            const raw = JSON.parse(hotel.imageUrlsJson);
            images = raw; // giữ nguyên signed URL
          }
        } catch (e) {
          images = [];
        }

        // DEFAULT placeholder
        let displayImage = "/assets/images/placeholder.png";

        // Signed URL → giữ nguyên, KHÔNG prepend API_BASE
        if (hotel.coverImage) {
          displayImage = hotel.coverImage;
        } else if (images.length > 0) {
          displayImage = images[0];
        }

        return {
          ...hotel,
          id: hotel.propertyId,
          hotelName: hotel.propertyName,
          ownerName: hotel.ownerName || hotel.owner?.fullName || "Chưa rõ",
          imageUrl: displayImage,
          images: images,
          submittedDate: hotel.createdAt
              ? new Date(hotel.createdAt).toLocaleDateString("vi-VN")
              : "N/A",
        };
      });

      mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllSubmissions(mappedData);

    } catch (error) {
      console.error(error);
      showToast("Lỗi tải dữ liệu. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, [filterStatus]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterType, filterStatus]);

  // Filtering
  const filteredSubmissions = useMemo(() => {
    let list = [...allSubmissions];

    if (filterType !== "ALL") {
      list = list.filter((s) => s.propertyType === filterType);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
          (s) =>
              s.hotelName?.toLowerCase().includes(q) ||
              s.ownerName?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allSubmissions, searchTerm, filterType]);

  // Paging
  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubmissions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubmissions, currentPage]);

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setIsViewOpen(true);
  };

  const handleApproveClick = (hotel) => {
    setSelectedHotel(hotel);
    setIsApproveOpen(true);
  };

  const handleRejectClick = (hotel) => {
    setSelectedHotel(hotel);
    setIsRejectOpen(true);
  };

  const closeModals = () => {
    setIsViewOpen(false);
    setIsApproveOpen(false);
    setIsRejectOpen(false);
    setTimeout(() => setSelectedHotel(null), 200);
  };

  const onConfirmApprove = async () => {
    if (!selectedHotel) return;
    setIsActionLoading(true);
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "APPROVE",
        reason: null,
      });
      showToast(`Đã phê duyệt "${selectedHotel.hotelName}"`, "success");
      await fetchSubmissions();
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi duyệt cơ sở", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedHotel) return;
    setIsActionLoading(true);
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "REJECTED",
        reason,
      });
      showToast(`Đã từ chối "${selectedHotel.hotelName}"`, "success");
      await fetchSubmissions();
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi từ chối cơ sở", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
      <>
        {toastData && (
            <div className="fixed top-24 right-6 z-[9999]">
              <Toast message={toastData.message} type={toastData.type} />
            </div>
        )}

        {isActionLoading && <LoadingOverlay message="Đang xử lý yêu cầu..." />}

        <Card className="overflow-hidden min-h-screen bg-gray-50/50 border-none shadow-none">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <CardHeader
                title="Quản lý Đơn đăng ký"
                subtitle="Phê duyệt và quản lý các cơ sở lưu trú mới"
                icon={<Hotel className="text-blue-600" />}
                className="p-0"
            />

            <Button
                variant="outline"
                size="sm"
                onClick={fetchSubmissions}
                leftIcon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
                className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Làm mới
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
            <div className="w-full overflow-x-auto pb-2 md:pb-0">
              <SubmissionStatusFilter currentStatus={filterStatus} onStatusChange={setFilterStatus} />
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="w-full md:w-2/3">
                <SubmissionSearchBar onSearch={setSearchTerm} initialValue={searchTerm} />
              </div>
              <div className="w-full md:w-1/3 flex justify-end">
                <SubmissionTypeFilter currentType={filterType} onTypeChange={setFilterType} />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-2" id="submission-grid">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Loader2 className="animate-spin text-blue-500 mb-3" size={42} />
                  <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
                </div>
            ) : filteredSubmissions.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {paginatedSubmissions.map((hotel) => (
                        <div key={hotel.id}>
                          <HotelSubmissionCard
                              hotel={hotel}
                              onViewDetails={() => handleViewDetails(hotel)}
                          />
                        </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                      <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                    <span className="text-sm text-gray-500">
                      Hiển thị <span className="font-semibold text-gray-700">{startItem}-{endItem}</span> trong tổng số <span className="font-semibold text-gray-700">{totalItems}</span> đơn
                    </span>

                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                                    currentPage === 1
                                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200"
                                }`}
                            >
                              <ChevronLeft size={18} />
                            </button>

                            {/* Page buttons */}
                            <div className="flex gap-1">
                              {(() => {
                                const delta = 1;
                                const range = [];
                                const rangeWithDots = [];
                                let l;

                                for (let i = 1; i <= totalPages; i++) {
                                  if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                                    range.push(i);
                                  }
                                }

                                range.forEach(i => {
                                  if (l) {
                                    if (i - l === 2) rangeWithDots.push(l + 1);
                                    else if (i - l !== 1) rangeWithDots.push("...");
                                  }
                                  rangeWithDots.push(i);
                                  l = i;
                                });

                                return rangeWithDots;
                              })().map((item, index) => (
                                  <button
                                      key={index}
                                      onClick={() => typeof item === "number" && handlePageChange(item)}
                                      disabled={item === "..."}
                                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center 
                              ${
                                          item === currentPage
                                              ? "bg-[rgb(40,169,224)] text-white shadow-sm"
                                              : item === "..."
                                                  ? "bg-transparent text-gray-400 cursor-default"
                                                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                      }
                            `}
                                  >
                                    {item}
                                  </button>
                              ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                                    currentPage === totalPages
                                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200"
                                }`}
                            >
                              <ChevronRight size={18} />
                            </button>

                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                              <span className="text-sm text-gray-500 whitespace-nowrap">Đi đến:</span>
                              <div className="relative">
                                <input
                                    type="text"
                                    className="w-12 h-8 pl-2 pr-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)] focus:ring-1 focus:ring-[rgb(40,169,224)] transition-all"
                                    placeholder={currentPage}
                                    value={jumpPage}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === "" || /^[0-9]+$/.test(val)) setJumpPage(val);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        const page = parseInt(jumpPage);
                                        if (!isNaN(page) && page >= 1 && page <= totalPages) {
                                          setCurrentPage(page);
                                          setJumpPage("");
                                        }
                                      }
                                    }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                </>
            ) : (
                <div className="col-span-full">
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <EmptyState
                        title="Không tìm thấy dữ liệu"
                        description="Danh sách hiện tại đang trống hoặc không khớp với bộ lọc."
                    />
                  </div>
                </div>
            )}
          </div>
        </Card>

        {selectedHotel && (
            <>
              <ViewHotelSubmissionModal
                  isOpen={isViewOpen}
                  onClose={closeModals}
                  submission={selectedHotel}
                  onApprove={handleApproveClick}
                  onReject={handleRejectClick}
              />

              <ApproveHotelModal
                  open={isApproveOpen}
                  onClose={closeModals}
                  application={{ hotelName: selectedHotel.hotelName }}
                  onConfirm={onConfirmApprove}
              />

              <RejectHotelModal
                  open={isRejectOpen}
                  onClose={closeModals}
                  application={{ hotelName: selectedHotel.hotelName }}
                  onConfirm={onConfirmReject}
              />
            </>
        )}
      </>
  );
};

export default HotelSubmissionsPage;