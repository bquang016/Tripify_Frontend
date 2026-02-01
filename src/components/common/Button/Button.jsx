// src/components/common/Button/Button.jsx
export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  iconOnly = false, // ✅ 1. Thêm dòng này để lấy iconOnly ra khỏi props
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] disabled:opacity-70 disabled:cursor-not-allowed";
  
  // ✅ 2. Cập nhật logic size: Nếu là iconOnly thì dùng padding đều (p-2) để nút vuông vắn
  const sizes = {
    sm: iconOnly ? "p-2 text-sm" : "px-3 py-1.5 text-sm",
    md: iconOnly ? "p-2.5 text-sm" : "px-4 py-2 text-sm",
    lg: iconOnly ? "p-3 text-base" : "px-5 py-3 text-base",
  };

  const variants = {
    primary: "bg-[rgb(40,169,224)] text-white hover:bg-[rgb(26,140,189)]",
    "primary-outline":
      "border border-[rgb(40,169,224)] text-[rgb(40,169,224)] bg-white hover:bg-[rgb(26,140,189)] hover:text-white hover:border-[rgb(26,140,189)]",
    outline:
      "border border-[rgb(40,169,224)] text-[rgb(40,169,224)] bg-white hover:bg-[rgb(40,169,224,0.08)]",
    ghost:
      "text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224,0.08)]",
    // ✅ Thêm variant 'secondary' để tránh lỗi undefined class khi dùng ở PropertyCard
    secondary: 
      "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent",
  };

  return (
    <button
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant] || variants.ghost} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {isLoading ? (
        <span className="animate-pulse">...</span>
      ) : (
        <>
          {leftIcon && <span className={iconOnly ? "" : "mr-2"}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={iconOnly ? "" : "ml-2"}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
