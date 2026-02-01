import React from "react";
import { Controller } from "react-hook-form";

/**
 * Component Giao diện Toggle (Dùng nội bộ hoặc dùng trực tiếp nếu không qua RHF)
 */
const ToggleSwitchUI = ({ label, checked, onChange }) => (
  <label className="flex flex-col justify-center items-start cursor-pointer w-full">
    {/* Label (nếu có) */}
    {label && (
      <span className="text-xs text-[rgb(40,169,224)] bg-white px-1 relative -mb-2 ml-3 z-10 font-semibold select-none">
        {label}
      </span>
    )}
    
    <div className="relative flex items-center justify-between w-full rounded-xl border border-gray-300 bg-white py-3 px-4 shadow-sm h-[58px] hover:border-blue-300 transition-colors">
      <span className="text-sm font-medium text-gray-700 select-none">
        {checked ? "Đang kích hoạt (Hiển thị)" : "Đã vô hiệu hóa (Ẩn)"}
      </span>
      
      {/* Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault(); // Ngăn label click event chồng chéo
          onChange(!checked);
        }}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224)] focus:ring-offset-2
          ${checked ? "bg-[rgb(40,169,224)]" : "bg-gray-200"}
        `}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
    {/* Giữ chỗ cho lỗi (nếu cần layout cố định) */}
    <div className="h-1"></div>
  </label>
);

/**
 * Component Wrapper hỗ trợ cả React Hook Form và State thường
 */
export default function ToggleSwitch({ control, name, label, checked, onChange }) {
  // TRƯỜNG HỢP 1: Dùng với React Hook Form (có 'control')
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleSwitchUI
            label={label}
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
    );
  }

  // TRƯỜNG HỢP 2: Dùng với State thông thường (SettingsPage)
  return (
    <ToggleSwitchUI
      label={label}
      checked={checked}
      onChange={onChange}
    />
  );
}