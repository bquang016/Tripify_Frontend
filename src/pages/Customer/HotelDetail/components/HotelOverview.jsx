import React from "react";
import { 
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, Plane, PawPrint, 
  Dumbbell, Wind, ConciergeBell, Cigarette, CheckCircle2, Star 
} from "lucide-react";

// Cấu hình danh sách tiện nghi (Đồng bộ với trang Đăng ký của Owner)
const AMENITIES_CONFIG = [
  { id: "pool", label: "Hồ bơi", icon: <Waves size={24} /> },
  { id: "parking", label: "Bãi đỗ xe", icon: <ParkingCircle size={24} /> },
  { id: "sauna", label: "Phòng xông hơi", icon: <Droplet size={24} /> },
  { id: "spa", label: "Spa", icon: <Sparkles size={24} /> },
  { id: "non_smoking", label: "Không hút thuốc", icon: <Ban size={24} /> },
  { id: "wifi", label: "Wi-Fi (miễn phí)", icon: <Wifi size={24} /> },
  { id: "airport_transfer", label: "Đưa đón sân bay", icon: <Plane size={24} /> },
  { id: "pets", label: "Cho phép thú cưng", icon: <PawPrint size={24} /> },
  { id: "gym", label: "Trung tâm thể dục", icon: <Dumbbell size={24} /> },
  { id: "smoking_area", label: "Khu vực hút thuốc", icon: <Cigarette size={24} /> },
  { id: "reception_24h", label: "Lễ tân 24h", icon: <ConciergeBell size={24} /> },
  { id: "ac", label: "Điều hòa không khí", icon: <Wind size={24} /> },
];

// Hàm helper để tìm icon và label chuẩn dựa trên dữ liệu backend trả về
const getAmenityConfig = (item) => {
    // Trường hợp 1: item là object có amenityName (cấu trúc cũ)
    let key = typeof item === 'string' ? item : item?.name || item?.amenityName || "";
    key = key.toLowerCase();

    // Logic mapping đơn giản (nếu backend trả về ID chuẩn thì khớp ngay, nếu trả về tên thì tìm gần đúng)
    const found = AMENITIES_CONFIG.find(cfg => 
        cfg.id === key || 
        cfg.label.toLowerCase() === key || 
        key.includes(cfg.id) // VD: backend trả "wifi_free" khớp với "wifi"
    );

    return found || { 
        id: 'other', 
        label: typeof item === 'string' ? item : item?.name || "Tiện nghi khác", 
        icon: <CheckCircle2 size={24} /> 
    };
};

const HotelOverview = ({ description, amenities }) => {
  
  // 1. Xử lý dữ liệu Amenities (Parse JSON nếu cần)
  let amenityList = [];
  try {
    if (typeof amenities === 'string') {
        amenityList = JSON.parse(amenities);
    } else if (Array.isArray(amenities)) {
        amenityList = amenities;
    }
  } catch (e) {
    console.error("Lỗi parse amenities:", e);
    amenityList = [];
  }

  return (
    <div className="space-y-8">
        
        {/* --- CARD 1: MÔ TẢ (Giới thiệu) --- */}
        <section id="overview" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-32">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Giới thiệu
            </h3>
            <div className="prose prose-blue max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify text-base">
                    {description}
                </p>
            </div>
        </section>

        {/* --- CARD 2: TIỆN NGHI (Layout mới) --- */}
        {amenityList && amenityList.length > 0 && (
            <section id="amenities-box" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Tiện nghi & Dịch vụ nổi bật
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                    {amenityList.map((item, idx) => {
                        const config = getAmenityConfig(item);
                        return (
                            <div key={idx} className="flex items-center gap-3 group">
                                <div className="p-2.5 rounded-xl bg-gray-50 text-[rgb(40,169,224)] group-hover:bg-[rgb(40,169,224)] group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                                    {config.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {config.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>
        )}
    </div>
  );
};

export default HotelOverview;