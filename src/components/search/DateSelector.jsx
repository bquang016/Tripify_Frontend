import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const [range, setRange] = useState([
    {
      startDate: value?.startDate || new Date(),
      endDate: value?.endDate || addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const displayText = `${format(range[0].startDate, "dd/MM/yyyy", { locale: vi })} - ${format(
    range[0].endDate,
    "dd/MM/yyyy",
    { locale: vi }
  )}`;

  const handleSelect = (item) => {
    setRange([item.selection]);
    onChange?.(item.selection);
  };

  return (
    <div className="relative flex flex-col" ref={ref}>
      <label className="text-sm font-semibold text-gray-600 mb-1">
        Khoảng thời gian lưu trú
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition"
      >
        <span className="text-gray-700 text-sm">{displayText}</span>
        <Calendar size={18} className="text-gray-500" />
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 mt-3 bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden transition-all"
          style={{
            width: "calc(100% + 120px)", // ✅ rộng hơn form ~60px mỗi bên
            transform: "translateX(-50%)",
          }}
        >
          {/* Lịch */}
          <div className="p-2">
            <DateRange
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={range}
              locale={vi}
              rangeColors={["rgb(40,169,224)"]}
              showDateDisplay={false}
              months={1}
              direction="horizontal"
              className="rounded-xl"
            />
          </div>

          {/* Nút áp dụng */}
          <div className="flex justify-end gap-2 p-3 border-t bg-gray-50">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-white"
            >
              Hủy
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded-lg bg-[rgb(40,169,224)] text-white hover:opacity-90"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
