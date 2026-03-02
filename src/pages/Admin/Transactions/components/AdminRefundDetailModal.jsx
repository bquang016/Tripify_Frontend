// src/pages/Admin/Transactions/components/AdminRefundDetailModal.jsx
import React, { useEffect } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import {
  X, FileText, CreditCard, User, Calendar,
  CheckCircle, XCircle, AlertTriangle, Copy,
  Check, Ban, Clock
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const AdminRefundDetailModal = ({ isOpen, onClose, refund, onApprove, onReject }) => {
  const { t, i18n } = useTranslation();
  const { currency } = useLanguage();
  const isVi = i18n.language === 'vi';

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen || !refund) return null;

  const { refundInfo, bookingId, amount } = refund;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(t('finance.copied_msg', { text }));
  };

  const formatMoney = (val) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const formatDate = (date) => date ? new Date(date).toLocaleString(isVi ? 'vi-VN' : 'en-US') : "N/A";

  return (
    <ModalPortal>
      <div
        className="fixed -inset-[1px] z-[99999] bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  {t('finance.detail_title')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{t('finance.order_code')}: <span className="font-mono font-bold text-slate-700">BK-{bookingId}</span></p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {/* Cảnh báo trạng thái */}
              {refundInfo.status === 'PENDING' ? (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex gap-3">
                  <AlertTriangle className="text-orange-600 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-orange-800">{t('finance.pending_warning')}</p>
                    <p className="text-xs text-orange-600 mt-1">{t('finance.pending_desc')}</p>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-lg flex gap-3 border ${refundInfo.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                  {refundInfo.status === 'APPROVED' ? <CheckCircle className="text-emerald-600" /> : <XCircle className="text-rose-600" />}
                  <div>
                    <p className={`text-sm font-bold ${refundInfo.status === 'APPROVED' ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {refundInfo.status === 'APPROVED' ? t('finance.refund_success') : t('finance.refund_rejected')}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {t('finance.processed_at')}: {formatDate(refundInfo.resolveDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid Thông tin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">{t('finance.request_info')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-500">{t('finance.original_amount')}</p>
                      <p className="text-base font-semibold text-slate-700">{formatMoney(amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('finance.refund_to_be_paid')}</p>
                      <p className="text-xl font-bold text-blue-600">{formatMoney(refundInfo.amount)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('finance.cancel_reason')}</p>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 italic">"{refundInfo.reason}"</div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('finance.table_request_date')}</p>
                    <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar size={14} /> {formatDate(refundInfo.requestDate)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">{t('finance.receiving_account')}</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-blue-600"><CreditCard size={20} /></div>
                      <div className="flex-1"><p className="text-xs text-slate-500">{t('finance.bank_name')}</p><p className="font-bold text-slate-800">{refundInfo.bankName || "N/A"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-purple-600"><User size={20} /></div>
                      <div className="flex-1"><p className="text-xs text-slate-500">{t('finance.account_holder')}</p><p className="font-bold text-slate-800 uppercase">{refundInfo.accountHolder || "---"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-emerald-600"><FileText size={20} /></div>
                      <div className="flex-1 group cursor-pointer" onClick={() => handleCopy(refundInfo.accountNumber)}>
                        <p className="text-xs text-slate-500">{t('finance.account_number')}</p>
                        <p className="font-mono font-bold text-lg text-slate-800 flex items-center gap-2">
                          {refundInfo.accountNumber || "---"}
                          {refundInfo.accountNumber && <Copy size={14} className="text-slate-400 group-hover:text-blue-500" />}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {refundInfo.adminNote && (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-1">{t('finance.admin_note')}</p>
                  <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">{refundInfo.adminNote}</div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {refundInfo.status === 'PENDING' && (
              <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                <Button className="bg-red-600 hover:bg-red-700 text-white shadow-red-100 flex items-center gap-2 !border-none" onClick={() => { onClose?.(); onReject?.(); }}><Ban size={18} /> {t('finance.reject_refund')}</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 flex items-center gap-2 !border-none" onClick={() => { onClose?.(); onApprove?.(); }}><Check size={18} /> {t('finance.confirm_refund')}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AdminRefundDetailModal;
