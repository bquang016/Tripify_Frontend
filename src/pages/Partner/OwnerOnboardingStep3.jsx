import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Banknote, CreditCard, ArrowRight, ShieldCheck, ChevronDown, Search, CheckCircle2, Hash, User, Loader2, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingStepper from './components/OnboardingStepper';
import logo from "@/assets/logo/logo_tripify_xoafont.png";
import Button from '@/components/common/Button/Button';

// --- STRIPE IMPORTS ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Schema Validator
const schema = yup.object().shape({
    paymentMethod: yup.string().required(),
    bankBin: yup.string().when('paymentMethod', {
        is: 'bank',
        then: schema => schema.required('Vui lòng chọn ngân hàng thụ hưởng'),
    }),
    bankName: yup.string(),
    bankLogo: yup.string(),
    accountName: yup.string().when('paymentMethod', {
        is: 'bank',
        then: schema => schema.required('Vui lòng nhập tên chủ tài khoản'),
    }),
    accountNumber: yup.string().when('paymentMethod', {
        is: 'bank',
        then: schema => schema.required('Vui lòng nhập số tài khoản').matches(/^[0-9]+$/, 'Số tài khoản chỉ bao gồm chữ số'),
    }),
});

// =======================================================
// COMPONENT NỘI DUNG CHÍNH
// =======================================================
const OwnerOnboardingStep3Content = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useOnboarding();

    // Stripe hooks
    const stripe = useStripe();
    const elements = useElements();

    const { register, handleSubmit, watch, reset, getValues, setValue, trigger, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            ...formData.paymentInfo,
            paymentMethod: formData.paymentInfo?.paymentMethod || 'bank'
        },
    });
    
    useEffect(() => {
        if (formData.paymentInfo) {
            reset({
                ...formData.paymentInfo,
                paymentMethod: formData.paymentInfo.paymentMethod || 'bank'
            });
        }
    }, [formData, reset]);

    const paymentMethod = watch('paymentMethod');
    const watchBankBin = watch("bankBin");
    const watchBankName = watch("bankName");
    const watchBankLogo = watch("bankLogo");
    const watchAccountNumber = watch("accountNumber");
    const watchAccountName = watch("accountName");

    // --- STATE CHO DROPDOWN NGÂN HÀNG ---
    const [banks, setBanks] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchBank, setSearchBank] = useState("");
    const dropdownRef = useRef(null);

    // --- STATE CHO VERIFY TÀI KHOẢN VÀ STRIPE ---
    const [isProcessing, setIsProcessing] = useState(false); // Dùng chung cho cả verify bank và tạo token Stripe
    const [isVerified, setIsVerified] = useState(false);
    const [verifyError, setVerifyError] = useState("");

    // Reset trạng thái verify khi đổi ngân hàng hoặc số tài khoản
    useEffect(() => {
        if (isVerified) {
            setIsVerified(false);
            setValue("accountName", "", { shouldValidate: true });
        }
        setVerifyError("");
    }, [watchBankBin, watchAccountNumber]);

    // Click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load Banks
    useEffect(() => {
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
    }, []);

    // Search Bank
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

    const handleSelectBank = (bank) => {
        setValue("bankBin", bank.bin, { shouldValidate: true });
        setValue("bankName", bank.shortName, { shouldValidate: true });
        setValue("bankLogo", bank.logo, { shouldValidate: true });
        setIsDropdownOpen(false);
        setSearchBank("");
    };

    const handleAccountNumberChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, "");
        setValue("accountNumber", val, { shouldValidate: true });
    };

    const handleAccountNameChange = (e) => {
        let val = e.target.value;
        val = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        val = val.replace(/[^A-Z\s]/g, ""); 
        setValue("accountName", val, { shouldValidate: true });
    };

    // --- HÀM TRA CỨU TÀI KHOẢN (MOCKUP) ---
    const verifyBankAccount = async () => {
        if (!watchBankBin || !watchAccountNumber || watchAccountNumber.length < 5) {
            setVerifyError("Vui lòng nhập số tài khoản hợp lệ trước khi kiểm tra.");
            return;
        }

        setIsProcessing(true);
        setVerifyError("");

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setValue("accountName", "BUI DANG QUANG", { shouldValidate: true });
            setIsVerified(true);
            trigger("accountName"); 
        } catch (error) {
            setVerifyError("Hệ thống tra cứu đang bận, vui lòng nhập tay tên tài khoản.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMajorStepClick = (stepId) => {
        if (!isValid) { trigger(); return; }
        updateFormData({ paymentInfo: getValues() });
        navigate(`/partner/onboarding/step-${stepId}`);
    };

    // --- SUBMIT FORM VÀ XỬ LÝ STRIPE TOKEN ---
    const onNext = async (data) => {
        // Xử lý tạo Stripe Token nếu Owner chọn nhận tiền qua thẻ
        if (data.paymentMethod === 'card') {
            if (!stripe || !elements) return;
            
            setIsProcessing(true);
            setVerifyError("");
            
            const cardElement = elements.getElement(CardElement);
            
            // Gọi API Stripe.js để tokenize thẻ
            const { error, token } = await stripe.createToken(cardElement, {
                currency: 'vnd',
            });

            setIsProcessing(false);

            if (error) {
                setVerifyError(error.message);
                return; // Chặn luồng nếu thẻ lỗi
            }

            // Gắn token vào data để mang qua Step tiếp theo và gửi xuống DB
            data.stripeToken = token.id;
            data.cardLast4 = token.card.last4;
            data.cardBrand = token.card.brand;
        }

        // Lưu vào Context API
        updateFormData({ paymentInfo: data });
        navigate('/partner/onboarding/step-4');
    };

    // Style cho Card Element
    const cardStyle = {
        style: {
            base: {
                iconColor: '#28A9E0',
                color: '#1e293b',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#94a3b8' },
            },
            invalid: { iconColor: '#ef4444', color: '#ef4444' },
        },
        hidePostalCode: true,
    };

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] font-sans pb-20">
            {/* HEADER */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Tripify" className="h-8 sm:h-9 w-auto" />
                        <div className="h-5 sm:h-6 w-px bg-slate-300 mx-1 sm:mx-2"></div>
                        <span className="font-bold text-slate-700 tracking-tight text-sm sm:text-base">Đăng ký Đối tác</span>
                    </div>
                    <button onClick={() => navigate('/partner')} className="text-sm font-semibold text-slate-500 hover:text-[#28A9E0] transition-colors">
                        Lưu & Thoát
                    </button>
                </div>
            </header>

            {/* STEPPER */}
            <div className="w-full bg-white border-b border-slate-100 pt-6 pb-12 sm:pt-8 sm:pb-14">
                <OnboardingStepper currentStep={3} onStepClick={handleMajorStepClick} />
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                 <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Thông tin Thanh toán</h1>
                    <p className="text-slate-500 mt-2 text-lg">Cung cấp phương thức để Tripify thanh toán doanh thu cho bạn.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 relative">
                    <form onSubmit={handleSubmit(onNext)}>
                        
                        {/* TAB */}
                        <div className="mb-8 flex border-b border-gray-200">
                            <label className={`flex items-center gap-2 px-6 py-4 cursor-pointer border-b-2 transition-all -mb-px
                                ${paymentMethod === 'bank' ? 'border-[#28A9E0] text-[#28A9E0]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                            >
                                <input type="radio" value="bank" {...register('paymentMethod')} className="hidden" />
                                <Banknote size={18} />
                                <span className="font-bold">Tài khoản ngân hàng</span>
                            </label>
                            
                            <label className={`flex items-center gap-2 px-6 py-4 cursor-pointer border-b-2 transition-all -mb-px
                                ${paymentMethod === 'card' ? 'border-[#28A9E0] text-[#28A9E0]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                            >
                                <input type="radio" value="card" {...register('paymentMethod')} className="hidden" />
                                <CreditCard size={18} />
                                <span className="font-bold">Thẻ Quốc Tế (Payouts)</span>
                            </label>
                        </div>

                        {/* ================================================== */}
                        {/* NỘI DUNG TAB 1: NGÂN HÀNG (GIỮ NGUYÊN) */}
                        {/* ================================================== */}
                        {paymentMethod === 'bank' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* CỘT TRÁI */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="flex items-center justify-between pb-2">
                                        <h4 className="text-lg font-bold text-gray-800">Chi tiết tài khoản</h4>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                                            <ShieldCheck size={14}/> <span>Napas Verified</span>
                                        </div>
                                    </div>

                                    {/* 1. NGÂN HÀNG */}
                                    <div className="space-y-2 relative" ref={dropdownRef}>
                                        <label className="block text-sm font-semibold text-slate-700">Ngân hàng thụ hưởng *</label>
                                        <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`w-full flex items-center justify-between rounded-2xl py-3.5 pl-4 pr-4 bg-white border ${errors.bankBin ? 'border-red-400' : 'border-slate-200 hover:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10'} text-slate-700 font-medium transition-all shadow-sm cursor-pointer`}>
                                            {watchBankBin ? (
                                                <div className="flex items-center gap-3">
                                                    <img src={watchBankLogo} alt="Logo" className="w-8 h-8 object-contain bg-white rounded-md border border-gray-100 p-0.5" />
                                                    <span className="font-bold text-gray-800">{watchBankName}</span>
                                                </div>
                                            ) : <span className="text-slate-400 font-normal">Chọn ngân hàng...</span>}
                                            <ChevronDown size={18} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {errors.bankBin && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.bankBin.message}</p>}

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                                                        <div className="relative">
                                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input type="text" placeholder="Tìm tên hoặc mã ngân hàng..." value={searchBank} onChange={(e) => setSearchBank(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#28A9E0] transition-all" />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-2">
                                                        {filteredBanks.map((bank) => (
                                                            <div key={bank.bin} onClick={() => handleSelectBank(bank)} className="flex items-center gap-3 p-3 hover:bg-[#28A9E0]/5 rounded-xl cursor-pointer group">
                                                                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex justify-center p-1 shadow-sm"><img src={bank.logo} alt={bank.shortName} className="w-full h-full object-contain" /></div>
                                                                <div><h5 className="text-sm font-bold text-gray-800">{bank.shortName}</h5><p className="text-xs text-gray-500 truncate max-w-[200px]">{bank.name}</p></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* 2. SỐ TÀI KHOẢN VÀ NÚT KIỂM TRA */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Số tài khoản *</label>
                                        <div className="relative flex gap-3">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Hash size={18} className="text-slate-400" /></div>
                                                <input type="text" placeholder="VD: 0123456789" maxLength={20} {...register("accountNumber")} onChange={handleAccountNumberChange} className={`w-full rounded-2xl py-3.5 pl-11 pr-4 bg-white border ${errors.accountNumber ? 'border-red-400' : 'border-slate-200 hover:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10'} text-slate-800 font-bold tracking-wider outline-none transition-all shadow-sm`} />
                                            </div>
                                            
                                            <button 
                                                type="button" 
                                                onClick={verifyBankAccount}
                                                disabled={!watchBankBin || !watchAccountNumber || isProcessing || isVerified}
                                                className={`px-5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm
                                                    ${isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                                    : watchBankBin && watchAccountNumber ? 'bg-[#28A9E0] text-white hover:bg-[#2088b6] hover:shadow-md' 
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                            >
                                                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 
                                                 isVerified ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                                                {isProcessing ? "Đang dò..." : isVerified ? "Đã xác thực" : "Kiểm tra"}
                                            </button>
                                        </div>
                                        {verifyError && paymentMethod === 'bank' && <p className="text-xs font-medium text-amber-600 mt-1">{verifyError}</p>}
                                        {errors.accountNumber && <p className="text-xs font-medium text-red-500 mt-1">{errors.accountNumber.message}</p>}
                                    </div>

                                    {/* 3. TÊN CHỦ TÀI KHOẢN */}
                                    <div className="space-y-2 relative">
                                        <label className="block text-sm font-semibold text-slate-700">Tên chủ tài khoản *</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className={isVerified ? "text-emerald-500" : "text-slate-400"} />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="VD: NGUYEN VAN A" 
                                                {...register("accountName")} 
                                                onChange={handleAccountNameChange} 
                                                readOnly={isVerified}
                                                className={`w-full rounded-2xl py-3.5 pl-11 pr-4 border text-slate-800 font-bold outline-none transition-all uppercase 
                                                    ${isVerified ? 'bg-emerald-50/50 border-emerald-200 cursor-default text-emerald-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : 'bg-white border-slate-200 hover:border-[#28A9E0] focus:ring-4 shadow-sm'} 
                                                    ${errors.accountName ? 'border-red-400' : ''}`} 
                                            />
                                            {isVerified && (
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Đã khoá</div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.accountName && <p className="text-xs font-medium text-red-500 mt-1">{errors.accountName.message}</p>}
                                    </div>
                                </div>

                                {/* CỘT PHẢI: CARD PREVIEW */}
                                <div className="lg:col-span-5 flex flex-col justify-center relative">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center lg:text-left">Bản xem trước</h3>
                                    <motion.div 
                                        className="w-full max-w-[400px] mx-auto h-[220px] rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20 transition-all duration-500"
                                        style={{ background: isVerified ? "linear-gradient(135deg, #10b981 0%, #047857 100%)" : watchBankBin ? "linear-gradient(135deg, #28A9E0 0%, #0D668E 100%)" : "linear-gradient(135deg, #94a3b8 0%, #475569 100%)" }}
                                        animate={{ scale: watchAccountNumber || watchAccountName ? [1, 1.02, 1] : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="w-12 h-10 bg-yellow-200/80 rounded-md flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-sm border border-yellow-100/50">
                                                <div className="w-8 h-6 border border-yellow-400/50 rounded-sm grid grid-cols-3 gap-px opacity-70">
                                                    <div className="border-b border-r border-yellow-400/50"></div><div className="border-b border-r border-yellow-400/50"></div><div className="border-b border-yellow-400/50"></div>
                                                    <div className="border-r border-yellow-400/50"></div><div className="border-r border-yellow-400/50"></div><div></div>
                                                </div>
                                            </div>
                                            {watchBankLogo ? <div className="bg-white p-1.5 rounded-lg shadow-sm"><img src={watchBankLogo} alt="Bank Logo" className="h-8 max-w-[80px] object-contain" /></div> : <div className="text-white/60 font-bold italic tracking-wider text-xl">BANK</div>}
                                        </div>
                                        <div className="relative z-10 space-y-4">
                                            <div className="font-mono text-2xl tracking-[0.15em] text-white text-shadow-sm flex justify-between items-center">
                                                {watchAccountNumber ? watchAccountNumber.match(/.{1,4}/g)?.join(' ') : <span className="opacity-40">XXXX XXXX XXXX</span>}
                                                {isVerified && <CheckCircle2 className="text-white opacity-80" size={24}/>}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">Chủ tài khoản</p>
                                                    <p className="text-white font-bold tracking-widest uppercase truncate max-w-[200px]">
                                                    {watchAccountName || "TÊN CHỦ TÀI KHOẢN"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">Napas 247</p>
                                                    <div className="flex gap-1 justify-end">
                                                        <div className="w-4 h-4 rounded-full bg-red-500/80 mix-blend-multiply"></div>
                                                        <div className="w-4 h-4 rounded-full bg-yellow-500/80 mix-blend-multiply -ml-2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* ================================================== */}
                        {/* NỘI DUNG TAB 2: THẺ STRIPE PAYOUT (ĐÃ MỞ KHÓA) */}
                        {/* ================================================== */}
                        {paymentMethod === 'card' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-[#28A9E0]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#28A9E0]">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Thanh toán qua Thẻ Quốc Tế</h3>
                                    <p className="text-slate-500">Doanh thu sẽ được Tripify tự động thanh toán trực tiếp vào thẻ VISA/Mastercard của bạn hàng tháng thông qua nền tảng Stripe Connect.</p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-bold text-slate-700">Thông tin thẻ thụ hưởng <span className="text-rose-500">*</span></label>
                                        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md font-bold">
                                            <Lock size={12} /> Stripe Secured
                                        </div>
                                    </div>
                                    
                                    {/* THÀNH PHẦN NHẬP THẺ CỦA STRIPE */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                            <CreditCard size={18} className="text-slate-400" />
                                        </div>
                                        <div className="pl-12 pr-4 py-4 border border-slate-200 rounded-xl bg-white shadow-sm focus-within:ring-4 focus-within:ring-[#28A9E0]/20 focus-within:border-[#28A9E0] transition-all">
                                            <CardElement options={cardStyle} />
                                        </div>
                                    </div>

                                    {verifyError && paymentMethod === 'card' && (
                                        <p className="text-sm font-medium text-red-500 mt-3 text-center bg-red-50 py-2 rounded-lg border border-red-100">{verifyError}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-8 mt-12 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={() => navigate('/partner/onboarding/step-2')}>Quay lại</Button>
                            <Button 
                                type="submit" 
                                rightIcon={isProcessing ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Lưu & Tiếp tục'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

// =======================================================
// BỌC TRONG ELEMENTS PROVIDER ĐỂ SỬ DỤNG ĐƯỢC STRIPE
// =======================================================
export default function OwnerOnboardingStep3() {
    return (
        <Elements stripe={stripePromise}>
            <OwnerOnboardingStep3Content />
        </Elements>
    );
}
