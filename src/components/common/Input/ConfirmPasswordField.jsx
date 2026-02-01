import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ConfirmPasswordField({
  label = "Xác nhận mật khẩu",
  password = "",
  value = "",
  onChange,
  required = false,
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value?.length > 0;
  const mismatch = value && password && value !== password;

  return (
    <div className="relative w-full">
      <Lock
        size={18}
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          mismatch ? "text-red-400" : "text-gray-400"
        }`}
      />

      <input
        id={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder={label}
        className={`peer w-full rounded-xl border ${
          mismatch ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224,0.15)]"
        } bg-white py-3 pl-10 pr-10 text-gray-800 placeholder-transparent shadow-sm focus:ring-2 transition-all duration-200`}
      />

      <label
        htmlFor={label}
        className={`absolute left-10 transition-all duration-200 ${
          isFloating
            ? `text-xs -top-2.5 bg-white px-1 ${
                mismatch ? "text-red-500" : "text-[rgb(40,169,224)]"
              }`
            : "text-sm top-3.5 text-gray-500"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setShow(!show)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
          mismatch ? "text-red-400" : "text-gray-400"
        } hover:text-[rgb(40,169,224)] transition-colors`}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      {mismatch && (
        <p className="text-xs text-red-500 mt-1 ml-1">
          Mật khẩu xác nhận không khớp.
        </p>
      )}
    </div>
  );
}
