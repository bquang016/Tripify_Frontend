import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function DatePicker({ label, value, onChange, error = "" }) {
  const formatDate = (date) => (date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "");

  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="date"
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          
          // ✅ SỬA DÒNG NÀY:
          // Thay 'pr-3' (padding-right: 0.75rem) bằng 'pr-28' (padding-right: 7rem)
          className={`w-full rounded-xl border bg-white py-3 pl-10 pr-28 text-gray-700 shadow-sm transition-all
            ${
              error
                ? "border-red-400 focus:border-red-400 focus:ring-red-100" 
                : "border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224,0.2)]"
            }
          `}
        />
        
        {/* Phần xem trước này sẽ nằm trong khoảng padding 'pr-28' mới */}
        {value && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[rgb(40,169,224)] pointer-events-none">
            {formatDate(value)}
          </span>
        )}
      </div>
      
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}

    </div>
  );
}