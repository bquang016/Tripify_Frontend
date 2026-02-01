// src/components/common/Select/Select.jsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({ label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <div
        className={`flex items-center justify-between w-full bg-white border border-gray-300 rounded-xl py-3 px-4 shadow-sm cursor-pointer transition-all ${
          open ? "border-[rgb(40,169,224)] ring-2 ring-[rgb(40,169,224,0.2)]" : "hover:border-gray-400"
        }`}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || "Chọn một mục..."}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180 text-[rgb(40,169,224)]" : "text-gray-400"}`}
        />
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fade-in">
          {options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt.value}
                className={`px-4 py-2 hover:bg-[rgb(40,169,224,0.1)] cursor-pointer transition-all ${
                  value === opt.label ? "text-[rgb(40,169,224)] font-medium" : "text-gray-700"
                }`}
                onClick={() => {
                  onChange(opt.label);
                  setOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">Không có lựa chọn</div>
          )}
        </div>
      )}
    </div>
  );
}
