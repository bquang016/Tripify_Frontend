import React, { useState, useEffect, useRef } from "react";

const DualRangeSlider = ({ min, max, step, onChange, value }) => {
    const [minVal, setMinVal] = useState(value?.min || min);
    const [maxVal, setMaxVal] = useState(value?.max || max);
    const minValRef = useRef(value?.min || min);
    const maxValRef = useRef(value?.max || max);
    const range = useRef(null);

    useEffect(() => {
        if (value) {
            setMinVal(value.min);
            setMaxVal(value.max);
            minValRef.current = value.min;
            maxValRef.current = value.max;
        }
    }, [value]);

    const getPercent = (v) => Math.round(((v - min) / (max - min)) * 100);

    const handleMinChange = (event) => {
        const val = Math.min(Number(event.target.value), maxVal - step);
        setMinVal(val);
        minValRef.current = val;
        onChange({ min: val, max: maxVal });
    };

    const handleMaxChange = (event) => {
        const val = Math.max(Number(event.target.value), minVal + step);
        setMaxVal(val);
        maxValRef.current = val;
        onChange({ min: minVal, max: val });
    };

    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);
        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, min, max]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);
        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, min, max]);

    // Format tiền VNĐ
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <div className="relative w-full pb-6 pt-4">
            <input 
                type="range" min={min} max={max} step={step} value={minVal} onChange={handleMinChange}
                className="thumb thumb--left" 
                style={{ zIndex: minVal > max - 100 ? "5" : "3" }} 
            />
            <input 
                type="range" min={min} max={max} step={step} value={maxVal} onChange={handleMaxChange}
                className="thumb thumb--right z-[4]" 
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
            </div>

            <div className="mt-6 flex justify-between items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 text-center shadow-sm">
                    {formatPrice(minVal)}
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 text-center shadow-sm">
                    {formatPrice(maxVal)}
                </div>
            </div>

            <style>{`
                .slider { position: relative; width: 100%; height: 6px; border-radius: 999px; margin-top: 10px; }
                .slider__track { background-color: #e5e7eb; width: 100%; height: 100%; position: absolute; border-radius: 999px; z-index: 1; }
                .slider__range { background-color: rgb(40, 169, 224); height: 100%; position: absolute; border-radius: 999px; z-index: 2; }
                .thumb { -webkit-appearance: none; pointer-events: none; position: absolute; height: 0; width: 100%; outline: none; top: 10px; }
                
                /* Styling the thumb for modern look */
                .thumb::-webkit-slider-thumb { 
                    -webkit-appearance: none; 
                    pointer-events: all; 
                    width: 24px; 
                    height: 24px; 
                    border-radius: 50%; 
                    background-color: white; 
                    border: 3px solid rgb(40, 169, 224); 
                    cursor: pointer; 
                    margin-top: -9px; 
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3); 
                    position: relative; 
                    z-index: 10; 
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }
                .thumb::-moz-range-thumb { 
                    pointer-events: all; 
                    width: 20px; 
                    height: 20px; 
                    border-radius: 50%; 
                    background-color: white; 
                    border: 3px solid rgb(40, 169, 224); 
                    cursor: pointer; 
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3); 
                    position: relative; 
                    z-index: 10; 
                }
                
                /* Hover & Active states */
                .thumb::-webkit-slider-thumb:hover { transform: scale(1.1); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
                .thumb::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); box-shadow: 0 2px 8px rgba(40, 169, 224, 0.4); }
            `}</style>
        </div>
    );
};

export default DualRangeSlider;