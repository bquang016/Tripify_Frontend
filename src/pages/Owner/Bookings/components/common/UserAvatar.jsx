import React from "react";

const UserAvatar = ({ name }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(-2).toUpperCase();
  
  const colors = [
    "bg-blue-100 text-blue-600", 
    "bg-emerald-100 text-emerald-600", 
    "bg-violet-100 text-violet-600", 
    "bg-amber-100 text-amber-600", 
    "bg-rose-100 text-rose-600"
  ];
  const colorClass = colors[name.length % colors.length];

  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${colorClass} border-2 border-white shadow-sm ring-1 ring-slate-100`}>
      {initials}
    </div>
  );
};

export default UserAvatar;