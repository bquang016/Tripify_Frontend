import React from 'react';
import Card from "@/components/common/Card/Card";
import { useLocation } from 'react-router-dom';

// Đây là component giữ chỗ cho các trang Owner chưa được tạo
export default function PlaceholderPage({ title = "Chức năng" }) {
  const location = useLocation();
  
  // Tự động lấy title từ path nếu không được truyền vào
  const autoTitle = location.pathname.split('/').pop().replace('-', ' ');
  const finalTitle = title === "Chức năng" ? autoTitle : title;

  return (
    <Card>
      <div className="p-6">
        <h1 className="text-2xl font-bold capitalize text-[rgb(40,169,224)]">{finalTitle}</h1>
        <p className="mt-4 text-gray-600">
          Đây là trang giữ chỗ (placeholder) cho chức năng: <strong className="capitalize">{finalTitle}</strong>.
          <br />
          Nội dung thực tế sẽ được phát triển sau.
        </p>
        <code className="block w-full bg-gray-100 text-gray-700 p-3 rounded-md mt-4 text-sm">
          Đường dẫn: {location.pathname}
        </code>
      </div>
    </Card>
  );
}