import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapEntryPoint = () => {
  const navigate = useNavigate();

  // Toạ độ mặc định để hiển thị ảnh map tĩnh (Hà Nội)
  // Bạn có thể thay bằng toạ độ động nếu muốn map thay đổi theo địa điểm tìm kiếm
  const defaultCenter = "105.804817,21.028511"; 
  
  // URL ảnh tĩnh từ Mapbox
  const mapStaticUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${defaultCenter},14,0/400x200?access_token=${MAPBOX_TOKEN}`;

  return (
    <div 
      className="w-full h-[120px] rounded-xl overflow-hidden relative cursor-pointer shadow-md border border-gray-200 group mb-6"
      onClick={() => navigate('/explore')} // Chuyển hướng sang trang bản đồ full
    >
      {/* Ảnh nền Mapbox Tĩnh */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${mapStaticUrl}')` }}
      >
        {/* Lớp phủ mờ để làm nổi bật nút bấm */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Nút bấm ở giữa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform group-hover:scale-105 active:scale-95">
           <MapPin size={16} />
           Khám phá ngay trên bản đồ
        </button>
      </div>

      {/* Marker giả lập (Optional - Trang trí thêm cho giống Traveloka) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8 pointer-events-none">
         <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md animate-bounce"></div>
      </div>
    </div>
  );
};

export default MapEntryPoint;