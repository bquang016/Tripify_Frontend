import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "@/components/common/Modal/ModalPortal"; // Sử dụng Portal

// (Hàm useDropdownPosition giữ nguyên)
const useDropdownPosition = (buttonRef, isOpen) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setStyle({
                top: `${rect.bottom + 4}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
            });
        }
    }, [isOpen, buttonRef]);

    return style;
};

export default function CancelReasonSelect({
                                               label,
                                               options = [],
                                               value, // value là label (ví dụ: "Khác")
                                               onChange, // onChange trả về label
                                           }) {
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const buttonRef = useRef(null);
    const dropdownStyle = useDropdownPosition(buttonRef, open);

    // (useEffect đóng khi click ra ngoài giữ nguyên)
    useEffect(() => {
        const onClickOutside = (e) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target)) {
                setOpen(false);
                setFocused(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // Logic floating label (giữ nguyên)
    const isFloating = focused || open || value;

    return (
        <div className="w-full">
            <div className="relative w-full">

                {/* 1. Nút bấm */}
                <button
                    type="button"
                    ref={buttonRef}
                    id={label}
                    onClick={() => {
                        setOpen(!open);
                        setFocused(true);
                    }}
                    onBlur={() => {
                        if (!open) setFocused(false);
                    }}
                    className={`peer w-full h-[58px] text-left rounded-xl border
                        border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]
                        bg-white py-3 pl-4 pr-10 text-gray-800 shadow-sm 
                        focus:ring-2 transition-all duration-200 outline-none
                    `}
                >
                    {/* ✅ SỬA LỖI: Bỏ placeholder "Chọn một mục..."
                        Chỉ hiển thị 'value' (giá trị được chọn).
                        Label sẽ tự động làm placeholder khi 'value' rỗng.
                    */}
                    <span className="text-sm">{value}</span>
                </button>

                {/* 2. Label (floating) - (Giữ nguyên) */}
                <label
                    htmlFor={label}
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        isFloating
                            ? `text-xs -top-2.5 bg-white px-1 text-[rgb(40,169,224)]`
                            : `text-sm top-3.5 text-gray-500` // <-- Trạng thái này sẽ là placeholder
                    }`}
                >
                    {label}
                </label>

                {/* 3. Icon mũi tên (Giữ nguyên) */}
                <ChevronDown
                    size={18}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all pointer-events-none text-gray-400
                    ${open ? "rotate-180 text-[rgb(40,169,224)]" : ""}
                    `}
                />

                {/* 4. Panel Dropdown (Giữ nguyên) */}
                <ModalPortal>
                    <AnimatePresence>
                        {open && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                style={dropdownStyle}
                                className="fixed z-[9999] mt-1 w-full max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                            >
                                {options.map((opt) => (
                                    <li
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.label);
                                            setOpen(false);
                                            setFocused(false);
                                        }}
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${
                                            value === opt.label
                                                ? "bg-[rgb(40,169,224,0.1)] text-[rgb(40,169,224)]"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        {opt.label}
                                        {value === opt.label && <Check size={16} />}
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </ModalPortal>
            </div>
        </div>
    );
}