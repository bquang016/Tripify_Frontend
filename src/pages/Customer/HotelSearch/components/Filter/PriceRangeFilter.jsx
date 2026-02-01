import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import DualRangeSlider from "./DualRangeSlider";
import { DollarSign } from "lucide-react";

const PriceRangeFilter = ({ onChange, initialMin = 0, initialMax = 10000000 }) => {
    const [range, setRange] = useState({ min: initialMin, max: initialMax });

    // Debounce: Chỉ gọi onChange lên cha khi người dùng dừng thao tác 600ms
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({ minPrice: range.min, maxPrice: range.max });
        }, 600);
        return () => clearTimeout(timer);
    }, [range]); // Bỏ dependency onChange để tránh loop nếu cha ko dùng useCallback

    const handleQuickPrice = (min, max) => {
        setRange({ min, max });
    };

    return (
        <FilterSection title="Khoảng giá (1 đêm)" icon={DollarSign}>
            <div className="mb-2">
                <DualRangeSlider 
                    min={0} 
                    max={10000000} 
                    step={100000}
                    value={range} // Truyền value xuống để slider cập nhật khi bấm nút nhanh
                    onChange={(newRange) => setRange(newRange)} 
                />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {[
                    { l: '< 1tr', min: 0, max: 1000000 },
                    { l: '1-3tr', min: 1000000, max: 3000000 },
                    { l: '> 3tr', min: 3000000, max: 10000000 }
                ].map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleQuickPrice(item.min, item.max)}
                        className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded hover:border-[rgb(40,169,224)] hover:text-[rgb(40,169,224)] transition-all"
                    >
                        {item.l}
                    </button>
                ))}
            </div>
        </FilterSection>
    );
};

export default PriceRangeFilter;