import React from "react";
import { Map as MapIcon, Check, Star, Navigation } from "lucide-react";

// Dùng ảnh map tĩnh làm nền (Placeholder đẹp)
const MAP_PLACEHOLDER = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80";

const HotelSidebar = ({ location, rating, minPrice, lat, lng }) => {

  const handleOpenMap = () => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    }
  };

  return (
    <div className="lg:col-span-4">
        <div className="sticky top-32 space-y-5">
            
            {/* 1. MAP CARD (ĐÃ SỬA LẠI TO HƠN) */}
            <div 
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm border border-gray-200 transition-all hover:shadow-lg"
                onClick={handleOpenMap}
            >
                {/* Tăng chiều cao từ h-40 lên h-56 để không bị che nút */}
                <div className="h-56 w-full overflow-hidden">
                    <img 
                        src={MAP_PLACEHOLDER} 
                        alt="Map Preview" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                    />
                    {/* Lớp phủ gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>

                {/* Nút "Xem bản đồ" nổi ở giữa (Đẩy lên trên một chút bằng -translate-y-4 để chắc chắn không bị che) */}
                <div className="absolute inset-0 flex items-center justify-center pb-8">
                    <div className="bg-white px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 text-[rgb(40,169,224)] font-bold text-sm transform group-hover:-translate-y-1 transition-transform duration-300 ring-4 ring-[rgb(40,169,224)]/10">
                        <MapIcon size={18} /> Xem trên bản đồ
                    </div>
                </div>

                {/* Thông tin địa chỉ ở dưới cùng */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-start gap-3 bg-white/90 backdrop-blur-sm border-t border-gray-100">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Navigation size={16} />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 font-medium leading-relaxed">
                        {location}
                    </p>
                </div>
            </div>

            {/* 2. HIGHLIGHTS CARD */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-800">Điểm nổi bật</h4>
                    {rating && (
                        <span className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">
                            <Star size={12} className="fill-yellow-700"/> {rating}
                        </span>
                    )}
                </div>
                
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-0.5 p-1 rounded-full bg-green-100 text-green-600">
                            <Check size={10} strokeWidth={4} />
                        </div>
                        <span>Vị trí trung tâm, thuận tiện di chuyển</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-0.5 p-1 rounded-full bg-green-100 text-green-600">
                            <Check size={10} strokeWidth={4} />
                        </div>
                        <span>Lễ tân phục vụ 24/7</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-0.5 p-1 rounded-full bg-green-100 text-green-600">
                            <Check size={10} strokeWidth={4} />
                        </div>
                        <span>Hủy phòng miễn phí (tuỳ chính sách)</span>
                    </li>
                </ul>
            </div>

            {/* 3. CTA BUTTON */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
                <p className="text-sm text-slate-500">Giá tốt nhất chỉ từ</p>
                <p className="text-2xl font-extrabold text-[rgb(40,169,224)]">
                    {minPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice) : "Liên hệ"}
                    <span className="text-sm font-normal text-slate-400">/đêm</span>
                </p>
                <button 
                    onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    Chọn phòng ngay
                </button>
            </div>

        </div>
    </div>
  );
};

export default HotelSidebar;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             0.


































































