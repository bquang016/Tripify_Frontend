// src/components/common/Input/DatePickerInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// [CẬP NHẬT] Thêm props minDate, maxDate để nhận từ cha
const DatePickerInput = ({ label, value, onChange, error, disabled = false, minDate, maxDate }) => {
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

  // --- Classes ---
  const buttonClasses = [
    "relative w-full rounded-lg bg-white py-2.5 text-left font-normal",
    "border border-gray-300 shadow-sm",
    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    "sm:text-sm",
    "pl-12 pr-10", 
    disabled
      ? "bg-gray-100 cursor-not-allowed text-gray-500"
      : "cursor-pointer hover:border-blue-400 transition"
  ].join(" ");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative" ref={ref}>
        {/* ICON LỊCH */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-20 pointer-events-none">
          <CalendarIcon size={18} className="text-gray-400" />
        </div>

        {/* BUTTON */}
        <button
          type="button"
          className={buttonClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {value ? (
            <span className="text-gray-900 font-normal">
              {format(value, 'dd/MM/yyyy')}
            </span>
          ) : (
            <span className="text-gray-400 font-normal">dd/MM/yyyy</span>
          )}
        </button>

        {/* ICON DROPDOWN */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-20">
          <ChevronDown size={18} className="text-gray-400" />
        </span>

        {/* POPUP CALENDAR */}
        {isOpen && !disabled && (
          <div className="absolute z-30 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg">
            <Calendar
              date={value || new Date()}
              onChange={(date) => {
                onChange(date);
                setIsOpen(false);
              }}
              color="#006494"
              dateDisplayFormat="dd/MM/yyyy"
              // [QUAN TRỌNG] Bỏ maxDate={new Date()} cố định
              // Sử dụng props truyền vào (nếu có)
              minDate={minDate} 
              maxDate={maxDate} 
            />
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DatePickerInput;