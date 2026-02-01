// src/pages/Customer/Booking/QRCodeModal.jsx

import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button/Button';
import { X } from 'lucide-react';
import qrCodeImage from '../../../assets/logo/QR.jpg';

const QRCodeModal = ({ isOpen, onClose, onConfirm }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 phút

    useEffect(() => {
        if (!isOpen) return;

        setTimeLeft(300);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onClose]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-[460px] shadow-xl relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-center mb-1">
                    Quét mã QR để thanh toán
                </h2>

                <p className="text-center text-gray-600 mb-4">
                    Mã sẽ hết hạn sau: <span className="font-semibold">{minutes}:{seconds}</span>
                </p>

                {/* QR IMAGE */}
                <img
                    src={qrCodeImage}
                    alt="QR Code thanh toán"
                    className="w-72 h-72 mx-auto mb-4 object-contain border p-3 rounded-xl"
                />

                <Button
                    fullWidth
                    size="lg"
                    onClick={onConfirm}
                >
                    Tôi đã thanh toán
                </Button>
            </div>
        </div>
    );
};

export default QRCodeModal;