// src/components/common/Card/PromotionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { Tag } from "lucide-react"; 

export default function PromotionCard({ promo }) {
  
  return (
    // ✅ 1. Thêm 'h-full' để thẻ group co giãn theo ô lưới
    <div className="group relative h-full">
      {/* ✅ 2. Thêm 'h-full' để Card co giãn theo thẻ group
      */}
      <Card className="p-0 overflow-hidden group hover:shadow-lg transition-shadow h-full">
        {/* ✅ 3. Thêm 'h-full' vào flex container chính
        */}
        <div className="flex flex-col sm:flex-row h-full">
          
          {/* 1. Hình ảnh (Image) */}
          <div className="sm:w-2/5 h-40 sm:h-auto overflow-hidden">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* 2. Nội dung (Content) */}
          {/* Container này (flex-col justify-between) giờ sẽ tự động co giãn 100%
            và đẩy nút bấm xuống dưới cùng.
          */}
          <div className="sm:w-3/5 p-4 flex flex-col justify-between">
            {/* Text */}
            <div>
              <h3 
                className="font-semibold text-gray-800 text-md"
                title={promo.title}
              >
                {promo.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {promo.description}
              </p>
            </div>
            
            {/* 3. Nút */}
            <Link to={`/promotions/${promo.id}`} className="mt-3 block">
              <Button 
                size="sm" 
                variant="outline"
                leftIcon={<Tag size={16} />}
                className="w-full sm:w-auto" 
              >
                {promo.buttonText || "Xem ngay"}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}