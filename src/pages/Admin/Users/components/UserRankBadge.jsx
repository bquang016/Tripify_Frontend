import React from "react";
import PropTypes from "prop-types";
import { Gem, Crown, Star, Award } from "lucide-react";

export default function UserRankBadge({ rank }) {
    const normalizedRank = rank ? rank.toUpperCase() : "BRONZE";

    // CSS Animation cho hiệu ứng bóng sáng (chỉ dùng cho Gold/Diamond)
    const style = (
        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-150%) skewX(-15deg); }
                50% { transform: translateX(150%) skewX(-15deg); }
                100% { transform: translateX(150%) skewX(-15deg); }
            }
            .animate-shimmer {
                animation: shimmer 2.5s infinite;
            }
        `}</style>
    );

    const getRankConfig = (r) => {
        switch (r) {
            case "DIAMOND":
                return {
                    label: "Diamond",
                    // Xanh ngọc - Sang trọng nhất
                    containerClass: "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/40 border-transparent",
                    iconClass: "text-white fill-white/30",
                    icon: <Gem size={14} />,
                    hasShine: true // ✅ Có hiệu ứng
                };
            case "GOLD":
                return {
                    label: "Gold",
                    // Vàng kim loại (Amber)
                    containerClass: "bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/40 border-transparent",
                    iconClass: "text-white fill-white/30",
                    icon: <Crown size={14} />,
                    hasShine: true // ✅ Có hiệu ứng
                };
            case "SILVER":
                return {
                    label: "Silver",
                    // Xám bạc kim loại (Đậm hơn bản cũ để chữ trắng nổi bật)
                    containerClass: "bg-gradient-to-r from-slate-400 via-gray-500 to-slate-400 text-white shadow-md border-transparent",
                    iconClass: "text-white fill-white/30",
                    icon: <Star size={14} />,
                    hasShine: false // ❌ Không hiệu ứng
                };
            case "BRONZE":
            default:
                return {
                    label: "Bronze",
                    // Nâu đồng đỏ (Thay vì cam nhạt cũ) -> Nhìn rắn rỏi, kim khí hơn
                    containerClass: "bg-gradient-to-r from-orange-600 via-red-700 to-orange-600 text-white shadow-md border-transparent",
                    iconClass: "text-white fill-white/30",
                    icon: <Award size={14} />,
                    hasShine: false // ❌ Không hiệu ứng
                };
        }
    };

    const config = getRankConfig(normalizedRank);

    return (
        <>
            {style}
            <div className={`
                relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 hover:scale-105 overflow-hidden select-none
                ${config.containerClass}
            `}>
                {/* Lớp ánh sáng chạy qua (Chỉ hiện nếu hasShine = true) */}
                {config.hasShine && (
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none" />
                )}

                {/* Icon & Text */}
                <span className={`${config.iconClass} z-10 relative`}>
                    {config.icon}
                </span>
                <span className="text-xs font-bold tracking-wide uppercase z-10 relative drop-shadow-sm">
                    {config.label}
                </span>
            </div>
        </>
    );
}

UserRankBadge.propTypes = {
    rank: PropTypes.string,
};