import React from "react";
import { useNavigate } from "react-router-dom";
// 1. Import CtaButton thay vì Button
import CtaButton from "./CtaButton";
// 2. Import icon CheckCircle từ lucid-react
import { CheckCircle } from "lucide-react";

// Component con cho mỗi Quyền lợi
const BenefitItem = ({ text }) => (
  <li className="flex items-center gap-3">
    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
    <span className="text-gray-100">{text}</span>
  </li>
);

export default function PartnerCTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-gray-800 text-white overflow-hidden">
      {/* Lớp ảnh nền mờ (Giữ nguyên) */}
      <img
        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
        alt="CTA Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      {/* Lớp Gradient (Giữ nguyên) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(40,169,224)]/70 to-[#006494]/90"></div>

      {/* Nội dung (ĐÃ CẬP NHẬT) */}
      {/* 3. Thay đổi max-w-3xl thành max-w-6xl để rộng hơn */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* 4. Tạo Grid 2 cột cho thiết bị md trở lên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* CỘT 1: Quyền lợi */}
          <div className="text-left">
            <h3 className="text-3xl font-bold mb-6 drop-shadow-md">
              Quyền lợi đối tác
            </h3>
            <ul className="space-y-4">
              <BenefitItem text="Tiếp cận hàng triệu khách hàng tiềm năng trên TravelMate." />
              <BenefitItem text="Công cụ quản lý đặt phòng và giá cả trực quan, dễ sử dụng." />
              <BenefitItem text="Hệ thống báo cáo, phân tích doanh thu chi tiết." />
              <BenefitItem text="Đội ngũ hỗ trợ đối tác chuyên nghiệp 24/7." />
            </ul>
          </div>

          {/* Đường ngăn cách (chỉ hiện trên md trở lên) */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-white/20 transform -translate-x-1/2"></div>

          {/* CỘT 2: CTA (Nội dung cũ) */}
          {/* 5. Căn lề trái (text-left) thay vì text-center */}
          <div className="relative text-left md:pl-12">
            <h2 className="text-4xl font-extrabold mb-6 drop-shadow-md">
              Sẵn sàng để bắt đầu?
            </h2>
            <p className="text-lg text-gray-100 mb-10 max-w-xl drop-shadow-sm">
              Chỉ mất vài phút để điền thông tin. Tham gia cộng đồng
              đối tác của chúng tôi và phát triển doanh thu ngay!
            </p>

            {/* Sử dụng CtaButton mới */}
            <CtaButton onClick={() => navigate("/partner/register")}>
              Điền form đăng ký ngay
            </CtaButton>
          </div>

        </div>
      </div>
    </section>
  );
}