import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2, Check } from "lucide-react";
import axios from "axios";

// API lấy danh sách tỉnh thành Việt Nam
const PROVINCES_API_URL = "https://provinces.open-api.vn/api/?depth=1";

const MapDestinationSearch = ({ value, onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const wrapperRef = useRef(null);

  // 1. Fetch Data Tỉnh/Thành
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const res = await axios.get(PROVINCES_API_URL);
        if (res.data) {
            // Map dữ liệu về dạng đơn giản { name, code }
            const data = res.data.map(p => ({ name: p.name.replace("Tỉnh ", "").replace("Thành phố ", ""), code: p.code, fullName: p.name }));
            setProvinces(data);
            setFilteredProvinces(data);
        }
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Lọc danh sách khi gõ
  const handleInputChange = (text) => {
    onChange(text);
    setShowDropdown(true);
    
    if (!text) {
        setFilteredProvinces(provinces);
    } else {
        const lowerText = text.toLowerCase();
        const filtered = provinces.filter(p => 
            p.name.toLowerCase().includes(lowerText) || 
            p.fullName.toLowerCase().includes(lowerText)
        );
        setFilteredProvinces(filtered);
    }
  };

  const handleSelect = (provinceName) => {
    onChange(provinceName);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="flex-1 relative group px-4 py-2 md:py-1">
      <div className="flex items-center gap-3 h-full">
        <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        
        <div className="flex flex-col w-full relative">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
            Địa điểm
          </label>
          
          <input 
            type="text" 
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Tìm Tỉnh/Thành phố..." 
            className="w-full text-sm font-semibold text-gray-700 placeholder-gray-400 bg-transparent outline-none truncate"
          />
        </div>

        {/* Nút Xóa */}
        {value && (
          <button 
            onClick={() => { onChange(""); setFilteredProvinces(provinces); }} 
            className="p-1 rounded-full hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* --- DROPDOWN KẾT QUẢ --- */}
      {showDropdown && (
          <div className="absolute top-full left-0 w-full md:w-[300px] bg-white rounded-xl shadow-2xl border border-gray-100 mt-2 max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 custom-scrollbar">
              {loading ? (
                  <div className="p-4 flex items-center justify-center text-gray-400 gap-2 text-xs">
                      <Loader2 size={14} className="animate-spin"/> Đang tải danh sách...
                  </div>
              ) : filteredProvinces.length > 0 ? (
                  <ul>
                      {filteredProvinces.map((province) => (
                          <li 
                              key={province.code}
                              onClick={() => handleSelect(province.name)}
                              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors"
                          >
                              <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                                      <MapPin size={12} />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                      {province.name}
                                  </span>
                              </div>
                              {value === province.name && <Check size={14} className="text-blue-600"/>}
                          </li>
                      ))}
                  </ul>
              ) : (
                  <div className="p-4 text-center text-gray-400 text-xs">
                      Không tìm thấy địa điểm nào.
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default MapDestinationSearch;