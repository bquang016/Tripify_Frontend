import { useState } from "react";

const RatingStars = ({ value = 0, onChange, max = 5 }) => {
  const [hovered, setHovered] = useState(0);

  const handleClick = (star) => {
    if (onChange) onChange(star);
  };

  const handleMouseEnter = (star) => {
    setHovered(star);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hovered || value);

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none"
          >
            {/* vòng glow */}
            <span
              className={`absolute h-8 w-8 rounded-full blur-[1px] transition-opacity ${
                isActive ? "bg-yellow-300/50 opacity-100" : "opacity-0"
              }`}
            />
            {/* icon sao */}
            <span
              className={`relative text-2xl transition-colors ${
                isActive ? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.7)]" : "text-slate-300"
              }`}
            >
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
