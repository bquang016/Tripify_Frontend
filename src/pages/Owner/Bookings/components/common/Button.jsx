import React from "react";

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
  const baseStyle = "whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#28A9E0] text-white hover:bg-[#2395c7] shadow-lg shadow-blue-200 border-transparent",
    soft: "bg-[#28A9E0]/10 text-[#28A9E0] border border-[#28A9E0]/20 hover:bg-[#28A9E0]/20 hover:border-[#28A9E0]/40 shadow-sm",
    dangerSoft: "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 shadow-sm",
    outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-[#28A9E0] shadow-sm",
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;

