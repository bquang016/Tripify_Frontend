import React from "react";
import { Star, MessageSquare, Quote } from "lucide-react";
import Avatar from "@/components/common/Avatar/Avatar";

const RecentReviewsWidget = ({ reviews }) => {
    
    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={14} 
                        className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                        <Star size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Đánh giá mới nhất</h3>
                        <p className="text-xs text-gray-500">Phản hồi từ khách hàng</p>
                    </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Xem tất cả
                </button>
            </div>

            {/* ✅ GRID LAYOUT: Hiển thị 3 đánh giá trên 1 hàng (trên màn hình lớn) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews?.map((review) => (
                    <div key={review.id} className="group relative p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-md transition-all duration-300">
                        
                        {/* Icon trích dẫn trang trí */}
                        <div className="absolute top-4 right-4 text-gray-200 group-hover:text-blue-100 transition-colors">
                            <Quote size={40} fill="currentColor" />
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <Avatar name={review.user} size={40} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{review.user}</p>
                                <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-3 relative z-10">
                            {renderStars(review.rating)}
                        </div>

                        {/* Comment Content */}
                        <div className="relative z-10">
                            <p className="text-sm text-gray-600 italic line-clamp-3 leading-relaxed">
                                "{review.text}"
                            </p>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {(!reviews || reviews.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Chưa có đánh giá nào gần đây</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentReviewsWidget;