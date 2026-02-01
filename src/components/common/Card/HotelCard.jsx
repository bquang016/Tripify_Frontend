// src/components/common/Card/HotelCard.jsx
import React from "react";
import { Link } from "react-router-dom"; // Để click vào card
// ✅ Thêm icon Star
import { Eye, MapPin, Star } from "lucide-react";
import Card from "./Card"; // Component Card nền
import Badge from "../Badge/Badge"; // Component Badge

export default function HotelCard({ hotel }) {
  // ✅ Lấy thêm rating và reviews
  const { id, name, location, price, image, rating, reviews } = hotel;

  return (
    // Sử dụng 'group' của Tailwind để kích hoạt hover
    <div className="group relative">
      <Card>
        {/* 1. Phần hình ảnh (Image container) */}
        <div className="relative w-full h-56 overflow-hidden rounded-xl mb-4">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* 2. Lớp Overlay */}
          <Link 
            to={`/hotels/${id}`} 
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2 text-white font-semibold border-2 border-white rounded-full px-4 py-2 transform scale-90 group-hover:scale-100 transition-transform">
              <Eye size={18} />
              <span>Xem ngay</span>
            </div>
          </Link>
        </div>

        {/* 3. Phần nội dung (Content) */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-gray-800 truncate" title={name}>
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={16} />
            <span className="truncate">{location}</span>
          </div>
          
          {/* ✅ (Yêu cầu 1) Thêm hiển thị Rating/Reviews */}
          {rating && (
            <div className="flex items-center gap-2 text-sm mt-1">
              <Badge 
                color="primary" 
                icon={<Star size={12} className="fill-current" />}
              >
                {rating}
              </Badge>
              <span className="text-gray-500">({reviews.toLocaleString('vi-VN')} đánh giá)</span>
            </div>
          )}

          <div className="mt-2">
            <Badge color="primary" icon={false}>
              {price}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}