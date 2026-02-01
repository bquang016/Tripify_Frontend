import React, { useMemo } from "react";
import { Star, Pin, ArrowRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ReviewCard from "./ReviewCard";

const FeaturedReviews = ({
  hotel,
  reviews = [],        // Dữ liệu để tính Progress Bars
  pinnedReviews = [],  // Dữ liệu để hiển thị list ghim
  onViewAll,
  isAdmin,
  isOwner,
  onOpenGallery,
  onUnpin
}) => {

  // 1. Tính toán thống kê sao (Dựa trên list reviews truyền vào)
  const stats = useMemo(() => {
    const total = reviews.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (total > 0) {
      reviews.forEach(r => {
        const s = Math.round(r.stars);
        if (counts[s] !== undefined) counts[s]++;
      });
    }
    return { total, counts };
  }, [reviews]);

  const getRatingText = (score) => {
      if (!score) return "Chưa có đánh giá";
      if (score >= 4.5) return "Tuyệt vời";
      if (score >= 4.0) return "Rất tốt";
      if (score >= 3.0) return "Hài lòng";
      return "Cần cải thiện";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* --- PHẦN 1: TỔNG QUAN (Rating + Progress Bars) --- */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Cột Trái: Điểm số to */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-blue-600 text-white text-3xl font-bold w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                {hotel.rating || 0}
             </div>
             <div className="flex flex-col items-start">
                <h3 className="text-lg font-bold text-slate-800">{getRatingText(hotel.rating)}</h3>
                <p className="text-sm text-slate-500">{hotel.reviewsCount || 0} đánh giá</p>
             </div>
          </div>
        </div>

        {/* Cột Phải: Progress Bars */}
        <div className="md:col-span-8 flex flex-col gap-2 w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts[star] || 0;
            const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 w-10 font-medium text-slate-600">
                  {star} <Star size={12} className="fill-slate-400 text-slate-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }} 
                  />
                </div>
                <span className="w-8 text-right text-slate-400 text-xs">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH GHIM --- */}
      {pinnedReviews.length > 0 && (
        <div className="border-t border-gray-100 bg-slate-50/30 p-6 pb-24"> {/* pb-24 để chừa chỗ cho nút mờ */}
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Pin size={14} className="text-blue-500 fill-blue-500" />
            Đánh giá nổi bật
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {pinnedReviews.map(review => (
              <div key={review.ratingId} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <ReviewCard
                    review={review}
                    isAdmin={isAdmin}
                    isOwner={isOwner}
                    onOpenGallery={onOpenGallery}
                    onPin={() => onUnpin(review.ratingId)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PHẦN 3: BOTTOM BLUR & BUTTON --- */}
      {/* Hiển thị đè lên phần dưới cùng */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-8 z-10">
        <Button
            onClick={onViewAll}
            className="group bg-yellow-400 text-yellow-950 hover:bg-yellow-500 font-bold rounded-full px-8 py-3 shadow-xl shadow-yellow-100 hover:shadow-yellow-200 hover:-translate-y-1 transition-all flex items-center gap-2"
        >
            Xem tất cả {hotel.reviewsCount} đánh giá
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
        </Button>
      </div>

    </div>
  );
};

export default FeaturedReviews;