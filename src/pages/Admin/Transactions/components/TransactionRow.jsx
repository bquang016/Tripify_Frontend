// src/pages/Admin/Transactions/components/TransactionRow.jsx
import React from 'react';
import { 
    User, Building, Calendar, Mail, Phone, ArrowRight, 
    CheckCircle2, AlertTriangle, CornerUpLeft, XCircle, Ban, Clock 
} from 'lucide-react';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

// --- 1. ĐỊNH NGHĨA BADGE TRỰC TIẾP TẠI ĐÂY ---
const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    
    switch (status) {
        case 'APPROVED': 
            return (
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} strokeWidth={2.5} /> 
                    <span className="font-bold text-xs">{t('finance.status_success', 'Success')}</span>
                </Badge>
            );
        case 'REFUND_REQUESTED': 
            return (
                <Badge className="bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <AlertTriangle size={14} strokeWidth={2.5} /> 
                    <span className="font-bold text-xs">{t('finance.status_refund_req', 'Refund Requested')}</span>
                </Badge>
            );
        case 'REFUNDED': 
            return (
                <Badge className="bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <CornerUpLeft size={14} strokeWidth={2.5} /> 
                    <span className="font-bold text-xs">{t('finance.status_refunded', 'Refunded')}</span>
                </Badge>
            );
        case 'FAILED': 
            return (
                <Badge className="bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <XCircle size={14} strokeWidth={2.5} /> 
                    <span className="font-bold text-xs">{t('finance.status_failed', 'Failed')}</span>
                </Badge>
            );
        case 'REJECTED':
            return (
                <Badge className="bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <Ban size={14} strokeWidth={2.5} /> 
                    <span className="font-bold text-xs">{t('finance.filter_rejected', 'Rejected')}</span>
                </Badge>
            );
        default: 
            return (
                <Badge className="bg-gray-100 text-gray-500 border border-gray-200 flex items-center gap-1.5 px-3 py-1 rounded-full">
                    <Clock size={14} strokeWidth={2} />
                    <span className="font-medium text-xs">{status || t('finance.filter_pending', 'Pending')}</span>
                </Badge>
            );
    }
};

// --- 2. COMPONENT ROW CHÍNH ---
const TransactionRow = ({ transaction, onViewDetail }) => {
    const { t, i18n } = useTranslation();
    const { currency } = useLanguage();
    const isVi = i18n.language === 'vi';

    const {
        paymentId, bookingId, userName, userEmail, userPhone,
        propertyName, amount, refundedAmount,
        paymentStatus, paymentDate
    } = transaction || {};

    const formatMoney = (val) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((val || 0) / 25000);
        }
        return new Intl.NumberFormat('vi-VN').format(val || 0) + '₫';
    };
    
    const formatDate = (str) => {
        if (!str) return 'N/A';
        return new Date(str).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <div className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-4">
            
            {/* Cột 1: ID & Ngày */}
            <div className="w-full md:w-[15%] shrink-0 flex md:flex-col justify-between md:justify-center gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">#{paymentId}</span>
                    <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                        BK-{bookingId}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={12} /> {formatDate(paymentDate)}
                </div>
            </div>

            {/* Cột 2: Thông tin Khách hàng */}
            <div className="w-full md:w-[25%] pl-0 md:pl-4 md:border-l border-gray-100">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                        <User size={16} />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate" title={userName}>
                            {userName || t('finance.guest_walk_in')}
                        </p>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-gray-500 truncate" title={userEmail}>
                                <Mail size={10}/> {userEmail || "No Email"}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Phone size={10}/> {userPhone || "No Phone"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cột 3: Thông tin Khách sạn */}
            <div className="w-full md:w-[20%] pl-0 md:pl-4 md:border-l border-gray-100">
                <div className="flex items-center gap-2">
                    <Building size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate" title={propertyName}>
                        {propertyName || "Unknown Hotel"}
                    </span>
                </div>
            </div>

            {/* Cột 4: Số tiền & Trạng thái */}
            <div className="w-full md:w-[25%] flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end pl-0 md:pl-4 md:border-l border-gray-100">
                <div className="text-right">
                    <span className="block text-lg font-bold text-blue-600">{formatMoney(amount)}</span>
                    {refundedAmount > 0 && (
                        <span className="block text-xs text-purple-600 font-medium bg-purple-50 px-1.5 py-0.5 rounded mt-0.5">
                            - {formatMoney(refundedAmount)} ({t('finance.status_refunded')})
                        </span>
                    )}
                </div>
                <div className="mt-0 md:mt-1">
                    <StatusBadge status={paymentStatus} />
                </div>
            </div>

            {/* Cột 5: Nút Hành động */}
            <div className="w-full md:w-[15%] flex justify-end pl-0 md:pl-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full md:w-auto border-gray-200 transition-colors ${
                        paymentStatus === 'REFUND_REQUESTED' 
                            ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:border-orange-300' 
                            : 'hover:border-blue-400 hover:text-blue-600'
                    }`}
                    onClick={() => onViewDetail(transaction)}
                >
                    {paymentStatus === 'REFUND_REQUESTED' ? (
                        <span className="flex items-center font-bold">
                            <AlertTriangle size={14} className="mr-1.5" /> {t('finance.process', 'Process')}
                        </span>
                    ) : (
                        <span className="flex items-center">
                            {t('hotels.details', 'Details')} <ArrowRight size={14} className="ml-1" />
                        </span>
                    )}
                </Button>
            </div>

        </div>
    );
};

export default TransactionRow;
