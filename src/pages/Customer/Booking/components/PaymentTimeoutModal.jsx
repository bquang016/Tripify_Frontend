    import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/common/Modal/Modal"; // Sử dụng Modal chung của dự án
import Button from "@/components/common/Button/Button";
import { Clock, AlertTriangle } from "lucide-react";

const PaymentTimeoutModal = ({ open, onConfirm }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (onConfirm) onConfirm();
        navigate("/"); // Chuyển hướng về trang chủ
    };

    return (
        <Modal
            open={open}
            onClose={() => {}} // Chặn đóng modal bằng cách click ra ngoài
            title="Hết thời gian giữ phòng"
            maxWidth="max-w-md"
            disableCloseButton={true} // Ẩn nút X nếu Modal hỗ trợ prop này
        >
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Clock size={32} className="text-red-500" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Đơn hàng đã hết hạn
                </h3>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Rất tiếc, thời gian giữ phòng (5 phút) đã kết thúc. 
                    Hệ thống đã tự động hủy đơn đặt phòng này để nhường chỗ cho khách hàng khác.
                </p>

                <Button 
                    onClick={handleRedirect}
                    className="w-full shadow-lg shadow-blue-200"
                >
                    Quay lại trang chủ
                </Button>
            </div>
        </Modal>
    );
};

export default PaymentTimeoutModal;