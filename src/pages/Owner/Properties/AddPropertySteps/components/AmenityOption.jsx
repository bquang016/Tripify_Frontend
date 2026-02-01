import React from "react";
import { Check } from "lucide-react";

/**
 * Component con cho mỗi lựa chọn tiện nghi.
 * @param {string} id - ID định danh cho DOM (input & label). Cần duy nhất trên trang.
 * @param {string} name - Tên field để đăng ký với react-hook-form (VD: "amenities.wifi").
 * @param {string} label - Tên hiển thị.
 * @param {React.ReactNode} icon - Icon.
 * @param {Function} register - Hàm register.
 */
const AmenityOption = ({ id, name, label, icon, register }) => (
  <label
    htmlFor={id}
    className="relative flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer 
               transition-all has-[:checked]:border-[rgb(40,169,224)] 
               has-[:checked]:bg-[rgb(40,169,224,0.05)] has-[:checked]:shadow-sm
               hover:bg-gray-50 select-none"
  >
    {/* Checkbox ẩn */}
    <input
      type="checkbox"
      id={id}
      // Nếu có prop 'name' thì dùng, nếu không thì fallback về logic cũ `amenities.${id}`
      {...register(name || `amenities.${id}`)} 
      className="absolute opacity-0 w-0 h-0 peer" 
    />
    
    <span className="text-[rgb(40,169,224)]">{icon}</span>
    <span className="text-sm font-medium text-gray-700">{label}</span>
    
    {/* Dấu check */}
    <span className="absolute top-2 right-2 hidden h-5 w-5 items-center justify-center 
                   rounded-full bg-[rgb(40,169,224)] text-white 
                   peer-checked:flex">
      <Check size={12} />
    </span>
  </label>
);

export default AmenityOption;