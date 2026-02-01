import React from "react";
import { Navigation } from "lucide-react";

const MapUserLocationButton = ({ onClick }) => {
  return (
    <div className="absolute bottom-24 md:bottom-8 right-4 z-10 flex flex-col gap-3">
      <button 
        onClick={onClick} 
        className="p-3 bg-white rounded-2xl shadow-lg hover:bg-gray-50 text-gray-700 border border-gray-100 transition-transform active:scale-95 group" 
        title="Vị trí của tôi"
      >
        <Navigation size={22} className="group-hover:text-blue-600 transition-colors group-active:fill-blue-600" />
      </button>
    </div>
  );
};

export default MapUserLocationButton;