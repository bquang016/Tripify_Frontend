// src/components/common/Input/DateRangePicker.jsx
import React from "react";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
  const fmt = (d) => (d ? format(new Date(d), "dd/MM/yyyy", { locale: vi }) : "");

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm font-medium text-gray-700">Khoảng ngày</label>
      <div className="flex items-center bg-white border border-gray-300 rounded-xl shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-[rgb(40,169,224,0.2)] focus-within:border-[rgb(40,169,224)] transition-all">
        <CalendarRange className="text-gray-400 mr-2" size={18} />
        <input
          type="date"
          value={startDate}
          onChange={onStartChange}
          className="w-full border-none outline-none bg-transparent text-gray-700"
        />
        <span className="mx-2 text-gray-400">—</span>
        <input
          type="date"
          value={endDate}
          onChange={onEndChange}
          className="w-full border-none outline-none bg-transparent text-gray-700"
        />
      </div>
      {(startDate || endDate) && (
        <div className="mt-1 text-sm text-[rgb(40,169,224)] font-medium">
          {fmt(startDate)} {endDate && " → " + fmt(endDate)}
        </div>
      )}
    </div>
  );
}
