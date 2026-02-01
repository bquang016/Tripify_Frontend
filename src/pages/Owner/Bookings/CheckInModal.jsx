import React, { useState, useEffect } from "react";
import { X, LogIn, CheckCircle, User, Calendar } from "lucide-react";
import Button from "./components/common/Button";

const CheckInModal = ({ isOpen, onClose, onConfirm, room }) => {
    const [step, setStep] = useState('CONFIRM'); // CONFIRM | PROCESSING | SUCCESS
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setStep('CONFIRM');
            setError("");
        }
    }, [isOpen]);

    if (!isOpen || !room) return null;

    const handleConfirm = async () => {
        try {
            setStep('PROCESSING');
            setError("");
            // Gọi hàm onConfirm từ cha (phải là async function)
            await onConfirm(); 
            setStep('SUCCESS');
        } catch (err) {
            console.error(err);
            setError(err.message || "Có lỗi xảy ra khi check-in.");
            setStep('CONFIRM');
        }
    };

    const handleCloseFull = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden relative">
                
                <button 
                    onClick={handleCloseFull} 
                    className="absolute right-4 top-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* --- MÀN HÌNH 1: XÁC NHẬN --- */}
                {step === 'CONFIRM' || step === 'PROCESSING' ? (
                    <>
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                <LogIn size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Xác nhận nhận phòng</h2>
                            <p className="text-slate-500 text-sm mt-2 px-4">
                                Khách hàng đã đến và sẵn sàng nhận phòng? Hành động này sẽ bắt đầu tính thời gian lưu trú.
                            </p>
                        </div>

                        {/* Thông tin tóm tắt */}
                        <div className="px-6 py-4 bg-slate-50 border-y border-slate-100 mx-4 rounded-lg">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 flex items-center gap-2"><User size={14}/> Khách hàng:</span>
                                    <span className="font-bold text-slate-800">{room.customerName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Mã đặt chỗ:</span>
                                    <span className="font-mono font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{room.bookingCode}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 flex items-center gap-2"><Calendar size={14}/> Check-in dự kiến:</span>
                                    <span className="font-medium text-slate-700">{new Date(room.checkIn).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="px-6 pt-4 text-center text-sm text-rose-600 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="p-6 flex gap-3">
                            <Button variant="outline" className="flex-1 justify-center" onClick={handleCloseFull} disabled={step === 'PROCESSING'}>
                                Hủy bỏ
                            </Button>
                            <Button 
                                className="flex-1 justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" 
                                onClick={handleConfirm}
                                disabled={step === 'PROCESSING'}
                            >
                                {step === 'PROCESSING' ? 'Đang xử lý...' : 'Xác nhận Check-in'}
                            </Button>
                        </div>
                    </>
                ) : (
                    /* --- MÀN HÌNH 2: THÀNH CÔNG --- */
                    <div className="p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Check-in Thành công!</h2>
                        <p className="text-slate-500 text-sm mb-8">
                            Trạng thái đơn hàng đã được cập nhật sang <strong>"Đang lưu trú"</strong>.
                        </p>
                        <Button className="w-full justify-center bg-slate-800 text-white" onClick={handleCloseFull}>
                            Hoàn tất
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckInModal;