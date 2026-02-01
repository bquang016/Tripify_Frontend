import React from "react";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const DailyActivityFeed = ({ bookings }) => {
    
    // Hàm chọn icon dựa trên trạng thái booking
    const getIcon = (status) => {
        switch(status) {
            case 'CONFIRMED': return <CheckCircle size={16} className="text-green-500" />;
            case 'CANCELLED': return <XCircle size={16} className="text-red-500" />;
            case 'PENDING_PAYMENT': return <Clock size={16} className="text-yellow-500" />;
            default: return <FileText size={16} className="text-blue-500" />;
        }
    };

    const getMessage = (booking) => {
        switch(booking.status) {
            case 'CONFIRMED': return `đã đặt phòng ${booking.propertyName}`;
            case 'CANCELLED': return `đã hủy đơn đặt tại ${booking.propertyName}`;
            case 'PENDING_PAYMENT': return `vừa tạo đơn mới tại ${booking.propertyName}`;
            case 'CHECKED_IN': return `đã check-in tại ${booking.propertyName}`;
            default: return `đã tương tác với ${booking.propertyName}`;
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Hoạt động gần đây</h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
                {bookings?.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex gap-3 relative">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-8 bottom-[-20px] w-[2px] bg-gray-100 last:hidden"></div>
                        
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm z-10 relative">
                                {getIcon(item.status)}
                            </div>
                        </div>
                        
                        <div className="flex-1 pb-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-bold">{item.customerName}</span> {getMessage(item)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                    #{item.id}
                                </span>
                                <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {(!bookings || bookings.length === 0) && (
                    <p className="text-center text-gray-400 py-10">Chưa có hoạt động mới</p>
                )}
            </div>
        </div>
    );
};

export default DailyActivityFeed;
