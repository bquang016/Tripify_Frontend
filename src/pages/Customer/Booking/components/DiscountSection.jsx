// src/pages/Customer/Booking/components/DiscountSection.jsx

import React, { useState, useRef, useEffect } from 'react';
import Card from '@/components/common/Card/Card';
import { Tag, TicketPercent, X, ShieldCheck, Store, ChevronDown, Calculator, ArrowRight, Coins } from 'lucide-react';
import PromotionSelectionDropdown from './PromotionSelectionModal';

// Đường dẫn Public Path
const TRAVEL_MATE_LOGO_PUBLIC_PATH = "/assets/logo_promption/1.jpg";

// Helper format tiền
const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val);

// ====================================================================
// COMPONENT: NÚT GỠ BỎ
// ====================================================================
const PromoSlotRemoveButton = ({ onRemove }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors shrink-0"
        title="Gỡ bỏ"
    >
        <X size={16} />
    </button>
);

// ====================================================================
// COMPONENT: HIỂN THỊ SLOT MÃ
// ====================================================================
const PromoSlotDisplay = ({ promo, icon: Icon, colorClass, emptyText, onClick, isDropdownOpen, isAdminPromo }) => {
    const ICON_SIZE_CLASS = "w-12 h-12";

    if (promo) {
        return (
            <div className={`border bg-opacity-5 rounded-xl p-3 flex items-center justify-between ${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} bg-white shadow-sm`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`${ICON_SIZE_CLASS} rounded-full ${colorClass} bg-opacity-20 flex items-center justify-center shrink-0`}>
                        {isAdminPromo ? <ShieldCheck size={24} className={colorClass.replace('bg-', 'text-')} /> : <Store size={24} className={colorClass.replace('bg-', 'text-')} />}
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')}`}>{promo.code}</p>
                        <p className="text-xs text-gray-500 truncate">{promo.description || "Đã áp dụng mã ưu đãi"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${isDropdownOpen ? `${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} ring-1 ring-offset-0` : 'border-gray-300 hover:bg-gray-50'}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`${ICON_SIZE_CLASS} rounded-full ${colorClass} bg-opacity-10 flex items-center justify-center shrink-0`}>
                    <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-600">{emptyText}</p>
                    <p className="text-xs text-gray-400">Bấm để chọn mã giảm giá</p>
                </div>
            </div>
            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-gray-600' : ''}`} />
        </div>
    );
};

// ====================================================================
// COMPONENT: CONTAINER (Wrapper)
// ====================================================================
const PromoSlotContainer = ({
                                title, icon, colorClass, emptyText, promo, onSelect, onRemove,
                                filterType, bookingPropertyId, totalAmount
                            }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="mb-5 last:mb-0" ref={dropdownRef}>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider pl-1">{title}</p>
            <div className="relative">
                <PromoSlotDisplay
                    promo={promo} icon={icon} colorClass={colorClass} emptyText={emptyText}
                    isDropdownOpen={isOpen} isAdminPromo={filterType === 'ADMIN'}
                    onClick={() => { if (!promo) setIsOpen(!isOpen); }}
                />
                {promo && <div className="absolute top-1/2 right-3 -translate-y-1/2"><PromoSlotRemoveButton onRemove={onRemove} /></div>}
                {!promo && <PromotionSelectionDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} onSelect={(p) => { onSelect(p); setIsOpen(false); }} filterType={filterType} bookingPropertyId={bookingPropertyId} totalAmount={totalAmount} />}
            </div>
        </div>
    );
};

// ====================================================================
// MAIN COMPONENT: DiscountSection
// ====================================================================
const DiscountSection = ({
                             onApplyAdmin, onApplyOwner, bookingPropertyId,
                             selectedAdminCode, selectedOwnerCode,
                             adminDiscount, ownerDiscount,
                             totalAmount = 0,
                             promoOrder = []
                         }) => {

    const adminPromoDisplay = selectedAdminCode ? { code: selectedAdminCode, description: `Giảm ${formatMoney(adminDiscount)}₫` } : null;
    const ownerPromoDisplay = selectedOwnerCode ? { code: selectedOwnerCode, description: `Giảm ${formatMoney(ownerDiscount)}₫` } : null;

    // --- LOGIC TÍNH TOÁN STEP-BY-STEP (Đã cập nhật) ---
    const renderStepByStepCalculation = () => {
        if (totalAmount <= 0) return null;

        if (promoOrder.length === 0) {
            return (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Giá gốc đơn hàng</span>
                        <span className="font-bold text-gray-800">{formatMoney(totalAmount)}₫</span>
                    </div>
                </div>
            );
        }

        let currentPrice = totalAmount;
        const steps = [];

        // 1. Dòng giá gốc
        steps.push(
            <div key="base" className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>Giá gốc:</span>
                <span className="line-through">{formatMoney(totalAmount)}₫</span>
            </div>
        );

        // 2. Lặp qua các mã đã áp dụng
        promoOrder.forEach((type, index) => {
            let discountAmount = 0;
            let label = "";
            let color = "";

            if (type === 'ADMIN' && adminDiscount > 0) {
                discountAmount = adminDiscount;
                label = `Mã Tripify (${selectedAdminCode})`;
                color = "text-blue-600";
            } else if (type === 'OWNER' && ownerDiscount > 0) {
                discountAmount = ownerDiscount;
                label = `Mã Khách Sạn (${selectedOwnerCode})`;
                color = "text-purple-600";
            }

            if (discountAmount > 0) {
                // Dòng hiển thị số tiền được giảm
                steps.push(
                    <div key={`${type}-disc`} className={`flex justify-between items-center text-sm ${color} font-medium mt-2`}>
                        <span className="flex items-center gap-1"><TicketPercent size={14}/> {label}</span>
                        <span>-{formatMoney(discountAmount)}₫</span>
                    </div>
                );

                // Cập nhật giá hiện tại
                currentPrice -= discountAmount;
                if (currentPrice < 0) currentPrice = 0;

                // ✅ LUÔN HIỂN THỊ DÒNG "CÒN LẠI" SAU MỖI LẦN TRỪ (Sửa đổi ở đây)
                steps.push(
                    <div key={`${type}-sub`} className="flex justify-between items-center text-sm font-semibold text-gray-600 border-b border-dashed border-gray-200 py-2 mb-1 bg-gray-50/50 px-2 rounded">
                        <span className="flex items-center gap-1 text-xs uppercase tracking-wide">
                            <ArrowRight size={12}/> Còn lại:
                        </span>
                        <span>{formatMoney(currentPrice)}₫</span>
                    </div>
                );
            }
        });

        return (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Chi tiết thanh toán</h4>
                <div className="space-y-1">
                    {steps}
                </div>

                {/* Dòng Tổng Kết Cuối Cùng */}
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                        <Calculator size={18} className="text-blue-600"/>
                        Cần thanh toán:
                    </span>
                    <span className="text-2xl font-extrabold text-blue-600">
                        {formatMoney(currentPrice)}₫
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Card className="p-5 border border-gray-200 shadow-sm rounded-xl bg-white">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-blue-100 p-1.5 rounded-md"><Tag size={18} className="text-blue-600" /></div>
                <h3 className="font-bold text-lg text-gray-800">Mã ưu đãi & Khuyến mãi</h3>
            </div>

            <PromoSlotContainer
                title="Tripify Voucher" icon={ShieldCheck} colorClass="text-blue-600 bg-blue-600" emptyText="Chọn mã ưu đãi từ hệ thống"
                promo={adminPromoDisplay} onSelect={onApplyAdmin} onRemove={() => onApplyAdmin(null)}
                filterType={'ADMIN'} logoUrl={TRAVEL_MATE_LOGO_PUBLIC_PATH} totalAmount={totalAmount}
            />

            <div className="my-4 border-t border-dashed border-gray-200" />

            <PromoSlotContainer
                title="Voucher Khách Sạn" icon={Store} colorClass="text-purple-600 bg-purple-600" emptyText="Chọn mã ưu đãi của khách sạn"
                promo={ownerPromoDisplay} onSelect={onApplyOwner} onRemove={() => onApplyOwner(null)}
                filterType={'OWNER'} bookingPropertyId={bookingPropertyId} totalAmount={totalAmount}
            />

            {/* Gọi hàm render chi tiết */}
            {renderStepByStepCalculation()}
        </Card>
    );
};

export default DiscountSection;