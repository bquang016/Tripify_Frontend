import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Users } from "lucide-react";

const UserGrowthChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
       <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <Users size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Tăng Trưởng Người Dùng</h3>
      </div>
      
      {/* ✅ FIX LỖI WIDTH(-1): Đặt height cố định */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
            <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                formatter={(value) => [value, "Người dùng mới"]}
            />
            <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} 
                activeDot={{r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2}} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;