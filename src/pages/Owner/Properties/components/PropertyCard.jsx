import React from "react";
import { MapPin, Star, Edit, Eye, Clock, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { motion } from "framer-motion";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const PropertyCard = ({ property, onView, onEdit, onToggleStatus }) => {
  
  const isPending = property.propertyStatus === "PENDING";
  // Check nếu trạng thái là APPROVED (đã duyệt hoạt động)
  const isApproved = property.propertyStatus === "APPROVED" || property.propertyStatus === "APPROVE";
  const isRejected = property.propertyStatus === "REJECTED";
  
  // ✅ SỬA 1: Switch chỉ bật khi đã duyệt (Approved) VÀ đang Active
  const isSwitchOn = isApproved && property.active;

  // Logic click Edit
  const handleEditClick = () => {
    if ((isApproved || isPending) && onEdit) {
      onEdit();
    }
  };

  // Logic xử lý khi bấm vào Switch
  const handleSwitchClick = (e) => {
    e.preventDefault();   // Ngăn chặn hành vi mặc định
    e.stopPropagation();  // Ngăn sự kiện lan ra thẻ cha (tránh mở trang detail)
    
    // Nếu đang Pending hoặc Rejected thì không cho bấm
    if (isPending || isRejected) return;

    // Gọi hàm toggle từ cha
    if (onToggleStatus) {
        console.log("Switch clicked for:", property.propertyName); // Log kiểm tra
        onToggleStatus();
    }
  };

  const imageUrl = getFullImageUrl(property.coverImage);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* --- PHẦN 1: ẢNH BÌA --- */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.propertyName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${imageUrl ? 'hidden' : 'flex'}`}>
            <ImageIcon size={40} className="mb-2 opacity-40" />
            <span className="text-xs font-medium">Không có ảnh bìa</span>
        </div>
        
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3 z-10">
            {isPending && (
                <span className="bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <Clock size={14} className="mr-1.5" /> Chờ duyệt
                </span>
            )}
            
            {/* ✅ SỬA 2: Nếu Active = true -> Hiện "Đang hoạt động" */}
            {isApproved && property.active && (
                <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <CheckCircle2 size={14} className="mr-1.5" /> Đang hoạt động
                </span>
            )}

            {/* ✅ SỬA 3: Nếu Active = false -> Hiện "Tạm đóng" (Dù status vẫn là APPROVE) */}
            {isApproved && !property.active && (
                 <span className="bg-gray-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <AlertCircle size={14} className="mr-1.5" /> Tạm đóng
                </span>
            )}

             {isRejected && (
                <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <AlertCircle size={14} className="mr-1.5" /> Từ chối
                </span>
            )}
        </div>
        
        <div className="absolute bottom-3 left-3 z-10">
             <div className="flex items-center bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                {property.rating || "Mới"}
            </div>
        </div>
      </div>

      {/* --- PHẦN 2: NỘI DUNG CHÍNH --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors" title={property.propertyName}>
                {property.propertyName}
            </h3>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city}</span>
        </div>

        {/* --- GRID THÔNG TIN VÀ SWITCH --- */}
        <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-lg overflow-hidden mb-5 border border-gray-100">
             
             {/* Cột 1: Loại hình */}
             <div className="bg-gray-50 p-2.5 flex flex-col justify-center items-center group-hover:bg-blue-50/30 transition-colors">
                <p className="text-xs text-gray-500 mb-0.5">Loại hình</p>
                <p className="font-semibold text-gray-800 text-sm line-clamp-1 text-center px-1">
                  {property.propertyType}
                </p>
             </div>

             {/* Cột 2: Switch Trạng thái */}
             <div 
                className={`relative z-50 bg-gray-50 p-2.5 flex flex-col justify-center items-center transition-colors 
                  ${(!isPending && !isRejected) ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                onClick={handleSwitchClick} // Bắt sự kiện click ngay tại ô này
             >
                <p className="text-xs text-gray-500 mb-1.5 select-none">Trạng thái KS</p>
                
                {isPending || isRejected ? (
                   <span className="text-xs font-semibold text-gray-400 italic">
                      {isPending ? "Chờ duyệt" : "Bị từ chối"}
                   </span>
                ) : (
                  // Switch vẽ bằng div thuần túy
                  <div className="relative inline-flex items-center pointer-events-none">
                    {/* Phần nền (Track) */}
                    <div className={`w-9 h-5 rounded-full transition-colors duration-200 ease-in-out border border-transparent
                        ${isSwitchOn ? 'bg-[rgb(40,169,224)]' : 'bg-gray-300'}`} 
                    />
                    
                    {/* Phần nút tròn (Knob) */}
                    <div className={`absolute left-[2px] top-[2px] bg-white h-4 w-4 rounded-full shadow-sm ring-0 transition-transform duration-200 ease-in-out
                        ${isSwitchOn ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </div>
                )}
             </div>
        </div>

        {/* --- PHẦN 3: ACTIONS --- */}
        <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
          <Button
            variant={isApproved ? "outline" : "secondary"}
            className={`flex-1 ${!isApproved && !isPending ? "opacity-70 cursor-not-allowed" : "hover:border-blue-500 hover:text-blue-600"}`}
            size="sm"
            onClick={handleEditClick} 
            disabled={isRejected}
            leftIcon={<Edit size={16}/>}
          >
            Chỉnh sửa
          </Button>
          
          <Button
             variant="secondary"
             size="sm"
             iconOnly
             className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
             onClick={onView} 
             title="Xem chi tiết"
          >
              <Eye size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;