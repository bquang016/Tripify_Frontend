import React from "react";
import HeroSection from "./HeroSection";
import WhyChooseUs from "./WhyChooseUs"; // ✅ MỚI
import PromotionBanner from "./PromotionBanner";
import AIRecommendations from "./AIRecommendations"; // ✅ Component bạn đã có
import HotDestinations from "./HotDestinations";
import FeaturedHotels from "./FeaturedHotels";
import TravelInspiration from "./TravelInspiration"; // ✅ MỚI
import TestimonialSection from "./TestimonialSection";
import Newsletter from "./Newsletter"; // ✅ MỚI

// Component Spacer để tạo khoảng cách thoáng đãng
const Spacer = () => <div className="h-10"></div>;

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero & Search */}
      <HeroSection />
      
      {/* 2. Tại sao chọn chúng tôi */}
      <WhyChooseUs />

      {/* 3. Banner Khuyến mãi */}
      <PromotionBanner />
      
      <Spacer />

      {/* 5. Điểm đến Hot */}
      <HotDestinations />

      {/* 6. Khách sạn nổi bật */}
      <FeaturedHotels />

      {/* 7. Blog / Cẩm nang */}
      <TravelInspiration />

      {/* 8. Đánh giá khách hàng */}
      <TestimonialSection />

      
      <Spacer />
    </div>
  );
};

export default HomePage;