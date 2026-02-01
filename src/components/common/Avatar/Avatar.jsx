import React, { useState, useEffect } from "react";

const Avatar = ({ name, src, size = 64, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  // Lấy ký tự đầu để hiển thị nếu không có ảnh hoặc ảnh lỗi
  const initials = name ? name.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    setHasError(false); // reset khi src đổi
  }, [src]);

  return (
      <div
          className={`flex items-center justify-center rounded-full bg-[rgb(40,169,224)] text-white font-semibold overflow-hidden select-none ${className}`}
          style={{ width: size, height: size }}
      >
        {/* Có ảnh thì hiển thị ảnh */}
        {src && !hasError ? (
            <img
                src={src}
                alt={name || "User Avatar"}
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
                loading="lazy"
            />
        ) : (
            /* Không có ảnh thì tạo avatar chữ */
            <span style={{ fontSize: size * 0.4 }}>{initials}</span>
        )}
      </div>
  );
};

export default Avatar;
