import React from "react";
import { MapPin, ArrowUpRight } from "lucide-react";

const DestinationCard = ({ data, onClick, className }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[1.5rem] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 ${className}`}
    >
      {/* 1. Background Image */}
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* 2. Gradient Overlay (Tối ở dưới để làm nổi chữ) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* 3. Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
        
        {/* Location Tag - Hiệu ứng trượt lên nhẹ nhàng */}
        <div className="flex items-center gap-2 mb-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10">
            <MapPin size={10} /> {data.region || "Việt Nam"}
          </span>
        </div>

        {/* City Name & Arrow Row */}
        <div className="flex justify-between items-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none">
            {data.name}
          </h3>
          
          {/* Arrow Button */}
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;