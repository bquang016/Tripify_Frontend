import React from "react";
import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const RecentBookingsTable = ({ bookings }) => {
  const { t, i18n } = useTranslation();
  const { currency } = useLanguage();
  const isVi = i18n.language === 'vi';
  
  // Hàm dịch trạng thái và lấy màu tương ứng
  const getStatusConfig = (status) => {
    switch (status) {
      case 'CONFIRMED': 
        return { label: isVi ? 'Đã xác nhận' : 'Confirmed', style: 'bg-green-100 text-green-700 border-green-200' };
      case 'PENDING_PAYMENT': 
        return { label: isVi ? 'Chờ thanh toán' : 'Pending', style: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'CANCELLED': 
        return { label: isVi ? 'Đã hủy' : 'Cancelled', style: 'bg-red-100 text-red-700 border-red-200' };
      case 'COMPLETED': 
        return { label: isVi ? 'Hoàn thành' : 'Completed', style: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'CHECKED_IN': 
        return { label: isVi ? 'Đã nhận phòng' : 'Checked-in', style: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'REFUNDED':
        return { label: isVi ? 'Đã hoàn tiền' : 'Refunded', style: 'bg-gray-100 text-gray-700 border-gray-200' };
      default: 
        return { label: status, style: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const formatMoney = (val) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(isVi ? 'vi-VN' : 'en-US');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Receipt size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {isVi ? "Giao Dịch Gần Đây" : "Recent Transactions"}
            </h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          {isVi ? "Xem tất cả" : "View all"}
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isVi ? "Mã Đơn" : "Order ID"}
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isVi ? "Khách Hàng" : "Customer"}
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isVi ? "Cơ Sở" : "Property"}
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isVi ? "Ngày Đặt" : "Date"}
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isVi ? "Tổng Tiền" : "Total"}
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                {isVi ? "Trạng Thái" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings?.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 px-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">#{booking.id}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{booking.customerName}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-[180px] truncate" title={booking.propertyName}>{booking.propertyName}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(booking.date)}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{formatMoney(booking.price)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.style}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {(!bookings || bookings.length === 0) && (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">
                  {t('common.no_data')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsTable;
