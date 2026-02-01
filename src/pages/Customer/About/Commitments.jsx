import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ModalPortal from "@/components/common/Modal/ModalPortal";



const commitments = [
    {
        title: "Đảm bảo an toàn & uy tín",
        shortDesc:
            "TravelMate chỉ hợp tác với các đối tác đạt chuẩn chất lượng và uy tín hàng đầu.",
        fullDesc: `
Chúng tôi luôn lựa chọn kỹ lưỡng các khách sạn, khu nghỉ dưỡng và nhà cung cấp dịch vụ du lịch có giấy phép hợp pháp, được khách hàng đánh giá cao và tuân thủ các tiêu chuẩn quốc tế về an toàn. 

Mọi đơn vị hợp tác đều phải vượt qua quá trình kiểm duyệt về cơ sở vật chất, quy trình phục vụ và chính sách hoàn tiền. TravelMate đảm bảo bạn luôn được sử dụng dịch vụ uy tín, minh bạch và chất lượng.
    `,
    },
    {
        title: "Chính sách hoàn tiền linh hoạt",
        shortDesc:
            "Bạn có thể thay đổi hoặc hủy đặt phòng dễ dàng, hoàn tiền nhanh chóng.",
        fullDesc: `
Nếu bạn cần thay đổi lịch trình hoặc hủy đặt phòng, TravelMate sẽ hỗ trợ bạn thực hiện theo chính sách của từng khách sạn. 

Quy trình hoàn tiền được thực hiện tự động, nhanh chóng và minh bạch, đảm bảo quyền lợi khách hàng trong mọi trường hợp. Chúng tôi cũng cung cấp thông báo chi tiết về trạng thái hoàn tiền qua email và tài khoản người dùng.
    `,
    },
    {
        title: "Bảo mật thông tin khách hàng",
        shortDesc:
            "Dữ liệu cá nhân của bạn được mã hóa theo chuẩn bảo mật cao nhất.",
        fullDesc: `
TravelMate cam kết bảo mật tuyệt đối thông tin người dùng. Toàn bộ dữ liệu cá nhân, thông tin thanh toán và lịch sử giao dịch đều được bảo mật.

Chúng tôi không chia sẻ thông tin cho bất kỳ bên thứ ba nào khi chưa được sự đồng ý của bạn.
    `,
    },
    {
        title: "Hỗ trợ khách hàng 24/7",
        shortDesc:
            "Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng mọi lúc.",
        fullDesc: `
Bạn có thể liên hệ với đội ngũ hỗ trợ của TravelMate bất kỳ lúc nào qua nhiều kênh: hotline, email, hoặc chat trực tuyến.

Chúng tôi có đội ngũ chuyên viên trực cùng với chatbot 24/7 , sẵn sàng giải đáp mọi thắc mắc và hỗ trợ xử lý nhanh các sự cố như hoàn tiền, thay đổi lịch đặt phòng hoặc khiếu nại dịch vụ.
    `,
    },
];

export default function Commitments() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleOpen = (item) => {
        setSelected(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    return (
        <section className="py-16 bg-gray-50 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">
                Cam kết & Chính sách
            </h2>


            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {commitments.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleOpen(item)}
                        className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        <h3 className="text-lg font-semibold text-blue-600 mb-3">
                            {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3">{item.shortDesc}</p>
                        <p className="text-blue-500 text-xs mt-3 font-medium underline">
                            Xem chi tiết
                        </p>
                    </div>
                ))}
            </div>


            <ModalPortal>
                <AnimatePresence>
                    {open && selected && (
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 40, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-md overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
                                        {selected.title}
                                    </h3>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-5 space-y-4 text-gray-700 text-left max-h-[60vh] overflow-y-auto">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-blue-500" size={22} />
                                        <p className="font-medium">{selected.title}</p>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {selected.fullDesc}
                                    </p>
                                </div>


                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </ModalPortal>
        </section>
    );
}
