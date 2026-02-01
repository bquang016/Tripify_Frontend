import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const RevenueOverview = ({ data }) => {
  // Hàm dịch loại hình sang tiếng Việt
  const translateType = (type) => {
    const map = {
      'HOTEL': 'Khách sạn',
      'VILLA': 'Biệt thự',
      'RESORT': 'Khu nghỉ dưỡng',
      'HOMESTAY': 'Homestay',
      'APARTMENT': 'Căn hộ'
    };
    return map[type] || type;
  };

  // Map dữ liệu sang tên tiếng Việt trước khi đưa vào biểu đồ
  const formattedData = (data || []).map(item => ({
    ...item,
    name: translateType(item.name)
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
         <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <PieIcon size={20} />
         </div>
         <h3 className="text-lg font-bold text-gray-800">Cơ Cấu Doanh Thu</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-10">Theo loại hình kinh doanh</p>
      
      {/* ✅ FIX LỖI WIDTH(-1): Đặt height cố định cho container cha */}
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
                formatter={(val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)} 
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