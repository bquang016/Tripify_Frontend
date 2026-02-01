import React from "react";

const HotelStickyNav = ({ activeSection, onReviewClick }) => {
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { id: "overview", label: "Tổng quan" },
    { id: "rooms", label: "Phòng nghỉ" },
    { id: "policies", label: "Chính sách" },
    { id: "reviews", label: "Đánh giá" },
  ];

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "reviews" && onReviewClick) {
                    onReviewClick();
                  } else {
                    scrollToSection(item.id);
                  }
                }}
                className={`
                  relative py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap outline-none
                  ${
                    isActive
                      ? "font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }
                `}
                style={{
                  color: isActive ? "rgb(40 169 224)" : undefined,
                }}
              >
                {item.label}

                <span
                  className={`
                    absolute bottom-0 left-0 w-full h-[3px] rounded-t-full 
                    transition-transform duration-300 origin-left
                    ${isActive ? "scale-x-100" : "scale-x-0"}
                  `}
                  style={{ backgroundColor: "rgb(40 169 224)" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotelStickyNav;
