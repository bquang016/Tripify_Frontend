// src/pages/Customer/Booking/SuccessModal.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/common/Button/Button';

const SuccessModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (!isOpen) return;

        setCount(3);
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    navigate('/');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onClose, navigate]);

    if (!isOpen) return null;

    const handleCloseAndNavigate = () => {
        onClose();
        navigate('/');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-xl">

                <CheckCircle2 size={72} className="text-green-500 mx-auto mb-6" />

                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Thanh toán thành công!
                </h2>

                <p className="text-gray-600 mb-6">
                    Bạn sẽ được chuyển về trang chủ sau <span className="font-semibold">{count}</span> giây.
                </p>

                <Button fullWidth size="lg" onClick={handleCloseAndNavigate}>
                    Về trang chủ ngay
                </Button>
            </div>
        </div>
    );
};

export default SuccessModal;