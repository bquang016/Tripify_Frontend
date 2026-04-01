import React from 'react';
import { Check } from 'lucide-react';

const PasswordStrengthCheck = ({ password = "" }) => {
  const criteria = [
    { label: "Tối thiểu 8 ký tự", valid: password.length >= 8 },
    { label: "Chữ hoa (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "Chữ thường (a-z)", valid: /[a-z]/.test(password) },
    { label: "Số (0-9)", valid: /[0-9]/.test(password) },
    { label: "Ký tự đặc biệt", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 px-1">
      {criteria.map((item, index) => (
        <div 
          key={index} 
          className={`flex items-center gap-2 text-xs transition-colors duration-300 font-medium ${
            item.valid ? "text-[#28A9E0]" : "text-slate-400"
          }`}
        >
          <div className={`h-3 w-3 rounded-full flex items-center justify-center border ${item.valid ? 'bg-[#28A9E0] border-[#28A9E0]' : 'bg-slate-100 border-slate-300'}`}>
             {item.valid && <Check size={8} className="text-white" strokeWidth={4} />}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthCheck;