import React from "react";
import PromotionCard from "./PromotionCard";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const PromotionList = ({ promotions, loading, onViewDetail, savedIds = [], onToggleSave }) => {
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (!promotions || promotions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                    {t('promotions.no_promotions', 'No promotions found.')}
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                    {t('promotions.try_again', 'Please try again or change your search filters.')}
                </p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
                <PromotionCard
                    key={promo.id}
                    promo={promo}
                    onClick={onViewDetail}
                    isSaved={savedIds.includes(promo.id)}
                    onToggleSave={onToggleSave}
                />
            ))}
        </div>
    );
};

export default PromotionList;
