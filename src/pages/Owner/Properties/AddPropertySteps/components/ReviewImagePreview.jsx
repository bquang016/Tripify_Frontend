// src/pages/Owner/Properties/AddPropertySteps/components/ReviewImagePreview.jsx
import React, { useState, useEffect } from "react";

/**
 * Hiển thị 1 ảnh xem trước (read-only) từ một đối tượng File.
 * @param {File} file - Đối tượng File (từ FileList)
 */
export default function ReviewImagePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Tạo URL tạm thời (blob:) để xem trước
  useEffect(() => {
    // Kiểm tra file có phải là file ảnh hợp lệ không
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Thu hồi URL khi component bị hủy để tránh rò rỉ bộ nhớ
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!previewUrl) {
    return (
      <div className="aspect-square w-full rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs text-center p-1">
        Lỗi ảnh
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-sm">
      <img
        src={previewUrl}
        alt={file.name}
        className="h-full w-full object-cover"
        title={file.name}
      />
    </div>
  );
}