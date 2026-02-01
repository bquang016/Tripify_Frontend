import React, { useState, useEffect } from "react"; // 1. Import thêm useEffect
import Modal from "@/components/common/Modal/Modal";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";

// 2. Thêm prop `existingEmail`, mặc định là null
export default function AddEmailModal({ isOpen, onClose, onSave, existingEmail = null }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 3. Thêm hook để tự điền email cũ khi mở modal
    useEffect(() => {
        if (isOpen) {
            if (existingEmail) {
                setEmail(existingEmail.email); // Lấy email cũ
            } else {
                setEmail(''); // Nếu không là thêm mới (để rỗng)
            }
            setError(''); // Luôn reset lỗi khi mở
        }
    }, [isOpen, existingEmail]); // Chạy lại khi modal mở hoặc email prop thay đổi

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("Vui lòng nhập địa chỉ email.");
            return false;
        }
        if (!emailRegex.test(email)) {
            setError("Địa chỉ email không hợp lệ.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (validateEmail()) {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            onSave(email);
            setEmail('');
            setLoading(false);
            onClose();
        }
    };

    // 4. Quyết định text dựa trên việc có `existingEmail` hay không
    const isEditing = !!existingEmail;
    const title = isEditing ? "CẬP NHẬT EMAIL" : "THÊM EMAIL";
    const buttonText = isEditing ? "Lưu" : "Thêm"; // <-- ĐÚNG YÊU CẦU CỦA BẠN

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={title} // 5. Dùng title động
        >
            <p className="text-sm text-gray-600 mb-4">
                {isEditing
                    ? "Cập nhật email sẽ yêu cầu xác minh lại."
                    : "Thêm email đang sử dụng của bạn để đăng nhập và nhận thông báo"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    name="email"
                    type="email"
                    placeholder="Ví dụ: yourname@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    error={error}
                />

                <div className="pt-4 space-y-3">
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={loading}
                        disabled={loading}
                        className="bg-[rgb(40,169,224)] hover:bg-[rgb(26,140,189)] text-white"
                    >
                        {buttonText} {/* 6. Dùng button text động */}
                    </Button>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        className="bg-blue-100 border-blue-100 text-[rgb(40,169,224)] hover:bg-blue-200"
                    >
                        Hủy
                    </Button>
                </div>
            </form>
        </Modal>
    );
}