import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../../utils/priceUtils';
import { Landmark, X, ArrowRight, AlertCircle, Info } from 'lucide-react';

const RequestWithdrawalModal = ({ isOpen, onClose, walletBalance, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý format số có dấu chấm khi người dùng gõ
  const handleAmountChange = (e) => {
    // Loại bỏ tất cả ký tự không phải là số
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(rawValue);
    if (error) setError('');
  };

  // Hiển thị số đã format vào input (VD: 500.000)
  const displayAmount = amount ? new Intl.NumberFormat('vi-VN').format(amount) : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const numericAmount = Number(amount);

    // Validation
    if (!numericAmount || numericAmount < 500000) {
      setError('Số tiền rút tối thiểu là 500.000 VNĐ');
      return;
    }
    if (numericAmount > walletBalance) {
      setError('Số dư khả dụng không đủ để thực hiện giao dịch');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(numericAmount);
      // Nếu thành công, form sẽ được cha đóng lại
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSelect = (value) => {
    if (value <= walletBalance) {
      setAmount(value.toString());
      setError('');
    }
  };

  const quickOptions = [
    { label: '500k', value: 500000 },
    { label: '1 Triệu', value: 1000000 },
    { label: '5 Triệu', value: 5000000 },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-[480px] shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600">
              <Landmark size={22} strokeWidth={2.5} />
            </div>
            Tạo lệnh rút tiền
          </h3>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
          
          {/* Card Số dư */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-md relative overflow-hidden text-white">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <p className="text-blue-100 font-medium mb-1 flex items-center gap-2">
              Số dư khả dụng hiện tại
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight">
                {formatCurrency(walletBalance).replace(' VNĐ', '')}
              </span>
              <span className="text-lg font-semibold text-blue-200">VNĐ</span>
            </div>
          </div>
          
          {/* Input Nhập tiền */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Số tiền muốn rút <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0"
                className={`w-full text-3xl font-bold text-gray-900 rounded-2xl border-2 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'} py-4 pl-6 pr-20 outline-none transition-all focus:ring-4`}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                VNĐ
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Info size={14} className="text-blue-500" />
              <span>Số tiền rút tối thiểu là <b>500.000 VNĐ</b></span>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {quickOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleQuickSelect(opt.value)}
                  disabled={opt.value > walletBalance}
                  className="flex-1 min-w-[80px] py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:cursor-not-allowed"
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickSelect(walletBalance)}
                disabled={walletBalance <= 0}
                className="flex-1 min-w-[90px] py-2.5 rounded-xl text-sm font-bold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rút tất cả
              </button>
            </div>
          </div>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-fadeIn">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium leading-tight">{error}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-2xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !amount || Number(amount) < 500000 || Number(amount) > walletBalance}
              className="flex-[2] py-3.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <span className="animate-spin inline-block w-5 h-5 border-[3px] border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  Xác nhận rút tiền
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestWithdrawalModal;
