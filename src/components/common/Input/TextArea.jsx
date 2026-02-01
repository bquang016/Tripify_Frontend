// src/components/common/Input/TextArea.jsx
import React from "react";

// 1. Bọc component trong React.forwardRef và thêm tham số ref
const TextArea = React.forwardRef(({
  label,
  error = "",
  disabled = false,
  className = "",
  rows = 4,
  ...props
}, ref) => {
  const hasError = !!error;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full">
        <textarea
          ref={ref} // 2. Gắn ref vào thẻ textarea thật sự
          id={label}
          disabled={disabled}
          rows={rows}
          placeholder=" " 
          {...props}
          className={`
            peer w-full rounded-xl border bg-white px-4 py-3
            text-gray-800 shadow-sm transition-all duration-200 outline-none
            placeholder-transparent
            focus:ring-2
            resize-none 
            ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}
            ${hasError
              ? "border-red-400 focus:border-red-400 ring-red-100"
              : "border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]"
            }
          `}
        />

        <label
          htmlFor={label}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none bg-white px-1
            -top-2.5 text-xs
            peer-placeholder-shown:top-3.5
            peer-placeholder-shown:text-sm
            peer-placeholder-shown:text-gray-500
            peer-focus:-top-2.5
            peer-focus:text-xs
            ${hasError ? "peer-focus:text-red-500 text-red-500" : "peer-focus:text-[rgb(40,169,224)] text-[rgb(40,169,224)]"}
          `}
        >
          {label}
        </label>
      </div>

      <div className="min-h-[20px] mt-1 ml-1">
         {hasError && <p className="text-xs text-red-500 animate-fadeIn">{error}</p>}
      </div>
    </div>
  );
});

// 3. Export component đã bọc
export default TextArea;