import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const RevenueOverview = ({ data }) => {
  const { t, i18n } = useTranslation();
  const { currency } = useLanguage();
  const isVi = i18n.language === 'vi';

  const translateType = (type) => {
    const map = {
      'HOTEL': isVi ? 'Khách sạn' : 'Hotel',
      'VILLA': isVi ? 'Biệt thự' : 'Villa',
      'RESORT': isVi ? 'Khu nghỉ dưỡng' : 'Resort',
      'HOMESTAY': isVi ? 'Homestay' : 'Homestay',
      'APARTMENT': isVi ? 'Căn hộ' : 'Apartment'
    };
    return map[type] || type;
  };

  const formattedData = useMemo(() => (data || []).map(item => ({
    ...item,
    name: translateType(item.name)
  })), [data, isVi]);

  const formatMoney = (val) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
         <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <PieIcon size={20} />
         </div>
         <h3 className="text-lg font-bold text-gray-800">
           {isVi ? "Cơ Cấu Doanh Thu" : "Revenue Breakdown"}
         </h3>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-10">
        {isVi ? "Theo loại hình kinh doanh" : "By business type"}
      </p>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(val) => formatMoney(val)} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueOverview;
