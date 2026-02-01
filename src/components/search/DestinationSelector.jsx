// src/components/search/DestinationSelector.jsx
import React, { useEffect, useRef, useState } from "react";
import { Search, MapPin, Hotel } from "lucide-react";

// Dữ liệu giả cho dropdown (Req #4)
const mockSuggestions = [
  { type: "city", name: "Hà Nội" },
  { type: "city", name: "Đà Nẵng" },
  { type: "city", name: "TP. Hồ Chí Minh" },
  { type: "city", name: "Vũng Tàu" }, // (Thêm Vũng Tàu để dễ test)
  { type: "hotel", name: "The Ocean Resort" },
  { type: "hotel", name: "Mountain Retreat" },
];

const SuggestionItem = ({ item, onClick }) => {
  const isCity = item.type === "city";
  return (
    <button
      type="button"
      onClick={onClick} 
      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
    >
      {isCity ? <MapPin size={16} className="text-gray-400" /> : <Hotel size={16} className="text-gray-400" />}
      <span>{item.name}</span>
    </button>
  );
};

export default function DestinationSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  // ✅ 1. XÓA STATE NỘI BỘ 'query'
  // const [query, setQuery] = useState(value || ""); // <-- XÓA DÒNG NÀY

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ✅ 2. LỌC DỰA TRÊN 'value' (prop từ cha) THAY VÌ 'query'
  const filteredSuggestions = mockSuggestions.filter((s) =>
    s.name.toLowerCase().includes((value || "").toLowerCase())
  );

  // Hàm xử lý khi chọn một mục
  const handleSelect = (item) => {
    // setQuery(item.name); // <-- XÓA DÒNG NÀY
    onChange?.(item.name); // Thông báo cho component cha
    setOpen(false);         // Đóng dropdown
  };

  return (
    <div className="relative flex flex-col" ref={ref}>
      <label className="text-sm font-semibold text-gray-600 mb-1">
        Điểm đến
      </label>

      {/* Wrapper chứa icon và input */}
      <div
        className={`relative w-full flex items-center border border-gray-300 rounded-lg px-3 py-2 
                   bg-white transition-all
                   ${open ? "ring-2 ring-[rgb(40,169,224)] border-transparent" : "focus-within:border-[rgb(40,169,224)]"
        }`}
      >
        <Search size={18} className="text-gray-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Nhập thành phố hoặc khách sạn"
          className="w-full h-full outline-none border-none p-0 ml-2 text-sm text-gray-700"
          
          // ✅ 3. SỬ DỤNG 'value' TỪ PROP
          value={value || ""}
          
          // ✅ 4. CẬP NHẬT TRỰC TIẾP STATE CỦA CHA (HotelSearchPage) KHI GÕ
          onChange={(e) => {
            onChange?.(e.target.value); // Cập nhật state của cha
            if (!open) setOpen(true);      // Mở dropdown khi bắt đầu gõ
          }}
          onFocus={() => setOpen(true)} // Mở khi focus
        />
      </div>

      {/* Dropdown gợi ý */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl 
                     rounded-xl z-50 w-full min-w-[300px] overflow-hidden animate-fadeIn"
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, index) => (
                <SuggestionItem 
                  key={index} 
                  item={item} 
                  onClick={() => handleSelect(item)} 
                />
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                Không tìm thấy kết quả.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}