import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { Info, CalendarDays, ArrowRight, Check, TrendingUp, Sparkles, AlertCircle } from "lucide-react"; 
import { DateRange } from 'react-date-range';
import { vi } from 'date-fns/locale';
import { addDays, differenceInCalendarDays, format, getDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

import roomService from "@/services/room.service";
import Spinner from "@/components/common/Loading/Spinner";
import { formatCurrency } from "@/utils/priceUtils";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const BookingDateModal = ({ 
    open, onClose, onConfirm, occupiedDates = [], selectedRoomId, 
    roomPrice: initialRoomPrice, convertedPrice,
    weekendPrice, convertedWeekendPrice,
    currency = 'VND'
}) => {

    // --- 1. Logic Khởi tạo & Fallback ---
    // Ưu tiên giá đã quy đổi nếu có
    const standardPrice = Number(convertedPrice || initialRoomPrice) || 0;
    const endPrice = Number(convertedWeekendPrice || weekendPrice || standardPrice) || 0;

    // State lưu giá (dùng cho tính toán tiền)
    const [prices, setPrices] = useState({ weekday: standardPrice, weekend: endPrice });

    // State chọn ngày
    const [selection, setSelection] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
    });

    // State dữ liệu biểu đồ & UI
    const [forecastData, setForecastData] = useState([]);
    const [loadingForecast, setLoadingForecast] = useState(false);
    const [monthsToShow, setMonthsToShow] = useState(2);
    const [hasPriceVariation, setHasPriceVariation] = useState(false);

    // State hỗ trợ UI đẹp hơn
    const [hoverInfo, setHoverInfo] = useState(null);
    const [priceComparison, setPriceComparison] = useState({
        isVariation: false,
        higherType: 'weekend',
        maxPrice: 0
    });

    // ✅ [MỚI] State cảnh báo lỗi chọn lịch
    const [dateError, setDateError] = useState(null);

    // Responsive: chỉnh số tháng hiển thị
    useEffect(() => {
        const handleResize = () => {
            setMonthsToShow(window.innerWidth < 1024 ? 1 : 2);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- 2. Gọi API Forecast & Xử lý dữ liệu ---
    useEffect(() => {
        const fetchPriceForecast = async () => {
            if (!selectedRoomId || !open) return;
            setLoadingForecast(true);
            try {
                const res = await roomService.getPriceForecast(selectedRoomId, 14);
                if (res.data) {
                    const apiData = res.data;

                    const weekdayItem = apiData.find(d => (d.weekend !== undefined ? !d.weekend : !d.isWeekend));
                    const weekendItem = apiData.find(d => (d.weekend !== undefined ? d.weekend : d.isWeekend));

                    // Backend forecast cũng nên trả về convertedPrice
                    const pWeekday = weekdayItem ? Number(weekdayItem.convertedPrice || weekdayItem.price) : standardPrice;
                    const pWeekend = weekendItem ? Number(weekendItem.convertedPrice || weekendItem.price) : endPrice;

                    setPrices({ weekday: pWeekday, weekend: pWeekend });

                    const maxP = Math.max(pWeekday, pWeekend);
                    const isVar = pWeekday !== pWeekend;
                    const higherType = pWeekend >= pWeekday ? 'weekend' : 'weekday';

                    setHasPriceVariation(isVar);
                    setPriceComparison({
                        isVariation: isVar,
                        higherType: higherType,
                        maxPrice: maxP
                    });

                    const formattedData = apiData.map(item => {
                        const dateObj = new Date(item.date);
                        const isWeekendDay = item.weekend !== undefined ? item.weekend : item.isWeekend;
                        const itemPrice = Number(item.convertedPrice || item.price);

                        let savings = 0;
                        if (itemPrice < maxP && maxP > 0) {
                            savings = Math.round(((maxP - itemPrice) / maxP) * 100);
                        }

                        return {
                            date: dateObj,
                            dayName: format(dateObj, "EEEE", { locale: vi }).replace("Thứ ", "T"),
                            fullDateStr: format(dateObj, "dd/MM"),
                            price: itemPrice,
                            level: isWeekendDay ? 'weekend' : 'weekday',
                            savings: savings,
                            isWeekend: isWeekendDay
                        };
                    });
                    setForecastData(formattedData);
                }
            } catch (error) {
                console.error("Lỗi forecast:", error);
            } finally {
                setLoadingForecast(false);
            }
        };
        fetchPriceForecast();
    }, [selectedRoomId, open, standardPrice, endPrice]);

    // ✅ [MỚI] HÀM KIỂM TRA LỊCH CÓ HỢP LỆ KHÔNG
    const isRangeValid = useMemo(() => {
        if (!selection.startDate || !selection.endDate) return false;

        let curr = new Date(selection.startDate);
        const end = new Date(selection.endDate);

        curr.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        while (curr < end) {
            const isOccupied = occupiedDates.some(range => {
                const s = new Date(range.start);
                const e = new Date(range.end);
                s.setHours(0,0,0,0);
                e.setHours(0,0,0,0);
                return curr >= s && curr <= e;
            });

            if (isOccupied) return false;

            curr = addDays(curr, 1);
        }
        return true;
    }, [selection, occupiedDates]);

    useEffect(() => {
        if (isRangeValid) {
            setDateError(null);
        } else {
            setDateError("Khoảng thời gian bạn chọn có ngày đã hết phòng. Vui lòng chọn lại!");
        }
    }, [selection, isRangeValid]);

    // --- 3. Logic tính tiền ---
    const bookingCalculation = useMemo(() => {
        let total = 0;
        let weekdayCount = 0;
        let weekendCount = 0;
        let tempDate = new Date(selection.startDate);
        const endDate = new Date(selection.endDate);

        tempDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        while (tempDate < endDate) {
            const dayOfWeek = getDay(tempDate);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            if (isWeekend) {
                total += prices.weekend;
                weekendCount++;
            } else {
                total += prices.weekday;
                weekdayCount++;
            }
            tempDate = addDays(tempDate, 1);
        }
        const nights = Math.max(1, differenceInCalendarDays(selection.endDate, selection.startDate));
        return { total, nights, weekdayCount, weekendCount, prices, currency };
    }, [selection, prices, currency]);

    const handleConfirm = () => {
        if (!isRangeValid) {
            setDateError("Bạn không thể đặt phòng vì khoảng thời gian này đã có người đặt!");
            return;
        }
        onConfirm([selection.startDate, selection.endDate], bookingCalculation);
    };

    const handleChartClick = (data) => {
        if (!data || !data.activePayload) return;
        const clickedDate = data.activePayload[0].payload.date;
        setSelection({
            startDate: clickedDate,
            endDate: addDays(clickedDate, 1),
            key: 'selection'
        });
    };

    const checkDisabledDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;

        return occupiedDates.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);
            return date >= start && date <= end;
        });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const compareText = priceComparison.higherType === 'weekend' ? 'cuối tuần' : 'ngày thường';

            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl text-xs transform -translate-y-2 z-50">
                    <div className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                        {data.dayName}, {data.fullDateStr}
                        {data.isWeekend
                            ? <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Cuối tuần</span>
                            : <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Trong tuần</span>
                        }
                    </div>
                    <div className="text-base font-extrabold text-blue-600 mb-1">
                        {formatCurrency(data.price, currency)}
                    </div>
                    {data.savings > 0 && (
                        <div className="text-green-600 font-medium flex items-center gap-1">
                            <TrendingUp size={12} className="rotate-180"/>
                            Rẻ hơn {data.savings}% so với {compareText}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Lên lịch chuyến đi"
            maxWidth="max-w-7xl"
        >
            <div className="flex flex-col h-full bg-white max-h-[90vh] overflow-hidden">

                {/* Header Tip */}
                <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center gap-3 shrink-0">
                    <Sparkles size={18} className="text-indigo-600 animate-pulse" />
                    <div className="text-sm text-indigo-900">
                        {hasPriceVariation ? (
                            <span>
                                <span className="font-bold">Mẹo thông minh:</span> Đặt phòng vào các ngày
                                <span className="font-bold text-green-600 mx-1">
                                    {priceComparison.higherType === 'weekend' ? 'Trong tuần' : 'Cuối tuần'}
                                </span>
                                để tiết kiệm tới <span className="font-bold text-orange-600">{Math.round(((priceComparison.maxPrice - Math.min(prices.weekday, prices.weekend))/priceComparison.maxPrice)*100)}%</span>!
                            </span>
                        ) : (
                            <span><span className="font-bold">Yên tâm đặt phòng:</span> Giá phòng ổn định tất cả các ngày trong tuần.</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    {/* CỘT TRÁI: LỊCH VÀ BIỂU ĐỒ */}
                    <div className="flex-1 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col items-center bg-gray-50/30 overflow-y-auto custom-scrollbar">

                        <div className="w-full flex justify-center mb-6">
                            <DateRange
                                onChange={item => setSelection(item.selection)}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={monthsToShow}
                                ranges={[selection]}
                                direction="horizontal"
                                minDate={new Date()}
                                rangeColors={['#28A9E0']}
                                locale={vi}
                                disabledDay={checkDisabledDate}
                                dateDisplayFormat="dd/MM/yyyy"
                                className="booking-calendar-custom border border-gray-200 rounded-xl shadow-sm bg-white"
                            />
                        </div>

                        {/* BIỂU ĐỒ GIÁ */}
                        <div className="w-full max-w-4xl bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mt-auto relative overflow-hidden min-h-[220px]">
                            {loadingForecast ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                                    <Spinner size="md" />
                                </div>
                            ) : (
                                <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 pointer-events-none"></div>

                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-100 p-1.5 rounded-lg">
                                                    <TrendingUp size={16} className="text-blue-600" />
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-800">Xu hướng giá 14 ngày tới</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 pl-9 h-4">
                                                {hoverInfo ? (
                                                    <span className="text-blue-600 font-medium transition-all">
                                                        {hoverInfo.fullDateStr}: {formatCurrency(hoverInfo.price, currency)}
                                                        {hoverInfo.savings > 0 ? ` (Rẻ hơn ${hoverInfo.savings}%)` : ''}
                                                    </span>
                                                ) : "Di chuột vào cột để xem chi tiết giá"}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 text-[10px] font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                            {hasPriceVariation ? (
                                                <>
                                                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span> Trong tuần</div>
                                                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm"></span> Cuối tuần</div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm"></span> Giá tiêu chuẩn</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-44 w-full relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={forecastData}
                                                margin={{top: 10, right: 0, left: -20, bottom: 0}}
                                                onClick={handleChartClick}
                                                onMouseMove={(state) => state.activePayload && setHoverInfo(state.activePayload[0].payload)}
                                                onMouseLeave={() => setHoverInfo(null)}
                                                barCategoryGap="20%"
                                            >
                                                <defs>
                                                    <linearGradient id="colorWeekday" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                                                        <stop offset="100%" stopColor="#86efac" stopOpacity={0.6}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorWeekend" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#FB923C" stopOpacity={1}/>
                                                        <stop offset="100%" stopColor="#FED7AA" stopOpacity={0.6}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorStable" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#60A5FA" stopOpacity={1}/>
                                                        <stop offset="100%" stopColor="#BFDBFE" stopOpacity={0.6}/>
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="dayName" axisLine={false} tickLine={false}
                                                    tick={{fontSize: 11, fill: '#64748b', fontWeight: 500}} dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false} tickLine={false}
                                                    tick={{fontSize: 10, fill: '#94a3b8'}}
                                                    tickFormatter={(val) => `${val}`}
                                                />
                                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.03)', radius: 6}} />

                                                <Bar dataKey="price" radius={[6, 6, 0, 0]} maxBarSize={45} cursor="pointer" animationDuration={800}>
                                                    {forecastData.map((entry, index) => {
                                                        let fillUrl = "url(#colorStable)";
                                                        if (hasPriceVariation) {
                                                            if (entry.isWeekend) fillUrl = "url(#colorWeekend)";
                                                            else fillUrl = "url(#colorWeekday)";
                                                        }

                                                        const isSelected = entry.date >= selection.startDate && entry.date < selection.endDate;

                                                        return (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={fillUrl}
                                                                stroke={isSelected ? '#2563eb' : 'none'}
                                                                strokeWidth={isSelected ? 2 : 0}
                                                                style={{
                                                                    filter: isSelected ? 'drop-shadow(0px 4px 8px rgba(37, 99, 235, 0.3))' : 'none',
                                                                    opacity: isSelected ? 1 : 0.75,
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 3. CỘT PHẢI: CHI TIẾT THANH TOÁN */}
                    <div className="w-full lg:w-96 bg-white p-6 flex flex-col gap-6 shadow-[-4px_0px_10px_rgba(0,0,0,0.02)] z-10 shrink-0 overflow-y-auto">

                        {/* Box hiển thị ngày */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thời gian lưu trú</h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Nhận phòng</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><CalendarDays size={20} /></div>
                                        <div>
                                            <span className="block text-lg font-bold text-gray-800 leading-tight">{format(selection.startDate, "dd/MM/yyyy")}</span>
                                            <span className="text-xs text-gray-400 font-medium">Từ 14:00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-gray-100 relative my-2">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-300"><ArrowRight size={16} /></div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Trả phòng</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600"><CalendarDays size={20} /></div>
                                        <div>
                                            <span className="block text-lg font-bold text-gray-800 leading-tight">{format(selection.endDate, "dd/MM/yyyy")}</span>
                                            <span className="text-xs text-gray-400 font-medium">Trước 12:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ [MỚI] THÔNG BÁO LỖI NẾU CÓ */}
                        {dateError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 animate-pulse">
                                <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-600 font-medium">{dateError}</p>
                            </div>
                        )}

                        {/* Box tính tiền */}
                        <div className="flex-1 min-h-[100px]">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Chi tiết thanh toán</h4>
                            <div className="space-y-3 text-sm">
                                {bookingCalculation.weekdayCount > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ngày thường ({formatCurrency(prices.weekday, currency)})</span>
                                        <span className="font-medium">x {bookingCalculation.weekdayCount} đêm</span>
                                    </div>
                                )}
                                {bookingCalculation.weekendCount > 0 && (
                                    <div className="flex justify-between text-orange-600 font-medium">
                                        <span>Cuối tuần ({formatCurrency(prices.weekend, currency)})</span>
                                        <span>x {bookingCalculation.weekendCount} đêm</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600 items-center pt-2 border-t border-gray-100">
                                    <span>Tổng số đêm</span>
                                    <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">{bookingCalculation.nights} đêm</span>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-100 my-2 pt-3 flex justify-between items-end">
                                    <span className="font-bold text-gray-800 text-base">Tổng tạm tính</span>
                                    <span className="text-2xl font-extrabold text-[rgb(40,169,224)]">
                                        {formatCurrency(bookingCalculation.total, currency)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-right italic">*Giá đã bao gồm thuế & phí</p>
                            </div>
                        </div>

                        {/* Nút bấm */}
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-100">
                            <Button
                                onClick={handleConfirm}
                                disabled={!!dateError}
                                className={`w-full shadow-lg py-3.5 text-base font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                                    dateError
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                        : "shadow-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                }`}
                            >
                                <Check size={20} strokeWidth={3} /> Xác nhận đặt phòng
                            </Button>
                            <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                Tôi muốn xem thêm
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BookingDateModal;
