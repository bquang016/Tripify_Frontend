// src/components/common/Input/SearchInput.jsx
import React from "react";
import { Search } from "lucide-react";

export default function SearchInput({ placeholder = "Tìm kiếm địa điểm, khách sạn..." }) {
  return (
    <div className="relative w-full group">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[rgb(40,169,224)] transition-all"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-full py-3 pl-11 pr-5 text-gray-700 placeholder-gray-400 shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] focus:shadow-md transition-all"
      />
    </div>
  );
}
