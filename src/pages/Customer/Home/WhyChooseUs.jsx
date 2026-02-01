import React from "react";
import { ShieldCheck, Headphones, CreditCard, Tag } from "lucide-react";

const FEATURES = [
  {
    icon: <Tag size={32} />,
    title: "Giá tốt nhất",
    desc: "Đảm bảo giá tốt nhất cho mọi đặt phòng. Tích điểm đổi quà hấp dẫn.",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Đặt phòng an toàn",
    desc: "Bảo mật thông tin tuyệt đối. Quy trình thanh toán được mã hóa chuẩn quốc tế.",
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    icon: <Headphones size={32} />,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
    color: "text-purple-600",
    bg: "bg-purple-100"
  },
  {
    icon: <CreditCard size={32} />,
    title: "Thanh toán linh hoạt",
    desc: "Hỗ trợ nhiều phương thức: Thẻ, Momo, VNPay, ZaloPay và trả sau.",
    color: "text-orange-600",
    bg: "bg-orange-100"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((item, index) => (
          <div 
            key={index} 
            className="group p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;