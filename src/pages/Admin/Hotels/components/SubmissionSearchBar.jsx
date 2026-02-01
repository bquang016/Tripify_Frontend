// src/pages/Admin/Hotels/components/SubmissionSearchBar.jsx
import React from "react";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { motion } from "framer-motion";

const SubmissionSearchBar = ({ onSearch, initialValue = "" }) => {
  const [value, setValue] = React.useState(initialValue);

  const debounced = useDebouncedCallback((val) => {
    onSearch(val);
  }, 400);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    debounced(val);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex-grow max-w-md"
    >
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
        </div>
        
        <input
          type="text"
          className="
            block w-full pl-10 pr-10 py-2.5 
            bg-white border border-gray-200 
            text-gray-900 text-sm rounded-full 
            shadow-sm placeholder-gray-400
            transition-all duration-200
            focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none
            hover:border-blue-300
          "
          placeholder="Tìm kiếm khách sạn, chủ sở hữu..."
          value={value}
          onChange={handleChange}
        />

        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SubmissionSearchBar;