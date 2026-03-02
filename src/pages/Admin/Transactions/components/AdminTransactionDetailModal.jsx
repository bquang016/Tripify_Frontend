import React from 'react';
import { 
    X, Calendar, CreditCard, User, Phone, Building, 
    Info, RefreshCw, FileText, AlertTriangle, Landmark, Hash, Calculator 
} from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminTransactionDetailModal({ isOpen, onClose, transaction, onOpenRefund }) {
    const { t, i18n } = useTranslation();
    const { currency } = useLanguage();
    const isVi = i18n.language === 'vi';

    if (!transaction) return null;

    const {
        paymentId, bookingId, userName, userEmail, userPhone,
        propertyName, amount, refundedAmount,
        paymentStatus, paymentDate, paymentMethod, note,
        refundRequest 
    } = transaction;

    const originalAmount = amount || 0;
    const actualRefund = refundedAmount || 0;
    const penaltyAmount = originalAmount - actualRefund;
    const penaltyPercent = originalAmount > 0 ? Math.round((penaltyAmount / originalAmount) * 100) : 0;
    const hasRefund = actualRefund > 0;

    const formatMoney = (val) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
    };

    const formatDate = (str) => str ? new Date(str).toLocaleString(isVi ? 'vi-VN' : 'en-US') : 'N/A';

    const renderStatus = (status) => {
        switch (status) {
            case 'APPROVED': 
                return <Badge className="bg-green-50 text-green-700 border-green-200">{t('finance.status_success', 'Success')}</Badge>;
            case 'REFUND_REQUESTED': 
                return <Badge className="bg-red-50 text-red-700 border-red-200 animate-pulse">{t('finance.status_refund_req', 'Refund Requested')}</Badge>;
            case 'REFUNDED': 
                return <Badge className="bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] border-[rgb(40,169,224)]/20">{t('finance.status_refunded', 'Refunded')}</Badge>;
            default: return <Badge className="bg-gray-100 text-gray-600">{status}</Badge>;
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={`${t('finance.tx_detail_title')} #${paymentId}`}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border shadow-sm ${hasRefund ? 'bg-[rgb(40,169,224)]/10 border-[rgb(40,169,224)]/20 text-[rgb(40,169,224)]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{t('owner.status')}</p>
                            <div className="mt-0.5">{renderStatus(paymentStatus)}</div>
                        </div>
                    </div>
                    
                    {!hasRefund && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t('finance.total_payment')}</p>
                            <p className="text-xl font-bold text-gray-800">{formatMoney(originalAmount)}</p>
                        </div>
                    )}
                </div>

                {hasRefund && (
                    <div className="bg-[rgb(40,169,224)]/5 rounded-xl p-4 border border-[rgb(40,169,224)]/20 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-bold text-[rgb(40,169,224)] uppercase tracking-widest mb-1">
                            {t('finance.actual_refund_amount')}
                        </p>
                        <p className="text-2xl font-bold text-[rgb(40,169,224)] mb-2">
                            {formatMoney(actualRefund)}
                        </p>

                        <div className="flex items-center justify-center gap-3 text-xs">
                            {penaltyAmount > 0 ? (
                                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md shadow-sm border border-[rgb(40,169,224)]/20">
                                    <span className="text-red-500 font-semibold flex items-center gap-1">
                                        {t('finance.penalty_fee', { percent: penaltyPercent })} ({formatMoney(penaltyAmount)})
                                    </span>
                                    <div className="h-3 w-px bg-gray-300"></div>
                                    <span className="text-gray-500">
                                        {t('finance.original')}: {formatMoney(originalAmount)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[rgb(40,169,224)] font-bold bg-white px-2 py-1 rounded-md shadow-sm border border-[rgb(40,169,224)]/20">
                                    {t('finance.refund_100')}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 border-b pb-1.5">
                            <Info size={14}/> {t('finance.general_info')}
                        </h4>
                        <div className="space-y-2 text-sm pl-1">
                            <div className="flex justify-between"><span className="text-gray-500">{t('finance.table_time')}:</span> <span className="font-medium text-gray-800">{formatDate(paymentDate)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">{t('finance.table_method')}:</span> <span className="font-medium text-gray-800">{paymentMethod || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">{t('finance.booking_code')}:</span> <span className="font-mono font-bold text-gray-800 bg-gray-100 px-1.5 rounded">BK-{bookingId}</span></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 border-b pb-1.5">
                            <User size={14}/> {t('finance.target')}
                        </h4>
                        <div className="space-y-2 text-sm pl-1">
                            <div className="flex items-start gap-2">
                                <User size={14} className="text-gray-400 mt-0.5"/>
                                <div>
                                    <p className="font-medium text-gray-800">{userName || t('finance.guest_walk_in')}</p>
                                    <p className="text-xs text-gray-500">{userEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Building size={14} className="text-gray-400 mt-0.5"/>
                                <p className="font-medium text-gray-800">{propertyName}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {refundRequest && (
                    <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-sm mt-2">
                        <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center gap-2 text-red-700 font-bold text-xs uppercase">
                            <AlertTriangle size={14} /> {t('finance.refund_request_label')}
                        </div>
                        <div className="p-3 text-sm space-y-2">
                            <div className="flex gap-2">
                                <span className="text-gray-500 whitespace-nowrap">{t('finance.cancel_reason')}:</span>
                                <span className="text-gray-800 italic">"{refundRequest.reason}"</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                <div><span className="text-gray-500 block">{t('finance.bank_name')}</span><span className="font-bold text-gray-900">{refundRequest.bankName}</span></div>
                                <div><span className="text-gray-500 block">{t('finance.account_number')}</span><span className="font-bold text-gray-900 font-mono">{refundRequest.accountNumber}</span></div>
                                <div><span className="text-gray-500 block">{t('finance.account_holder')}</span><span className="font-bold text-gray-900 uppercase">{refundRequest.accountHolder}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button variant="outline" size="sm" onClick={onClose}>{t('finance.close')}</Button>
                    
                    {paymentStatus === 'REFUND_REQUESTED' && (
                        <Button 
                            size="sm"
                            className="bg-[rgb(40,169,224)] hover:bg-blue-500 text-white shadow-sm border-none"
                            onClick={() => { onClose(); onOpenRefund(transaction); }}
                        >
                            <RefreshCw size={14} className="mr-1.5"/> {t('finance.process_refund')}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
