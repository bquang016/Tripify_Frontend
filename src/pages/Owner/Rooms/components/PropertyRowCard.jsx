import React from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { MapPin, BedDouble } from "lucide-react";

/**
 * Card nằm ngang, hiển thị tóm tắt 1 cơ sở
 * và 1 nút để xem danh sách phòng của cơ sở đó.
 */
export default function PropertyRowCard({ property, onViewRoomsClick }) {
  const { id, name, location, imageUrl, roomCount } = property;

  return (
    // Dùng Card làm nền, bỏ padding mặc định (p-0)
    <Card className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Sử dụng flex-row cho màn hình desktop (sm:)
        và flex-col cho mobile (mặc định)
      */}
      <div className="flex flex-col sm:flex-row">

        {/* 1. Hình ảnh (bên trái) - chiếm 1/4 */}
        <div className="sm:w-1/4 h-48 sm:h-auto overflow-hidden relative flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* 2. Nội dung & Nút (bên phải) - chiếm 3/4 */}
        <div className="sm:w-3/4 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          {/* Thông tin */}
          <div className="flex-1 mb-4 sm:mb-0">
            <h3 className="font-semibold text-xl text-gray-800 truncate" title={name}>
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPin size={16} />
              <span className="truncate">{location}</span>
            </div>
             <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <BedDouble size={16} />
              {/* Giả sử bạn có thông tin này, nếu không có thể ẩn đi */}
              <span className="truncate">Hiện có {roomCount || 0} phòng</span>
            </div>
          </div>
          
          {/* Nút bấm */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button
              size="md"
              variant="primary-outline"
              onClick={() => onViewRoomsClick(id)}
              className="w-full sm:w-auto" // full-width trên mobile
            >
              Xem các phòng hiện tại
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}