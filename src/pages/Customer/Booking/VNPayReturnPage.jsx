import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '@/services/payment.service';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button/Button';

export default function VNPayReturnPage() {
    const location = useLocation(); // Lấy toàn bộ query string trên URL
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [message, setMessage] = useState('Đang xác thực giao dịch từ VNPay...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // location.search chính là chuỗi "?vnp_Amount=...&vnp_BankCode=..."
                const queryString = location.search;
                if (!queryString) {
                    setStatus('error');
                    setMessage('Không tìm thấy thông tin giao dịch.');
                    return;
                }

                // Gọi API Backend để kiểm tra chữ ký và cập nhật DB
                const res = await paymentService.verifyVNPayReturn(queryString);
                
                if (res.data?.success) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Đơn đặt phòng của bạn đã được xác nhận.');
                } else {
                    setStatus('error');
                    setMessage(res.data?.message || 'Giao dịch bị từ chối hoặc thất bại.');
                }
            } catch (error) {
                console.error("Lỗi xác thực VNPay:", error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xác thực giao dịch.');
            }
        };

        verifyPayment();
    }, [location.search]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center animate-fade-in">
                
                {status === 'processing' && (
                    <div className="flex flex-col items-center">
                        <Loader2 size={64} className="text-blue-500 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-slate-800">Đang xử lý...</h2>
                        <p className="text-slate-500 mt-2">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-scale-up">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={56} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Thanh toán thành công!</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>
                        
                        <Button fullWidth size="lg" onClick={() => navigate('/customer/bookings')} className="bg-green-600 hover:bg-green-700 text-white">
                            Xem đơn đặt phòng
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center animate-scale-up">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <XCircle size={56} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Giao dịch thất bại!</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <Button fullWidth size="lg" onClick={() => navigate('/customer/bookings')} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                Kiểm tra lại đơn hàng
                            </Button>
                            <Button fullWidth variant="ghost" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}