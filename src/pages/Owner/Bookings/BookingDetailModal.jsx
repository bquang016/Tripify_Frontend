import React, { useMemo } from "react";
import {
    X, Phone, Mail, CreditCard, FileText, CheckCircle2, 
    MapPin, Users, LogOut, Calendar, Clock, User, AlertCircle
} from "lucide-react";
import Button from "./components/common/Button";

const BookingDetailModal = ({ isOpen, onClose, booking, onCheckOut }) => {
    if (!isOpen || !booking) return null;

    // --- 1. HELPERS FORMAT ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        });
    };

    // Helper dịch trạng thái thanh toán sang Tiếng Việt
    const getPaymentStatusLabel = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'PAID':
                return 'Đã thanh toán';
            case 'PENDING':
            case 'PENDING_PAYMENT':
                return 'Chờ thanh toán';
            case 'REFUNDED':
                return 'Đã hoàn tiền';
            case 'REFUND_REQUESTED':
                return 'Chờ hoàn tiền';
            case 'REJECTED':
                return 'Thất bại';
            default:
                return status || 'Chưa xác định';
        }
    };

    // --- 2. TÍNH TOÁN SỐ ĐÊM & ĐƠN GIÁ ---
    const { nights, pricePerNight } = useMemo(() => {
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        
        // Tính số mili-giây chênh lệch
        const diffTime = Math.abs(end - start);
        // Chuyển sang số ngày (làm tròn lên, tối thiểu 1 đêm)
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        const price = booking.totalPrice / days;
        
        return { nights: days, pricePerNight: price };
    }, [booking.checkIn, booking.checkOut, booking.totalPrice]);

    // Hàm xử lý check-out
    const handleModalCheckOut = () => {
        if (onCheckOut) {
            onCheckOut(booking.id);
            onClose();
        }
    };

    // Logic màu sắc badge thanh toán
    const isPaid = booking.paymentStatus === 'APPROVED' || booking.paymentStatus === 'PAID';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Chi tiết đặt phòng</h2>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            Mã đặt chỗ: <span className="font-mono font-bold text-[#28A9E0] bg-blue-50 px-2 py-0.5 rounded">{booking.bookingCode || "N/A"}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50">
                    
                    {/* CỘT TRÁI: THÔNG TIN KHÁCH & THANH TOÁN */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Thông tin liên hệ */}
                        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                                <Users size={18} className="text-[#28A9E0]" /> Thông tin khách hàng
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Họ tên */}
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase block mb-1.5">Họ và tên</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="bg-white p-1.5 rounded shadow-sm text-blue-500">
                                            <User size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{booking.customerName}</p>
                                    </div>
                                </div>

                                {/* Số điện thoại */}
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase block mb-1.5">Số điện thoại</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="bg-white p-1.5 rounded shadow-sm text-emerald-500">
                                            <Phone size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{booking.phone || "---"}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase block mb-1.5">Email</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="bg-white p-1.5 rounded shadow-sm text-purple-500">
                                            <Mail size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 truncate">{booking.email || "---"}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Thanh toán */}
                        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                                <CreditCard size={18} className="text-[#28A9E0]" /> Thanh toán
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 text-sm">Phương thức</span>
                                    <span className="font-medium text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">
                                        {booking.paymentMethod || "Chưa xác định"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 text-sm">Trạng thái</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                                        isPaid 
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                        : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                        {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 
                                        {getPaymentStatusLabel(booking.paymentStatus)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Yêu cầu đặc biệt */}
                        {booking.specialRequest && booking.specialRequest !== "Không" && (
                            <section className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText size={16} /> Yêu cầu đặc biệt
                                </h3>
                                <p className="text-amber-900 text-sm italic">"{booking.specialRequest}"</p>
                            </section>
                        )}
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT PHÒNG */}
                    <div className="md:col-span-1">
                         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-0">
                            <div className="bg-slate-50 p-4 border-b border-slate-200">
                                <h3 className="font-bold text-slate-700 text-sm uppercase">Thông tin phòng</h3>
                            </div>
                            
                            <div className="p-5 space-y-5">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Loại phòng</p>
                                    <p className="text-[#28A9E0] font-bold text-lg leading-tight">{booking.roomName}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-2">
                                        <MapPin size={14} /> {booking.propertyAddress || "Tại khách sạn"}
                                    </p>
                                </div>

                                {/* Ngày giờ nhận trả */}
                                <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Nhận phòng</p>
                                        <p className="font-bold text-slate-700 text-sm flex items-center gap-1">
                                            <Calendar size={12}/> {formatDate(booking.checkIn)}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                                            <Clock size={10}/> 14:00
                                        </p>
                                    </div>
                                    <div className="text-right border-l border-slate-200 pl-4">
                                        <p className="text-xs text-slate-400 mb-1">Trả phòng</p>
                                        <p className="font-bold text-slate-700 text-sm flex items-center justify-end gap-1">
                                            {formatDate(booking.checkOut)} <Calendar size={12}/>
                                        </p>
                                        <p className="text-xs text-orange-600 font-medium mt-0.5 flex items-center justify-end gap-1">
                                            12:00 <Clock size={10}/>
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Đơn giá</span>
                                        <span className="font-medium text-slate-700">{formatCurrency(pricePerNight)} / đêm</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Thời gian</span>
                                        <span className="font-medium text-slate-700">{nights} đêm</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Số khách</span>
                                        <span className="font-medium text-slate-700">{booking.guestCount}</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-600 font-bold">Tổng cộng</span>
                                        <span className="text-2xl font-bold text-[#28A9E0]">{formatCurrency(booking.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Nút Trả phòng (Nếu cần) */}
                            {/* Chỉ hiện nếu trạng thái là Đang ở (CHECKED_IN) hoặc Đã xác nhận (CONFIRMED) */}
                            {(booking.originalStatus === 'CHECKED_IN' || booking.originalStatus === 'CONFIRMED') && (
                                <div className="p-4 bg-slate-50 border-t border-slate-200">
                                    <Button 
                                        className="w-full justify-center bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100" 
                                        icon={LogOut}
                                        onClick={handleModalCheckOut}
                                    >
                                        Check-out / Trả phòng
                                    </Button>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;