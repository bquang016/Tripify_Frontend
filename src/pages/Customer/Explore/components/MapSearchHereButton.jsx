import React from "react";
import { Search } from "lucide-react";

const MapSearchHereButton = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    // Thay đổi top-32 thành top-48 hoặc top-[180px] để đẩy nó xuống dưới hẳn header & filter
    <div className="absolute top-48 md:top-[180px] left-1/2 transform -translate-x-1/2 z-10 animate-in fade-in slide-in-from-top-4 duration-300">
      <button 
        onClick={onClick}
        className="group bg-white hover:bg-blue-50 text-gray-800 px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
      >
        <span className="bg-blue-600 text-white p-1 rounded-full group-hover:rotate-90 transition-transform duration-300">
            <Search size={12} strokeWidth={3} />
        </span>
        Tìm khu vực này
      </button>
    </div>
  );
  
};

export default MapSearchHereButton;