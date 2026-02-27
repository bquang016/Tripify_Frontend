import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckSquare, 
  List, 
  ChevronDown, 
  CreditCard, 
  DollarSign, 
  RotateCcw,
  Ticket,
  FileSearch,
  Bell, // [THÊM ICON BELL]
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(""); 
  const location = useLocation();
  const { logout, currentUser, hasRole } = useAuth(); 

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { 
      name: "Quản lý Users", 
      icon: <Users size={20} />, 
      path: "/admin/users",
      permission: "USER_VIEW" 
    },
    ...(currentUser?.isSuper ? [
      { name: "Quản lý Phân quyền", icon: <ShieldCheck size={20} />, path: "/admin/roles" }
    ] : []),
    
    // 🏢 MENU CON: QUẢN LÝ NƠI CƯ TRÚ
    { 
      name: "Quản lý nơi cư trú", 
      icon: <Building2 size={20} />, 
      key: "residences",
      permission: "PROPERTY_VIEW",
      children: [
        { 
          name: "Duyệt nơi cư trú", 
          path: "/admin/hotels/submissions", 
          icon: <CheckSquare size={16} />,
          permission: "PROPERTY_APPROVE"
        },
        { 
          name: "Danh sách nơi cư trú",
          path: "/admin/hotels/list",
          icon: <List size={16} /> 
        },
      ]
    },
    
    // 💰 MENU CON: QUẢN LÝ DÒNG TIỀN
    { 
      name: "Quản lý dòng tiền", 
      icon: <DollarSign size={20} />, 
      key: "finance", 
      permission: "TRANSACTION_VIEW",
      children: [
        { 
          name: "Quản lý thanh toán", 
          path: "/admin/transactions", 
          icon: <CreditCard size={16} /> 
        },
        { 
          name: "Quản lý hoàn tiền",
          path: "/admin/refunds",
          icon: <RotateCcw size={16} />,
          permission: "REFUND_MANAGE"
        },
      ]
    },

    // 🎫 QUẢN LÝ KHUYẾN MÃI
    { 
      name: "Quản lý Khuyến mãi", 
      icon: <Ticket size={20} />, 
      path: "/admin/promotions",
      permission: "PROMOTION_VIEW"
    },

    { 
      name: "Duyệt Chủ sở hữu", 
      icon: <CheckSquare size={20} />, 
      path: "/admin/approvals",
      permission: "OWNER_APPROVE"
    },

    // [BỔ SUNG MỤC THÔNG BÁO]
    {
      name: "Thông báo",
      icon: <Bell size={20} />, 
      path: "/admin/notifications"
    },

    {
      name: "Lịch sử hệ thống",
      icon: <FileSearch size={20} />,
      path: "/admin/audit-logs",
      permission: "AUDIT_VIEW"
    },
    ...(currentUser?.isSuper ? [
      {
        name: "Cấu hình hệ thống",
        icon: <Settings size={20} />,
        path: "/admin/settings"
      }
    ] : []),
  ];

  const handleSubMenuToggle = (key) => {
      setOpenSubMenu(openSubMenu === key ? "" : key);
  };

  // Hàm lọc menu dựa trên quyền
  const filteredMenuItems = menuItems.filter(item => {
    // Nếu là Super Admin thì hiện tất cả
    if (currentUser?.isSuper) return true;
    
    // Nếu mục yêu cầu permission cụ thể
    if (item.permission && !hasRole(item.permission)) return false;
    
    return true;
  });

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`} 
    >
      {/* Logo */}
      <div 
        className={`flex items-center p-4 border-b border-gray-200 h-16 
          ${collapsed ? "justify-center" : "justify-between"}`} 
      >
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
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredMenuItems.map((item) => {
          
          // Menu có con
          if (item.children) {
            const isSubMenuOpen = openSubMenu === item.key;
            
            // Lọc các menu con dựa trên quyền
            const filteredChildren = item.children.filter(child => {
              if (currentUser?.isSuper) return true;
              if (child.permission && !hasRole(child.permission)) return false;
              return true;
            });

            // Nếu không có menu con nào được phép xem, ẩn luôn menu cha
            if (filteredChildren.length === 0) return null;

            // Logic active: Nếu đang ở route con thì menu cha cũng active
            const isParentActive = filteredChildren.some(child => 
                location.pathname === child.path || location.pathname.startsWith(child.path)
            );
            
            return (
              <div key={item.key}>
                <button
                  onClick={() => handleSubMenuToggle(item.key)}
                  className={`flex items-center justify-between gap-3 py-2.5 px-4 rounded-lg transition-all w-full
                    ${isParentActive ? "bg-[rgb(40,169,224)] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
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
                    {filteredChildren.map(child => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          title={child.name} 
                          className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all text-sm
                            ${isChildActive ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-100"}`}
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

          // Menu đơn
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          
          // Style đặc biệt cho "Cấu hình hệ thống" khi active (xanh dương nhẹ)
          const isSettings = item.path === "/admin/settings";
          const activeStyle = isSettings && isActive 
            ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
            : (isActive ? "bg-[rgb(40,169,224)] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100");

          return (
            <Link
              key={item.path || item.name}
              to={item.path}
              title={item.name} 
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all
                ${activeStyle}
                ${collapsed ? "justify-center" : ""}`}
            >
              {item.icon}
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => {
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
              logout();
            }
          }}
          title="Đăng xuất"
          className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all w-full text-red-500 hover:bg-red-50
            ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;