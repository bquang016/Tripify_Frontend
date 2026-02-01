import React from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { MapPin, Users, BedDouble, CheckCircle2 } from 'lucide-react';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider';

const BookingSummary = ({ hotel, room, dateRange, onSubmit, disabled, submitting, calculationData }) => {
    if (!hotel || !room) return null;

    const nights = Math.max(1, differenceInCalendarDays(dateRange.endDate, dateRange.startDate));

    // ✅ Logic mới: Ưu tiên lấy tổng tiền đã tính toán (có giá cuối tuần)
    // Nếu không có calculationData (trường hợp cũ), fallback về cách tính đơn giản
    const totalPrice = calculationData ? calculationData.total : (room.price * nights);

    // Helper format tiền tệ
    const formatMoney = (v) => new Intl.NumberFormat('vi-VN').format(v);

    return (
        <Card className="sticky top-24 p-6 border border-slate-200 shadow-xl rounded-xl overflow-hidden">
            {/* Hotel Info (Giữ nguyên) */}
            <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                    <img src={room.image || hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">Khách sạn</span>
                    <h3 className="font-bold text-base text-slate-800 line-clamp-2 leading-tight mb-1">{hotel.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin size={12} /> {hotel.location}
                    </p>
                </div>
            </div>

            <Divider className="my-4" />

            {/* Room Info (Giữ nguyên) */}
            <div className="space-y-3 text-sm">
                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <BedDouble size={16} className="text-blue-500"/> {room.name}
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="block text-slate-400 mb-0.5">Nhận phòng</span>
                        <span className="font-bold text-slate-700">{format(dateRange.startDate, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="block text-slate-400 mb-0.5">Trả phòng</span>
                        <span className="font-bold text-slate-700">{format(dateRange.endDate, "dd/MM/yyyy")}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium bg-blue-50/50 p-2 rounded border border-blue-50">
                    <span className="flex items-center gap-1"><Users size={14} className="text-blue-500"/> {room.guests} khách</span>
                    <span className="w-px h-3 bg-blue-200"></span>
                    <span className="flex items-center gap-1"><BedDouble size={14} className="text-blue-500"/> {nights} đêm</span>
                </div>
            </div>

            <Divider className="my-4" />

            {/* Price Calculation (CẬP NHẬT LOGIC MỚI) */}
            <div className="space-y-2">

                {calculationData ? (
                    // Trường hợp 1: Có dữ liệu chi tiết từ Modal (Hiển thị Ngày thường / Cuối tuần)
                    <>
                        {calculationData.weekdayCount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Giá ngày thường (x{calculationData.weekdayCount})</span>
                                <span className="font-medium text-slate-700">
                            {formatMoney(calculationData.prices.weekday * calculationData.weekdayCount)}₫
                        </span>
                            </div>
                        )}

                        {calculationData.weekendCount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Giá cuối tuần (x{calculationData.weekendCount})</span>
                                <span className="font-medium text-orange-600">
                            {formatMoney(calculationData.prices.weekend * calculationData.weekendCount)}₫
                        </span>
                            </div>
                        )}
                    </>
                ) : (
                    // Trường hợp 2: Fallback (Giống hệt code cũ)
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Giá phòng (x{nights} đêm)</span>
                        <span className="font-medium text-slate-700">{formatMoney(totalPrice)}₫</span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Thuế và phí</span>
                    <span className="font-bold text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded">Đã bao gồm</span>
                </div>

                <div className="flex justify-between items-end pt-4 mt-2 border-t border-dashed border-slate-300">
                    <span className="font-bold text-slate-700">Tổng cộng</span>
                    <span className="text-2xl font-extrabold text-blue-600">{formatMoney(totalPrice)}₫</span>
                </div>
            </div>

            <Button
                fullWidth
                size="lg"
                className="mt-6 bg-[#28A9E0] hover:bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold py-3.5"
                onClick={onSubmit}
                disabled={disabled || submitting}
                leftIcon={!submitting && <CheckCircle2 size={20} />}
                isLoading={submitting}
            >
                {submitting ? "Đang xử lý..." : "Thanh toán ngay"}
            </Button>
        </Card>
    );
};

export default BookingSummary;