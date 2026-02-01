import React from "react";
import {
  CalendarDays,
  MapPin,
  Loader2,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Clock,
  CalendarCheck,
  Tag
} from "lucide-react";
import Button from "@/components/common/Button/Button";

// Helper lấy ảnh
const R2_PUBLIC_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";
const FALLBACK_IMAGE = "https://via.placeholder.com/300x200?text=Hotel";

const getImageUrl = (path) => {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  return `${R2_PUBLIC_URL}/${path.replace(/^\/+/, "")}`;
};
const BookingCard = ({ booking, onClick, onReviewClick }) => {

  // ==================================================================
  // 👇 [SỬA LẠI LOGIC TÍNH GIÁ] 
  // Backend trả về totalPrice là GIÁ ĐÃ GIẢM (Final Price).
  // Nên muốn hiện giá gốc, ta phải CỘNG NGƯỢC LẠI discount.
  // ==================================================================

  const discount = booking.discountAmount || 0;

  // Giá khách phải trả (Lấy trực tiếp từ DB vì DB đã lưu giá sau giảm)
  const finalPrice = booking.totalPrice;

  // Giá gốc (để hiển thị gạch ngang)
  const originalPrice = finalPrice + discount;

  const formatCurrency = (val) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(val);

  const renderStatusBadge = (status) => {
    // ... (Giữ nguyên code phần badge status của bạn) ...
    const config = {
      PENDING_PAYMENT: {
        style: "bg-orange-100 text-orange-700 border-orange-200",
        label: "Chờ thanh toán",
        icon: Clock,
      },
      CONFIRMED: {
        style: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Đã xác nhận",
        icon: CalendarCheck,
      },
      CHECKED_IN: {
        style: "bg-purple-100 text-purple-700 border-purple-200",
        label: "Đang lưu trú",
        icon: Building2,
      },
      COMPLETED: {
        style: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Hoàn thành",
        icon: CheckCircle2,
      },
      CANCELLED: {
        style: "bg-rose-100 text-rose-700 border-rose-200",
        label: "Đã hủy",
        icon: XCircle,
      },
    };

    const current = config[status] || {
      style: "bg-slate-100 text-slate-600 border-slate-200",
      label: status,
      icon: AlertCircle,
    };
    const Icon = current.icon;

    return (
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${current.style}`}>
        <Icon size={14} strokeWidth={2.5} />
          {current.label}
      </span>
    );
  };

  return (
      <div
          onClick={onClick}
          className={`group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-lg md:flex-row ${
              booking.status === "CANCELLED" ? "opacity-75 grayscale-[0.1]" : ""
          }`}
      >
        {/* ... (Giữ nguyên phần Image Section) ... */}
        <div className="relative h-48 w-full shrink-0 bg-slate-100 md:h-auto md:w-60">
          <img
              src={getImageUrl(booking.propertyImage)}
              alt={booking.propertyName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Hotel"; }}
          />
          <div className="absolute left-3 top-3 md:hidden">
            {renderStatusBadge(booking.status)}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            {/* ... (Giữ nguyên phần thông tin Property, Date, Room Type) ... */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="line-clamp-1 text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                  {booking.propertyName}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin size={14} className="text-slate-400"/> {booking.propertyAddress}
                </p>
              </div>
              <div className="hidden md:block shrink-0">
                {renderStatusBadge(booking.status)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Nhận phòng</p>
                  <p className="font-bold text-slate-700">
                    {new Date(booking.checkInDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Loại phòng</p>
                  <p className="truncate font-bold text-slate-700 max-w-[120px]" title={booking.roomName}>
                    {booking.roomName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
            <div>
              {/* ... (Giữ nguyên logic hiển thị trạng thái Refund) ... */}
              {booking.paymentStatus === "REFUND_REQUESTED" && (
                  <span className="mb-1 flex items-center gap-1 text-xs font-bold text-orange-600 animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Đang chờ hoàn tiền
              </span>
              )}
              {booking.paymentStatus === "REFUNDED" && (
                  <span className="mb-1 flex items-center gap-1 text-xs font-bold text-green-600">
                <CheckCircle2 size={12} /> Đã hoàn tiền
              </span>
              )}

              <p className="text-xs font-medium text-slate-400">Tổng thanh toán</p>

              {/* 👇 [UPDATE] Hiển thị giá tiền đã sửa logic */}
              <div className="flex flex-col items-start">
                {discount > 0 && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {/* Giá gốc (originalPrice) gạch ngang */}
                      <span className="text-xs text-gray-400 line-through decoration-slate-400">
                        {formatCurrency(originalPrice)}
                    </span>
                      {/* Badge hiển thị số tiền được giảm */}
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Tag size={10} /> -{formatCurrency(discount)}
                    </span>
                    </div>
                )}

                {/* Giá cuối cùng (finalPrice = totalPrice từ Backend) */}
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(finalPrice)}
                </p>
              </div>
            </div>

            {/* ... (Giữ nguyên các nút bấm Review/Detail) ... */}
            <div className="flex gap-2">
              {booking.status === "COMPLETED" && (
                  <>
                    {!booking.reviewed ? (
                        <Button
                            size="sm"
                            className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-none font-bold shadow-sm transition-transform hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReviewClick?.(booking, "create");
                            }}
                        >
                          <Star size={14} className="fill-yellow-900" />
                          Viết đánh giá
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="flex items-center gap-2 bg-indigo-600 text-white border-transparent hover:bg-indigo-700 font-bold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReviewClick?.(booking, "view");
                            }}
                        >
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          Xem đánh giá
                        </Button>
                    )}
                  </>
              )}
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                Chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookingCard;
