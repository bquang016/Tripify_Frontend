import React from "react";
import { Clock } from "lucide-react";

export default function TimePicker({ label, value, onChange }) {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="time"
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-700 shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] transition-all"
        />
      </div>
    </div>
  );
}
