// src/components/common/Input/TextField.jsx
import React from "react";

// 1. Bọc component trong React.forwardRef để nhận 'ref' từ React Hook Form
const TextField = React.forwardRef(({
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error = "",
  icon,
  ...props // Chứa các props từ register như: ref, onBlur, name...
}, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={label}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          ref={ref} // 2. Quan trọng: Gắn ref vào thẻ input thật
          id={label}
          name={name}
          type={type}
          // Nếu dùng với RHF thì value/onChange sẽ được quản lý bởi ...props (register)
          // Nhưng ta vẫn giữ prop value/onChange riêng để support cả 2 cách dùng
          value={value} 
          onChange={onChange}
          placeholder={label}
          {...props} // Spread các props còn lại của RHF vào đây
          className={`w-full rounded-xl border bg-white py-3 pr-4 text-gray-800 shadow-sm transition-all duration-200 outline-none
            ${icon ? "pl-10" : "px-4"}
            ${
              error
                ? "border-red-400 focus:border-red-400 focus:ring-red-100 placeholder-red-400"
                : "border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224,0.15)] placeholder-gray-400"
            }
          `}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
});

// Đặt tên hiển thị cho component (tốt cho việc debug)
TextField.displayName = "TextField";

export default TextField;