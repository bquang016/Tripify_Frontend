import React, { forwardRef } from "react";
import { MapPin, User, Eye, Clock, CheckCircle, XCircle, Hotel, Home, Building, Calendar } from "lucide-react";
import Button from "@/components/common/Button/Button";

// URL Base cho ảnh (Cập nhật theo port backend của bạn)
const API_IMAGE_BASE = "http://localhost:8386/uploads/";

// 1. Helper: Cấu hình Badge trạng thái
const getStatusConfig = (status) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Đang chờ duyệt",
        className: "bg-yellow-100 text-yellow-700 border-yellow-300 ring-2 ring-yellow-400/50 shadow-sm animate-pulse",
        icon: <Clock size={14} className="animate-spin-slow" />
      };
    case "APPROVED":
    case "APPROVE": 
      return {
        label: "Đã phê duyệt",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle size={14} />
      };
    case "REJECTED":
      return {
        label: "Đã từ chối",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle size={14} />
      };
    default:
      return {
        label: status || "Không xác định",
        className: "bg-gray-100 text-gray-600 border-gray-200",
        icon: null
      };
  }
};

// 2. Helper: Icon loại hình
const getTypeIcon = (type) => {
    switch (type) {
        case "HOTEL": return <Hotel size={14} />;
        case "VILLA": return <Home size={14} />;
        case "HOMESTAY": return <Building size={14} />;
        default: return <Hotel size={14} />;
    }
};

// 3. Helper: Xử lý URL ảnh
const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_IMAGE_BASE}${path}`;
};

// [QUAN TRỌNG] Sử dụng forwardRef để fix lỗi animation
const HotelSubmissionCard = forwardRef(({ hotel, onViewDetails }, ref) => {
  if (!hotel) return null;

  const statusConfig = getStatusConfig(hotel.propertyStatus);
  
  // Xử lý ảnh bìa
  const coverImage = getImageUrl(hotel.imageUrl) || "https://placehold.co/600x400?text=No+Image";
  
  // Xử lý Avatar Owner
  const ownerAvatar = getImageUrl(hotel.ownerAvatar);
  const ownerInitial = hotel.ownerName ? hotel.ownerName.charAt(0).toUpperCase() : "U";

  return (
    <div 
      ref={ref} // Gắn ref vào thẻ div ngoài cùng
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={onViewDetails}
    >
      {/* === HEADER ẢNH === */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={hotel.hotelName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => e.target.src = "https://placehold.co/600x400?text=Error"}
        />
        
        {/* Badge Trạng thái */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md ${statusConfig.className}`}>
            {statusConfig.icon}
            {statusConfig.label}
        </div>

        {/* Badge Loại hình */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
            {getTypeIcon(hotel.propertyType)}
            {hotel.propertyType}
        </div>
      </div>

      {/* === BODY === */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Tên & Địa chỉ */}
        <div>
          <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-[rgb(40,169,224)] transition-colors" title={hotel.hotelName}>
            {hotel.hotelName || "Tên chưa cập nhật"}
          </h3>
          <div className="flex items-start gap-1.5 text-gray-500 text-xs mt-1">
            <MapPin size={14} className="shrink-0 mt-0.5 text-red-400" />
            <span className="line-clamp-2">{hotel.address || "Địa chỉ chưa cập nhật"}</span>
          </div>
        </div>

        {/* Thông tin Owner (Có Avatar) & Ngày gửi */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
             <div className="flex items-center gap-2.5 overflow-hidden">
                {/* Avatar Owner */}
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 overflow-hidden">
                    {ownerAvatar ? (
                        <img 
                            src={ownerAvatar} 
                            alt={hotel.ownerName} 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'} // Nếu lỗi ảnh thì ẩn đi để hiện fallback bên dưới
                        />
                    ) : (
                        <span className="text-xs font-bold">{ownerInitial}</span>
                    )}
                    {/* Fallback icon nếu không có avatar và img bị ẩn */}
                    {!ownerAvatar && <User size={14} className="hidden" />} 
                </div>
                
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate max-w-[100px]" title={hotel.ownerName}>
                        {hotel.ownerName || "Không tên"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">Chủ sở hữu</p> {/* Đã đổi tên */}
                </div>
             </div>

             <div className="text-right shrink-0">
                 <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    <Calendar size={12}/>
                    {hotel.submittedDate || "N/A"}
                 </div>
             </div>
        </div>
      </div>

      {/* === FOOTER ACTION === */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-center">
        <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-[rgb(40,169,224)] hover:text-white hover:border-[rgb(40,169,224)] transition-colors"
            onClick={(e) => {
                e.stopPropagation(); 
                onViewDetails();
            }}
        >
            <Eye size={14} className="mr-2"/> Xem chi tiết
        </Button>
      </div>
    </div>
  );
});

export default HotelSubmissionCard; 