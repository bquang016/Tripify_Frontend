// src/pages/Owner/TermsOfService/PartnerPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[rgb(40,169,224)]" />
            {title}
        </h3>
        <div className="text-gray-600 text-sm leading-relaxed space-y-2 text-justify">
            {children}
        </div>
    </div>
);

const PartnerPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-4">
                        <img
                            src="/assets/logo/logo_travelmate_xoafont.png"
                            alt="TravelMate"
                            className="h-12 object-contain"
                        />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Chính sách Đối tác</h1>
                    <p className="text-gray-500 mt-2">Hiệu lực từ: 01/01/2025</p>
                </div>

                <Card className="p-8 md:p-12 shadow-lg">
                    {/* Giới thiệu */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8 flex gap-4">
                        <FileText className="text-[rgb(40,169,224)] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-semibold text-blue-900">Nguyên tắc hợp tác</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                Tài liệu này quy định các nguyên tắc ứng xử, tiêu chuẩn chất lượng và quy trình làm việc giữa TravelMate và các Đối tác (Chủ cơ sở lưu trú).
                            </p>
                        </div>
                    </div>

                    {/* Nội dung chính */}
                    <Section title="1. Tiêu chuẩn Chất lượng Dịch vụ">
                        <p>
                            Đối tác cam kết duy trì chất lượng phòng ở, vệ sinh và thái độ phục vụ đúng như mô tả trên hệ thống.
                        </p>
                        <p>
                            TravelMate có quyền tạm ngưng hoặc chấm dứt hợp tác nếu Đối tác nhận được nhiều phản hồi tiêu cực hoặc vi phạm nghiêm trọng các tiêu chuẩn an toàn.
                        </p>
                    </Section>

                    <Section title="2. Chính sách Giá & Khuyến mãi">
                        <p>
                            Đối tác cam kết cung cấp mức giá cạnh tranh và không cao hơn giá niêm yết tại cơ sở hoặc trên các nền tảng khác (Rate Parity).
                        </p>
                        <p>
                            Mọi chương trình khuyến mãi đăng ký trên TravelMate phải được thực hiện đúng cam kết với khách hàng.
                        </p>
                    </Section>

                    <Section title="3. Quy trình Giải quyết Khiếu nại">
                        <p>
                            Trong trường hợp có tranh chấp với khách hàng (ví dụ: khách đến nhưng hết phòng, phòng không đúng ảnh...), Đối tác có trách nhiệm phối hợp với TravelMate để tìm phương án đền bù hoặc hỗ trợ khách hàng thỏa đáng (nâng hạng phòng, hoàn tiền, chuyển khách sạn tương đương).
                        </p>
                    </Section>

                    <Section title="4. Chống Gian lận & Bảo mật">
                        <p>
                            Nghiêm cấm các hành vi tạo đơn đặt phòng ảo, đánh giá ảo hoặc sử dụng thông tin khách hàng sai mục đích.
                        </p>
                    </Section>

                    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">
                        <p className="text-gray-500 italic text-sm mb-6 text-center">
                            Đối tác cần hỗ trợ vui lòng liên hệ: <strong>partners@travelmate.vn</strong>
                        </p>
                        <Button onClick={() => window.close()}>
                            Đã hiểu & Đóng tab
                        </Button>
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default PartnerPolicy;