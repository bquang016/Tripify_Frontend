import React from "react";
import { Camera, Loader2 } from "lucide-react";
import Avatar from "../Avatar/Avatar"; 

export default function AvatarUpload({
  src,
  name,
  size = 100,
  onClick, // Thay onUpload bằng onClick (để mở modal)
  isLoading = false
}) {
  return (
    <div className="relative inline-block group">
      {/* 1. Hiển thị Avatar gốc */}
      <div className={`rounded-full overflow-hidden border-4 border-white shadow-sm ${isLoading ? 'opacity-50' : ''}`}>
        <Avatar src={src} name={name} size={size} className="text-2xl" />
      </div>

      {/* 2. Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Loader2 className="animate-spin text-[rgb(40,169,224)]" size={size / 3} />
        </div>
      )}

      {/* 3. Overlay khi Hover (Nút bấm mở Modal) */}
      {!isLoading && (
        <div
          onClick={onClick} // Gọi hàm mở modal
          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white 
                     rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <Camera size={size / 3} />
        </div>
      )}

      {/* 4. Icon Camera nhỏ ở góc */}
      <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 pointer-events-none group-hover:hidden">
        <Camera size={14} className="text-gray-600" />
      </div>
    </div>
  );
}