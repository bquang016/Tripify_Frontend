import React from "react";
import { DollarSign, Users, Building2, CalendarCheck } from "lucide-react";

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
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Tổng Doanh Thu" 
        value={formatCurrency(stats?.totalRevenue)} 
        icon={<DollarSign size={24} />}
        colorClass="bg-gradient-to-r from-green-400 to-green-600"
        subText="Toàn hệ thống"
      />
      <StatCard 
        title="Người Dùng" 
        value={stats?.totalUsers || 0} 
        icon={<Users size={24} />}
        colorClass="bg-gradient-to-r from-blue-400 to-blue-600"
        subText="Đang hoạt động"
      />
      <StatCard 
        title="Cơ Sở Lưu Trú" 
        value={stats?.totalProperties || 0} 
        icon={<Building2 size={24} />}
        colorClass="bg-gradient-to-r from-purple-400 to-purple-600"
        subText="Đã kiểm duyệt"
      />
      <StatCard 
        title="Booking Mới (24h)" 
        value={stats?.newBookings24h || 0} 
        icon={<CalendarCheck size={24} />}
        colorClass="bg-gradient-to-r from-orange-400 to-orange-600"
        subText="Cần xử lý ngay"
      />
    </div>
  );
};

export default StatCards;