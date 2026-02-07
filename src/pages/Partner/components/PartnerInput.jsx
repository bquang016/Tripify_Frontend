import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PartnerInput = ({ 
  label, 
  name, 
  type = "text", 
  register, 
  rules, 
  error, 
  icon: Icon, 
  placeholder,
  className = "" 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Màu chủ đạo: rgb(40 169 224) -> Hex: #28A9E0
  return (
    <div className={`w-full group ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-300 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#28A9E0]'}`}>
            <Icon size={18} />
          </div>
        )}

        {/* Input Field (Clean White Style) */}
        <input
          id={name}
          type={inputType}
          {...register(name, rules)}
          placeholder={placeholder}
          className={`
            w-full rounded-2xl py-3.5 
            ${Icon ? 'pl-11' : 'pl-5'} 
            ${isPassword ? 'pr-12' : 'pr-5'}
            bg-white border 
            text-slate-700 placeholder-slate-400 font-medium
            outline-none transition-all duration-300 shadow-sm
            ${error 
              ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-slate-200 focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 hover:border-[#28A9E0]/50'
            }
          `}
        />

        {/* Toggle Password Button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-[#28A9E0] focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error Message - Tinh tế hơn */}
      {error && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default PartnerInput;