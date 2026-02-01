// src/pages/Admin/Hotels/components/SubmissionTypeFilter.jsx
import React from "react";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";

const PROPERTY_TYPES = [
  { value: "ALL", label: "Tất cả loại hình" },
  { value: "HOTEL", label: "Khách sạn" },
  { value: "RESORT", label: "Resort" },
  { value: "VILLA", label: "Villa" },
  { value: "HOMESTAY", label: "Homestay" },
];


const SubmissionTypeFilter = ({ currentType, onTypeChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-w-[200px]"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter size={16} className="text-gray-500" />
        </div>
        <select
          value={currentType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="
            appearance-none
            bg-white border border-gray-200 text-gray-700 text-sm rounded-xl 
            focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 
            shadow-sm cursor-pointer hover:border-blue-400 transition-all outline-none
          "
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {/* Custom Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default SubmissionTypeFilter;