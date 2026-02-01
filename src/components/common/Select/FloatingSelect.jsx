import React, { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingSelect({
  control,
  name,
  label,
  options = [],
  error = "",
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false); 
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocused(false); 
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find(opt => opt.value === field.value);
        const displayLabel = selectedOption ? selectedOption.label : "";
        
        const stringValue = String(field.value ?? '');
        const isFloating = focused || open || stringValue.length > 0;
        const hasError = !!error;

        return (
          <div className="w-full" ref={ref}>
            <div className="relative w-full">
              
              {/* 1. Nút bấm (Giữ nguyên chiều cao h-[58px]) */}
              <button
                type="button"
                id={label}
                onClick={() => {
                  setOpen(!open);
                  setFocused(true); 
                }}
                onBlur={() => {
                  if (!open) setFocused(false);
                }}
                className={`peer w-full h-[58px] text-left rounded-xl border ${
                  hasError
                    ? "border-red-400 focus:border-red-400 ring-red-100"
                    : "border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]"
                } bg-white py-3 pl-4 pr-10 text-gray-800 shadow-sm 
                  focus:ring-2 transition-all duration-200 outline-none
                `}
              >
                <span className="text-sm">{displayLabel}</span>
              </button>

              {/* 2. Label (floating) (Giữ nguyên) */}
              <label
                htmlFor={label}
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  isFloating
                    ? `text-xs -top-2.5 bg-white px-1 ${
                        hasError ? "text-red-500" : "text-[rgb(40,169,224)]"
                      }`
                    : `text-sm top-3.5 ${hasError ? "text-red-400" : "text-gray-500"}`
                }`}
              >
                {label}
              </label>

              {/* 3. Icon mũi tên (Giữ nguyên) */}
              <ChevronDown
                size={18}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all pointer-events-none ${
                  hasError ? "text-red-400" : "text-gray-400"
                } ${open ? "rotate-180 text-[rgb(40,169,224)]" : ""}`}
              />

              {/* 4. Panel Dropdown (tùy chỉnh) */}
              <AnimatePresence>
                {open && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                  >
                    {options.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => {
                          field.onChange(opt.value); 
                          setOpen(false);
                          setFocused(false);
                        }}
                        // ✅ SỬA LỖI 3: Bỏ `font-medium`
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${
                          field.value === opt.value
                            ? "bg-[rgb(40,169,224,0.1)] text-[rgb(40,169,224)]" // Bỏ font-medium
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                        {field.value === opt.value && <Check size={16} />}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            
            {/* 5. Lỗi (Giữ nguyên) */}
            <p className="text-xs text-red-500 mt-1 ml-1 h-4">
              {hasError ? error : <span>&nbsp;</span>}
            </p>
          </div>
        );
      }}
    />
  );
}