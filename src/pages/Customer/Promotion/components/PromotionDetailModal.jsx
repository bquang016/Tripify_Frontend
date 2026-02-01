import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Copy, CheckCircle, Info, Clock, AlertCircle, Sparkles, Calendar, Crown } from "lucide-react";

// Icon cho Super Deal
const SUPER_DEAL_IMAGE = "https://cdn-icons-png.flaticon.com/512/5267/5267825.png";

const PromotionDetailModal = ({ isOpen, onClose, promo, savedIds, onToggleSave }) => {
    const [copied, setCopied] = useState(false);
    const [animate, setAnimate] = useState(false);

    // Hiệu ứng mở modal
    useEffect(() => {
        if (isOpen) {
            setAnimate(true);
        } else {
            setAnimate(false);
        }
    }, [isOpen]);

    // [GIỮ NGUYÊN] Khóa cuộn trang chính khi Modal mở
    // Để khi bạn cuộn Modal dài, trang web phía sau không bị trôi
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!promo) return null;

    // --- XỬ LÝ DỮ LIỆU ---
    const cleanNumber = (val) => {
        if (val === undefined || val === null) return 0;
        return Number(val);
    };

    const minBookingAmount = cleanNumber(promo.minBookingAmount ?? promo.minOrder);
    const maxDiscountAmount = cleanNumber(promo.maxDiscountAmount ?? promo.maxDiscount);
    const discountVal = cleanNumber(promo.discountValue);
    const targetRank = promo.minMembershipRank || promo.targetRank || "BRONZE";

    const handleCopyCode = () => {
        navigator.clipboard.writeText(promo.code || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        if (onToggleSave && savedIds && !savedIds.includes(promo.id)) {
            onToggleSave(promo.id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
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
        switch (r) {
            case 'BRONZE':
                return {
                    prefix: 'Thành viên', name: 'Đồng',
                    bgClass: 'bg-gradient-to-br from-[#ffedd5] via-[#fdba74] to-[#c2410c]',
                    borderClass: 'border-[#ffedd5]/50',
                    textClass: 'text-[#7c2d12]',
                    iconColor: '#7c2d12',
                    shadowClass: 'shadow-orange-900/20',
                    isLuxury: false
                };
            case 'SILVER':
                return {
                    prefix: 'Thành viên', name: 'Bạc',
                    bgClass: 'bg-gradient-to-br from-[#f8fafc] via-[#cbd5e1] to-[#64748b]',
                    borderClass: 'border-white/60',
                    textClass: 'text-[#334155]',
                    iconColor: '#334155',
                    shadowClass: 'shadow-slate-900/20',
                    isLuxury: false
                };
            case 'GOLD':
                return {
                    prefix: 'Thành viên', name: 'Vàng',
                    bgClass: 'bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#854d0e]',
                    borderClass: 'border-[#fef08a]/50',
                    textClass: 'text-[#422006]',
                    iconColor: '#422006',
                    shadowClass: 'shadow-yellow-600/40',
                    isLuxury: true,
                    shimmerColor: 'from-transparent via-white/90 to-transparent'
                };
            case 'DIAMOND':
                return {
                    prefix: 'Thành viên', name: 'Kim Cương',
                    bgClass: 'bg-gradient-to-br from-[#cffafe] via-[#06b6d4] to-[#164e63]',
                    borderClass: 'border-[#cffafe]/50',
                    textClass: 'text-[#ecfeff]',
                    iconColor: '#ecfeff',
                    shadowClass: 'shadow-cyan-700/40',
                    isLuxury: true,
                    shimmerColor: 'from-transparent via-white/80 to-transparent'
                };
            default:
                return {
                    prefix: 'Tất cả', name: 'Hội viên',
                    bgClass: 'bg-white',
                    borderClass: 'border-gray-200',
                    textClass: 'text-gray-600',
                    iconColor: '#4b5563',
                    shadowClass: 'shadow-lg',
                    isLuxury: false
                };
        }
    };

    const daysLeft = getDaysLeft();
    const isBigSale = (promo.discountType === 'PERCENTAGE' && discountVal >= 20) ||
        (promo.discountType === 'FIXED' && discountVal >= 500000);

    const rankConfig = getRankConfig(targetRank);

    return (
        <Modal open={isOpen} onClose={onClose} title={null} maxWidth="max-w-2xl">
            {/* [CẬP NHẬT QUAN TRỌNG]
                1. Xóa 'max-h-[85vh]' và 'overflow-y-auto': Để Modal tự do giãn chiều cao theo nội dung (h-auto).
                2. Xóa các class ẩn thanh cuộn: Vì bây giờ ta dùng thanh cuộn của trình duyệt (hoặc của wrapper Modal).
            */}
            <div className={`bg-white rounded-3xl block relative
                duration-500 ease-out transition-[opacity,transform] will-change-[opacity,transform]
                w-full h-auto
                ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                     style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* --- 1. ẢNH BANNER --- */}
                <div className="w-full relative z-10 bg-gray-100 min-h-[220px] group overflow-hidden shrink-0 rounded-t-3xl">
                    <img
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-auto max-h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>

                    {/* BADGE HỘI VIÊN */}
                    <div className={`absolute top-4 right-4 z-20 flex flex-col items-center justify-center
                        min-w-[60px] py-1.5 px-2 rounded-lg
                        border-t border-l border-b border-r
                        shadow-xl backdrop-blur-sm overflow-hidden
                        ${rankConfig.bgClass} ${rankConfig.borderClass} ${rankConfig.textClass} ${rankConfig.shadowClass}`}>

                        {rankConfig.isLuxury && (
                            <div className={`absolute inset-0 z-0 bg-gradient-to-r ${rankConfig.shimmerColor} animate-shimmer-sweep -translate-x-full`}></div>
                        )}
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/30 blur-lg rounded-full pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center gap-0.5">
                            <Crown
                                size={16}
                                color={rankConfig.iconColor}
                                fill={rankConfig.iconColor}
                                className="drop-shadow-sm filter mb-0.5"
                                strokeWidth={2.5}
                            />
                            <span className="text-[8px] font-bold uppercase tracking-wider opacity-80 leading-none">
                                {rankConfig.prefix}
                            </span>
                            <span className="text-xs font-black uppercase leading-none tracking-wide drop-shadow-sm mt-0.5">
                                {rankConfig.name}
                            </span>
                        </div>
                    </div>

                    {/* SUPER DEAL BADGE */}
                    {isBigSale && (
                        <div className="absolute top-0 left-4 w-20 h-20 z-20 animate-bounce-slow">
                            <img
                                src={SUPER_DEAL_IMAGE}
                                alt="Super Deal"
                                className="w-full h-full object-contain drop-shadow-xl filter brightness-110"
                            />
                        </div>
                    )}
                </div>

                {/* --- DECOR LINE --- */}
                <div className="relative z-20 -mt-1 shrink-0">
                    <div className="h-6 w-full bg-white relative flex items-center justify-center">
                        <div className="w-[90%] border-t-2 border-dashed border-gray-300"></div>
                    </div>
                </div>

                {/* --- 2. NỘI DUNG CHÍNH --- */}
                {/* Giữ lại pb-8 để nội dung cuối thoáng hơn một chút */}
                <div className="px-8 pb-8 pt-2 space-y-6 relative z-10">
                    <div className="space-y-4 text-center">
                        {/* TAGS & LABELS */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {isBigSale ? (
                                <div className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold shadow-md shadow-red-200">
                                    <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                    <Sparkles size={14} className="animate-pulse" /> SUPER DEAL - GIẢM SÂU
                                </div>
                            ) : (
                                <div className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-md shadow-orange-200">
                                    <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                    <Sparkles size={14} className="animate-pulse" /> KHUYẾN MÃI HOT
                                </div>
                            )}

                            <div className="text-gray-500 text-sm font-medium flex items-center gap-2 bg-gray-100/80 px-3 py-1.5 rounded-full border border-gray-200">
                                <Clock size={15} className="text-blue-500" />
                                <span className="flex items-center gap-1 text-xs sm:text-sm">
                                    {daysLeft !== null && daysLeft > 0 ? (
                                        <span className="font-bold text-red-500">Còn {daysLeft} ngày</span>
                                    ) : (
                                        <span>{daysLeft === null ? "Vô thời hạn" : "Đã hết hạn"}</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* TITLE */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">
                            {promo.title || promo.name}
                        </h2>
                    </div>

                    {/* BOX MÃ CODE */}
                    <div className="relative group max-w-lg mx-auto w-full">
                        <div className={`absolute -inset-0.5 rounded-2xl opacity-75 blur opacity-20 group-hover:opacity-40 transition duration-1000 ${isBigSale ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}></div>
                        <div
                            onClick={handleCopyCode}
                            className={`relative overflow-hidden bg-white border-2 ${copied ? 'border-green-500 bg-green-50' : (isBigSale ? 'border-red-300 border-dashed hover:border-red-500 hover:bg-red-50' : 'border-blue-300 border-dashed hover:border-blue-500 hover:bg-blue-50')} rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 shadow-sm`}
                        >
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Mã Voucher</p>
                                <p className={`text-3xl font-black font-mono tracking-widest ${copied ? 'text-green-600' : (isBigSale ? 'text-red-600' : 'text-blue-600')}`}>
                                    {promo.code}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium transition-colors ${copied ? "text-green-600" : "text-gray-400"}`}>
                                    {copied ? "Đã chép!" : "Sao chép"}
                                </span>
                                <div className={`p-3 rounded-full shadow-sm transition-all duration-300 transform group-hover:scale-110 ${copied ? "bg-green-500 text-white" : (isBigSale ? "bg-red-500 text-white" : "bg-blue-500 text-white")}`}>
                                    {copied ? <CheckCircle size={24} /> : <Copy size={24} />}
                                </div>
                            </div>
                            {copied && <span className="absolute inset-0 bg-green-200/20 animate-ping rounded-xl"></span>}
                        </div>
                    </div>

                    {/* CHI TIẾT & ĐIỀU KIỆN */}
                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-xs tracking-wide">
                                <Info size={14} className="text-blue-500 fill-blue-100"/> Thông tin chi tiết
                            </h4>
                            <p className="leading-relaxed pl-6 text-gray-700">{promo.description}</p>

                            <div className="w-full h-[1px] bg-gray-200 my-3"></div>

                            <h4 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-xs tracking-wide">
                                <AlertCircle size={14} className="text-orange-500 fill-orange-100"/> Điều kiện áp dụng
                            </h4>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                                {/* Hạng thành viên */}
                                <li className="sm:col-span-2 flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Crown size={15} color={rankConfig.iconColor} />
                                        <span>Đối tượng áp dụng:</span>
                                    </div>
                                    <span className={`font-bold text-sm px-2.5 py-0.5 rounded-full border ${rankConfig.bgClass} ${rankConfig.borderClass} ${rankConfig.textClass}`}>
                                        {rankConfig.prefix} {rankConfig.name}
                                    </span>
                                </li>

                                {/* Đơn tối thiểu */}
                                <li className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                        <span>Đơn tối thiểu:</span>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        {minBookingAmount.toLocaleString('vi-VN')}đ
                                    </span>
                                </li>

                                {/* Giảm tối đa */}
                                <li className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                        <span>Giảm tối đa:</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-right">
                                        {maxDiscountAmount > 0
                                            ? maxDiscountAmount.toLocaleString('vi-VN') + 'đ'
                                            : "Không giới hạn"
                                        }
                                    </span>
                                </li>

                                {/* Hạn sử dụng */}
                                <li className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Calendar size={14} className="text-purple-500" />
                                        <span className="font-medium">Hạn sử dụng:</span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-right">
                                        <span className="text-gray-600">
                                            Từ <span className="font-semibold text-blue-600">{formatDate(promo.startDate) || "Nay"}</span>
                                            {" "}đến <span className="font-semibold text-red-600">{formatDate(promo.endDate) || "Vô hạn"}</span>
                                        </span>

                                        {daysLeft !== null && daysLeft > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-100">
                                                Còn {daysLeft} ngày
                                            </span>
                                        )}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-5%); }
                    50% { transform: translateY(5%); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite;
                }
                @keyframes shimmer-sweep {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                .animate-shimmer-sweep {
                    animation: shimmer-sweep 2.5s infinite linear;
                }
            `}</style>
        </Modal>
    );
};

export default PromotionDetailModal;