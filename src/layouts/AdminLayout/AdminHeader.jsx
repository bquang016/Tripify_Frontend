import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { useTranslation } from "react-i18next";

const AdminHeader = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1"></div>
        <div className="flex items-center gap-3 ml-auto">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all border border-gray-200 mr-2"
            title={i18n.language === 'vi' ? "Quay về trang chủ Website" : "Back to Home"}
          >
            <Home size={18} />
            <span className="hidden lg:inline">{t('common.home')}</span>
          </Link>

          <div className="border-l border-gray-200 pl-3 flex items-center gap-3">
             <AdminNotificationDropdown />
             <AdminProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
