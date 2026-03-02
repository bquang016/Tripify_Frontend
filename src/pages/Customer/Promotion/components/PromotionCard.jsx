import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import { Bookmark, Flame, Crown, Clock, TicketPercent } from "lucide-react";
import placeholderImg from "@/assets/images/placeholder.png";
import { useTranslation } from "react-i18next";

export default function PromotionCard({ promo, onClick, isSaved, onToggleSave }) {
    const { t, i18n } = useTranslation();
    const isClickable = typeof onClick === 'function';

    const bgImage = promo.bannerUrl || promo.image || placeholderImg;
    const targetRank = promo.minMembershipRank || promo.targetRank || 'BRONZE';

    const limit = promo.usageLimit || promo.quantity || 0;
    const used = promo.usageCount || promo.used || 0;
    const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

    const isHot =
        promo.code?.toLowerCase().includes("hot") ||
        promo.description?.toLowerCase().includes("hot") ||
        usagePercent > 80;

    const getRankConfig = (rank) => {
        if (!rank) return { show: false };
        const r = rank.toUpperCase();
        switch (r) {
            case 'BRONZE': return { label: i18n.language === 'vi' ? 'Đồng' : 'Bronze', className: 'bg-orange-600 text-white', show: true };
            case 'SILVER': return { label: i18n.language === 'vi' ? 'Bạc' : 'Silver', className: 'bg-slate-500 text-white', show: true };
            case 'GOLD': return { label: i18n.language === 'vi' ? 'Vàng' : 'Gold', className: 'bg-yellow-500 text-white', show: true };
            case 'DIAMOND': return { label: i18n.language === 'vi' ? 'Kim Cương' : 'Diamond', className: 'bg-blue-600 text-white', show: true };
            default: return { show: false };
        }
    };

    const rankConfig = getRankConfig(targetRank);

    const handleClick = (e) => {
        if (isClickable) {
            e.preventDefault();
            e.stopPropagation();
            onClick(promo);
        }
    };

    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleSave) onToggleSave(promo.id);
    };

    return (
        <div className="group relative h-full">
            <Card className="p-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out h-full border border-gray-100 flex flex-col relative rounded-2xl bg-white">
                <div className="w-full h-40 sm:h-48 overflow-hidden relative cursor-pointer shrink-0" onClick={handleClick}>
                    <img src={bgImage} alt={promo.code} onError={(e) => {e.target.src = placeholderImg}} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-60 transition-opacity group-hover:opacity-50" />
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                        {isHot && (
                            <div className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-pulse">
                                <Flame size={12} fill="currentColor" /> HOT
                            </div>
                        )}
                        {rankConfig.show && (
                            <div className={`${rankConfig.className} text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1`}>
                                <Crown size={12} fill="currentColor" /> {rankConfig.label}
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-3 left-3 z-10">
                        <div className="bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/50">
                            <TicketPercent size={14} strokeWidth={2} /> {promo.code}
                        </div>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow bg-white relative z-10">
                    <div className="mb-2">
                        <div className="flex justify-between items-start gap-2 min-h-[28px]">
                            <h3 className="font-bold text-gray-900 text-base line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors flex-1" onClick={handleClick}>
                                {promo.name || promo.title || (i18n.language === 'vi' ? "Chương trình khuyến mãi" : "Promotion Program")}
                            </h3>
                            <button onClick={handleSaveClick} className={`flex-shrink-0 -mt-1 p-1.5 rounded-full transition-all duration-300 ${isSaved ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"}`}>
                                <Bookmark size={20} strokeWidth={2} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-snug min-h-[40px]">
                            {promo.discountDetail || promo.description}
                        </p>
                    </div>

                    <div className="mt-auto">
                        {limit > 0 && (
                            <div className="mb-3">
                                <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1.5 px-0.5">
                                    <span>{i18n.language === 'vi' ? `Đã dùng: ${used}` : `Used: ${used}`}</span>
                                    <span>{Math.round(usagePercent)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative">
                                    <div className={`h-full rounded-full transition-all duration-700 ease-out relative ${usagePercent > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`} style={{ width: `${Math.min(usagePercent, 100)}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12 -translate-x-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium bg-gray-100/80 px-2.5 py-1.5 rounded-full">
                                <Clock size={13} className="text-gray-500" />
                                <span>{promo.endDate ? new Date(promo.endDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US') : (i18n.language === 'vi' ? 'Vô thời hạn' : 'Unlimited')}</span>
                            </div>
                            <Button size="sm" className="h-9 px-4 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all rounded-full" onClick={handleClick}>
                                {isClickable ? t('promotions.use_now') : (i18n.language === 'vi' ? 'Chi tiết' : 'Details')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
