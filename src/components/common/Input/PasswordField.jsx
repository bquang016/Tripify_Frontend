import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({
  label = "Mật khẩu",
  value = "",
  onChange,
  required = false,
  // ✅ THÊM 2 PROPS NÀY
  onFocus, 
  onBlur,
  // ... các props khác nếu có
  ...props 
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false); // State nội bộ để làm hiệu ứng floating label
  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative w-full">
      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        id={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        // ✅ GỌI HÀM TỪ CHA TRUYỀN XUỐNG
        onFocus={(e) => {
            setFocused(true);
            onFocus && onFocus(e); 
        }}
        onBlur={(e) => {
            setFocused(e.target.value !== "");
            onBlur && onBlur(e);
        }}
        placeholder={label}
        className="peer w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-800 placeholder-transparent shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.15)] transition-all duration-200"
        {...props} // Spread các props còn lại
      />
      {/* ... (Phần label và button Eye giữ nguyên) ... */}
      <label
        htmlFor={label}
        className={`absolute left-10 transition-all duration-200 text-gray-500 ${
          isFloating
            ? "text-xs -top-2.5 bg-white px-1 text-[rgb(40,169,224)]"
            : "text-sm top-3.5"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[rgb(40,169,224)] transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}