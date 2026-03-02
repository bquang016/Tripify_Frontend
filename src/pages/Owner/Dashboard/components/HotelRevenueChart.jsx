import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const HotelRevenueChart = ({ data }) => {
    const { t, i18n } = useTranslation();
    const { currency } = useLanguage();
    const isVi = i18n.language === 'vi';

    // Nếu không có data hoặc data rỗng, không render gì cả để tránh lỗi Recharts
    if (!data || data.length === 0) return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[300px]">
            <p className="text-gray-400">{t('owner.loading_chart', 'Loading chart data...')}</p>
        </div>
    );

    const formatMoney = (val) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{t('owner.revenue_chart_title', 'Revenue Chart')}</h3>
                    <p className="text-xs text-gray-500">{t('owner.revenue_overview_year', 'Yearly overview')}</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#6b7280'}} 
                            dy={10} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#6b7280'}} 
                            tickFormatter={(val) => currency === 'USD' ? `$${(val / 25000).toFixed(0)}` : `${(val / 1000000).toFixed(0)}Tr`}
                            width={45}
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            formatter={(value) => [formatMoney(value), t('owner.revenue', 'Revenue')]}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRev)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HotelRevenueChart;
