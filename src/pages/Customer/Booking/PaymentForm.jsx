// src/pages/Customer/Booking/PaymentForm.jsx

import React from 'react';
import './PaymentForm.css'; // Import CSS
import { CreditCard } from 'lucide-react'; // Import icon

// Import Logo
import VnpayLogo from '../../../assets/logo/vnpay_logo.png';
import MomoLogo from '../../../assets/logo/momo_logo.png';
import ZaloPayLogo from '../../../assets/logo/zalopay_logo.png';

const PaymentForm = ({ onChange, selected }) => {
    // Component này giờ nhận props:
    // - selected: giá trị phương thức đang chọn (từ component cha truyền xuống)
    // - onChange: hàm callback để cập nhật state ở component cha

    // Hàm xử lý khi click chọn phương thức
    const handleSelect = (method) => {
        if (onChange) {
            onChange(method);
        }
    };

    return (
        <div className="payment-form-container bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="form-header flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800 m-0">Phương thức thanh toán</h2>
            </div>

            <div className="payment-options flex flex-col gap-3">
                {/* Lựa chọn 1: VNPay */}
                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'VNPAY' ? 'selected border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
                    onClick={() => handleSelect('VNPAY')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center">
                        <img src={VnpayLogo} alt="VNPay" className="w-full h-full object-contain" />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Cổng thanh toán VNPay</span>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPAY"
                        checked={selected === 'VNPAY'}
                        readOnly
                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                    />
                </div>

                {/* Lựa chọn 2: MoMo */}
                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'MOMO' ? 'selected border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200'}`}
                    onClick={() => handleSelect('MOMO')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center">
                        <img src={MomoLogo} alt="MoMo" className="w-full h-full object-contain" />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Ví điện tử MoMo</span>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="MOMO"
                        checked={selected === 'MOMO'}
                        readOnly
                        className="accent-pink-600 w-4 h-4 cursor-pointer"
                    />
                </div>

                {/* Lựa chọn 3: ZaloPay */}
                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'ZALOPAY' ? 'selected border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500' : 'border-gray-200'}`}
                    onClick={() => handleSelect('ZALOPAY')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center">
                        <img src={ZaloPayLogo} alt="ZaloPay" className="w-full h-full object-contain" />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Ví điện tử ZaloPay</span>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="ZALOPAY"
                        checked={selected === 'ZALOPAY'}
                        readOnly
                        className="accent-cyan-600 w-4 h-4 cursor-pointer"
                    />
                </div>

                {/* Lựa chọn 4: QR Code (Thêm option này để khớp với logic trang PaymentPage.jsx) */}
                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'qr_code' ? 'selected border-gray-800 bg-gray-50 ring-1 ring-gray-800' : 'border-gray-200'}`}
                    onClick={() => handleSelect('qr_code')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center text-gray-600">
                        <CreditCard size={24} />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Quét mã QR Ngân hàng</span>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="qr_code"
                        checked={selected === 'qr_code'}
                        readOnly
                        className="accent-gray-800 w-4 h-4 cursor-pointer"
                    />
                </div>

            </div>
        </div>
    );
};

export default PaymentForm;