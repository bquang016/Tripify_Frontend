import React, { useState, useEffect } from "react";
import { ArrowLeft, Filter, Trash2, Loader2 } from "lucide-react"; // Thêm icon Loader
import { addDays, format } from "date-fns";

import MapDestinationSearch from "./search-inputs/MapDestinationSearch";
import MapDateSelector from "./search-inputs/MapDateSelector";
import MapGuestSelector from "./search-inputs/MapGuestSelector";

const MapHeader = ({ 
  navigate, 
  onFilterChange, // Callback mới thay vì navigate trực tiếp
  isSearching,    // Prop loading từ parent truyền vào
  minRating, setMinRating, 
  priceRange, setPriceRange 
}) => {
  
  // --- State ---
  const defaultDates = { startDate: new Date(), endDate: addDays(new Date(), 1) };
  const [keyword, setKeyword] = useState("");
  const [dateRange, setDateRange] = useState(defaultDates);
  const [guests, setGuests] = useState(2);

  // --- Logic Debounce & Auto Search ---
  useEffect(() => {
    // Tạo timer delay tìm kiếm
    const timer = setTimeout(() => {
      // Chuẩn bị data
      const searchParams = {
        keyword: keyword,
        guests: guests,
        checkIn: format(dateRange.startDate, "yyyy-MM-dd"),
        checkOut: format(dateRange.endDate, "yyyy-MM-dd"),
      };

      // Gọi callback lên Parent (ExploreMapPage)
      onFilterChange(searchParams);

    }, 500); // Delay 500ms sau khi ngừng thao tác

    return () => clearTimeout(timer); // Cleanup timer cũ nếu user tiếp tục thay đổi
  }, [keyword, dateRange, guests, onFilterChange]); // Chạy lại khi 1 trong 3 state thay đổi

  // --- Logic Reset ---
  const handleResetFilters = () => {
    setKeyword("");
    setDateRange(defaultDates);
    setGuests(2);
    setMinRating(0);
    setPriceRange("all");
  };

  const isFilterActive = keyword || guests !== 2 || minRating !== 0 || priceRange !== "all";

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none flex flex-col gap-3">
      
      {/* Row 1: Back + Inputs */}
      <div className="flex items-start md:items-center justify-center gap-3 pointer-events-auto">
        <button onClick={() => navigate(-1)} className="mt-1 md:mt-0 p-3 bg-white rounded-full shadow-xl hover:bg-gray-50 text-gray-700 border border-gray-100 transition-transform active:scale-95 shrink-0">
          <ArrowLeft size={20} />
        </button>

        {/* Container Thanh Tìm Kiếm */}
        <div className="bg-white shadow-xl rounded-2xl md:rounded-full p-1 flex flex-col md:flex-row items-stretch md:items-center border border-gray-200 max-w-4xl w-full transition-all hover:shadow-2xl gap-1 md:gap-0 relative">
          
          {/* 1. Chọn Tỉnh Thành (API) */}
          <MapDestinationSearch value={keyword} onChange={setKeyword} />
          
          <div className="hidden md:block w-[1px] h-8 bg-gray-200 my-auto"></div>
          <div className="md:hidden h-[1px] w-full bg-gray-100 my-1"></div>

          {/* 2. Ngày */}
          <MapDateSelector dateRange={dateRange} onChange={setDateRange} />

          <div className="hidden md:block w-[1px] h-8 bg-gray-200 my-auto"></div>
          <div className="md:hidden h-[1px] w-full bg-gray-100 my-1"></div>

          {/* 3. Khách */}
          <MapGuestSelector guests={guests} onChange={setGuests} />

          {/* Indicator Loading nhỏ (Thay thế nút Search) */}
          <div className="hidden md:flex items-center justify-center px-4 w-12">
             {isSearching ? (
                 <Loader2 size={20} className="text-blue-600 animate-spin" />
             ) : (
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
             )}
          </div>

        </div>
      </div>

      {/* Row 2: Filter Chips */}
      <div className="flex items-center justify-center gap-2 pointer-events-auto overflow-x-auto no-scrollbar pb-2 px-4">
        {isFilterActive && (
            <button onClick={handleResetFilters} className="px-3 py-2 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all flex items-center gap-1.5 shadow-sm">
                <Trash2 size={12} /> Xóa lọc
            </button>
        )}

        <FilterChip label="4 sao trở lên" isActive={minRating === 4} onClick={() => setMinRating(minRating === 4 ? 0 : 4)} icon={<Filter size={13} />} />
        <FilterChip label="Giá rẻ (<1tr)" isActive={priceRange === 'low'} onClick={() => setPriceRange(priceRange === 'low' ? 'all' : 'low')} />
        <FilterChip label="Trung bình (1-3tr)" isActive={priceRange === 'mid'} onClick={() => setPriceRange(priceRange === 'mid' ? 'all' : 'mid')} />
      </div>
    </div>
  );
};

// Chip Component (Giữ nguyên)
const FilterChip = ({ label, isActive, onClick, icon }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm border transition-all flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md ${isActive ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:shadow-md'}`}>
        {icon}{label}
    </button>
);

export default MapHeader;