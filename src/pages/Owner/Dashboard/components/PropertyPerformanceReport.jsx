import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Building2, Filter, TrendingUp, ShoppingBag } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PropertyPerformanceReport = ({ data }) => {
    const [selectedType, setSelectedType] = useState("ALL");
    const [chartMode, setChartMode] = useState("REVENUE"); // REVENUE hoặc BOOKINGS

    // Xử lý và format dữ liệu
    const formattedData = useMemo(() => {
        if (!data) return [];
        return data.map(item => ({
            name: item.name,
            revenue: Number(item.value) || 0,
            bookings: Number(item.count) || 0
        }));
    }, [data]);

    const filteredData = useMemo(() => {
        if (selectedType === "ALL") return formattedData;
        return formattedData.filter(d => d.name === selectedType);
    }, [formattedData, selectedType]);

    // Format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Custom Tooltip cho Biểu đồ
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                    <p className="font-bold text-slate-700">{payload[0].name}</p>
                    <p className="text-emerald-600 font-semibold text-sm mt-1">
                        {chartMode === "REVENUE" ? "Doanh thu: " + formatCurrency(payload[0].value) : "Số lượt đặt: " + payload[0].value + " phòng"}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-6 flex flex-col items-center justify-center animate-fade-in">
                <Building2 className="text-slate-300 mb-3" size={48} />
                <h2 className="text-lg font-black text-slate-700">Hiệu suất cơ sở theo loại hình</h2>
                <p className="text-sm text-slate-500 mt-2">Chưa có dữ liệu doanh thu để thống kê biểu đồ.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6 animate-fade-in">
            {/* Header & Bộ lọc */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Building2 className="text-emerald-500" size={20} />
                        Hiệu suất cơ sở theo loại hình
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Phân tích chuyên sâu mức độ hiệu quả của từng loại hình lưu trú.</p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    {/* Nút chuyển đổi biểu đồ */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setChartMode("REVENUE")} 
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartMode === "REVENUE" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
                        >
                            <TrendingUp size={14} className="inline mr-1"/> Doanh thu
                        </button>
                        <button 
                            onClick={() => setChartMode("BOOKINGS")} 
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartMode === "BOOKINGS" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                        >
                            <ShoppingBag size={14} className="inline mr-1"/> Lượt đặt
                        </button>
                    </div>

                    {/* Dropdown Lọc */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 appearance-none"
                        >
                            <option value="ALL">Tất cả loại hình</option>
                            {formattedData.map((d, idx) => (
                                <option key={idx} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Khu vực Biểu đồ */}
                <div className="h-[300px] w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={filteredData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey={chartMode === "REVENUE" ? "revenue" : "bookings"}
                            >
                                {filteredData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Khu vực Bảng dữ liệu chi tiết */}
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Loại hình</th>
                                <th className="px-4 py-3 text-center">Số lượt đặt</th>
                                <th className="px-4 py-3 text-right">Tổng Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4 font-bold text-slate-700 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                        {item.name}
                                    </td>
                                    <td className="px-4 py-4 text-center font-semibold text-blue-600">
                                        {item.bookings} lượt
                                    </td>
                                    <td className="px-4 py-4 text-right font-black text-emerald-600">
                                        {formatCurrency(item.revenue)}
                                    </td>
                                </tr>
                            ))}
                            {selectedType === "ALL" && (
                                <tr className="bg-slate-100/50">
                                    <td className="px-4 py-3 font-black text-slate-800 uppercase text-xs">Tổng cộng</td>
                                    <td className="px-4 py-3 text-center font-black text-blue-700">
                                        {formattedData.reduce((acc, curr) => acc + curr.bookings, 0)} lượt
                                    </td>
                                    <td className="px-4 py-3 text-right font-black text-emerald-700">
                                        {formatCurrency(formattedData.reduce((acc, curr) => acc + curr.revenue, 0))}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PropertyPerformanceReport;