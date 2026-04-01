import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Copy, CheckCircle, Info, Clock, AlertCircle, Sparkles, Calendar, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

const SUPER_DEAL_IMAGE = "https://cdn-icons-png.flaticon.com/512/5267/5267825.png";

const PromotionDetailModal = ({ isOpen, onClose, promo, savedIds, onToggleSave }) => {
    const { t, i18n } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) setAnimate(true);
        else setAnimate(false);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!promo) return null;

    const cleanNumber = (val) => (val === undefined || val === null) ? 0 : Number(val);
    const minAmount = cleanNumber(promo.minBookingAmount ?? promo.minOrder);
    const maxAmount = cleanNumber(promo.maxDiscountAmount ?? promo.maxDiscount);
    const discountVal = cleanNumber(promo.discountValue);
    const targetRank = promo.minMembershipRank || promo.targetRank || "BRONZE";

    const handleCopyCode = () => {
        navigator.clipboard.writeText(promo.code || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onToggleSave && savedIds && !savedIds.includes(promo.id)) onToggleSave(promo.id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? "vi-VN" : "en-US");
    };

    const formatCurrency = (val) => {
        if (i18n.language === 'vi') return val.toLocaleString('vi-VN') + 'đ';
        return '$' + (val / 25000).toFixed(1);
    };

    const getDaysLeft = () => {
        if (!promo.endDate) return null;
        const end = new Date(promo.endDate);
        const now = new Date();
        end.setHours(23, 59, 59, 999);
        const diffTime = end - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getRankConfig = (rank) => {
        const r = rank ? rank.toUpperCase() : 'ALL';
        const isVi = i18n.language === 'vi';
        switch (r) {
            case 'BRONZE':
                return { prefix: isVi ? 'Thành viên' : 'Member', name: isVi ? 'Đồng' : 'Bronze', bgClass: 'bg-gradient-to-br from-[#ffedd5] via-[#fdba74] to-[#c2410c]', borderClass: 'border-[#ffedd5]/50', textClass: 'text-[#7c2d12]', iconColor: '#7c2d12', shadowClass: 'shadow-orange-900/20' };
            case 'SILVER':
                return { prefix: isVi ? 'Thành viên' : 'Member', name: isVi ? 'Bạc' : 'Silver', bgClass: 'bg-gradient-to-br from-[#f8fafc] via-[#cbd5e1] to-[#64748b]', borderClass: 'border-white/60', textClass: 'text-[#334155]', iconColor: '#334155', shadowClass: 'shadow-slate-900/20' };
            case 'GOLD':
                return { prefix: isVi ? 'Thành viên' : 'Member', name: isVi ? 'Vàng' : 'Gold', bgClass: 'bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#854d0e]', borderClass: 'border-[#fef08a]/50', textClass: 'text-[#422006]', iconColor: '#422006', shadowClass: 'shadow-yellow-600/40', isLuxury: true, shimmerColor: 'from-transparent via-white/90 to-transparent' };
            case 'DIAMOND':
                return { prefix: isVi ? 'Thành viên' : 'Member', name: isVi ? 'Kim Cương' : 'Diamond', bgClass: 'bg-gradient-to-br from-[#cffafe] via-[#06b6d4] to-[#164e63]', borderClass: 'border-[#cffafe]/50', textClass: 'text-[#ecfeff]', iconColor: '#ecfeff', shadowClass: 'shadow-cyan-700/40', isLuxury: true, shimmerColor: 'from-transparent via-white/80 to-transparent' };
            default:
                return { prefix: isVi ? 'Tất cả' : 'All', name: isVi ? 'Hội viên' : 'Members', bgClass: 'bg-white', borderClass: 'border-gray-200', textClass: 'text-gray-600', iconColor: '#4b5563', shadowClass: 'shadow-lg' };
        }
    };

    const daysLeft = getDaysLeft();
    const isBigSale = (promo.discountType === 'PERCENTAGE' && discountVal >= 20) || (promo.discountType === 'FIXED' && discountVal >= 500000);
    const rankConfig = getRankConfig(targetRank);

    return (
        <Modal open={isOpen} onClose={onClose} title={null} maxWidth="max-w-2xl">
            <div className={`bg-white rounded-3xl block relative duration-500 ease-out transition-[opacity,transform] w-full h-auto ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="w-full relative z-10 bg-gray-100 min-h-[220px] group overflow-hidden shrink-0 rounded-t-3xl">
                    <img src={promo.image} alt={promo.title} className="w-full h-auto max-h-[380px] object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                    <div className={`absolute top-4 right-4 z-20 flex flex-col items-center justify-center min-w-[60px] py-1.5 px-2 rounded-lg border shadow-xl backdrop-blur-sm overflow-hidden ${rankConfig.bgClass} ${rankConfig.borderClass} ${rankConfig.textClass} ${rankConfig.shadowClass}`}>
                        {rankConfig.isLuxury && <div className={`absolute inset-0 z-0 bg-gradient-to-r ${rankConfig.shimmerColor} animate-shimmer-sweep -translate-x-full`}></div>}
                        <div className="relative z-10 flex flex-col items-center gap-0.5">
                            <Crown size={16} color={rankConfig.iconColor} fill={rankConfig.iconColor} className="filter mb-0.5" strokeWidth={2.5} />
                            <span className="text-[8px] font-bold uppercase tracking-wider opacity-80 leading-none">{rankConfig.prefix}</span>
                            <span className="text-xs font-black uppercase leading-none tracking-wide mt-0.5">{rankConfig.name}</span>
                        </div>
                    </div>
                    {isBigSale && (
                        <div className="absolute top-0 left-4 w-20 h-20 z-20 animate-bounce-slow">
                            <img src={SUPER_DEAL_IMAGE} alt="Super Deal" className="w-full h-full object-contain filter brightness-110" />
                        </div>
                    )}
                </div>

                <div className="px-8 pb-8 pt-2 space-y-6 relative z-10">
                    <div className="space-y-4 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className={`relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-md ${isBigSale ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-200' : 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-orange-200'}`}>
                                <Sparkles size={14} className="animate-pulse" /> {isBigSale ? (i18n.language === 'vi' ? 'SUPER DEAL - GIẢM SÂU' : 'SUPER DEAL - BIG DISCOUNT') : (i18n.language === 'vi' ? 'KHUYẾN MÃI HOT' : 'HOT PROMOTION')}
                            </div>
                            <div className="text-gray-500 text-sm font-medium flex items-center gap-2 bg-gray-100/80 px-3 py-1.5 rounded-full border border-gray-200">
                                <Clock size={15} className="text-blue-500" />
                                <span className="text-xs sm:text-sm">
                                    {daysLeft !== null && daysLeft > 0 ? (i18n.language === 'vi' ? `Còn ${daysLeft} ngày` : `${daysLeft} days left`) : (daysLeft === null ? (i18n.language === 'vi' ? "Vô thời hạn" : "Unlimited") : t('promotions.expired'))}
                                </span>
                            </div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">{promo.title}</h2>
                    </div>

                    <div className="relative group max-w-lg mx-auto w-full">
                        <div onClick={handleCopyCode} className={`relative overflow-hidden bg-white border-2 border-dashed rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 shadow-sm ${copied ? 'border-green-500 bg-green-50' : (isBigSale ? 'border-red-300 hover:border-red-500 hover:bg-red-50' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50')}`}>
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{i18n.language === 'vi' ? 'Mã Voucher' : 'Voucher Code'}</p>
                                <p className={`text-3xl font-black font-mono tracking-widest ${copied ? 'text-green-600' : (isBigSale ? 'text-red-600' : 'text-blue-600')}`}>{promo.code}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium transition-colors ${copied ? "text-green-600" : "text-gray-400"}`}>{copied ? t('promotions.copied') : t('promotions.copy_code')}</span>
                                <div className={`p-3 rounded-full shadow-sm transition-all duration-300 transform group-hover:scale-110 ${copied ? "bg-green-500 text-white" : (isBigSale ? "bg-red-500 text-white" : "bg-blue-500 text-white")}`}>
                                    {copied ? <CheckCircle size={24} /> : <Copy size={24} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-xs tracking-wide"><Info size={14} className="text-blue-500 fill-blue-100"/> {i18n.language === 'vi' ? 'Thông tin chi tiết' : 'Details'}</h4>
                            <p className="leading-relaxed pl-6 text-gray-700">{promo.description}</p>
                            <div className="w-full h-[1px] bg-gray-200 my-3"></div>
                            <h4 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-xs tracking-wide"><AlertCircle size={14} className="text-orange-500 fill-orange-100"/> {i18n.language === 'vi' ? 'Điều kiện áp dụng' : 'Terms & Conditions'}</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                                <li className="sm:col-span-2 flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 shrink-0"><Crown size={15} color={rankConfig.iconColor} /><span>{i18n.language === 'vi' ? 'Đối tượng áp dụng:' : 'Applicable to:'}</span></div>
                                    <span className={`font-bold text-sm px-2.5 py-0.5 rounded-full border ${rankConfig.bgClass} ${rankConfig.borderClass} ${rankConfig.textClass}`}>{rankConfig.prefix} {rankConfig.name}</span>
                                </li>
                                <li className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span><span>{t('promotions.min_spend')}:</span></div>
                                    <span className="font-bold text-gray-900">{formatCurrency(minAmount)}</span>
                                </li>
                                <li className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span><span>{t('promotions.max_discount')}:</span></div>
                                    <span className="font-bold text-gray-900">{maxAmount > 0 ? formatCurrency(maxAmount) : (i18n.language === 'vi' ? "Không giới hạn" : "No limit")}</span>
                                </li>
                                <li className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 shrink-0"><Calendar size={14} className="text-purple-500" /><span>{i18n.language === 'vi' ? 'Hạn sử dụng:' : 'Valid until:'}</span></div>
                                    <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-right">
                                        <span className="text-gray-600">{i18n.language === 'vi' ? 'Từ' : 'From'} <span className="font-semibold text-blue-600">{formatDate(promo.startDate) || "Now"}</span> {i18n.language === 'vi' ? 'đến' : 'to'} <span className="font-semibold text-red-600">{formatDate(promo.endDate) || (i18n.language === 'vi' ? "Vô hạn" : "Unlimited")}</span></span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PromotionDetailModal;
