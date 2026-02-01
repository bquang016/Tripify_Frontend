// src/pages/Owner/TermsOfService/TermsOfService.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[rgb(40,169,224)]" />
            {title}
        </h3>
        <div className="text-gray-600 text-sm leading-relaxed space-y-2 text-justify">
            {children}
        </div>
    </div>
);

const TermsOfService = () => {
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Điều khoản Dịch vụ dành cho Đối tác</h1>
                    <p className="text-gray-500 mt-2">Cập nhật lần cuối: 18/11/2025</p>
                </div>

                <Card className="p-8 md:p-12 shadow-lg">
                    {/* Giới thiệu */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8 flex gap-4">
                        <FileText className="text-[rgb(40,169,224)] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-semibold text-blue-900">Thỏa thuận hợp tác</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                Bằng việc đăng ký trở thành Đối tác (Chủ sở hữu) trên TravelMate, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Vui lòng đọc kỹ trước khi tiếp tục.
                            </p>
                        </div>
                    </div>

                    {/* Nội dung chính */}
                    <Section title="1. Trách nhiệm của Chủ sở hữu">
                        <p>
                            Chủ sở hữu cam kết cung cấp thông tin chính xác, trung thực về cơ sở lưu trú, bao gồm hình ảnh, tiện nghi, giá cả và tình trạng phòng trống.
                        </p>
                        <p>
                            Bạn chịu trách nhiệm đảm bảo cơ sở lưu trú tuân thủ các quy định pháp luật hiện hành về kinh doanh dịch vụ lưu trú, bao gồm giấy phép kinh doanh và các tiêu chuẩn an toàn phòng cháy chữa cháy.
                        </p>
                    </Section>

                    <Section title="2. Chính sách Đặt phòng & Thanh toán">
                        <p>
                            TravelMate đóng vai trò là nền tảng trung gian kết nối. Khi có khách đặt phòng, hệ thống sẽ gửi thông báo đến bạn. Bạn có trách nhiệm cập nhật trạng thái phòng trống theo thời gian thực để tránh tình trạng "overbooking".
                        </p>
                        <p>
                            Doanh thu từ việc cho thuê phòng sẽ được TravelMate đối soát và thanh toán theo chu kỳ hàng tháng (hoặc theo thỏa thuận riêng), sau khi trừ đi phí hoa hồng dịch vụ.
                        </p>
                    </Section>

                    <Section title="3. Tiêu chuẩn Nội dung & Hình ảnh">
                        <p>
                            Mọi hình ảnh tải lên hệ thống phải thuộc quyền sở hữu của bạn hoặc bạn có quyền sử dụng hợp pháp. Nghiêm cấm tải lên các nội dung đồi trụy, bạo lực, hoặc vi phạm thuần phong mỹ tục.
                        </p>
                        <p>
                            TravelMate có quyền gỡ bỏ bất kỳ nội dung nào vi phạm tiêu chuẩn cộng đồng hoặc bị báo cáo bởi người dùng mà không cần báo trước.
                        </p>
                    </Section>

                    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">
                        <p className="text-gray-500 italic text-sm mb-6 text-center">
                            Mọi thắc mắc vui lòng liên hệ bộ phận Hỗ trợ Đối tác: <strong>partners@travelmate.vn</strong>
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

export default TermsOfService;