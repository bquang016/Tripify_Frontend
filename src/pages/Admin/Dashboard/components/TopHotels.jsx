import React from "react";
import { Trophy } from "lucide-react";

const TopHotels = ({ hotels }) => {
  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Top Doanh Thu</h3>
        <Trophy className="text-yellow-500" size={20} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {hotels?.map((hotel, index) => (
          <div key={index} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
            {/* Ranking Badge */}
            <div className={`
              w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mr-3 flex-shrink-0
              ${index === 0 ? 'bg-yellow-100 text-yellow-700 ring-4 ring-yellow-50' : 
                index === 1 ? 'bg-gray-200 text-gray-700' : 
                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'}
            `}>
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 truncate">{hotel.name}</h4>
              <p className="text-xs text-gray-500">{hotel.bookings} đơn đặt phòng</p>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-green-600 block">{formatMoney(hotel.revenue)}</span>
            </div>
          </div>
        ))}
        {(!hotels || hotels.length === 0) && <p className="text-center text-gray-400 py-10">Chưa có dữ liệu</p>}
      </div>
    </div>
  );
};

export default TopHotels;