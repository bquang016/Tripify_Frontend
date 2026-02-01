import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Sparkles } from 'lucide-react';

// --- CONFIGURATION ---
const AUTO_PLAY_TIME = 5000;
const TRANSITION_DURATION = 1000;

// ==========================================
// SUB-COMPONENT 1: Discount Badge (Huy hiệu giảm giá)
// ==========================================
const DiscountBadge = memo(({ value, type }) => {
    if (!value) return null;
    return (
        <div className="absolute top-6 left-6 z-20 animate-bounce-slow">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-2 border-2 border-white/20 backdrop-blur-md">
                <Sparkles size={18} className="text-yellow-300 fill-yellow-300" />
                <span className="font-bold text-lg">
                    Giảm {type === 'PERCENTAGE' ? `${value}%` : `${value.toLocaleString()}đ`}
                </span>
            </div>
        </div>
    );
});

// ==========================================
// SUB-COMPONENT 2: Countdown Timer (Đồng hồ đếm ngược)
// ==========================================
const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endDate) - new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) return null;

    const TimeBox = ({ val, label }) => (
        <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm rounded-lg p-2 min-w-[55px] border border-white/10">
            <span className="text-lg font-bold text-white tabular-nums">{String(val).padStart(2, '0')}</span>
            <span className="text-[9px] text-gray-300 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="flex items-center gap-3 mt-6 animate-fade-in-up [animation-delay:400ms]">
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                <Clock size={16} />
                <span className="text-sm font-semibold">Kết thúc sau:</span>
            </div>
            <div className="flex gap-2">
                <TimeBox val={timeLeft.days} label="Ngày" />
                <TimeBox val={timeLeft.hours} label="Giờ" />
                <TimeBox val={timeLeft.minutes} label="Phút" />
                <TimeBox val={timeLeft.seconds} label="Giây" />
            </div>
        </div>
    );
};

// ==========================================
// SUB-COMPONENT 3: Glass Overlay (Nội dung chính)
// ==========================================
const GlassContent = ({ promo, onClick }) => (
    <div className="absolute inset-0 z-10 flex items-center justify-start container mx-auto px-4 md:px-12">
        <div className="max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up transition-all hover:bg-white/15 group pointer-events-auto">

            {/* Tag */}
            <span className="inline-block px-4 py-1 mb-5 text-xs font-bold tracking-wider text-blue-100 uppercase bg-blue-600/80 rounded-full shadow-lg shadow-blue-600/20">
                Khuyến Mãi Hot
            </span>

            {/* Title - Đã xóa line-clamp-2 để hiện đầy đủ */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                {promo.title}
            </h2>

            {/* Description */}
            <p className="text-gray-100 text-lg mb-2 line-clamp-2 font-light drop-shadow-md">
                {promo.description}
            </p>

            {/* Countdown */}
            <CountdownTimer endDate={promo.endDate} />

            {/* Action Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick(promo);
                }}
                className="mt-8 group/btn relative inline-flex items-center gap-3 px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95 cursor-pointer"
            >
                <span className="relative z-10">Xem chi tiết</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 relative z-10" />
            </button>
        </div>
    </div>
);

// ==========================================
// SUB-COMPONENT 4: Background Slide (Ảnh nền)
// ==========================================
const BannerSlide = memo(({ promo, isActive }) => (
    <div
        className={`absolute inset-0 w-full h-full transition-all ease-in-out ${
            isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
        }`}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
    >
        {/* Image with Zoom Effect */}
        <div className={`w-full h-full transform transition-transform duration-[10000ms] ease-linear ${
            isActive ? 'scale-110' : 'scale-100'
        }`}>
            <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

        <DiscountBadge value={promo.discountValue} type={promo.discountType} />
    </div>
));

// ==========================================
// SUB-COMPONENT 5: Navigation Controls (Nút điều hướng)
// ==========================================
const NavigationControls = ({ onNext, onPrev, total, current, onChange }) => (
    <>
        {/* Arrows */}
        <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 z-20 group cursor-pointer"
        >
            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 z-20 group cursor-pointer"
        >
            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {Array.from({ length: total }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); onChange(idx); }}
                    className={`h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm cursor-pointer ${
                        current === idx
                            ? 'w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                            : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                />
            ))}
        </div>
    </>
);

// ==========================================
// MAIN COMPONENT: AutoScrollBanner
// ==========================================
const AutoScrollBanner = ({ promotions, onBannerClick }) => {
    // 1. Lọc khuyến mãi có ảnh
    const bannerPromotions = promotions?.filter(p => p.image) || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Xử lý Next/Prev
    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % bannerPromotions.length);
        setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
    }, [bannerPromotions.length, isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + bannerPromotions.length) % bannerPromotions.length);
        setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
    }, [bannerPromotions.length, isAnimating]);

    const handleDotClick = useCallback((idx) => {
        if (isAnimating || idx === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(idx);
        setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
    }, [isAnimating, currentIndex]);

    // Auto Play
    useEffect(() => {
        if (bannerPromotions.length <= 1 || isPaused) return;
        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_PLAY_TIME);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused, bannerPromotions.length]);

    if (bannerPromotions.length === 0) return null;

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl group select-none ring-1 ring-gray-200 bg-gray-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Slides */}
            {bannerPromotions.map((promo, index) => (
                <BannerSlide
                    key={`${promo.id}-${index}`}
                    promo={promo}
                    isActive={index === currentIndex}
                />
            ))}

            {/* Glass Content Overlay */}
            <GlassContent
                promo={bannerPromotions[currentIndex]}
                onClick={onBannerClick}
            />

            {/* Controls */}
            <NavigationControls
                total={bannerPromotions.length}
                current={currentIndex}
                onNext={nextSlide}
                onPrev={prevSlide}
                onChange={handleDotClick}
            />

            {/* Custom Animations Styles */}
            <style jsx>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up {
                animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              @keyframes bounceSlow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }
              .animate-bounce-slow {
                animation: bounceSlow 3s infinite ease-in-out;
              }
            `}</style>
        </div>
    );
};

export default AutoScrollBanner;