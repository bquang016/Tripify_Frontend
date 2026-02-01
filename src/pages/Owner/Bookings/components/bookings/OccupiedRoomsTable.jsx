import React from "react";
import { LogIn, LogOut, Eye, Calendar, User, Phone, CreditCard, BedDouble } from "lucide-react";

const OccupiedRoomsTable = ({ data, loading, onCheckIn, onCheckOut, onViewDetail }) => {
  
  const formatDate = (date) => {
      if (!date) return "---";
      return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (loading) {
      return (
        <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-slate-200 rounded"></div>
        </div>
      );
  }
  
  if (!data || data.length === 0) {
      return (
        <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <BedDouble size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-600">Chưa có dữ liệu phòng</p>
            <p className="text-sm">Không tìm thấy đơn đặt phòng nào phù hợp với bộ lọc hiện tại.</p>
        </div>
      );
  }

  // Helper render trạng thái với style đẹp hơn
  const renderStatusBadge = (status) => {
      const styles = {
          'PENDING_PAYMENT': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Chờ thanh toán' },
          'CONFIRMED': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Sắp đến' },
          'CHECKED_IN': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Đang lưu trú' },
          'COMPLETED': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Hoàn thành' },
          'CANCELLED': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Đã hủy' },
      };

      const style = styles[status] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: status };

      return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border} inline-flex items-center gap-1 shadow-sm`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text-', 'bg-')}`}></span>
              {style.label}
          </span>
      );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50/80 backdrop-blur text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 w-[250px]">Thông tin Phòng & Khách</th>
            <th className="px-6 py-4 w-[200px]">Lịch trình</th>
            <th className="px-6 py-4 text-right w-[150px]">Thanh toán</th>
            <th className="px-6 py-4 text-center w-[150px]">Trạng thái</th>
            <th className="px-6 py-4 text-right w-[180px]">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((item) => (
            <tr key={item.bookingId} className="hover:bg-blue-50/30 transition-all duration-200 group">
              
              {/* Cột 1: Phòng & Khách */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                            {item.roomName}
                        </span>
                        {/* Mã Booking nhỏ */}
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            #{item.bookingId}
                        </span>
                    </div>
                    
                    {/* Thông tin khách */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                            <User size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 leading-tight">{item.customerName}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {item.phone || "---"}
                            </p>
                        </div>
                    </div>
                </div>
              </td>

              {/* Cột 2: Lịch trình */}
              <td className="px-6 py-4">
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 space-y-1.5 w-fit min-w-[160px]">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1"><Calendar size={12}/> In</span>
                        <span className="font-semibold text-slate-700">{formatDate(item.checkIn)}</span>
                    </div>
                    <div className="w-full h-px bg-slate-200"></div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1"><Calendar size={12}/> Out</span>
                        <span className="font-semibold text-slate-700">{formatDate(item.checkOut)}</span>
                    </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 ml-1 font-medium">
                    {item.guestCount} • {Math.ceil((new Date(item.checkOut) - new Date(item.checkIn))/(1000*60*60*24))} đêm
                </div>
              </td>

              {/* Cột 3: Thanh toán */}
              <td className="px-6 py-4 text-right">
                <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-slate-800 text-base">
                        {formatCurrency(item.totalPrice)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        item.paymentStatus === 'APPROVED' || item.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : item.paymentStatus === 'REFUNDED'
                        ? 'bg-purple-50 text-purple-600 border-purple-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                        <CreditCard size={10} />
                        {item.paymentStatus === 'APPROVED' || item.paymentStatus === 'PAID' ? 'Đã TT' 
                         : item.paymentStatus === 'REFUNDED' ? 'Đã hoàn'
                         : 'Chưa TT'}
                    </span>
                </div>
              </td>

              {/* Cột 4: Trạng thái */}
              <td className="px-6 py-4 text-center">
                {renderStatusBadge(item.status)}
              </td>

              {/* Cột 5: Thao tác */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    
                    {/* Nút Check-in */}
                    {item.status === 'CONFIRMED' && (
                        <button 
                            onClick={() => onCheckIn(item.bookingId)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-sm shadow-blue-200 transition-all active:scale-95"
                            title="Check In (Khách nhận phòng)"
                        >
                            <LogIn size={14} /> Check-in
                        </button>
                    )}

                    {/* Nút Check-out */}
                    {item.status === 'CHECKED_IN' && (
                        <button 
                            onClick={() => onCheckOut(item.bookingId)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium shadow-sm shadow-emerald-200 transition-all active:scale-95"
                            title="Check Out (Khách trả phòng)"
                        >
                            <LogOut size={14} /> Check-out
                        </button>
                    )}

                    {/* Nút Chi tiết */}
                    <button 
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-md hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OccupiedRoomsTable;
