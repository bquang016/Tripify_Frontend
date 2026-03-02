import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

// (Yêu cầu 2: Component nội bộ để hiển thị cờ đẹp hơn)
const FlagIcon = ({ code, className = "w-5 h-auto rounded-sm" }) => (
  <img
    // Sử dụng CDN miễn phí để lấy cờ dạng SVG
    src={`https://flagcdn.com/${code}.svg`}
    alt={`${code} flag`}
    className={className}
  />
);

// Danh sách các lựa chọn ngôn ngữ/tiền tệ
const options = [
  { code: "vi", label: "VI (VND)", icon: <FlagIcon code="vn" />, currency: "VND" },
  { code: "en", label: "ENG (USD)", icon: <FlagIcon code="gb" />, currency: "USD" }, 
];

// (Yêu cầu 1: Tách component)
const LanguageSwitcher = ({ navLinkClass }) => {
  const { language, currency, changeLanguage, changeCurrency } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  
  const selected = options.find(opt => opt.code === language) || options[0];
  const langRef = useRef(null);

  // Xử lý click outside chỉ cho dropdown này
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSelect = (option) => {
    changeLanguage(option.code);
    changeCurrency(option.currency);
    setLangOpen(false);
  };

  return (
    <div className="relative" ref={langRef}>
      <button
        onClick={() => setLangOpen(!langOpen)}
        className={navLinkClass} // Nhận class từ Header để đồng nhất style
      >
        {/* (Yêu cầu 2: Hiển thị icon cờ) */}
        {selected.icon}
        <span className="ml-1">{selected.label}</span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown menu */}
      {langOpen && (
        <div className="absolute mt-2 bg-white border border-gray-100 shadow-xl rounded-lg w-40 py-2 z-50">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => handleSelect(opt)}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
            >
              {opt.icon}
              <span className="ml-1">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;