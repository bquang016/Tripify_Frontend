import React, { useState, useEffect } from "react"; // 1. Import thêm useEffect
import Modal from "@/components/common/Modal/Modal";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";

// 2. Thêm prop `existingPhone`
export default function AddPhoneModal({ isOpen, onClose, onSave, existingPhone = null }) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 3. Thêm hook để tự điền SĐT cũ
    useEffect(() => {
        if (isOpen) {
            if (existingPhone) {
                setPhone(existingPhone.phone); // Lấy SĐT cũ
            } else {
                setPhone(''); // Thêm mới
            }
            setError('');
        }
    }, [isOpen, existingPhone]);

    const validatePhone = () => {
        if (!phone) {
            setError("Vui lòng nhập số điện thoại.");
            return false;
        }
        if (!/^0\d{9,10}$/.test(phone)) {
            setError("Số điện thoại không hợp lệ (10-11 chữ số).");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (validatePhone()) {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            onSave(phone);
            setPhone('');
            setLoading(false);
            onClose();
        }
    };

    // 4. Quyết định text
    const isEditing = !!existingPhone;
    const title = isEditing ? "CẬP NHẬT SỐ DI ĐỘNG" : "THÊM SỐ DI ĐỘNG";
    const buttonText = isEditing ? "Lưu" : "Thêm";

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={title} // 5. Dùng title động
        >
            <p className="text-sm text-gray-600 mb-4">
                Thêm số di động của bạn để đăng nhập và nhận thông báo khẩn cấp
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    name="phone"
                    type="tel"
                    placeholder="Ví dụ: 0901234567"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
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