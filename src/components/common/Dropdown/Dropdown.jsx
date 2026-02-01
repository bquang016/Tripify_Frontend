// src/components/common/Dropdown/Dropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  label = "Menu",
  items = [], // [{label, icon, onClick, disabled, danger}]
  placement = "bottom-start", // 'bottom-start' | 'bottom-end'
  buttonClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        !btnRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    const onKey = (e) => {
      if (!open) return;
      const enabledItems = items.filter((i) => !i.disabled);
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % enabledItems.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + enabledItems.length) % enabledItems.length);
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        enabledItems[activeIndex]?.onClick?.();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, items, activeIndex]);

  const align =
    placement === "bottom-end"
      ? "right-0"
      : "left-0";

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] ${buttonClassName}`}
      >
        {label}
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""} text-gray-400`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${align} z-50 mt-2 min-w-[180px] rounded-xl border border-gray-200 bg-white p-1 shadow-lg`}
          >
            {items.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-400">Không có mục</div>
            )}
            {items.map((item, idx) => {
              const disabled = !!item.disabled;
              const danger = !!item.danger;
              const isActive = idx === activeIndex && !disabled;
              return (
                <button
                  key={idx}
                  disabled={disabled}
                  onMouseEnter={() => !disabled && setActiveIndex(idx)}
                  onClick={() => {
                    if (disabled) return;
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors
                    ${disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-[rgb(40,169,224,0.08)]"}
                    ${danger && !disabled ? "text-red-600 hover:bg-red-50" : ""}
                    ${isActive ? "bg-[rgb(40,169,224,0.08)]" : ""}`}
                >
                  {item.icon && <span className="text-gray-400">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
