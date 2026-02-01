import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react"; // ✅ Import icon Home
import SearchInput from "../../components/common/Input/SearchInput";
import OwnerNotificationDropdown from "./OwnerNotificationDropdown";
import OwnerProfileDropdown from "./OwnerProfileDropdown";

const OwnerHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* 1. Search Bar */}
        <div className="w-full max-w-md hidden md:block">
          <SearchInput placeholder="Tìm kiếm tài sản, đơn đặt phòng..." />
        </div>

        {/* 2. Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          
          {/* ✅ NÚT QUAY LẠI TRANG CHỦ */}
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all border border-gray-200 mr-2"
            title="Quay về trang chủ Website"
          >
            <Home size={18} />
            <span className="hidden lg:inline">Về trang chủ</span>
          </Link>

          {/* Group Icon & Profile */}
          <div className="border-l border-gray-200 pl-3 flex items-center gap-3">
             <OwnerNotificationDropdown />
             <OwnerProfileDropdown />
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default OwnerHeader;