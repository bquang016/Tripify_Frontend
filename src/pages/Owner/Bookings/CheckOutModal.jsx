import React, { useState, useEffect } from "react";
import { X, LogOut, CheckCircle, AlertTriangle, User } from "lucide-react";
import Button from "./components/common/Button";

const CheckOutModal = ({ isOpen, onClose, onConfirm, room }) => {
    const [step, setStep] = useState('CONFIRM'); // CONFIRM | PROCESSING | SUCCESS
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setStep('CONFIRM');
            setError("");
        }
    }, [isOpen]);

    if (!isOpen || !room) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleConfirmClick = async () => {
        // Logic kiểm tra: Nếu chưa Check-in thì không cho Check-out
        // Mặc dù nút bấm ở ngoài bảng đã chặn, nhưng thêm 1 lớp bảo vệ ở đây
        if (room.originalStatus !== 'CHECKED_IN' && room.originalStatus !== 'CONFIRMED') {
             setError("Trạng thái đơn hàng không hợp lệ để trả phòng.");
             return;
        }

        try {
            setStep('PROCESSING');
            setError("");
            await onConfirm(); // Gọi hàm async từ cha
            setStep('SUCCESS');
        } catch (err) {
            console.error(err);
            setError(err.message || "Lỗi khi trả phòng. Vui lòng thử lại.");
            setStep('CONFIRM');
        }
    };

    const handleCloseFull = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden relative">
                
                <button 
                    onClick={handleCloseFull} 
                    className="absolute right-4 top-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {step === 'CONFIRM' || step === 'PROCESSING' ? (
                    <>
                        <div className="p-6 text-center">
                            <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                                <LogOut size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Xác nhận trả phòng?</h2>
                            
                            {/* Cảnh báo nếu đơn chưa check-in (trường hợp hy hữu) */}
                            {room.originalStatus === 'CONFIRMED' && (
                                <div className="mt-3 bg-amber-50 text-amber-800 text-xs p-2 rounded border border-amber-100 flex items-center justify-center gap-2">
                                    <AlertTriangle size={14}/>
                                    Cảnh báo: Khách này chưa được Check-in trên hệ thống.
                                </div>
                            )}

                            <p className="text-slate-500 text-sm mt-2">
                                Hành động này sẽ kết thúc kỳ lưu trú và cập nhật trạng thái phòng sang "Trống".
                            </p>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-y border-slate-100 mx-4 rounded-lg">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Phòng:</span>
                                    <span className="font-bold text-slate-800">{room.roomName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Khách hàng:</span>
                                    <span className="font-medium text-slate-800">{room.customerName}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-slate-500">Tổng thanh toán:</span>
                                    <span className="font-bold text-rose-600 text-lg">
                                        {formatCurrency(room.totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="px-6 pt-4 text-center text-sm text-rose-600 font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="p-6 flex gap-3">
                            <Button variant="outline" className="flex-1 justify-center" onClick={handleCloseFull} disabled={step === 'PROCESSING'}>
                                Hủy bỏ
                            </Button>
                            <Button 
                                className="flex-1 justify-center bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200" 
                                onClick={handleConfirmClick}
                                disabled={step === 'PROCESSING'}
                            >
                                {step === 'PROCESSING' ? 'Đang xử lý...' : 'Đồng ý trả phòng'}
                            </Button>
                        </div>
                    </>
                ) : (
                    /* --- MÀN HÌNH THÀNH CÔNG --- */
                    <div className="p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Trả phòng thành công!</h2>
                        <p className="text-slate-500 text-sm mb-6">Giao dịch đã được hoàn tất.</p>
                        
                        <Button className="w-full justify-center bg-[#28A9E0] text-white shadow-md" onClick={handleCloseFull}>
                            Đóng cửa sổ
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckOutModal;