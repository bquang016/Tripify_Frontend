import React from "react";
import { useNavigate } from "react-router-dom";
import { Map, ArrowRight } from "lucide-react";

// Components
import DestinationCard from "@/components/common/Card/DestinationCard";

// Dữ liệu mẫu
const DESTINATIONS = [
  {
    id: 1,
    name: "Hà Nội",
    region: "Miền Bắc",
    image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-ha-noi.jpg",
    keyword: "Hà Nội"
  },
  {
    id: 2,
    name: "TP. Hồ Chí Minh",
    region: "Miền Nam",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
    keyword: "Hồ Chí Minh"
  },
  {
    id: 3,
    name: "Đà Nẵng",
    region: "Miền Trung",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2070&auto=format&fit=crop",
    keyword: "Đà Nẵng"
  },
  {
    id: 4,
    name: "Hội An",
    region: "Quảng Nam",
    image: "https://images.unsplash.com/photo-1563354860-799d15199ac3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9pJTIwYW58ZW58MHx8MHx8fDA%3D",
    keyword: "Hội An"
  },
  {
    id: 5,
    name: "Đà Lạt",
    region: "Lâm Đồng",
    image: "https://images.unsplash.com/photo-1552310065-aad9ebece999?q=80&w=1162&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    keyword: "Đà Lạt"
  },
  {
    id: 6,
    name: "Phú Quốc",
    region: "Kiên Giang",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2020&auto=format&fit=crop",
    keyword: "Phú Quốc"
  }
];

const SectionHeader = ({ onSeeAll }) => (
  <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 px-2">
      <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">

          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Điểm Đến <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Yêu Thích</span>
          </h2>
          
          <p className="text-gray-500 mt-3 font-medium text-base leading-relaxed">
              Lên kế hoạch cho chuyến đi tiếp theo của bạn đến những địa danh du lịch hàng đầu được cộng đồng TravelMate bình chọn.
          </p>
      </div>

      <button 
          onClick={onSeeAll}
          className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-all bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-orange-200 shadow-sm hover:shadow-md group"
      >
          Khám phá ngay 
          <div className="bg-gray-100 group-hover:bg-orange-100 p-1 rounded-full transition-colors">
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
      </button>
  </div>
);

const HotDestinations = () => {
  const navigate = useNavigate();

  const handleDestinationClick = (keyword) => {
    navigate(`/hotels?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="container mx-auto px-4 py-12 font-sans relative z-10">
      <SectionHeader onSeeAll={() => navigate("/hotels")} />

      {/* --- GRID LAYOUT 2 HÀNG (4 CỘT) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* HÀNG 1 */}
        {/* Item 1: Lớn (Chiếm 2 cột) */}
        <DestinationCard 
            className="lg:col-span-2 h-[280px] lg:h-[320px]"
            data={DESTINATIONS[0]} 
            onClick={() => handleDestinationClick(DESTINATIONS[0].keyword)} 
        />
        {/* Item 2: Nhỏ */}
        <DestinationCard 
            className="lg:col-span-1 h-[280px] lg:h-[320px]"
            data={DESTINATIONS[1]} 
            onClick={() => handleDestinationClick(DESTINATIONS[1].keyword)} 
        />
        {/* Item 3: Nhỏ */}
        <DestinationCard 
            className="lg:col-span-1 h-[280px] lg:h-[320px]"
            data={DESTINATIONS[2]} 
            onClick={() => handleDestinationClick(DESTINATIONS[2].keyword)} 
        />

        {/* HÀNG 2 */}
        {/* Item 4: Nhỏ */}
        <DestinationCard 
            className="lg:col-span-1 h-[280px] lg:h-[320px]"
            data={DESTINATIONS[3]} 
            onClick={() => handleDestinationClick(DESTINATIONS[3].keyword)} 
        />
        {/* Item 5: Nhỏ */}
        <DestinationCard 
            className="lg:col-span-1 h-[280px] lg:h-[320px]"
            data={DESTINATIONS[4]} 
            onClick={() => handleDestinationClick(DESTINATIONS[4].keyword)} 
        />
        {/* Item 6: Lớn (Chiếm 2 cột) */}
        <DestinationCard 
            className="lg:col-span-2 h-[280px] lg:h-[320px]"
            data={DESTINATIONS[5]} 
            onClick={() => handleDestinationClick(DESTINATIONS[5].keyword)} 
        />

      </div>
    </section>
  );
};

export default HotDestinations;