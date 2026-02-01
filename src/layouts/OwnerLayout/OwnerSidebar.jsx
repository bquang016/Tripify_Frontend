import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Building2,
  List,
  Plus,
  ChevronDown,
  Tag,
  Bell // ✅ Import icon Chuông
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const OwnerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState("");
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/owner" },
    
    // ✅ Đã thêm mục THÔNG BÁO
    { name: "Thông báo", icon: <Bell size={20} />, path: "/owner/notifications" },
    
    { name: "Khuyến mãi", icon: <Tag size={20} />, path: "/owner/promotions" },
    { name: "Bookings", icon: <CalendarCheck size={20} />, path: "/owner/bookings" },
    {
      name: "Quản lý cơ sở lưu trú",
      icon: <Building2 size={20} />,
      key: "properties",
      children: [
        { name: "Danh sách cơ sở", path: "/owner/properties", icon: <List size={16} /> },
        { name: "Thêm cơ sở mới", path: "/owner/properties/new", icon: <Plus size={16} /> },
      ]
    },
    { name: "Cơ sở lưu trú", icon: <BedDouble size={20} />, path: "/owner/rooms" },
  ];

  const handleSubMenuToggle = (key) => {
    setOpenSubMenu(openSubMenu === key ? "" : key);
  };

  return (
      <aside
          className={`sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Header Logo */}
        <div className={`flex items-center p-4 border-b border-gray-200 h-16 dark:border-gray-700 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
              <Link to="/" className="flex items-center gap-2">
                <img
                    src="/assets/logo/logo_travelmate_xoafont.png"
                    alt="TravelMate"
                    style={{ width: "135px", height: "43px" }}
                    className="object-contain"
                />
              </Link>
          )}
          <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu List */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            if (item.children) {
              const isSubMenuOpen = openSubMenu === item.key;
              const isParentActive = item.children.some(child =>
                  location.pathname.startsWith(child.path)
              );

              return (
                  <div key={item.key}>
                    <button
                        onClick={() => handleSubMenuToggle(item.key)}
                        className={`flex items-center justify-between gap-3 py-2.5 px-4 rounded-lg transition-all w-full
                        ${isParentActive ? "bg-[rgb(40,169,224)] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}
                        ${collapsed ? "justify-center" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
                      </div>
                      {!collapsed && (
                          <ChevronDown size={16} className={`transition-transform ${isSubMenuOpen ? "rotate-180" : ""}`} />
                      )}
                    </button>

                    {isSubMenuOpen && !collapsed && (
                        <div className="pl-7 mt-1 space-y-1 animate-fadeIn">
                          {item.children.map(child => {
                            const isChildActive = location.pathname === child.path;
                            return (
                                <Link
                                    key={child.path}
                                    to={child.path}
                                    title={child.name}
                                    className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all text-sm
                                    ${isChildActive ? "bg-gray-200 text-gray-900 font-medium dark:bg-gray-700 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"}`}
                                >
                                  {child.icon}
                                  <span>{child.name}</span>
                                </Link>
                            );
                          })}
                        </div>
                    )}
                  </div>
              );
            }

            const isActive = location.pathname === item.path || (item.path !== "/owner" && location.pathname.startsWith(item.path));
            return (
                <Link
                    key={item.path || item.name}
                    to={item.path}
                    title={item.name}
                    className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all
                    ${isActive ? "bg-[rgb(40,169,224)] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}
                    ${collapsed ? "justify-center" : ""}`}
                >
                  {item.icon}
                  {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
                </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
              onClick={() => {
                if (confirm("Bạn có chắc muốn đăng xuất?")) {
                  logout();
                }
              }}
              title="Đăng xuất"
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium text-sm">Đăng xuất</span>}
          </button>
        </div>
      </aside>
  );
};

export default OwnerSidebar;