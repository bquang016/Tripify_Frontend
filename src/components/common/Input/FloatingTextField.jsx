// src/components/common/Input/FloatingTextField.jsx
import React from "react";

export default React.forwardRef(function FloatingTextField({
  label,
  type = "text",
  icon,
  error = "",
  disabled = false,
  className = "",
  ...props
}, ref) { // <--- 1. Thêm tham số ref
  const hasError = !!error;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full">
        {/* Icon (nếu có) */}
        {icon && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            hasError ? "text-red-400" : "text-gray-400"
          }`}>
            {icon}
          </span>
        )}

        {/* Input Field */}
        <input
          ref={ref} // <--- 2. Áp dụng ref cho phần tử <input>
          id={label}
          type={type}
          disabled={disabled}
          placeholder=" " // ✅ QUAN TRỌNG: Placeholder khoảng trắng để kích hoạt CSS
          {...props}
          className={`
            peer w-full h-[58px] rounded-xl border bg-white py-3 pr-4
            ${icon ? "pl-10" : "pl-4"}
            text-gray-800 shadow-sm transition-all duration-200 outline-none
            placeholder-transparent /* Ẩn placeholder đi */
            focus:ring-2
            ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}
            ${hasError
              ? "border-red-400 focus:border-red-400 ring-red-100"
              : "border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]"
            }
          `}
        />

        {/* Floating Label */}
        <label
          htmlFor={label}
          className={`
            absolute transition-all duration-200 pointer-events-none bg-white px-1
            ${icon ? "left-10" : "left-4"}

            /* --- TRẠNG THÁI 1: Mặc định (Có dữ liệu hoặc Focus) -> Label bay lên --- */
            -top-2.5 text-xs

            /* --- TRẠNG THÁI 2: Input rỗng & Không focus -> Label nằm giữa --- */
            peer-placeholder-shown:top-3.5
            peer-placeholder-shown:text-sm
            peer-placeholder-shown:text-gray-500

            /* --- TRẠNG THÁI 3: Khi Focus (Luôn bay lên & đổi màu) --- */
            peer-focus:-top-2.5
            peer-focus:text-xs
            ${hasError ? "peer-focus:text-red-500 text-red-500" : "peer-focus:text-[rgb(40,169,224)] text-[rgb(40,169,224)]"}
          `}
        >
          {label}
        </label>
      </div>

      {/* Error Message */}
      <div className="min-h-[20px] mt-1 ml-1">
         {hasError && <p className="text-xs text-red-500 animate-fadeIn">{error}</p>}
      </div>
    </div>
  );
});