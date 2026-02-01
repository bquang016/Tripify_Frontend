import React, { useState } from "react";

/**
 * Đây là component TextField mới, được thiết kế đặc biệt cho các form Auth (Login/Register)
 * để có hiệu ứng "floating label" đồng bộ với PasswordField.
 */
export default function AuthTextField({
  name,
  label = "Text Field",
  type = "text",
  value = "",
  onChange,
  required = false,
  icon, // Icon (ví dụ: <Mail size={18} />)
}) {
  const [focused, setFocused] = useState(false);
  
  // Label sẽ nổi lên nếu input đang được focus, hoặc đã có nội dung
  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative w-full">
      {/* Icon (nếu có) */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      {/* Input */}
      <input
        id={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder={label} // Placeholder này sẽ bị ẩn (do chữ trong suốt)
        className="peer w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 placeholder-transparent shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.15)] transition-all duration-200"
      />

      {/* Label (floating) */}
      <label
        htmlFor={label}
        className={`absolute left-10 transition-all duration-200 text-gray-500 ${
          isFloating
            ? "text-xs -top-2.5 bg-white px-1 text-[rgb(40,169,224)]" // Trạng thái nổi
            : "text-sm top-3.5" // Trạng thái mặc định
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}