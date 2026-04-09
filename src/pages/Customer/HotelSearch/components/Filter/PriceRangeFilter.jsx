import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import DualRangeSlider from "./DualRangeSlider";
import { DollarSign } from "lucide-react";

const PriceRangeFilter = ({ onChange, initialMin = 0, initialMax = 10000000 }) => {
    const [range, setRange] = useState({ min: initialMin, max: initialMax });

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({ minPrice: range.min, maxPrice: range.max });
        }, 600);
        return () => clearTimeout(timer);
    }, [range]);

    const handleQuickPrice = (min, max) => {
        setRange({ min, max });
    };

    return (
        <FilterSection title="Khoảng giá (1 đêm)" icon={DollarSign}>
            <div className="mb-2 px-1">
                <DualRangeSlider 
                    min={0} 
                    max={10000000} 
                    step={100000}
                    value={range} 
                    onChange={(newRange) => setRange(newRange)} 
                />
            </div>

            {/* Đã làm đẹp lại các nút bấm quick price */}
            <div className="flex flex-wrap gap-2 mt-5">
                {[
                    { l: '< 1tr', min: 0, max: 1000000 },
                    { l: '1-3tr', min: 1000000, max: 3000000 },
                    { l: '> 3tr', min: 3000000, max: 10000000 }
                ].map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleQuickPrice(item.min, item.max)}
                        className="flex-1 text-center text-[13px] font-medium px-2 py-1.5 bg-white border border-gray-200 rounded-full hover:border-[rgb(40,169,224)] hover:text-[rgb(40,169,224)] hover:bg-blue-50/50 transition-all active:scale-95"
                    >
                        {item.l}
                    </button>
                ))}
            </div>
        </FilterSection>
    );
};

export default PriceRangeFilter;