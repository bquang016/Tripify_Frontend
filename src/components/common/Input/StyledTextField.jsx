import React, { forwardRef } from 'react';
import { User } from 'lucide-react';

/**
 * Component TextField mới, hỗ trợ forwardRef để làm việc với react-hook-form
 */
const StyledTextField = forwardRef(({ label, icon, error, className = "", ...props }, ref) => {
  
  // Class CSS cơ bản
  const baseClasses = [
    "block w-full rounded-lg border bg-white shadow-sm transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed", // Style cho trạng thái disabled
    "sm:text-sm"
  ].join(" ");
  
  // Xử lý viền đỏ khi có lỗi
  const borderClass = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
    : "border-gray-300";

  // Class padding
  const paddingClasses = icon ? "py-2.5 pl-10 pr-3" : "py-2.5 px-3";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Icon (nếu có) */}
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {React.cloneElement(icon, { 
              className: `text-gray-400 ${error ? 'text-red-300' : ''}`, 
              size: 16 
            })}
          </div>
        )}
        
        {/* Input chính - Quan trọng: Phải gán ref={ref} */}
        <input
          ref={ref} 
          id={props.name}
          className={`${baseClasses} ${borderClass} ${paddingClasses}`}
          {...props}
        />
      </div>
      
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
});

// Đặt tên hiển thị cho component (tốt cho việc debug)
StyledTextField.displayName = "StyledTextField";

export default StyledTextField;