// src/components/ai/Recommendations/RecommendationCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../../common/Card/Card";
import Badge from "../../common/Badge/Badge";
import { MapPin, Star } from "lucide-react";

// Component này nhận 'rec' (một gợi ý) làm prop
export default function RecommendationCard({ rec }) {
  
  return (
    // Sử dụng 'group' của Tailwind để kích hoạt hover
    <div className="group relative h-full">
      {/* Sử dụng Card làm nền.
        Chúng ta cũng thêm h-full để đồng bộ chiều cao như đã làm ở PromotionBanner.
      */}
      <Link to={`/hotels/${rec.id}`} className="block h-full">
        <Card className="p-5 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
          
          {/* 1. Nội dung (Tên KS, Địa điểm) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 truncate" title={rec.name}>
              {rec.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPin size={16} />
              <span className="truncate">{rec.city}</span>
            </div>
          </div>
          
          {/* 2. Badge điểm số */}
          <div className="mt-3">
            <Badge color="primary" icon={<Star size={14} />}>
              {rec.score} / 10
            </Badge>
          </div>

        </Card>
      </Link>
    </div>
  );
}