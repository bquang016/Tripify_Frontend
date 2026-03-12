import React from "react";
import { LogIn, LogOut, CircleDollarSign, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const HotelStatCard = ({ title, value, icon, colorClass, subText }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">{subText}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg shadow-opacity-20`}>
                {icon}
            </div>
        </div>
    </div>
);

const HotelStatCards = ({ stats }) => {
    const { t, i18n } = useTranslation();
    const { currency } = useLanguage();

    const formatMoney = (val) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((val || 0) / 25000);
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val || 0);
    };

    const isVi = i18n.language === 'vi';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <HotelStatCard
                title={isVi ? "Check-in Hôm nay" : "Check-in Today"}
                value={stats?.checkInToday || 0}
                icon={<LogIn size={24} />}
                colorClass="bg-gradient-to-r from-emerald-500 to-teal-500"
                subText={isVi ? "Khách đến" : "Arrivals"}
            />
            <HotelStatCard
                title={isVi ? "Check-out Hôm nay" : "Check-out Today"}
                value={stats?.checkOutToday || 0}
                icon={<LogOut size={24} />}
                colorClass="bg-gradient-to-r from-orange-500 to-red-500"
                subText={isVi ? "Khách đi" : "Departures"}
            />
            <HotelStatCard
                title={isVi ? "Doanh thu Hôm nay" : "Today's Revenue"}
                value={formatMoney(stats?.revenueToday)}
                icon={<CircleDollarSign size={24} />}
                colorClass="bg-gradient-to-r from-blue-500 to-indigo-500"
                subText={isVi ? "Tạm tính" : "Estimated"}
            />
            <HotelStatCard
                title={isVi ? "Booking Mới (24h)" : "New Bookings (24h)"}
                value={stats?.newBookings24h || 0}
                icon={<CalendarCheck size={24} />}
                colorClass="bg-gradient-to-r from-violet-500 to-purple-500"
                subText={isVi ? "Đơn đặt mới" : "Recent orders"}
            />
        </div>
    );
};

export default HotelStatCards;
