import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react"; // Import icon Home
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import AdminProfileDropdown from "./AdminProfileDropdown";

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        
        {/* Empty space for alignment if needed, or just let the right group align */}
        <div className="flex-1"></div>

        {/* 2. Nhóm chức năng bên phải */}
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

          {/* Icon Thông báo */}
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
