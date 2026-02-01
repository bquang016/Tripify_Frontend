import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";


const members = [
    {
        name: "Từ Việt Thái",
        role: "Leader",
        email: "thaiviet22825@gmail.com",
        img: "https://i.pravatar.cc/150?img=3",
    },
    {
        name: "Bùi Đăng Quang",
        role: "Developer",
        email: "buidangquangmtp@gmail.com",
        img: "/assets/images/avatar devteam/quangmtp.png",
    },
    {
        name: "Lê Công Tôn Thắng",
        role: "Developer",
        email: "thangle20051111@gmail.com",
        img: "/assets/images/avatar devteam/lethang.png",
    },
    {
        name: "Lương Huyền Trang",
        role: "Developer",
        email: "luongtrang140905@gmail.com",
        img: "/assets/images/avatar devteam/lhtrang.png",
    },
    {
        name: "Đào Quang Thành",
        role: "Developer",
        email: "daoquangthanh0704@gmail.com",
        img: "/assets/images/avatar devteam/dqthanh.png",
    },
    {
        name: "Bùi Tiến Thành",
        role: "Developer",
        email: "apksuyuki1@gmail.com",
        img: "/assets/images/avatar devteam/tthanh.jpg",
    },
];


const MemberCard = ({ member, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1"
    >
        <img
            src={member.img}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">{member.name}</h4>
                <span className="text-sm text-gray-500">{member.role}</span>
            </div>
            <p className="text-sm text-gray-500">{member.email}</p>
        </div>
    </motion.div>
);

const Contact = () => {
    return (
        <section className="py-16 bg-gray-50" id="contact">
            <div className="max-w-6xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-12 text-blue-700"
                >
                    Liên hệ & Hỗ trợ
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl shadow-sm"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-blue-600">
                            Thông tin liên hệ
                        </h3>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-500" size={20} />
                                <span>Hotline: +84 329044969</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-500" size={20} />
                                <span>Email: quangmtp@smarttravel.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="text-blue-500" size={20} />
                                <span>Địa chỉ: 120 An Liễng</span>
                            </li>
                        </ul>
                        <p className="mt-6 text-gray-600">
                            Hỗ trợ 24/7 – sẵn sàng đồng hành cùng chuyến đi của bạn.
                        </p>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl shadow-sm"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-blue-600">
                            Đội ngũ phát triển
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Nhóm phát triển dự án — 2S_TW.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {members.map((member, index) => (
                                <MemberCard key={index} member={member} index={index} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;