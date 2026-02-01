import React from "react";
import { MapPin, Star, Wifi, Coffee, Car, Check, ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";

// Cấu hình Base URL
const BASE_URL = "http://localhost:8386"; 

const HotelListCard = ({ hotel }) => {
  const navigate = useNavigate();

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/${imagePath}`;
  };
  const mainImage = getImageUrl(hotel.coverImage);

  let amenities = [];
  try {
    const amenitiesObj = hotel.amenitiesJson ? JSON.parse(hotel.amenitiesJson) : {};
    amenities = Object.keys(amenitiesObj).filter(key => amenitiesObj[key] === true);
  } catch (e) { amenities = []; }

  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderAmenityIcon = (key) => {
    switch (key.toLowerCase()) {
      case "wifi": return <Wifi size={14} />;
      case "parking": return <Car size={14} />;
      case "breakfast": return <Coffee size={14} />;
      default: return <Check size={14} />;
    }
  };

  // --- GIAO DIỆN ĐÃ ĐIỀU CHỈNH ---
  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col md:flex-row h-auto md:h-[260px]"
      onClick={() => navigate(`/hotels/${hotel.propertyId}`)}
    >
      
      {/* === LEFT: IMAGE SECTION === */}
      <div className="w-full md:w-[35%] h-52 md:h-full relative overflow-hidden">
        {/* Animation nhẹ (scale 1.05) */}
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
           <img
            src={mainImage}
            alt={hotel.propertyName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Error"; }}
          />
        </div>

        {/* Gradient nhẹ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50" />

        <div className="absolute top-3 left-3">
          {/* Badge dùng màu chủ đạo */}
          <span className="bg-white/95 backdrop-blur text-[rgb(40,169,224)] text-xs font-bold px-2.5 py-1 rounded shadow-sm uppercase">
            {hotel.propertyType}
          </span>
        </div>
      </div>

      {/* === RIGHT: CONTENT SECTION === */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        
        <div>
          <div className="flex justify-between items-start mb-1">
            <div>
              {/* Hover text dùng màu chủ đạo */}
              <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-[rgb(40,169,224)] transition-colors line-clamp-1">
                {hotel.propertyName}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin size={14} className="mr-1 text-gray-400 shrink-0" />
                <span className="line-clamp-1">
                  {hotel.address}, {hotel.city}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 ml-2">
               <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-base font-bold text-gray-800">{hotel.rating || "New"}</span>
               </div>
               <span className="text-xs text-gray-400">
                  {hotel.reviewCount > 0 ? `(${hotel.reviewCount})` : ""}
               </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {amenities.slice(0, 4).map((item, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-gray-500 text-xs border border-gray-100 capitalize">
                {renderAmenityIcon(item)} <span className="ml-1">{item}</span>
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="text-xs text-gray-400 flex items-center px-1">+{amenities.length - 4}</span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-dashed border-gray-200">
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">Giá phòng / đêm</span>
            
            {/* ✅ ĐÃ SỬA: Dùng chung size text-xl và màu chủ đạo cho cả khoảng giá */}
            <div className="flex items-baseline flex-wrap gap-1">
               {hotel.minPrice ? (
                  <>
                    <span className="text-xl font-bold text-[rgb(40,169,224)]">
                        {formatCurrency(hotel.minPrice)}
                    </span>
                    
                    {(hotel.maxPrice && hotel.minPrice !== hotel.maxPrice) && (
                       <>
                        <span className="text-gray-400 text-sm mx-1">-</span>
                        <span className="text-xl font-bold text-[rgb(40,169,224)]">
                            {formatCurrency(hotel.maxPrice)}
                        </span>
                       </>
                    )}
                  </>
               ) : (
                  <span className="text-lg font-bold text-red-500">Liên hệ</span>
               )}
            </div>
            
            <span className="text-[10px] text-gray-500 mt-0.5">
              Đã bao gồm thuế & phí
            </span>
          </div>

          {/* Nút bấm dùng màu chủ đạo + hover sẫm hơn chút */}
          <Button 
            onClick={(e) => {
                e.stopPropagation(); 
                navigate(`/hotels/${hotel.propertyId}`)
            }}
            className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white rounded-lg px-4 py-2 h-10 text-sm shadow-sm transition-all"
          >
             Xem phòng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelListCard;