import React from "react";

const AboutSystem = () => {
    return (
        <section className="py-16 px-6 bg-white text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                    Giới thiệu hệ thống
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Nền tảng đặt phòng của chúng tôi được xây dựng nhằm mang đến trải nghiệm
                    du lịch thông minh, tiện lợi và an toàn. Với công nghệ AI, chúng tôi gợi ý
                    cho bạn những điểm đến phù hợp nhất, giúp bạn dễ dàng lựa chọn khách sạn
                    tốt nhất với mức giá hợp lý.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/825/825529.png"
                            alt="Smart booking"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">Đặt phòng thông minh</h3>
                        <p className="text-gray-600">
                            Sử dụng AI để gợi ý khách sạn, tối ưu trải nghiệm người dùng.
                        </p>
                    </div>

                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2950/2950653.png"
                            alt="Secure payment"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">Thanh toán an toàn</h3>
                        <p className="text-gray-600">
                            Tích hợp phương thức thanh toán an toàn, nhanh chóng.
                        </p>
                    </div>

                    <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                            alt="24/7 support"
                            className="w-16 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">Hỗ trợ 24/7</h3>
                        <p className="text-gray-600">
                            Đội ngũ CSKH sẵn sàng hỗ trợ bạn mọi lúc.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSystem;