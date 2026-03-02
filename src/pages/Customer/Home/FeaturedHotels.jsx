import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowRight, MapPin, Star, Heart, 
    Sparkles 
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Components & Services
import Skeleton from "@/components/common/Loading/Skeleton";
import propertyService from "@/services/property.service";
import placeholderImg from "@/assets/images/placeholder.png";
import { formatPrice } from "@/utils/priceUtils";
import { useLanguage } from "@/context/LanguageContext";

// Cấu hình đường dẫn ảnh
const BASE_IMAGE_URL = "http://localhost:8386/images/"; 

// ====================================================================
// 1. SUB-COMPONENT: HEADER
// ====================================================================
const SectionHeader = ({ onSeeAll }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 px-2">
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                    {t('home.featured_title').split(' ').map((word, i) => 
                        i >= 2 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 ml-1">{word} </span> : word + ' '
                    )}
                </h2>
                <p className="text-gray-500 mt-3 font-medium text-base leading-relaxed">
                    {t('home.featured_subtitle')}
                </p>
            </div>

            <button 
                onClick={onSeeAll}
                className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-all bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md group"
            >
                {t('home.see_all')}
                <div className="bg-gray-100 group-hover:bg-blue-100 p-1 rounded-full transition-colors">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </button>
        </div>
    );
};

// ====================================================================
// 2. SUB-COMPONENT: HOTEL CARD
// ====================================================================
const ModernHotelCard = ({ hotel, currentCurrency }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div 
            onClick={() => navigate(`/hotels/${hotel.id}`)}
            className="group relative bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 cursor-pointer h-full flex flex-col"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = placeholderImg; }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {hotel.isPopular && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles size={10} fill="currentColor" /> {t('home.popular')}
                        </span>
                    )}
                </div>
                <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-rose-500 rounded-full transition-all shadow-sm">
                        <Heart size={18} />
                    </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold">{hotel.rating}</span>
                        <span className="text-xs text-gray-200">({hotel.reviews})</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors" title={hotel.name}>
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1.5">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="truncate">{hotel.location}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-200 my-auto"></div>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('home.price_from')}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-blue-600">
                                {hotel.formattedPrice}
                            </span>
                            <span className="text-sm text-gray-400 font-medium">/{t('home.night')}</span>
                        </div>
                    </div>
                    
                    <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// 3. MAIN COMPONENT
// ====================================================================
const FeaturedHotels = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { currency } = useLanguage();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCoverImage = (item) => {
        if (item.coverImage) {
            return item.coverImage.startsWith("http") 
                ? item.coverImage 
                : `${BASE_IMAGE_URL}${item.coverImage}`;
        }

        if (item.images && item.images.length > 0) {
            const firstImg = item.images[0];
            return firstImg.startsWith("http") 
                ? firstImg 
                : `${BASE_IMAGE_URL}${firstImg}`;
        }
        
        return placeholderImg;
    };

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                
                const res = await propertyService.getFeaturedProperties();
                console.log(">>> [DEBUG] Dữ liệu thô từ API Featured:", res);

                let rawData = [];

                if (res && res.result && Array.isArray(res.result.content)) {
                    rawData = res.result.content;
                } 
                else if (res && res.data && Array.isArray(res.data.content)) {
                    rawData = res.data.content;
                } 
                else if (res && Array.isArray(res.content)) {
                    rawData = res.content;
                } 
                else if (Array.isArray(res)) {
                    rawData = res;
                }

                const mapped = rawData.map(item => ({
                    id: item.propertyId,
                    name: item.propertyName,
                    location: item.address || item.city || "Việt Nam",
                    price: item.minPrice || 0,
                    formattedPrice: formatPrice(item.minPrice, item.convertedMinPrice, item.currency || currency),
                    isConverted: !!item.convertedMinPrice,
                    image: getCoverImage(item),
                    rating: item.rating || 5.0,
                    reviews: item.reviewCount || 0,
                    isPopular: (item.rating || 0) >= 4.5
                }));

                setHotels(mapped.slice(0, 4));
            } catch (err) {
                console.error("❌ Lỗi khi tải khách sạn nổi bật:", err);
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [currency]);

    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[1.5rem] overflow-hidden border border-gray-100 bg-white shadow-sm h-[400px]">
                    <Skeleton height="250px" radius="0" />
                    <div className="p-5 space-y-3">
                        <Skeleton height="20px" width="70%" />
                        <Skeleton height="14px" width="40%" />
                        <div className="pt-4 flex justify-between items-center">
                            <Skeleton height="30px" width="30%" />
                            <Skeleton height="40px" width="40px" radius="50%" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className="container mx-auto px-4 pb-20 pt-10 font-sans relative z-20">
            <SectionHeader onSeeAll={() => navigate("/hotels")} />

            {loading ? (
                renderSkeletons()
            ) : hotels.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <p className="text-gray-500">{t('home.updating')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {hotels.map((h) => (
                        <ModernHotelCard key={h.id} hotel={h} currentCurrency={currency} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedHotels;
