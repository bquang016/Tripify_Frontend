import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Tạo danh sách giờ (00:00 -> 23:30)
const TIME_OPTIONS = [];
for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, '0');
  TIME_OPTIONS.push(`${hour}:00`);
  TIME_OPTIONS.push(`${hour}:30`);
}

/**
 * Component chọn giờ đẹp mắt thay thế input type="time"
 */
const PolicyTimeSelector = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={wrapperRef}>
      {/* Label */}
      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
        {label}
      </label>
      
      <div className="relative">
        {/* Nút bấm hiển thị giá trị */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-3.5 flex items-center justify-between border rounded-xl cursor-pointer bg-white transition-all duration-200
            ${isOpen 
              ? "border-[rgb(40,169,224)] ring-4 ring-[rgb(40,169,224)]/10 shadow-sm" 
              : "border-gray-200 hover:border-[rgb(40,169,224)]/50 hover:bg-gray-50"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-md ${value ? "bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)]" : "bg-gray-100 text-gray-400"}`}>
                <Clock size={18} strokeWidth={2.5} />
            </div>
            <span className={`text-sm font-bold ${value ? "text-gray-800" : "text-gray-400"}`}>
                {value || "Chọn giờ..."}
            </span>
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[rgb(40,169,224)]" : ""}`} />
        </div>

        {/* Danh sách thả xuống */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto custom-scrollbar"
            >
              <div className="p-1.5 grid grid-cols-1 gap-0.5">
                  {TIME_OPTIONS.map((time) => (
                    <div
                      key={time}
                      onClick={() => {
                        onChange(time);
                        setIsOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-all flex items-center justify-between
                        ${value === time 
                          ? "bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] font-bold" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      {time}
                      {value === time && <div className="w-2 h-2 rounded-full bg-[rgb(40,169,224)]"></div>}
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PolicyTimeSelector;