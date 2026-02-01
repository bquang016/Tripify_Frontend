import React from "react";
import { Star, MapPin, ArrowRight, Heart, Wifi, Utensils, X } from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const MapHotelCard = ({ property, onClose, navigate }) => {
  
  let imageUrl = "/assets/images/placeholder.png";
  if (property.coverImage) {
      imageUrl = property.coverImage.startsWith("http") 
        ? property.coverImage 
        : `${API_BASE_URL}/images/${property.coverImage}`;
  }

  const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(property.minPrice || 0);

  // --- HÀM XỬ LÝ CLICK ---
  const handleNavigate = (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra map
      if (navigate) {
          // ✅ SỬA LỖI: Chuyển đúng đường dẫn /hotels/{id}
          navigate(`/hotels/${property.propertyId}`);
      }
  };

  return (
    <div 
        className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden font-sans cursor-pointer group hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 relative"
        onClick={handleNavigate} // Bắt sự kiện click cho toàn bộ thẻ
    >
      
      {/* Nút Đóng Popup (Góc trên phải) */}
      <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-2 right-2 z-20 bg-black/20 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
      >
          <X size={14} />
      </button>

      {/* Ảnh Header */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.propertyName} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => e.target.src = "/assets/images/placeholder.png"}
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                {property.propertyType}
            </span>
        </div>

        

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-1 text-xs font-medium opacity-90 mb-0.5">
                 <MapPin size={12} /> {property.city || "Việt Nam"}
            </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors" title={property.propertyName}>
                {property.propertyName}
            </h3>
            <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-blue-700">{property.rating || 0}</span>
            </div>
        </div>

        <div className="flex items-center gap-3 mb-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1"><Wifi size={12}/> Wifi free</span>
            <span className="flex items-center gap-1"><Utensils size={12}/> Ăn sáng</span>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-gray-100 border-dashed">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-medium line-through decoration-gray-300">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format((property.minPrice || 0) * 1.2)}
                </span>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-gray-900">{priceFormatted}</span>
                    <span className="text-xs text-gray-500 font-medium">/đêm</span>
                </div>
            </div>
            
            <button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2.5 shadow-lg shadow-blue-200 transition-colors flex items-center justify-center"
                // Nút này sẽ kích hoạt onClick của div cha, nên không cần gắn sự kiện riêng
            >
                <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MapHotelCard;