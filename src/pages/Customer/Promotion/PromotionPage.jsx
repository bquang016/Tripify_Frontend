import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import promotionService from "@/services/promotion.service";
import PromotionList from "./components/PromotionList";
import PromotionDetailModal from "./components/PromotionDetailModal";
import PromotionFilter from "./components/PromotionFilter";
import AutoScrollBanner from "./components/AutoScrollBanner";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
// Import các icon hiển thị
import { Tag, ChevronLeft, ChevronRight, Crown, Sparkles, Gift } from "lucide-react";

// Config URL ảnh
// ✅ R2 public base URL
const R2_PUBLIC_BASE_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getFullImageUrl = (path) => {
    // fallback khi không có banner
    if (!path) {
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
    }

    // nếu BE trả full URL thì dùng luôn
    if (path.startsWith("http")) return path;

    // BE trả relative path: campaign-images/xxx.webp
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${R2_PUBLIC_BASE_URL}/${cleanPath}`;
};


const PromotionPage = () => {
    const location = useLocation();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- CẤU HÌNH TAB ---
    const [activeTab, setActiveTab] = useState('all');
    const [savedIds, setSavedIds] = useState([]);

    const tabs = [
        { id: 'all', name: 'Tất cả ưu đãi' },
        { id: 'exclusive', name: 'Khuyến mãi độc quyền' }, // Tab này sẽ hiện khuyến mãi của Owner
        { id: 'saved', name: 'Kho ưu đãi của tôi' }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const itemsPerPage = 9;

    // --- TẢI DỮ LIỆU & PHÂN LOẠI ---
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                // Gọi API: /api/v1/promotions/all
                const response = await promotionService.getAllPromotions();

                // Dữ liệu từ API có thể nằm trực tiếp trong response hoặc trong response.data
                const rawData = Array.isArray(response) ? response : (response.data || response.result || []);

                // >>> BƯỚC DEBUG QUAN TRỌNG: Kiểm tra log này trong Console (F12)
                console.log("Raw Promotions Data (Check the 'property' field):", rawData);

                const now = new Date();
                const activePromotions = rawData.filter(p => {
                    const endDate = p.endDate ? new Date(p.endDate) : new Date();
                    // Chỉ lấy trạng thái ACTIVE và chưa hết hạn
                    return p.status === "ACTIVE" && endDate > now;
                });

                // Sắp xếp mới nhất lên đầu
                activePromotions.sort((a, b) => b.promotionId - a.promotionId);

                // Mapping dữ liệu
                const mappedPromotions = activePromotions.map(p => {
                    const cleanDiscountValue = Number(p.discountValue || 0);
                    const cleanMinOrder = Number(p.minBookingAmount || 0);
                    const cleanMaxDiscount = Number(p.maxDiscountAmount || 0);

                    // --- [MẤU CHỐT KẾT NỐI] ---
                    // Kiểm tra sự tồn tại của object property và propertyId bên trong nó (từ PromotionResponseDTO.java)
                    const propertyInfo = p.property;
                    const isOwnerPromotion = !!(propertyInfo && propertyInfo.propertyId);


                    return {
                        id: p.promotionId,

                        // Flag này đánh dấu: "Đây là khuyến mãi độc quyền từ Owner"
                        isExclusive: isOwnerPromotion,

                        // Lấy tên khách sạn (nếu có) để hiển thị
                        hotelName: isOwnerPromotion ? propertyInfo.propertyName : null,

                        title: p.description,
                        description: `Giảm ${p.discountType === 'PERCENTAGE' ? cleanDiscountValue + '%' : cleanDiscountValue.toLocaleString('vi-VN') + 'đ'} cho đơn từ ${cleanMinOrder.toLocaleString('vi-VN')}đ`,
                        image: getFullImageUrl(p.bannerUrl),
                        code: p.code,
                        endDate: p.endDate,
                        startDate: p.startDate,
                        minOrder: cleanMinOrder,
                        minBookingAmount: cleanMinOrder,
                        maxDiscount: cleanMaxDiscount,
                        maxDiscountAmount: cleanMaxDiscount,
                        discountType: p.discountType,
                        discountValue: cleanDiscountValue,
                        used: p.usageCount || 0,
                        quantity: p.usageLimit || 100,
                        targetRank: p.minMembershipRank || p.targetRank || null
                    };
                });

                // LOG để kiểm tra sau khi mapping
                console.log("Mapped Promotions (Check isExclusive):", mappedPromotions);


                setPromotions(mappedPromotions);

                // Tự động mở modal nếu có link từ trang chủ
                if (location.state?.targetPromoId) {
                    const targetId = location.state.targetPromoId;
                    const foundPromo = mappedPromotions.find(p => p.id === targetId);
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
    }, [location.state]);

    // --- LOGIC HIỂN THỊ THEO TAB (Giữ nguyên) ---
    const sourcePromotions = useMemo(() => {
        // 1. Tab Đã lưu
        if (activeTab === 'saved') {
            return promotions.filter(p => savedIds.includes(p.id));
        }

        // 2. Tab Độc quyền -> Lọc ra các item có isExclusive = true (tức là có propertyId)
        if (activeTab === 'exclusive') {
            return promotions.filter(p => p.isExclusive);
        }

        // 3. Tab Tất cả -> Hiện hết
        return promotions;
    }, [activeTab, promotions, savedIds]);

    // Lọc theo từ khóa tìm kiếm (Giữ nguyên)
    const filteredPromotions = useMemo(() => {
        return sourcePromotions.filter(promo => {
            const term = searchTerm.toLowerCase();
            return (
                promo.title?.toLowerCase().includes(term) ||
                promo.code?.toLowerCase().includes(term) ||
                promo.description?.toLowerCase().includes(term) ||
                (promo.hotelName && promo.hotelName.toLowerCase().includes(term))
            );
        });
    }, [sourcePromotions, searchTerm]);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN (Giữ nguyên) ---
    // Load danh sách đã lưu
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

    // Reset trang khi đổi tab/search
    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab]);

    // Phân trang
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPromotions.slice(start, start + itemsPerPage);
    }, [filteredPromotions, currentPage]);

    const getPaginationGroup = () => {
        const delta = 1; const range = []; const rangeWithDots = []; let l;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }
        range.forEach(i => {
            if (l) { if (i - l === 2) rangeWithDots.push(l + 1); else if (i - l !== 1) rangeWithDots.push('...'); }
            rangeWithDots.push(i); l = i;
        });
        return rangeWithDots;
    };

    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(jumpPage);
            if (!isNaN(page) && page >= 1 && page <= totalPages) { setCurrentPage(page); setJumpPage(""); }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Trang */}
                <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(26,140,189)] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Gift className="w-8 h-8" /> Kho Ưu Đãi & Khuyến Mãi
                        </h1>
                        <p className="mt-2 text-blue-100 max-w-2xl">
                            Săn ngay hàng ngàn mã giảm giá độc quyền dành cho khách hàng thân thiết.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>

                {/* Banner (Chỉ hiện khi ở tab All) */}
                {!loading && activeTab === 'all' && promotions.length > 0 && (
                    <div className="w-full">
                        <AutoScrollBanner promotions={promotions} onBannerClick={(p) => { setSelectedPromo(p); setIsModalOpen(true); }} />
                    </div>
                )}

                {/* Nội dung chính */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">

                    {/* Menu Tabs */}
                    <div className="mb-6">
                        <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    <PromotionFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} totalCount={filteredPromotions.length} />

                    <div className="flex-1 mt-6">

                        {/* Giao diện riêng cho Tab Độc Quyền */}
                        {activeTab === 'exclusive' && (
                            <div className="mb-6 flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <div className="bg-yellow-100 p-2 rounded-full shadow-sm">
                                    <Crown className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        Bộ Sưu Tập Độc Quyền <Sparkles size={16} className="text-yellow-500 animate-pulse"/>
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Những ưu đãi đặc biệt từ các khách sạn đối tác của TravelMate.
                                    </p>
                                </div>
                            </div>
                        )}

                        <PromotionList
                            promotions={paginatedData}
                            loading={loading}
                            onViewDetail={(p) => { setSelectedPromo(p); setIsModalOpen(true); }}
                            savedIds={savedIds}
                            onToggleSave={handleToggleSave}
                        />

                        {/* Trạng thái trống */}
                        {!loading && paginatedData.length === 0 && (
                            <div className="text-center py-12 flex flex-col items-center justify-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-3">
                                    {activeTab === 'exclusive' ? <Crown className="w-8 h-8 text-gray-400" /> : <Tag className="w-8 h-8 text-gray-400" />}
                                </div>
                                <p className="text-gray-500 font-medium">
                                    {activeTab === 'exclusive'
                                        ? "Chưa có chương trình khuyến mãi độc quyền nào."
                                        : "Không tìm thấy khuyến mãi nào."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Phân trang */}
                    {filteredPromotions.length > 0 && !loading && (
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Hiển thị <span className="font-semibold text-gray-700">{paginatedData.length}</span> / <span className="font-semibold text-gray-700">{filteredPromotions.length}</span> kết quả
                                </span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={18} /></button>
                                    <div className="flex gap-1">{getPaginationGroup().map((item, index) => (<button key={index} onClick={() => typeof item === 'number' && setCurrentPage(item)} disabled={item === '...'} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${item === currentPage ? 'bg-[rgb(40,169,224)] text-white shadow-sm' : item === '...' ? 'bg-transparent text-gray-400 cursor-default' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{item}</button>))}</div>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Chi tiết */}
            <PromotionDetailModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedPromo(null); }}
                promo={selectedPromo}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
            />
        </div>
    );
};

export default PromotionPage;
