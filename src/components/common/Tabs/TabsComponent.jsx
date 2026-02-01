import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TabsComponent({ tabs, activeTab, onTabChange }) {
  const tabsRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Kiểm tra overflow
  const checkScrollButtons = () => {
    const el = tabsRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const sLeft = el.scrollLeft;

    setShowLeft(sLeft > 5);
    setShowRight(sLeft < maxScroll - 5);
  };

  // Tự động scroll tab active vào giữa
  useLayoutEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const activeNode = el.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeNode) {
      activeNode.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    setTimeout(checkScrollButtons, 300);
  }, [activeTab]);

  // Theo dõi resize & scroll
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollButtons);
    const ro = new ResizeObserver(checkScrollButtons);
    ro.observe(el);

    checkScrollButtons();

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkScrollButtons);
    };
  }, []);

  // Scroll bằng button
  const scrollByDir = (dir) => {
    const el = tabsRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.6 * (dir === "left" ? -1 : 1);

    el.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScrollButtons, 300);
  };

  return (
    <div className="relative w-full">
      {/* Scroll Left */}
      <ScrollBtn visible={showLeft} dir="left" onClick={() => scrollByDir("left")} />

      {/* Tabs container */}
      <div
        ref={tabsRef}
        className="
          overflow-x-auto 
          whitespace-nowrap
          border-b border-gray-200
          scrollbar-width-none
          -ms-overflow-style-none
          [&::-webkit-scrollbar]:hidden
        "
      >
        <nav className="relative flex px-2">
          {tabs.map((t) => (
            <TabBtn key={t.id} tab={t} active={activeTab} onTabChange={onTabChange} />
          ))}
        </nav>
      </div>

      {/* Scroll Right */}
      <ScrollBtn visible={showRight} dir="right" onClick={() => scrollByDir("right")} />
    </div>
  );
}

const TabBtn = ({ tab, active, onTabChange }) => (
  <div
    data-tab-id={tab.id}
    onClick={() => onTabChange(tab.id)}
    className={`
      px-4 py-2 cursor-pointer text-sm font-medium relative
      transition-colors duration-200 flex-shrink-0 select-none
      ${active === tab.id ? "text-[rgb(40,169,224)]" : "text-gray-500"}
    `}
  >
    {tab.name}

    {active === tab.id && (
      <motion.div
        layoutId="tabIndicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(40,169,224)]"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
  </div>
);

const ScrollBtn = ({ visible, dir, onClick }) => (
  <button
    onClick={onClick}
    className={`
      absolute top-0 bottom-0 w-10 z-20 flex items-center justify-center
      transition-opacity duration-200
      ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      ${dir === "left"
        ? "left-0 bg-gradient-to-r from-white to-transparent"
        : "right-0 bg-gradient-to-l from-white to-transparent"}
    `}
  >
    {dir === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
  </button>
);
