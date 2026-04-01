import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import promotionService from "@/services/promotion.service";
import PromotionList from "./components/PromotionList";
import PromotionDetailModal from "./components/PromotionDetailModal";
import PromotionFilter from "./components/PromotionFilter";
import AutoScrollBanner from "./components/AutoScrollBanner";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import { ChevronLeft, ChevronRight, Crown, Sparkles, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";

const R2_PUBLIC_BASE_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${R2_PUBLIC_BASE_URL}/${cleanPath}`;
};

const PromotionPage = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [savedIds, setSavedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const tabs = [
        { id: 'all', name: i18n.language === 'vi' ? 'Tất cả ưu đãi' : 'All Offers' },
        { id: 'exclusive', name: i18n.language === 'vi' ? 'Khuyến mãi độc quyền' : 'Exclusive Deals' },
        { id: 'saved', name: i18n.language === 'vi' ? 'Kho ưu đãi của tôi' : 'My Saved Offers' }
    ];

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await promotionService.getAllPromotions();
                const rawData = Array.isArray(response) ? response : (response.data || response.result || []);
                const now = new Date();
                const activePromotions = rawData.filter(p => {
                    const endDate = p.endDate ? new Date(p.endDate) : new Date();
                    return p.status === "ACTIVE" && endDate > now;
                });

                activePromotions.sort((a, b) => b.promotionId - a.promotionId);

                const mappedPromotions = activePromotions.map(p => {
                    const cleanDiscountValue = Number(p.discountValue || 0);
                    const cleanMinOrder = Number(p.minBookingAmount || 0);
                    const propertyInfo = p.property;
                    const isOwnerPromotion = !!(propertyInfo && propertyInfo.propertyId);

                    return {
                        id: p.promotionId,
                        isExclusive: isOwnerPromotion,
                        hotelName: isOwnerPromotion ? propertyInfo.propertyName : null,
                        title: p.description,
                        image: getFullImageUrl(p.bannerUrl),
                        code: p.code,
                        endDate: p.endDate,
                        startDate: p.startDate,
                        minBookingAmount: cleanMinOrder,
                        maxDiscountAmount: Number(p.maxDiscountAmount || 0),
                        discountType: p.discountType,
                        discountValue: cleanDiscountValue,
                        used: p.usageCount || 0,
                        quantity: p.usageLimit || 100,
                        targetRank: p.minMembershipRank || p.targetRank || null
                    };
                });

                setPromotions(mappedPromotions);

                if (location.state?.targetPromoId) {
                    const foundPromo = mappedPromotions.find(p => p.id === location.state.targetPromoId);
                    if (foundPromo) {
                        setSelectedPromo(foundPromo);
                        setIsModalOpen(true);
                        window.history.replaceState({}, document.title);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch promotions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, [location.state, i18n.language]);

    const sourcePromotions = useMemo(() => {
        if (activeTab === 'saved') return promotions.filter(p => savedIds.includes(p.id));
        if (activeTab === 'exclusive') return promotions.filter(p => p.isExclusive);
        return promotions;
    }, [activeTab, promotions, savedIds]);

    const filteredPromotions = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return sourcePromotions.filter(promo => 
            promo.title?.toLowerCase().includes(term) ||
            promo.code?.toLowerCase().includes(term) ||
            (promo.hotelName && promo.hotelName.toLowerCase().includes(term))
        );
    }, [sourcePromotions, searchTerm]);

    useEffect(() => {
        const saved = localStorage.getItem('savedPromotions');
        if (saved) setSavedIds(JSON.parse(saved));
    }, []);

    const handleToggleSave = (id) => {
        setSavedIds(prev => {
            const newSaved = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            localStorage.setItem('savedPromotions', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab]);

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPromotions.slice(start, start + itemsPerPage);
    }, [filteredPromotions, currentPage]);

    const getPaginationGroup = () => {
        const range = []; const delta = 1;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
        }
        return range;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(26,140,189)] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Gift className="w-8 h-8" /> {t('promotions.title')}
                        </h1>
                        <p className="mt-2 text-blue-100 max-w-2xl">{t('promotions.subtitle')}</p>
                    </div>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>

                {!loading && activeTab === 'all' && promotions.length > 0 && (
                    <AutoScrollBanner promotions={promotions} onBannerClick={(p) => { setSelectedPromo(p); setIsModalOpen(true); }} />
                )}

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                    <div className="mb-6">
                        <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    <PromotionFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} totalCount={filteredPromotions.length} />

                    <div className="flex-1 mt-6">
                        {activeTab === 'exclusive' && filteredPromotions.length > 0 && (
                            <div className="mb-6 flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <div className="bg-yellow-100 p-2 rounded-full shadow-sm"><Crown className="w-6 h-6 text-yellow-600 fill-yellow-600" /></div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">{i18n.language === 'vi' ? 'Bộ Sưu Tập Độc Quyền' : 'Exclusive Collection'} <Sparkles size={16} className="text-yellow-500 animate-pulse"/></h2>
                                    <p className="text-sm text-gray-600">{i18n.language === 'vi' ? 'Những ưu đãi đặc biệt từ các khách sạn đối tác của Tripify.' : 'Special offers from Tripify partner hotels.'}</p>
                                </div>
                            </div>
                        )}

                        <PromotionList
                            promotions={paginatedData}
                            loading={loading}
                            onViewDetail={(p) => { setSelectedPromo(p); setIsModalOpen(true); }}
                            savedIds={savedIds}
                            onToggleSave={handleToggleSave}
                            // Thêm prop để PromotionList biết đang ở tab nào để hiển thị câu dịch chuẩn
                            activeTab={activeTab}
                        />
                    </div>

                    {filteredPromotions.length > 0 && !loading && totalPages > 1 && (
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-sm text-gray-500">{i18n.language === 'vi' ? `Hiển thị ${paginatedData.length} / ${filteredPromotions.length} kết quả` : `Showing ${paginatedData.length} / ${filteredPromotions.length} results`}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={18} /></button>
                                    <div className="flex gap-1">{getPaginationGroup().map(item => (<button key={item} onClick={() => setCurrentPage(item)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${item === currentPage ? 'bg-[rgb(40,169,224)] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{item}</button>))}</div>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <PromotionDetailModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedPromo(null); }} promo={selectedPromo} savedIds={savedIds} onToggleSave={handleToggleSave} />
        </div>
    );
};

export default PromotionPage;
