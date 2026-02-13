import React from 'react';
import { ChevronDown } from 'lucide-react';

const PartnerSelect = ({ label, name, value, onChange, options = [], error, placeholder = "Chọn..." }) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm focus:ring-2 focus:outline-none appearance-none transition-all duration-200
            ${error 
              ? 'border-red-400 focus:ring-red-200 text-red-900 placeholder-red-300' 
              : 'border-slate-200 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224)]/20 text-slate-800'
            }
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 ml-1 mt-1">{error}</p>}
    </div>
  );
};

export default PartnerSelect;