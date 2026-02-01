import React from 'react';
import { PackageOpen } from 'lucide-react'; // Icon mặc định nếu ảnh lỗi hoặc không có

export default function EmptyState({ 
  title = "Không có dữ liệu", 
  description = "Hiện tại chưa có dữ liệu nào để hiển thị.", 
  imageSrc = "/assets/images/empty.png", // Ảnh mặc định của dự án bạn
  icon,     // Cho phép truyền icon Lucide thay thế ảnh
  action,   // Component nút bấm (Button) để thực hiện hành động
  className = "" 
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 ${className}`}>
      
      {/* Khu vực Hình ảnh / Icon */}
      <div className="relative mb-6 group">
        {/* Hiệu ứng nền mờ phía sau */}
        <div className="absolute inset-0 bg-blue-100 rounded-full opacity-40 blur-2xl transform scale-125 group-hover:scale-150 transition-transform duration-500"></div>
        
        {icon ? (
          <div className="relative bg-white p-5 rounded-full shadow-sm text-gray-400">
            {icon}
          </div>
        ) : (
          <img 
            src={imageSrc} 
            alt="empty" 
            className="relative w-48 h-auto object-contain opacity-90 drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1" 
            onError={(e) => {
              // Fallback: Nếu ảnh không tải được, ẩn ảnh đi và hiện icon
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        )}
        
        {/* Fallback Icon (ẩn mặc định, chỉ hiện khi ảnh lỗi) */}
        <div className="hidden bg-white p-6 rounded-full shadow-sm">
            <PackageOpen size={48} className="text-gray-300" strokeWidth={1.5} />
        </div>
      </div>

      {/* Tiêu đề & Mô tả */}
      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-gray-500 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Khu vực nút hành động (nếu có) */}
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
}