import React, { useState, useEffect } from 'react';
import './PaymentForm.css'; 
import { CreditCard, PlusCircle } from 'lucide-react'; 
import paymentService from '@/services/payment.service';

import VnpayLogo from '../../../assets/logo/vnpay_logo.png';
import MomoLogo from '../../../assets/logo/momo_logo.png';
import ZaloPayLogo from '../../../assets/logo/zalopay_logo.png';

const PaymentForm = ({ onChange, selected }) => {
    const [savedCards, setSavedCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await paymentService.getSavedCards();
                setSavedCards(res.data || []);
            } catch (e) {
                console.error("Lỗi lấy thẻ:", e);
            } finally {
                setLoadingCards(false);
            }
        };
        fetchCards();
    }, []);

    const handleSelect = (method) => {
        if (onChange) onChange(method);
    };

    const getCardBrandLogo = (brand) => {
        switch (brand?.toLowerCase()) {
          case 'visa': return "https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg";
          case 'mastercard': return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
          case 'jcb': return "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg";
          default: return null;
        }
    };

    return (
        <div className="payment-form-container bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="form-header flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800 m-0">Phương thức thanh toán</h2>
            </div>

            <div className="payment-options flex flex-col gap-3">
                
                {/* --- NHÓM THẺ TÍN DỤNG ĐÃ LƯU (STRIPE) --- */}
                <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Thẻ tín dụng / Ghi nợ</h3>
                    
                    {loadingCards ? (
                        <div className="text-sm text-gray-500 animate-pulse">Đang tải thẻ...</div>
                    ) : savedCards.length === 0 ? (
                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-between">
                            <span>Bạn chưa có thẻ nào được lưu.</span>
                            <a href="/customer/cards" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                                <PlusCircle size={16} /> Thêm thẻ
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {savedCards.map(card => {
                                // FIX LỖI UNDEFINED Ở ĐÂY: Xử lý cả 2 trường hợp tên biến
                                const expMonth = card.card?.expMonth || card.card?.exp_month || '00';
                                const expYear = card.card?.expYear || card.card?.exp_year || '0000';
                                const last4 = card.card?.last4 || '****';
                                const brand = card.card?.brand;

                                return (
                                    <div
                                        key={card.id}
                                        className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === card.id ? 'selected border-[rgb(40,169,224)] bg-blue-50 ring-1 ring-[rgb(40,169,224)]' : 'border-gray-200'}`}
                                        onClick={() => handleSelect(card.id)}
                                    >
                                        <div className="payment-logo w-12 h-8 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center shadow-sm">
                                            {getCardBrandLogo(brand) ? (
                                                <img src={getCardBrandLogo(brand)} alt={brand} className="max-h-full max-w-full" />
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase">{brand}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <span className="payment-name font-semibold text-gray-800 text-sm tracking-wider">
                                                •••• •••• •••• {last4}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Hết hạn: {String(expMonth).padStart(2, '0')}/{String(expYear).slice(-2)}
                                            </span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={card.id}
                                            checked={selected === card.id}
                                            readOnly
                                            className="accent-[rgb(40,169,224)] w-4 h-4 cursor-pointer"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 my-2"></div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wider">Ví điện tử & Khác</h3>

                {/* Các phương thức VNPay, MoMo... (Giữ nguyên) */}
                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'VNPAY' ? 'selected border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
                    onClick={() => handleSelect('VNPAY')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center">
                        <img src={VnpayLogo} alt="VNPay" className="w-full h-full object-contain" />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Cổng thanh toán VNPay</span>
                    <input type="radio" checked={selected === 'VNPAY'} readOnly className="accent-blue-600 w-4 h-4" />
                </div>

                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'MOMO' ? 'selected border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200'}`}
                    onClick={() => handleSelect('MOMO')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center">
                        <img src={MomoLogo} alt="MoMo" className="w-full h-full object-contain" />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Ví điện tử MoMo</span>
                    <input type="radio" checked={selected === 'MOMO'} readOnly className="accent-pink-600 w-4 h-4" />
                </div>

                <div
                    className={`payment-option flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selected === 'ZALOPAY' ? 'selected border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500' : 'border-gray-200'}`}
                    onClick={() => handleSelect('ZALOPAY')}
                >
                    <div className="payment-logo w-10 h-10 mr-3 flex-shrink-0 bg-white rounded-md p-1 border border-gray-100 flex items-center justify-center">
                        <img src={ZaloPayLogo} alt="ZaloPay" className="w-full h-full object-contain" />
                    </div>
                    <span className="payment-name flex-1 font-medium text-gray-700 text-sm">Ví điện tử ZaloPay</span>
                    <input type="radio" checked={selected === 'ZALOPAY'} readOnly className="accent-cyan-600 w-4 h-4" />
                </div>

            </div>
        </div>
    );
};

export default PaymentForm;