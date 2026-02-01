import React from 'react';
import { 
    X, Calendar, CreditCard, User, Phone, Mail, Building, 
    Info, RefreshCw, FileText, AlertTriangle, Landmark, Hash, Calculator 
} from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';

export default function AdminTransactionDetailModal({ isOpen, onClose, transaction, onOpenRefund }) {
    if (!transaction) return null;

    const {
        paymentId, bookingId, userName, userEmail, userPhone,
        propertyName, amount, refundedAmount,
        paymentStatus, paymentDate, paymentMethod, note,
        refundRequest 
    } = transaction;

    // --- LOGIC ---
    const originalAmount = amount || 0;
    const actualRefund = refundedAmount || 0;
    const penaltyAmount = originalAmount - actualRefund;
    const penaltyPercent = originalAmount > 0 ? Math.round((penaltyAmount / originalAmount) * 100) : 0;
    const hasRefund = actualRefund > 0;

    const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val) + '₫';
    const formatDate = (str) => str ? new Date(str).toLocaleString('vi-VN') : 'N/A';

    // Render Badge: Đồng bộ màu Brand cho trạng thái Refunded
    const renderStatus = (status) => {
        switch (status) {
            case 'APPROVED': return <Badge className="bg-green-50 text-green-700 border-green-200">Thành công</Badge>;
            case 'REFUND_REQUESTED': return <Badge className="bg-red-50 text-red-700 border-red-200 animate-pulse">Yêu cầu hoàn tiền</Badge>;
            case 'REFUNDED': 
                return <Badge className="bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] border-[rgb(40,169,224)]/20">Đã hoàn tiền</Badge>;
            default: return <Badge className="bg-gray-100 text-gray-600">{status}</Badge>;
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={`Chi tiết giao dịch #${paymentId}`}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-5">
                
                {/* 1. HEADER STATUS */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border shadow-sm ${hasRefund ? 'bg-[rgb(40,169,224)]/10 border-[rgb(40,169,224)]/20 text-[rgb(40,169,224)]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Trạng thái</p>
                            <div className="mt-0.5">{renderStatus(paymentStatus)}</div>
                        </div>
                    </div>
                    
                    {!hasRefund && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase">Tổng thanh toán</p>
                            <p className="text-xl font-bold text-gray-800">{formatMoney(originalAmount)}</p>
                        </div>
                    )}
                </div>

                {/* 2. KHỐI TÀI CHÍNH (Sử dụng màu Brand) */}
                {hasRefund && (
                    <div className="bg-[rgb(40,169,224)]/5 rounded-xl p-4 border border-[rgb(40,169,224)]/20 flex flex-col items-center justify-center text-center">
                        <p className="text-xs font-bold text-[rgb(40,169,224)] uppercase tracking-widest mb-1">
                            Số tiền hoàn lại thực tế
                        </p>
                        <p className="text-2xl font-bold text-[rgb(40,169,224)] mb-2">
                            {formatMoney(actualRefund)}
                        </p>

                        <div className="flex items-center justify-center gap-3 text-xs">
                            {penaltyAmount > 0 ? (
                                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md shadow-sm border border-[rgb(40,169,224)]/20">
                                    <span className="text-red-500 font-semibold flex items-center gap-1">
                                        -{penaltyPercent}% Phí ({formatMoney(penaltyAmount)})
                                    </span>
                                    <div className="h-3 w-px bg-gray-300"></div>
                                    <span className="text-gray-500">
                                        Gốc: {formatMoney(originalAmount)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[rgb(40,169,224)] font-bold bg-white px-2 py-1 rounded-md shadow-sm border border-[rgb(40,169,224)]/20">
                                    Hoàn tiền 100%
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. THÔNG TIN CHI TIẾT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột Trái */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 border-b pb-1.5">
                            <Info size={14}/> Thông tin chung
                        </h4>
                        <div className="space-y-2 text-sm pl-1">
                            <div className="flex justify-between"><span className="text-gray-500">Thời gian:</span> <span className="font-medium text-gray-800">{formatDate(paymentDate)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Phương thức:</span> <span className="font-medium text-gray-800">{paymentMethod || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Mã đặt phòng:</span> <span className="font-mono font-bold text-gray-800 bg-gray-100 px-1.5 rounded">BK-{bookingId}</span></div>
                        </div>
                    </div>

                    {/* Cột Phải */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 border-b pb-1.5">
                            <User size={14}/> Đối tượng
                        </h4>
                        <div className="space-y-2 text-sm pl-1">
                            <div className="flex items-start gap-2">
                                <User size={14} className="text-gray-400 mt-0.5"/>
                                <div>
                                    <p className="font-medium text-gray-800">{userName || "Khách vãng lai"}</p>
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

                {/* 4. YÊU CẦU HOÀN TIỀN */}
                {refundRequest && (
                    <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-sm mt-2">
                        <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center gap-2 text-red-700 font-bold text-xs uppercase">
                            <AlertTriangle size={14} /> Yêu cầu hoàn tiền
                        </div>
                        <div className="p-3 text-sm space-y-2">
                            <div className="flex gap-2">
                                <span className="text-gray-500 whitespace-nowrap">Lý do:</span>
                                <span className="text-gray-800 italic">"{refundRequest.reason}"</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                <div><span className="text-gray-500 block">Ngân hàng</span><span className="font-bold text-gray-900">{refundRequest.bankName}</span></div>
                                <div><span className="text-gray-500 block">Số tài khoản</span><span className="font-bold text-gray-900 font-mono">{refundRequest.accountNumber}</span></div>
                                <div><span className="text-gray-500 block">Chủ tài khoản</span><span className="font-bold text-gray-900 uppercase">{refundRequest.accountHolder}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button variant="outline" size="sm" onClick={onClose}>Đóng</Button>
                    
                    {paymentStatus === 'REFUND_REQUESTED' && (
                        <Button 
                            size="sm"
                            className="bg-[rgb(40,169,224)] hover:bg-blue-500 text-white shadow-sm border-none"
                            onClick={() => { onClose(); onOpenRefund(transaction); }}
                        >
                            <RefreshCw size={14} className="mr-1.5"/> Xử lý Hoàn tiền
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}