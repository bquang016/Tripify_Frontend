import React, { useState, useRef, useEffect } from "react";
import { User, Minus, Plus } from "lucide-react";

const MapGuestSelector = ({ guests, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = (val) => onChange(Math.max(1, val));

  return (
    <div ref={containerRef} className="relative px-4 py-2 md:py-1 md:w-48">
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 h-full cursor-pointer rounded-lg transition-all p-1 ${isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      >
        <div className={`p-2 rounded-full ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
             <User size={18} />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
            Số khách
          </label>
          <span className="text-sm font-bold text-gray-700">
            {guests} khách, 1 phòng
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 animate-in fade-in slide-in-from-top-2">
            
            {/* Người lớn */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm font-bold text-gray-800">Người lớn</p>
                    <p className="text-[10px] text-gray-400">13 tuổi trở lên</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button 
                        onClick={() => handleUpdate(guests - 1)}
                        disabled={guests <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-all"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests}</span>
                    <button 
                        onClick={() => handleUpdate(guests + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-blue-600 transition-all"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* Trẻ em (Giả lập UI cho đẹp) */}
            <div className="flex items-center justify-between opacity-50 pointer-events-none">
                <div>
                    <p className="text-sm font-bold text-gray-800">Trẻ em</p>
                    <p className="text-[10px] text-gray-400">Dưới 13 tuổi</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-4 text-center">0</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm"><Plus size={14} /></button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MapGuestSelector;