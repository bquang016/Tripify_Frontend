import React from "react";
import { MessageCircleHeart } from "lucide-react"; // Icon mới

// Components
import TestimonialCard from "@/components/common/Card/TestimonialCard";

// Mock Data (Dữ liệu giả lập với Avatar thật)
const TESTIMONIALS = [
  {
    id: 1,
    name: "Nguyễn Thùy Chi",
    role: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    comment: "TravelMate thực sự là cứu cánh cho những chuyến đi ngẫu hứng của mình. Giao diện đặt phòng quá mượt, giá cả lại minh bạch. Chắc chắn sẽ ủng hộ dài dài!"
  },
  {
    id: 2,
    name: "Trần Minh Đức",
    role: "Doanh nhân",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
    comment: "Tôi thường xuyên phải đi công tác và cần hóa đơn đỏ nhanh chóng. Hệ thống này hỗ trợ xuất hóa đơn và quản lý lịch sử đặt phòng rất chuyên nghiệp."
  },
  {
    id: 3,
    name: "Lê Hoàng Bảo",
    role: "Nhiếp ảnh gia",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 4,
    comment: "Rất thích tính năng gợi ý khách sạn theo địa điểm chụp ảnh. Mình đã tìm được homestay view đồi thông Đà Lạt cực chill nhờ TravelMate."
  }
];

const SectionHeader = () => (
    <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <MessageCircleHeart size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Đánh giá từ cộng đồng</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Khách hàng nói gì về <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">TravelMate?</span>
        </h2>
        
        <p className="text-gray-500 font-medium text-base md:text-lg">
            Hơn 10,000+ khách hàng đã tin tưởng và đồng hành cùng chúng tôi trong mọi hành trình.
        </p>
    </div>
);

const TestimonialSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 font-sans relative overflow-hidden">
      
      {/* Decorative Circles (Background Effect) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <SectionHeader />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;