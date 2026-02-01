import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import { ArrowRight } from "lucide-react";

export default function PartnerHeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* 1. Phần Text (Bên trái) */}
        <div className="text-center md:text-left animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#006494] mb-6 tracking-tight">
            Trở thành đối tác của TravelMate
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Phát triển kinh doanh cùng chúng tôi. Tiếp cận hàng triệu
            khách hàng và quản lý cơ sở lưu trú của bạn một cách
            dễ dàng, hiệu quả.
          </p>
          <Button
            size="lg"
            className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white shadow-lg transform hover:scale-105 transition-transform"
            rightIcon={<ArrowRight size={20} />}
            onClick={() => navigate("/partner/register")}
          >
            Đăng ký ngay
          </Button>
        </div>

        {/* 2. Phần Hình ảnh (Bên phải) */}
        <div 
          className="animate-fadeIn" 
          style={{ animationDelay: "0.2s" }}
        >
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
            alt="Hợp tác khách sạn"
            className="w-full h-auto max-h-[400px] rounded-2xl shadow-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}