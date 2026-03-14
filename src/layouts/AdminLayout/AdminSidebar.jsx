import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
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
  Bell,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const AdminSidebar = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(""); 
  const location = useLocation();
  const { logout, currentUser, hasRole } = useAuth(); 

  const menuItems = [
    { name: t('admin.dashboard'), icon: <LayoutDashboard size={20} />, path: "/admin" },
    { 
      name: t('admin.manage_users'), 
      icon: <Users size={20} />, 
      path: "/admin/users",
      permission: "USER_VIEW" 
    },
    ...(currentUser?.isSuper ? [
      { name: t('admin.manage_roles'), icon: <ShieldCheck size={20} />, path: "/admin/roles" }
    ] : []),
    
    { 
      name: t('admin.manage_residences'), 
      icon: <Building2 size={20} />, 
      key: "residences",
      permission: "PROPERTY_VIEW",
      children: [
        { 
          name: t('admin.approve_residences'), 
          path: "/admin/hotels/submissions", 
          icon: <CheckSquare size={16} />,
          permission: "PROPERTY_APPROVE"
        },
        { 
          name: t('admin.residences_list'),
          path: "/admin/hotels/list",
          icon: <List size={16} /> 
        },
      ]
    },
    
    { 
      name: t('admin.financial_mgmt'), 
      icon: <DollarSign size={20} />, 
      key: "finance", 
      permission: "TRANSACTION_VIEW",
      children: [
        { 
          name: t('admin.payments_mgmt'), 
          path: "/admin/transactions", 
          icon: <CreditCard size={16} /> 
        },
        { 
          name: t('admin.refunds_mgmt'),
          path: "/admin/refunds",
          icon: <RotateCcw size={16} />,
          permission: "REFUND_MANAGE"
        },
      ]
    },

    { 
      name: t('admin.promotions_mgmt'), 
      icon: <Ticket size={20} />, 
      path: "/admin/promotions",
      permission: "PROMOTION_VIEW"
    },

    { 
      name: t('admin.owner_approvals'), 
      icon: <CheckSquare size={20} />, 
      path: "/admin/approvals",
      permission: "APPLICATION_MANAGE"
    },

    {
      name: t('admin.notifications'),
      icon: <Bell size={20} />, 
      path: "/admin/notifications"
    },

    {
    name: 'Thanh toán Đối tác',
    icon: <DollarSign size={20} />, // Nhớ import DollarSign từ lucide-react
    path: '/admin/payouts'
    },

    {
      name: t('admin.audit_logs'),
      icon: <FileSearch size={20} />,
      path: "/admin/audit-logs",
      permission: "AUDIT_VIEW"
    },
    ...(currentUser?.isSuper ? [
      {
        name: t('admin.settings'),
        icon: <Settings size={20} />,
        path: "/admin/settings"
      }
    ] : []),
  ];

  const handleSubMenuToggle = (key) => {
      setOpenSubMenu(openSubMenu === key ? "" : key);
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (currentUser?.isSuper) return true;
    if (item.permission && !hasRole(item.permission)) return false;
    return true;
  });

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`} 
    >
      <div className={`flex items-center p-4 border-b border-gray-200 h-16 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="src/assets/logo/logo_tripify_xoafont.png"
              alt="Tripify"
              style={{ width: "135px", height: "43px" }} 
              className="object-contain"
            />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredMenuItems.map((item) => {
          if (item.children) {
            const isSubMenuOpen = openSubMenu === item.key;
            const filteredChildren = item.children.filter(child => {
              if (currentUser?.isSuper) return true;
              if (child.permission && !hasRole(child.permission)) return false;
              return true;
            });
            if (filteredChildren.length === 0) return null;
            const isParentActive = filteredChildren.some(child => location.pathname === child.path || location.pathname.startsWith(child.path));
            return (
              <div key={item.key}>
                <button onClick={() => handleSubMenuToggle(item.key)} className={`flex items-center justify-between gap-3 py-2.5 px-4 rounded-lg transition-all w-full ${isParentActive ? "bg-[rgb(40,169,224)] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"} ${collapsed ? "justify-center" : ""}`}>
                  <div className="flex items-center gap-3">{item.icon}{!collapsed && <span className="font-medium text-sm">{item.name}</span>}</div>
                  {!collapsed && <ChevronDown size={16} className={`transition-transform ${isSubMenuOpen ? "rotate-180" : ""}`} />}
                </button>
                {isSubMenuOpen && !collapsed && (
                  <div className="pl-7 mt-1 space-y-1 animate-fadeIn">
                    {filteredChildren.map(child => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <Link key={child.path} to={child.path} title={child.name} className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all text-sm ${isChildActive ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-100"}`}>
                          {child.icon}<span>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          const isSettings = item.path === "/admin/settings";
          const activeStyle = isSettings && isActive ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" : (isActive ? "bg-[rgb(40,169,224)] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100");
          return (
            <Link key={item.path || item.name} to={item.path} title={item.name} className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all ${activeStyle} ${collapsed ? "justify-center" : ""}`}>
              {item.icon}{!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => {
            if (confirm(t('admin.logout_confirm'))) {
              logout();
            }
          }}
          title={t('common.logout')}
          className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all w-full text-red-500 hover:bg-red-50 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">{t('common.logout')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;