import React, { useState, useEffect, useRef } from "react";

const DualRangeSlider = ({ min, max, step, onChange, value }) => {
    // Sử dụng prop 'value' truyền từ ngoài vào để đồng bộ (controlled component)
    const [minVal, setMinVal] = useState(value?.min || min);
    const [maxVal, setMaxVal] = useState(value?.max || max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Cập nhật state nội bộ khi props value thay đổi (ví dụ khi reset hoặc bấm nút nhanh)
    useEffect(() => {
        if (value) {
            setMinVal(value.min);
            setMaxVal(value.max);
            minValRef.current = value.min;
            maxValRef.current = value.max;
        }
    }, [value]);

    const getPercent = (v) => Math.round(((v - min) / (max - min)) * 100);

    // Xử lý kéo
    const handleMinChange = (event) => {
        const val = Math.min(Number(event.target.value), maxVal - step);
        setMinVal(val);
        minValRef.current = val;
        onChange({ min: val, max: maxVal }); // Gọi callback ngay khi kéo
    };

    const handleMaxChange = (event) => {
        const val = Math.max(Number(event.target.value), minVal + step);
        setMaxVal(val);
        maxValRef.current = val;
        onChange({ min: minVal, max: val }); // Gọi callback ngay khi kéo
    };

    // Update UI thanh màu xanh
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

    return (
        <div className="relative w-full pb-8 pt-4">
            <input type="range" min={min} max={max} step={step} value={minVal} onChange={handleMinChange}
                className="thumb thumb--left z-[3]" style={{ zIndex: minVal > max - 100 && "5" }} />
            <input type="range" min={min} max={max} step={step} value={maxVal} onChange={handleMaxChange}
                className="thumb thumb--right z-[4]" />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold text-gray-700 min-w-[80px] text-center">
                    {minVal.toLocaleString()}đ
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold text-gray-700 min-w-[80px] text-center">
                    {maxVal.toLocaleString()}đ
                </div>
            </div>

            <style>{`
                .slider { position: relative; width: 100%; height: 6px; border-radius: 3px; }
                .slider__track { background-color: #e5e7eb; width: 100%; height: 100%; position: absolute; border-radius: 3px; z-index: 1; }
                .slider__range { background-color: rgb(40, 169, 224); height: 100%; position: absolute; border-radius: 3px; z-index: 2; }
                .thumb { -webkit-appearance: none; pointer-events: none; position: absolute; height: 0; width: 100%; outline: none; top: 18px; }
                .thumb::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: all; width: 20px; height: 20px; border-radius: 50%; background-color: white; border: 2px solid rgb(40, 169, 224); cursor: grab; margin-top: -8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); position: relative; z-index: 10; }
                .thumb::-moz-range-thumb { pointer-events: all; width: 20px; height: 20px; border-radius: 50%; background-color: white; border: 2px solid rgb(40, 169, 224); cursor: grab; box-shadow: 0 2px 5px rgba(0,0,0,0.2); position: relative; z-index: 10; }
            `}</style>
        </div>
    );
};

export default DualRangeSlider;