import React, { useState, useEffect, useRef } from 'react';
import { 
    AlertCircle, X, RefreshCcw, Info, ShieldCheck, 
    ChevronDown, Search, CheckCircle2, Hash, User, 
    Loader2, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button/Button';

export default function RequestRefundModal({ isOpen, onClose, onConfirm, booking }) {
    // ==========================================
    // LOGIC XÁC ĐỊNH LOẠI HOÀN TIỀN
    // ==========================================
    const isAutoRefund = booking?.paymentMethod === 'STRIPE_CARD' || booking?.paymentMethod?.startsWith('pm_');
    const isManualRefund = !isAutoRefund;

    const [formData, setFormData] = useState({
        reason: '',
        bankBin: '',
        bankName: '',
        bankLogo: '',
        accountNumber: '',
        accountHolder: ''
    });
    
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // --- STATE NGÂN HÀNG ---
    const [banks, setBanks] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchBank, setSearchBank] = useState("");
    const dropdownRef = useRef(null);

    // --- STATE VERIFY (NAPAS) ---
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifyError, setVerifyError] = useState("");

    // Reset trạng thái verify khi người dùng đổi ngân hàng hoặc số tài khoản
    useEffect(() => {
        if (isVerified) {
            setIsVerified(false);
            setFormData(prev => ({ ...prev, accountHolder: "" }));
        }
        setVerifyError("");
    }, [formData.bankBin, formData.accountNumber]);

    // Click outside để đóng dropdown ngân hàng
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load Banks API VietQR
    useEffect(() => {
        if (isOpen && isManualRefund && banks.length === 0) {
            const fetchBanks = async () => {
                try {
                    const res = await fetch("https://api.vietqr.io/v2/banks");
                    const data = await res.json();
                    if (data.code === "00") {
                        setBanks(data.data);
                        setFilteredBanks(data.data);
                    }
                } catch (error) {
                    console.error("Lỗi khi tải ngân hàng:", error);
                }
            };
            fetchBanks();
        }
    }, [isOpen, isManualRefund, banks.length]);

    // Tìm kiếm ngân hàng
    useEffect(() => {
        if (!searchBank.trim()) {
            setFilteredBanks(banks);
        } else {
            const lowerSearch = searchBank.toLowerCase();
            const filtered = banks.filter(
                (b) =>
                b.shortName?.toLowerCase().includes(lowerSearch) ||
                b.name?.toLowerCase().includes(lowerSearch) ||
                b.code?.toLowerCase().includes(lowerSearch)
            );
            setFilteredBanks(filtered);
        }
    }, [searchBank, banks]);

    // Reset form khi mở Modal
    useEffect(() => {
        if (isOpen) {
            setFormData({ reason: '', bankBin: '', bankName: '', bankLogo: '', accountNumber: '', accountHolder: '' });
            setError('');
            setVerifyError('');
            setIsVerified(false);
            setSubmitting(false);
        }
    }, [isOpen]);

    // Khóa cuộn trang nền
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

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleSelectBank = (bank) => {
        setFormData(prev => ({ 
            ...prev, 
            bankBin: bank.bin, 
            bankName: bank.shortName, 
            bankLogo: bank.logo 
        }));
        setIsDropdownOpen(false);
        setSearchBank("");
    };

    const handleAccountNumberChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, ""); // Chỉ cho phép số
        setFormData(prev => ({ ...prev, accountNumber: val }));
    };

    const handleAccountNameChange = (e) => {
        let val = e.target.value;
        val = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // Không dấu, in hoa
        val = val.replace(/[^A-Z\s]/g, ""); // Chỉ chữ và khoảng trắng
        setFormData(prev => ({ ...prev, accountHolder: val }));
    };

    const handleChangeReason = (e) => {
        setFormData(prev => ({ ...prev, reason: e.target.value }));
        if (error) setError('');
    };

    // Hàm Dò Tài Khoản (Mockup)
    const verifyBankAccount = async () => {
        if (!formData.bankBin || !formData.accountNumber || formData.accountNumber.length < 5) {
            setVerifyError("Vui lòng nhập số tài khoản hợp lệ.");
            return;
        }

        setIsVerifying(true);
        setVerifyError("");

        try {
            // Giả lập call API Napas mất 1.5s
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Giả lập tìm thấy tài khoản (Bạn có thể điền mặc định tên khách hàng từ currentUser nếu muốn)
            setFormData(prev => ({ ...prev, accountHolder: booking?.customerName ? booking.customerName.toUpperCase() : "BUI DANG QUANG" }));
            setIsVerified(true);
        } catch (error) {
            setVerifyError("Hệ thống tra cứu đang bận, vui lòng nhập tay tên tài khoản.");
        } finally {
            setIsVerifying(false);
        }
    };

    const validateForm = () => {
        if (!formData.reason.trim() || formData.reason.trim().length < 10) {
            return 'Lý do hoàn tiền cần chi tiết hơn (tối thiểu 10 ký tự).';
        }
        if (isManualRefund) {
            if (!formData.bankBin) return 'Vui lòng chọn Ngân hàng thụ hưởng.';
            if (!formData.accountNumber.trim()) return 'Vui lòng nhập Số tài khoản.';
            if (!formData.accountHolder.trim()) return 'Vui lòng nhập Tên chủ tài khoản.';
        }
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        try {
            await onConfirm({
                reason: formData.reason.trim(),
                bankName: isManualRefund ? formData.bankName : 'AUTO_REFUND',
                accountNumber: isManualRefund ? formData.accountNumber.trim() : 'AUTO_REFUND',
                accountHolder: isManualRefund ? formData.accountHolder : 'AUTO_REFUND'
            });
        } catch (err) {
            setError("Có lỗi xảy ra, vui lòng thử lại.");
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const refundAmount = booking?.refundAmount
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.refundAmount)
        : '0 ₫';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
            {/* Tăng max-w-4xl để đủ chỗ cho giao diện 2 cột */}
            <div className={`bg-white w-full ${isManualRefund ? 'max-w-4xl' : 'max-w-md'} rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all`}>
                
                {/* --- HEADER --- */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Yêu cầu hoàn tiền</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Đơn hàng: <span className="font-mono font-bold text-[#28A9E0]">BK-{booking?.bookingId}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors" disabled={submitting}>
                        <X size={24} />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className="p-6 overflow-y-auto custom-scrollbar max-h-[75vh] bg-[#F8FAFC]">
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 shadow-sm mb-6">
                        <div className="bg-orange-50 p-3 rounded-xl text-orange-500 h-fit border border-orange-100">
                            <RefreshCcw size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Số tiền dự kiến hoàn lại</p>
                            <p className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">{refundAmount}</p>
                        </div>
                    </div>

                    {!isManualRefund ? (
                        // =====================================
                        // GIAO DIỆN HOÀN TIỀN TỰ ĐỘNG (STRIPE)
                        // =====================================
                        <div className="space-y-6">
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
                                <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-1">Phương thức hoàn tiền</h4>
                                    <p className="text-sm text-blue-800/80 leading-relaxed">
                                        Số tiền sẽ được <strong>hoàn trả tự động</strong> về thẻ quốc tế mà bạn đã sử dụng. Quá trình này mất khoảng 3-5 ngày làm việc.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Lý do hoàn tiền <span className="text-rose-500">*</span></label>
                                <textarea name="reason" rows="4" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#28A9E0]/20 focus:border-[#28A9E0] outline-none text-sm resize-none bg-white shadow-sm" placeholder="Vui lòng chia sẻ lý do..." value={formData.reason} onChange={handleChangeReason} />
                            </div>
                        </div>
                    ) : (
                        // =====================================
                        // GIAO DIỆN CHUYỂN KHOẢN (VNPAY, MOMO)
                        // =====================================
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            
                            {/* CỘT TRÁI: FORM ĐIỀN */}
                            <div className="lg:col-span-7 space-y-5">
                                <div className="flex items-center justify-between pb-1">
                                    <h4 className="text-base font-bold text-slate-800">Tài khoản nhận tiền hoàn</h4>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                        <ShieldCheck size={14}/> <span>Napas Verified</span>
                                    </div>
                                </div>

                                {/* Ngân hàng */}
                                <div className="space-y-2 relative" ref={dropdownRef}>
                                    <label className="block text-sm font-semibold text-slate-700">Ngân hàng thụ hưởng <span className="text-rose-500">*</span></label>
                                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between rounded-xl py-3 pl-4 pr-4 bg-white border border-slate-200 hover:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 text-slate-700 font-medium transition-all shadow-sm cursor-pointer">
                                        {formData.bankBin ? (
                                            <div className="flex items-center gap-3">
                                                <img src={formData.bankLogo} alt="Logo" className="w-7 h-7 object-contain bg-white rounded-md border border-slate-100 p-0.5" />
                                                <span className="font-bold text-slate-800">{formData.bankName}</span>
                                            </div>
                                        ) : <span className="text-slate-400 font-normal">Chọn ngân hàng...</span>}
                                        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Dropdown thông minh */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                                                <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                                                    <div className="relative">
                                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input type="text" placeholder="Tìm tên hoặc mã ngân hàng..." value={searchBank} onChange={(e) => setSearchBank(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#28A9E0] transition-all" />
                                                    </div>
                                                </div>
                                                <div className="max-h-[220px] overflow-y-auto custom-scrollbar p-2">
                                                    {filteredBanks.map((bank) => (
                                                        <div key={bank.bin} onClick={() => handleSelectBank(bank)} className="flex items-center gap-3 p-3 hover:bg-[#28A9E0]/5 rounded-xl cursor-pointer group">
                                                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex justify-center p-1 shadow-sm"><img src={bank.logo} alt={bank.shortName} className="w-full h-full object-contain" /></div>
                                                            <div><h5 className="text-sm font-bold text-slate-800">{bank.shortName}</h5><p className="text-xs text-slate-500 truncate max-w-[200px]">{bank.name}</p></div>
                                                        </div>
                                                    ))}
                                                    {filteredBanks.length === 0 && <div className="p-4 text-center text-sm text-slate-500">Không tìm thấy ngân hàng phù hợp</div>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Số tài khoản */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Số tài khoản <span className="text-rose-500">*</span></label>
                                    <div className="relative flex gap-3">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Hash size={18} className="text-slate-400" /></div>
                                            <input type="text" placeholder="VD: 0123456789" maxLength={20} value={formData.accountNumber} onChange={handleAccountNumberChange} className="w-full rounded-xl py-3 pl-11 pr-4 bg-white border border-slate-200 hover:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 text-slate-800 font-bold tracking-wider outline-none transition-all shadow-sm" />
                                        </div>
                                        
                                        {/* Nút Kiểm tra */}
                                        <button type="button" onClick={verifyBankAccount} disabled={!formData.bankBin || !formData.accountNumber || isVerifying || isVerified} className={`px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : formData.bankBin && formData.accountNumber ? 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                            {isVerifying ? <Loader2 size={18} className="animate-spin" /> : isVerified ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                                            <span className="hidden sm:inline">{isVerifying ? "Đang dò..." : isVerified ? "Đã xác thực" : "Kiểm tra"}</span>
                                        </button>
                                    </div>
                                    {verifyError && <p className="text-xs font-medium text-amber-600 mt-1">{verifyError}</p>}
                                </div>

                                {/* Tên chủ tài khoản */}
                                <div className="space-y-2 relative">
                                    <label className="block text-sm font-semibold text-slate-700">Tên chủ tài khoản <span className="text-rose-500">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className={isVerified ? "text-emerald-500" : "text-slate-400"} />
                                        </div>
                                        <input type="text" placeholder="VD: NGUYEN VAN A" value={formData.accountHolder} onChange={handleAccountNameChange} readOnly={isVerified} className={`w-full rounded-xl py-3 pl-11 pr-4 border text-slate-800 font-bold outline-none transition-all uppercase ${isVerified ? 'bg-emerald-50/50 border-emerald-200 cursor-default text-emerald-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : 'bg-white border-slate-200 hover:border-[#28A9E0] focus:ring-4 shadow-sm'}`} />
                                        {isVerified && (
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Đã khoá</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Lý do */}
                                <div className="pt-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Lý do yêu cầu hoàn tiền <span className="text-rose-500">*</span></label>
                                    <textarea name="reason" rows="3" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#28A9E0]/20 outline-none text-sm resize-none bg-white shadow-sm placeholder:text-slate-400" placeholder="Vui lòng chia sẻ lý do..." value={formData.reason} onChange={handleChangeReason} />
                                </div>
                            </div>

                            {/* CỘT PHẢI: CARD PREVIEW */}
                            <div className="lg:col-span-5 flex flex-col justify-center relative bg-slate-100/50 rounded-3xl p-6 border border-slate-200/60">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Bản xem trước thẻ</h3>
                                
                                <motion.div 
                                    className="w-full max-w-[340px] mx-auto aspect-[1.586/1] rounded-[20px] p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20 transition-all duration-500"
                                    style={{ background: isVerified ? "linear-gradient(135deg, #10b981 0%, #047857 100%)" : formData.bankBin ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #94a3b8 0%, #475569 100%)" }}
                                    animate={{ scale: formData.accountNumber || formData.accountHolder ? [1, 1.02, 1] : 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="w-10 h-8 bg-yellow-200/80 rounded-md flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-sm border border-yellow-100/50">
                                            <div className="w-6 h-5 border border-yellow-400/50 rounded-sm grid grid-cols-3 gap-px opacity-70">
                                                <div className="border-b border-r border-yellow-400/50"></div><div className="border-b border-r border-yellow-400/50"></div><div className="border-b border-yellow-400/50"></div>
                                                <div className="border-r border-yellow-400/50"></div><div className="border-r border-yellow-400/50"></div><div></div>
                                            </div>
                                        </div>
                                        {formData.bankLogo ? <div className="bg-white p-1.5 rounded-lg shadow-sm"><img src={formData.bankLogo} alt="Bank Logo" className="h-6 max-w-[70px] object-contain" /></div> : <div className="text-white/60 font-bold italic tracking-wider text-lg">BANK</div>}
                                    </div>

                                    <div className="relative z-10 space-y-4 mt-auto">
                                        <div className="font-mono text-xl tracking-[0.15em] text-white text-shadow-sm flex justify-between items-center">
                                            {formData.accountNumber ? formData.accountNumber.match(/.{1,4}/g)?.join(' ') : <span className="opacity-40">XXXX XXXX XXXX</span>}
                                            {isVerified && <CheckCircle2 className="text-white opacity-80" size={20}/>}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] text-white/70 uppercase tracking-widest mb-1">Chủ tài khoản</p>
                                                <p className="text-white font-bold tracking-widest uppercase truncate max-w-[180px] text-sm">
                                                {formData.accountHolder || "TÊN CHỦ TÀI KHOẢN"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-white/70 uppercase tracking-widest mb-1">Napas 247</p>
                                                <div className="flex gap-1 justify-end">
                                                    <div className="w-4 h-4 rounded-full bg-red-500/80 mix-blend-multiply"></div>
                                                    <div className="w-4 h-4 rounded-full bg-yellow-500/80 mix-blend-multiply -ml-2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <p className="text-xs text-center text-slate-400 mt-6 leading-relaxed px-4">
                                    Vui lòng sử dụng tính năng <strong className="text-slate-600">Kiểm tra</strong> để đảm bảo thông tin thụ hưởng chính xác 100%.
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-rose-50 text-rose-600 text-sm font-medium p-4 rounded-xl border border-rose-100 flex items-center justify-center gap-2 mt-6">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={submitting} className="text-slate-600 hover:bg-slate-50">Hủy bỏ</Button>
                    <Button className="bg-[#28A9E0] hover:bg-[#208ab8] text-white px-8 border-none" onClick={handleSubmit} disabled={submitting} isLoading={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                </div>
            </div>
        </div>
    );
}