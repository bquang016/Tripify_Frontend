import React, { useState, useEffect } from 'react';
import {
    AlertCircle, CreditCard, User, Hash, Building2, X
} from 'lucide-react';
import Button from '@/components/common/Button/Button';

export default function RequestRefundModal({ isOpen, onClose, onConfirm, booking }) {
    // State form
    const [formData, setFormData] = useState({
        reason: '',
        bankName: '',
        accountNumber: '',
        accountHolder: ''
    });

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Reset form khi mở modal
    useEffect(() => {
        if (isOpen) {
            setFormData({ reason: '', bankName: '', accountNumber: '', accountHolder: '' });
            setError('');
            setSubmitting(false);
        }
    }, [isOpen]);
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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    // Hàm Validate riêng biệt
    const validateForm = () => {
        const { reason, bankName, accountNumber, accountHolder } = formData;

        // 1. Kiểm tra trống
        if (!reason.trim() || !bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
            return 'Vui lòng điền đầy đủ thông tin các trường bắt buộc.';
        }

        // 2. Lý do phải rõ ràng
        if (reason.trim().length < 10) {
            return 'Lý do hoàn tiền cần chi tiết hơn (tối thiểu 10 ký tự).';
        }

        // 3. Số tài khoản chỉ chứa số
        const accNumRegex = /^[0-9]{6,25}$/;
        if (!accNumRegex.test(accountNumber.trim())) {
            return 'Số tài khoản không hợp lệ (chỉ gồm số, từ 6-25 ký tự).';
        }

        // 4. Tên chủ tài khoản không chứa số (cho phép Tiếng Việt)
        // Regex này loại trừ số và các ký tự đặc biệt thông thường
        const nameRegex = /^[^\d!@#$%^&*()_+={}[\]|\\:;"'<>,.?/]+$/;
        if (!nameRegex.test(accountHolder.trim())) {
            return 'Tên chủ tài khoản không được chứa số hoặc ký tự đặc biệt.';
        }

        return null; // Không có lỗi
    };

    const handleSubmit = async () => {
        // Gọi validate
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);

        try {
            await onConfirm({
                reason: formData.reason.trim(),
                bankName: formData.bankName.trim(),
                accountNumber: formData.accountNumber.trim(),
                accountHolder: formData.accountHolder.toUpperCase().trim()
            });
            // Lưu ý: Không đóng modal ở đây, để component cha xử lý (hoặc đóng khi success)
        } catch (err) {
            setError("Có lỗi xảy ra, vui lòng thử lại.");
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // Format tiền
    const refundAmount = booking?.refundAmount
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.refundAmount)
        : '0 ₫';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all">

                {/* --- HEADER --- */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Yêu cầu hoàn tiền</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Đơn hàng: <span className="font-mono font-bold text-slate-700">BK-{booking?.bookingId}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        disabled={submitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar max-h-[70vh]">

                    {/* Info Box */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                        <div className="bg-white p-2 rounded-full text-orange-500 h-fit shadow-sm">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-orange-800 font-medium">Số tiền dự kiến hoàn lại</p>
                            <p className="text-2xl font-bold text-orange-600 mt-1">{refundAmount}</p>
                            <p className="text-xs text-orange-700/80 mt-1 leading-relaxed">
                                Vui lòng cung cấp chính xác thông tin tài khoản chính chủ.
                            </p>
                        </div>
                    </div>

                    {/* Form Input */}
                    <div className="space-y-4">

                        {/* Lý do */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Lý do hoàn tiền <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                name="reason"
                                rows="3"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm transition-all placeholder:text-slate-400"
                                placeholder="VD: Tôi bận việc đột xuất, chuyến bay bị hủy... (Ít nhất 10 ký tự)"
                                value={formData.reason}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="h-px bg-slate-100 my-2" />

                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard size={18} className="text-blue-500" /> Thông tin nhận tiền
                        </h4>

                        {/* Grid Ngân hàng & STK */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Ngân hàng</label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        name="bankName"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                                        placeholder="VD: MBBank"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Số tài khoản</label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm font-mono"
                                        placeholder="Chỉ nhập số"
                                        value={formData.accountNumber}
                                        onChange={(e) => {
                                            // Chỉ cho phép nhập số
                                            const val = e.target.value.replace(/\D/g, '');
                                            setFormData(prev => ({ ...prev, accountNumber: val }));
                                            if (error) setError('');
                                        }}
                                        maxLength={25}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chủ tài khoản */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Chủ tài khoản (Không dấu)</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    name="accountHolder"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm uppercase"
                                    placeholder="VD: NGUYEN VAN A"
                                    value={formData.accountHolder}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        setFormData(prev => ({ ...prev, accountHolder: val }));
                                        if (error) setError('');
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-rose-50 text-rose-600 text-xs font-medium p-3 rounded-lg border border-rose-100 text-center animate-pulse flex items-center justify-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={submitting}>
                        Hủy bỏ
                    </Button>
                    <Button
                        className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 px-6 border-none"
                        onClick={handleSubmit}
                        disabled={submitting}
                        isLoading={submitting}
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                </div>
            </div>
        </div>
    );
}