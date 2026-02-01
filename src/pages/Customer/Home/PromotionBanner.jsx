import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import promotionService from "@/services/promotion.service";
import { ArrowRight, Gift, Clock, MapPin, Sparkles, ChevronRight, Star } from 'lucide-react';

// --- CONFIGURATION ---
const AUTO_SWITCH_TIME = 6000;
const BE_BASE_URL = "http://localhost:8386";
const UPLOAD_DIR = "/uploads/";

// Helper: Format tiền tệ đẹp
const formatCurrency = (val, type) => {
    if (type === 'PERCENTAGE') return `-${val}%`;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const R2_PUBLIC_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getImageUrl = (path) => {
    if (!path) {
        return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80";
    }

    // Nếu BE đã trả full URL (chuẩn REST)
    if (path.startsWith("http")) {
        return path;
    }

    // Path tương đối -> ảnh nằm trên Cloudflare R2
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${R2_PUBLIC_URL}/${cleanPath}`;
};


// ==========================================
// COMPONENT 1: Countdown Timer (Minimalist)
// ==========================================
const CountdownBadge = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const calc = () => {
            const diff = new Date(endDate) - new Date();
            if (diff > 0) {
                return {
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    m: Math.floor((diff / 1000 / 60) % 60),
                };
            }
            return null;
        };
        setTimeLeft(calc());
        const t = setInterval(() => setTimeLeft(calc()), 60000);
        return () => clearInterval(t);
    }, [endDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold text-white tracking-wide font-mono">
                Kết thúc sau: <span className="text-yellow-400">{timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m</span>
            </span>
        </div>
    );
};

// ==========================================
// COMPONENT 2: Sidebar Ticket Item
// ==========================================
const PromoListItem = memo(({ promo, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative p-4 cursor-pointer transition-all duration-300 rounded-md border flex gap-4 items-center overflow-hidden
                ${isActive
                    ? 'bg-white border-blue-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] scale-[1.02]'
                    : 'bg-white/40 hover:bg-white border-transparent hover:border-blue-100 hover:shadow-md'
                }`}
        >
            {/* Active Indicator Bar */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-cyan-500" />
            )}

            {/* Thumbnail */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                <img src={promo.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {promo.code || 'HOT DEAL'}
                    </span>
                    {isActive && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                </div>

                <h4 className={`text-sm font-bold leading-tight mb-1 truncate transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                    {promo.title}
                </h4>

                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Gift size={12} className="text-rose-500" />
                    <span className="text-rose-600 font-bold">Giảm {formatCurrency(promo.discountValue, promo.discountType)}</span>
                </div>
            </div>

            {/* Arrow */}
            <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-300 group-hover:text-blue-400'}`}>
                <ChevronRight size={18} />
            </div>

            {/* Progress Line for Active Item */}
            {isActive && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 z-10 animate-progress-line" style={{width: '100%', animationDuration: `${AUTO_SWITCH_TIME}ms`}} />
            )}
        </div>
    );
});

// ==========================================
// COMPONENT 3: Main Hero Banner
// ==========================================
const HeroBanner = ({ promo, onAction }) => {
    // Key change to trigger animation reset
    const [animKey, setAnimKey] = useState(0);
    useEffect(() => setAnimKey(prev => prev + 1), [promo.id]);

    return (
        <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => onAction(promo)}>
            {/* Background Image with Ken Burns Effect */}
            <div key={`bg-${animKey}`} className="absolute inset-0 animate-fade-zoom">
                <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Sophisticated Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-3 z-20">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-full shadow-lg shadow-rose-900/20">
                    <Sparkles size={12} fill="currentColor" />
                    ƯU ĐÃI ĐỘC QUYỀN
                </div>
                <CountdownBadge endDate={promo.endDate} />
            </div>

            {/* Content Area */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                <div key={`txt-${animKey}`} className="animate-slide-up space-y-4">

                    {/* Discount Tag */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 w-fit">
                        <Gift size={16} className="text-yellow-400" />
                        <span className="text-sm font-bold text-white">
                            Giảm ngay <span className="text-yellow-400 text-lg">{formatCurrency(promo.discountValue, promo.discountType)}</span> khi đặt hôm nay
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm max-w-3xl">
                        {promo.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-200 text-base md:text-lg font-light line-clamp-2 max-w-xl opacity-90">
                        {promo.description}
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <button className="group/btn relative inline-flex items-center gap-3 pl-6 pr-2 py-2 bg-white rounded-full transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-xl">
                            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Khám phá ngay</span>
                            <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white transition-transform group-hover/btn:rotate-45">
                                <ArrowRight size={16} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const PromotionBanner = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch API
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await promotionService.getAllPromotions();
                const data = Array.isArray(res) ? res : (res.data || []);
                const now = new Date();

                const valid = data
                    .filter(p => p.status === "ACTIVE" && new Date(p.endDate) > now && p.bannerUrl)
                    .sort((a, b) => b.promotionId - a.promotionId)
                    .slice(0, 5) // Lấy 5 items
                    .map(p => ({
                        id: p.promotionId,
                        title: p.description, // Hoặc title
                        description: `Trải nghiệm chuyến đi tuyệt vời với ưu đãi ${p.discountValue}${p.discountType === 'PERCENTAGE' ? '%' : 'đ'} dành riêng cho thành viên TravelMate.`, // Placeholder nếu thiếu desc
                        discountValue: p.discountValue,
                        discountType: p.discountType,
                        endDate: p.endDate,
                        image: getImageUrl(p.bannerUrl),
                        code: `SALE${p.discountValue}`
                    }));
                setPromotions(valid);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    // Auto Rotate
    useEffect(() => {
        if (!promotions.length) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % promotions.length);
        }, AUTO_SWITCH_TIME);
        return () => clearInterval(interval);
    }, [promotions.length, activeIndex]);

    const handleExplore = (promo) => {
        navigate('/promotions', { state: { targetPromoId: promo.id } });
    };

    if (loading) return <div className="container mx-auto h-[500px] bg-gray-100 rounded-[2.5rem] animate-pulse mt-8" />;
    if (!promotions.length) return null;

    return (
        <section className="container mx-auto px-4 py-10 font-sans text-gray-900">
            {/* Styles for Animations */}
            <style>{`
                @keyframes progress-line { from { width: 0%; } to { width: 100%; } }
                @keyframes fade-zoom {
                    0% { opacity: 0; transform: scale(1.05); }
                    10% { opacity: 1; }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-progress-line { animation: progress-line linear forwards; }
                .animate-fade-zoom { animation: fade-zoom 8s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
            `}</style>

            {/* Header Area */}
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    {/* ĐÃ BỎ TAG TRAVELMATE SPECIAL Ở ĐÂY */}
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Săn Deal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Giờ Vàng</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium text-base">Cập nhật liên tục các ưu đãi hấp dẫn nhất</p>
                </div>
                <button onClick={() => navigate('/promotions')} className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 px-4 py-2 rounded-lg border border-transparent hover:border-blue-100 hover:shadow-sm">
                    Xem tất cả <ArrowRight size={16} />
                </button>
            </div>

            {/* Main Layout: Asymmetric Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[580px]">

                {/* LEFT: Hero (7 columns) */}
                <div className="lg:col-span-8 h-[380px] lg:h-[520px] order-1">
                    <HeroBanner promo={promotions[activeIndex]} onAction={handleExplore} />
                </div>

                {/* RIGHT: List (5 columns) */}
                <div className="lg:col-span-4 flex flex-col gap-4 order-2 pr-1">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Danh sách ưu đãi</h3>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            {activeIndex + 1}/{promotions.length}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 pb-4">
                        {promotions.map((promo, idx) => (
                            <PromoListItem
                                key={promo.id}
                                promo={promo}
                                isActive={idx === activeIndex}
                                onClick={() => setActiveIndex(idx)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PromotionBanner;