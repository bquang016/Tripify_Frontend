import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";

const RevenueChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <BarChart3 size={20} />
           </div>
           <div>
              <h3 className="text-lg font-bold text-gray-800">Biểu đồ Doanh Thu</h3>
              <p className="text-xs text-gray-500 mt-0.5">Thống kê theo từng tháng (Năm nay)</p>
           </div>
        </div>
      </div>
      
      {/* ✅ FIX LỖI WIDTH(-1): Đặt height cố định */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}} 
                dy={10} 
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}} 
                tickFormatter={(val) => `${(val/1000000).toFixed(0)}Tr`} 
                width={45}
            />
            <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                formatter={(value) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), "Doanh thu"]}
                labelStyle={{ color: '#6b7280', marginBottom: '0.25rem' }}
            />
            <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                radius={[6, 6, 0, 0]} 
                activeBar={{ fill: '#2563eb' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;