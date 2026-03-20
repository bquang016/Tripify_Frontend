import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react"; 
import SearchInput from "../../components/common/Input/SearchInput";
import OwnerNotificationDropdown from "./OwnerNotificationDropdown";
import OwnerProfileDropdown from "./OwnerProfileDropdown";
import LanguageSwitcher from "../CustomerLayout/LanguageSwitcher";
import { useTranslation } from "react-i18next";


const OwnerHeader = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* 1. Search Bar */}
        <div className="w-full max-w-md hidden md:block">
          <SearchInput placeholder={isVi ? "Tìm kiếm tài sản, đơn đặt phòng..." : "Search properties, bookings..."} />
        </div>

        {/* 2. Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          
          {/* Language Switcher */}
          <div className="border-r border-gray-200 pr-4">
            <LanguageSwitcher navLinkClass="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50" />
          </div>

          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all border border-gray-200 mr-2"
            title={isVi ? "Quay về trang chủ Website" : "Back to Home"}
          >
            <Home size={18} />
            <span className="hidden lg:inline">{t('common.home')}</span>
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
