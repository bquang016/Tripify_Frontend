import React from "react";
import { Check } from "lucide-react";

const AmenityOption = ({ id, label, icon, register, isSelected }) => (
  <label
    htmlFor={id}
    className={`relative flex flex-col items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer 
               transition-all select-none h-24
               ${isSelected 
                 ? 'border-[rgb(40,169,224)] bg-[rgb(40,169,224,0.05)] shadow-sm'
                 : 'border-gray-200 hover:bg-gray-50'
               }`}
  >
    <input
      type="checkbox"
      id={id}
      {...register()} 
      className="absolute opacity-0 w-0 h-0 peer" 
    />
    
    <span className={`${isSelected ? 'text-[rgb(40,169,224)]' : 'text-gray-500'}`}>{icon}</span>
    <span className={`text-xs font-bold text-center ${isSelected ? 'text-[rgb(40,169,224)]' : 'text-gray-600'}`}>{label}</span>
    
    {/* Dấu check */}
    {isSelected && (
      <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center 
                     rounded-full bg-[rgb(40,169,224)] text-white">
        <Check size={12} strokeWidth={3} />
      </span>
    )}
  </label>
);

export default AmenityOption;
