import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import AdminProfileDropdown from "./AdminProfileDropdown";
import LanguageSwitcher from "../CustomerLayout/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const AdminHeader = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1">
            {/* Optional: Add breadcrumbs or page title here */}
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          {/* Language Switcher - Styled like the one on home page but for Admin panel */}
          <div className="flex items-center">
            <LanguageSwitcher navLinkClass="flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full border border-gray-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm" />
          </div>

          <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 rounded-full transition-all shadow-sm"
            title={isVi ? "Quay về trang chủ Website" : "Back to Home"}
          >
            
            <Home size={18} />
            <span className="hidden lg:inline">{t('common.home')}</span>
          </Link>

          <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>

          <div className="flex items-center gap-3">
             <AdminNotificationDropdown />
             <AdminProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
