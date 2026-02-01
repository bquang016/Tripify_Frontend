import React from "react";
import Button from "@/components/common/Button/Button";
import { Star, FileText } from "lucide-react";

export const AmenitiesSection = ({ amenities, description }) => {
    const featuredAmenities = amenities.slice(0, 8); // Hiển thị nhiều hơn chút
    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
            <p className="text-gray-600 leading-relaxed mb-6 pb-6 border-b">
                {description}
            </p>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tiện ích</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {featuredAmenities.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-[rgb(40,169,224)]">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ReviewsSection = () => (
    <div className="p-10 text-center">
        <Star size={48} className="mx-auto text-gray-300 mb-3" />
        <h4 className="text-lg font-semibold text-gray-600">Chưa có đánh giá nào</h4>
        <p className="text-gray-500">Hãy là người đầu tiên trải nghiệm và đánh giá khách sạn này!</p>
    </div>
);

export const PoliciesSection = () => (
    <div className="p-10 text-center">
        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
        <h4 className="text-lg font-semibold text-gray-600">Chính sách đang cập nhật</h4>
        <p className="text-gray-500">Vui lòng liên hệ trực tiếp với khách sạn để biết thêm chi tiết.</p>
    </div>
);