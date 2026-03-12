import React, { useState, useEffect } from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { Search, RotateCcw, MapPin, Star } from "lucide-react";
import MapEntryPoint from "@/pages/Customer/Explore/components/MapEntryPoint";
import { useTranslation } from "react-i18next";

// Import các components con
import FilterSection from "./components/Filter/FilterSection";
import CheckboxOption from "./components/Filter/CheckboxOption";
import PriceRangeFilter from "./components/Filter/PriceRangeFilter";

export default function FilterSidebar({ onFilterChange }) {
    const { t, i18n } = useTranslation();
    
    // --- STATE ---
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [resetTrigger, setResetTrigger] = useState(0);

    useEffect(() => {
        onFilterChange({ 
            cities: selectedCities.length > 0 ? selectedCities : null, 
            ratings: selectedRatings.length > 0 ? selectedRatings : null
        });
    }, [selectedCities, selectedRatings]);

    // --- HANDLERS ---
    const handlePriceChange = ({ minPrice, maxPrice }) => {
        onFilterChange({ minPrice, maxPrice });
    };

    const handleCityToggle = (city) => {
        setSelectedCities(prev => {
            if (prev.includes(city)) return prev.filter(c => c !== city); 
            return [...prev, city]; 
        });
    };

    const handleRatingToggle = (star) => {
        setSelectedRatings(prev => {
            if (prev.includes(star)) return prev.filter(s => s !== star);
            return [...prev, star];
        });
    };

    const handleReset = () => {
        setSelectedCities([]);
        setSelectedRatings([]);
        setResetTrigger(prev => prev + 1); 
        onFilterChange({ minPrice: null, maxPrice: null, cities: null, ratings: null });
    };

    const CITIES = [
        'Thành phố Hà Nội', 
        'Thành phố Hồ Chí Minh', 
        'Thành phố Đà Nẵng', 
        'Tỉnh Quảng Ninh', 
        'Tỉnh Lào Cai',
        'Tỉnh Lâm Đồng' 
    ];

    return (
        <div className="space-y-5 animate-fade-in-up">
            
            <MapEntryPoint />

            <Card className="p-0 overflow-hidden shadow-sm border border-gray-200 rounded-xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-1.5 rounded-lg text-[rgb(40,169,224)]">
                            <Search size={16} />
                        </div>
                        <h2 className="text-base font-bold text-gray-900">{t('hotels.filters')}</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 px-2 transition-colors"
                        leftIcon={<RotateCcw size={14} />}
                    >
                        {i18n.language === 'vi' ? 'Đặt lại' : 'Reset'}
                    </Button>
                </div>

                <div className="p-5 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar bg-white">
                    
                    {/* MODULE 1: LỌC GIÁ */}
                    <PriceRangeFilter 
                        key={resetTrigger} 
                        onChange={handlePriceChange} 
                    />

                    {/* MODULE 2: ĐỊA ĐIỂM */}
                    <FilterSection title={t('search.popular_destinations')} icon={MapPin}>
                        {CITIES.map(city => (
                            <CheckboxOption 
                                key={city} 
                                label={city.replace("Thành phố ", "").replace("Tỉnh ", "")} 
                                checked={selectedCities.includes(city)}
                                onChange={() => handleCityToggle(city)}
                            />
                        ))}
                    </FilterSection>

                    {/* MODULE 3: HẠNG SAO */}
                    <FilterSection title={t('hotels.star_rating')} icon={Star}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <CheckboxOption 
                                key={star} 
                                label={
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">{star}</span>
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                }
                                checked={selectedRatings.includes(star)}
                                onChange={() => handleRatingToggle(star)}
                            />
                        ))}
                    </FilterSection>

                </div>
            </Card>
        </div>
    );
}
