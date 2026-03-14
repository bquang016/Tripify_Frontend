import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '../../../../services/payment.service'; 
import Button from '../../../../components/common/Button/Button'; // Import Button của dự án
import { toast } from 'react-toastify'; // Hoặc hệ thống Toast bạn đang dùng

// Khởi tạo Stripe bên ngoài component để tránh re-render nhiều lần
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// --- Component Form chứa logic ---
const CardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stripe.js chưa load xong
    if (!stripe || !elements) return; 

    setLoading(true);

    try {
      // 1. Gọi Backend lấy clientSecret
      const response = await paymentService.createStripeSetupIntent();
      const clientSecret = response.data.clientSecret;

      // Lấy tham chiếu đến ô nhập thẻ
      const cardElement = elements.getElement(CardElement);

      // 2. Gửi thông tin thẻ trực tiếp cho Stripe server
      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      // 3. Xử lý kết quả
      if (error) {
        toast.error(`Lỗi: ${error.message}`);
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        toast.success('Liên kết thẻ thành công!');
        cardElement.clear(); // Xoá trắng form sau khi thành công
        // TODO: Cập nhật lại danh sách thẻ hiển thị trên UI (Giai đoạn 2)
      }
    } catch (error) {
      console.error("Setup Intent Error:", error);
      toast.error('Có lỗi xảy ra khi kết nối máy chủ thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  // Tuỳ chỉnh CSS cho ô nhập thẻ của Stripe cho giống với Tailwind
  const cardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937', // text-gray-800
        '::placeholder': { color: '#9ca3af' }, // text-gray-400
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
      },
      invalid: { color: '#ef4444' }, // text-red-500
    },
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nhập thông tin thẻ tín dụng/ghi nợ
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <CardElement options={cardElementOptions} />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full flex justify-center py-2"
      >
        {loading ? 'Đang xử lý...' : 'Thêm thẻ'}
      </Button>
    </form>
  );
};

// --- Component Wrapper (Sẽ được import và sử dụng ở UI) ---
const CardManagement = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
      <p className="text-sm text-gray-500 mb-6">
        Thêm thẻ để thanh toán nhanh chóng và an toàn. Thông tin thẻ của bạn được bảo mật bởi Stripe.
      </p>
      
      {/* Bắt buộc phải có thẻ Elements bọc ngoài để dùng Stripe hooks */}
      <Elements stripe={stripePromise}>
        <CardForm />
      </Elements>
    </div>
  );
};

export default CardManagement;