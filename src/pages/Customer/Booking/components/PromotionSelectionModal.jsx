// src/pages/Customer/Booking/components/PromotionSelectionModal.jsx

import React, { useEffect, useState } from 'react';
import Spinner from '@/components/common/Loading/Spinner';
import promotionService from "@/services/promotion.service";
import { TicketPercent, Calendar, CheckCircle2, Trophy } from 'lucide-react'; // Thêm Trophy icon

// ====================================================================
// UTILS
// ====================================================================
const R2_PUBLIC_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150x100?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/^\/+/, "");
    return `${R2_PUBLIC_URL}/${cleanPath}`;
};

// ====================================================================
// SUB-COMPONENT: MỘT DÒNG KHUYẾN MÃI
// ====================================================================
const PromotionListItem = ({ promo, isSelected, accentColor, onSelect }) => {
    const isSystemPromo = !promo.property;

    // Format tiền tệ
    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const discountText = promo.discountType === 'PERCENTAGE'
        ? `${promo.discountValue}%`
        : formatCurrency(promo.discountValue);

    const maxDiscountText = promo.maxDiscountAmount > 0
        ? ` (Tối đa ${formatCurrency(promo.maxDiscountAmount)})`
        : '';

    // Hiển thị số tiền giảm thực tế (nếu có)
    const actualSave = promo.calculatedDiscountAmount > 0
        ? formatCurrency(promo.calculatedDiscountAmount)
        : null;

    const imageUrl = promo.bannerUrl
        ? getFullImageUrl(promo.bannerUrl)
        : "https://via.placeholder.com/64x48?text=Promo";

    return (
        <li
            className={`group relative cursor-pointer select-none py-4 pl-3 pr-9 transition-all border-l-4 mb-4 rounded-r-md shadow-sm
            ${isSelected
                ? `${isSystemPromo ? 'bg-blue-50 border-blue-500' : 'bg-purple-50 border-purple-500'}`
                : 'border-transparent hover:bg-gray-50 border-b border-gray-100'
            }
            ${promo.isBestOffer ? 'bg-orange-50 ring-1 ring-orange-200 mt-2' : ''} 
            `}
            onClick={() => onSelect(promo)}
        >
            {/* ✅ NHÃN "LỰA CHỌN TỐT NHẤT" - GÓC PHẢI */}
            {promo.isBestOffer && (
                <div className="absolute -top-3 -right-2 z-20">
                    <span className="relative flex items-center justify-center px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md border-2 border-white animate-pulse">
                        <Trophy size={11} className="mr-1 text-yellow-300 fill-yellow-300" />
                        LỰA CHỌN TỐT NHẤT
                        {/* Tam giác nhỏ tạo hiệu ứng 3D ở góc */}
                        <div className="absolute top-full right-3 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-red-800 border-r-[0px] border-r-transparent transform -skew-x-12"></div>
                    </span>
                </div>
            )}

            <div className="flex items-start gap-3">
                {/* Ảnh Thumbnail */}
                <div className="w-16 h-12 flex-shrink-0 rounded border border-gray-200 bg-white overflow-hidden shadow-sm mt-1">
                    <img
                        src={imageUrl}
                        alt={promo.code}
                        className={`w-full h-full ${isSystemPromo ? 'object-contain p-0.5' : 'object-cover'}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/64x48?text=Promo"; }}
                    />
                </div>

                {/* Nội dung text */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                        <span className={`font-bold text-sm truncate ${isSelected ? accentColor : 'text-gray-900'}`}>
                            {promo.code}
                        </span>

                        {/* Hiển thị số tiền giảm ngay bên cạnh nếu có */}
                        {actualSave && (
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md ml-2 whitespace-nowrap">
                                -{actualSave}
                             </span>
                        )}
                    </div>

                    <p className="text-gray-600 text-xs font-medium truncate mt-0.5">
                        Giảm {discountText} {maxDiscountText}
                    </p>

                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={10} /> HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>

            {isSelected && (
                <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${accentColor}`}>
                    <CheckCircle2 size={18} />
                </span>
            )}
        </li>
    );
};

// ====================================================================
// SUB-COMPONENT: OPTION KHÔNG DÙNG MÃ
// ====================================================================
const NoPromotionOption = ({ isSelected, accentColor, onSelect }) => (
    <li
        className={`group relative cursor-pointer select-none py-3 pl-3 pr-9 border-l-4 border-transparent hover:bg-gray-50 mb-2
        ${isSelected ? 'bg-gray-50' : ''}`}
        onClick={() => onSelect(null)}
    >
        <div className="flex items-center gap-3">
            <div className="w-16 h-12 flex items-center justify-center flex-shrink-0 rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                <TicketPercent size={20} />
            </div>
            <span className={`block truncate text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-500 italic'}`}>
                Không dùng mã khuyến mãi
            </span>
        </div>
        {isSelected && (
            <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${accentColor}`}>
                <CheckCircle2 size={18} />
            </span>
        )}
    </li>
);

// ====================================================================
// MAIN COMPONENT (DROPDOWN)
// ====================================================================
const PromotionSelectionDropdown = ({
                                        isOpen,
                                        onClose,
                                        onSelect,
                                        selectedId,
                                        filterType, // 'ADMIN' hoặc 'OWNER'
                                        bookingPropertyId, // ID khách sạn để lọc mã chủ sở hữu
                                        totalAmount = 0 // Nhận tổng tiền để tính toán Best Offer
                                    }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const isOwnerContext = filterType === 'OWNER';
    const accentColor = isOwnerContext ? 'text-purple-600' : 'text-blue-600';
    const headerTitle = isOwnerContext ? "Ưu đãi từ Khách sạn" : "Ưu đãi từ TravelMate";

    useEffect(() => {
        if (isOpen) {
            fetchAndFilterPromotions();
        }
    }, [isOpen, filterType, bookingPropertyId, totalAmount]);

    const fetchAndFilterPromotions = async () => {
        setLoading(true);
        try {
            let rawData = [];

            // 1. Gọi API: Ưu tiên API Suggestion nếu có totalAmount để lấy isBestOffer từ Backend
            if (totalAmount > 0) {
                try {
                    const response = await promotionService.getSuggestions(totalAmount);
                    rawData = Array.isArray(response) ? response : (response.data || []);
                } catch (e) {
                    console.warn("Fallback to getAllPromotions due to error:", e);
                    const response = await promotionService.getAllPromotions();
                    rawData = Array.isArray(response) ? response : (response.data || []);
                }
            } else {
                const response = await promotionService.getAllPromotions();
                rawData = Array.isArray(response) ? response : (response.data || []);
            }

            const now = new Date();

            // 2. Lọc sơ bộ: Phải Active và chưa hết hạn
            let activePromotions = rawData.filter(p =>
                p.status === "ACTIVE" && new Date(p.endDate) > now
            );

            // 3. Lọc theo ngữ cảnh (Admin/Owner)
            if (filterType === 'ADMIN') {
                activePromotions = activePromotions.filter(p => !p.property);
            } else if (filterType === 'OWNER') {
                if (bookingPropertyId) {
                    activePromotions = activePromotions.filter(p =>
                        p.property && Number(p.property.propertyId) === Number(bookingPropertyId)
                    );
                } else {
                    activePromotions = [];
                }
            }

            // 4. Fallback tính toán Best Offer ở Frontend (nếu backend chưa trả về isBestOffer)
            // Logic này đảm bảo nhãn luôn hiện kể cả khi API Suggestion chưa hoàn thiện
            const hasBackendFlag = activePromotions.some(p => p.isBestOffer !== undefined);

            if (!hasBackendFlag && totalAmount > 0) {
                let maxDiscount = 0;

                // Tính tiền giảm cho từng mã
                activePromotions = activePromotions.map(p => {
                    let discount = 0;
                    if (p.minBookingAmount && totalAmount < p.minBookingAmount) {
                        return { ...p, calculatedDiscountAmount: 0 };
                    }

                    if (p.discountType === 'PERCENTAGE') {
                        discount = (totalAmount * p.discountValue) / 100;
                        if (p.maxDiscountAmount && discount > p.maxDiscountAmount) {
                            discount = p.maxDiscountAmount;
                        }
                    } else {
                        discount = p.discountValue;
                        if (discount > totalAmount) discount = totalAmount;
                    }

                    if (discount > maxDiscount) maxDiscount = discount;
                    return { ...p, calculatedDiscountAmount: discount };
                });

                // Gán cờ isBestOffer
                if (maxDiscount > 0) {
                    activePromotions = activePromotions.map(p => ({
                        ...p,
                        isBestOffer: p.calculatedDiscountAmount === maxDiscount
                    }));
                }
            }

            // 5. Sắp xếp: Best Offer lên đầu
            activePromotions.sort((a, b) => {
                const isBestA = a.isBestOffer ? 1 : 0;
                const isBestB = b.isBestOffer ? 1 : 0;
                return isBestB - isBestA;
            });

            setPromotions(activePromotions);
        } catch (error) {
            console.error("PromotionSelectionDropdown: Lỗi tải dữ liệu", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute z-50 mt-2 left-0 right-0 max-h-96 w-full overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100 origin-top">

            {/* Header Sticky */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10 bg-gradient-to-r from-gray-50 to-white">
                <h4 className={`text-sm font-bold uppercase tracking-wide ${accentColor}`}>
                    {headerTitle}
                </h4>
            </div>

            {/* Nội dung danh sách (Scrollable) */}
            <div className="overflow-y-auto max-h-80 p-3 bg-gray-50/50">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-8 gap-2">
                        <Spinner size="md" color={isOwnerContext ? "border-purple-600" : "border-blue-600"} />
                        <span className="text-xs text-gray-400">Đang tìm ưu đãi tốt nhất...</span>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {/* Option Bỏ chọn */}
                        <NoPromotionOption
                            isSelected={!selectedId}
                            accentColor={accentColor}
                            onSelect={onSelect}
                        />

                        {/* Danh sách mã khuyến mãi */}
                        {promotions.length > 0 ? (
                            promotions.map((promo) => (
                                <PromotionListItem
                                    key={promo.promotionId}
                                    promo={promo}
                                    isSelected={selectedId === promo.promotionId}
                                    accentColor={accentColor}
                                    onSelect={onSelect}
                                />
                            ))
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <TicketPercent size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">Chưa có mã khuyến mãi phù hợp.</p>
                            </div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PromotionSelectionDropdown;