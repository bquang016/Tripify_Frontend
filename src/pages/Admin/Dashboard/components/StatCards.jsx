import React from "react";
import { DollarSign, Users, Building2, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const StatCard = ({ title, value, icon, colorClass, subText }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {subText && <p className="text-xs text-green-500 mt-2 font-medium">{subText}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg shadow-opacity-20`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatCards = ({ stats }) => {
  const { t, i18n } = useTranslation();
  const { currency } = useLanguage();
  const isVi = i18n.language === 'vi';

  const formatCurrency = (val) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title={t('admin.total_revenue')} 
        value={formatCurrency(stats?.totalRevenue)} 
        icon={<DollarSign size={24} />}
        colorClass="bg-gradient-to-r from-green-400 to-green-600"
        subText={isVi ? "Toàn hệ thống" : "System-wide"}
      />
      <StatCard 
        title={t('admin.total_users')} 
        value={stats?.totalUsers || 0} 
        icon={<Users size={24} />}
        colorClass="bg-gradient-to-r from-blue-400 to-blue-600"
        subText={isVi ? "Đang hoạt động" : "Active now"}
      />
      <StatCard 
        title={isVi ? "Cơ Sở Lưu Trú" : "Properties"} 
        value={stats?.totalProperties || 0} 
        icon={<Building2 size={24} />}
        colorClass="bg-gradient-to-r from-purple-400 to-purple-600"
        subText={isVi ? "Đã kiểm duyệt" : "Verified"}
      />
      <StatCard 
        title={isVi ? "Booking Mới (24h)" : "New Bookings (24h)"} 
        value={stats?.newBookings24h || 0} 
        icon={<CalendarCheck size={24} />}
        colorClass="bg-gradient-to-r from-orange-400 to-orange-600"
        subText={isVi ? "Cần xử lý ngay" : "Action required"}
      />
    </div>
  );
};

export default StatCards;
