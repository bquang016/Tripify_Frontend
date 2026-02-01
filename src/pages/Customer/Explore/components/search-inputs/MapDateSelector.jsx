import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange } from "react-date-range";

// Import CSS của thư viện (Bắt buộc)
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const MapDateSelector = ({ dateRange, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Config range cho thư viện
  const selectionRange = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    // Cập nhật state khi người dùng chọn trên lịch
    onChange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative px-4 py-2 md:py-1 md:w-64 border-b md:border-b-0 md:border-r border-gray-100 last:border-0">
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 h-full cursor-pointer rounded-lg transition-all p-1 ${isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      >
        <div className={`p-2 rounded-full ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
             <Calendar size={18} />
        </div>
        
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
            Ngày nhận phòng
          </label>
          <span className="text-sm font-bold text-gray-700 truncate">
            {format(dateRange.startDate, "dd/MM", { locale: vi })} - {format(dateRange.endDate, "dd/MM", { locale: vi })}
          </span>
        </div>
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute top-full left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden min-w-[350px]">
            <DateRange
                ranges={[selectionRange]}
                onChange={handleSelect}
                minDate={new Date()} // Không cho chọn ngày quá khứ
                rangeColors={["#2563eb"]} // Màu xanh blue-600
                moveRangeOnFirstSelection={false}
                months={1} // Hiển thị 1 tháng (để gọn trên map)
                direction="horizontal"
                locale={vi} // Tiếng Việt
            />
            
            <div className="flex justify-end gap-2 p-2 border-t border-gray-100 bg-gray-50/50">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Đóng
                </button>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors"
                >
                    Áp dụng
                </button>
            </div>
        </div>
      )}

      {/* Override CSS nhỏ để lịch đẹp hơn */}
      <style>{`
        .rdrDateDisplayWrapper { display: none; } 
        .rdrCalendarWrapper { font-size: 12px; width: 100%; }
        .rdrMonthAndYearWrapper { height: 40px; padding-top: 0; }
      `}</style>
    </div>
  );
};

export default MapDateSelector;