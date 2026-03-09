import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const PartnerDatePicker = ({ label, value, onChange, error, disabled = false, minDate, maxDate, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // --- Click outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Classes CSS được đồng bộ với PartnerInput ---
  const buttonClasses = [
    "w-full rounded-2xl py-3.5 pl-12 pr-10 bg-white border font-medium outline-none transition-all shadow-sm text-left flex items-center justify-between",
    disabled
      ? "bg-slate-50 cursor-not-allowed text-slate-400 border-slate-200"
      : "cursor-pointer hover:border-[#28A9E0] focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 border-slate-200",
    error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""
  ].join(" ");

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={ref}>
        {/* ICON LỊCH BÊN TRÁI */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-20 pointer-events-none">
          <CalendarIcon size={20} className={error ? "text-red-500" : "text-slate-400"} />
        </div>

        {/* BUTTON NHẬP LIỆU */}
        <button
          type="button"
          className={buttonClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {value ? (
            <span className="text-slate-700">
              {format(value, 'dd/MM/yyyy')}
            </span>
          ) : (
            <span className="text-slate-400">dd/MM/yyyy</span>
          )}
        </button>

        {/* ICON MŨI TÊN BÊN PHẢI */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-20">
          <ChevronDown size={20} className="text-slate-400" />
        </span>

        {/* POPUP CALENDAR */}
        {isOpen && !disabled && (
          <div className="absolute z-30 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden">
            <Calendar
              date={value || new Date()}
              onChange={(date) => {
                onChange(date);
                setIsOpen(false);
              }}
              color="#28A9E0" 
              dateDisplayFormat="dd/MM/yyyy"
              minDate={minDate} 
              maxDate={maxDate} 
            />
          </div>
        )}
      </div>

      {/* THÔNG BÁO LỖI */}
      {error && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default PartnerDatePicker;