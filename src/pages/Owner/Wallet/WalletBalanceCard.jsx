import React from 'react';
import Button from '../../../components/common/Button/Button';
import { formatCurrency } from '../../../utils/priceUtils';
import { ArrowDownToLine, Wallet } from 'lucide-react';

const WalletBalanceCard = ({ balance, onWithdrawClick }) => {
  return (
    <div className="bg-gradient-to-br from-[#1E40AF] to-[#0A1A4C] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex-1 animate-fadeIn">
      {/* Vòng tròn trang trí mờ hậu cảnh */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#1E40AF]/30 rounded-full blur-xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-blue-100">
            <Wallet size={20} className="text-blue-200" />
            <span className="font-medium text-lg">Số dư khả dụng</span>
          </div>
          <div className="text-5xl font-extrabold tracking-tight mb-2 flex items-baseline gap-1.5">
            {formatCurrency(balance)}
            <span className="text-2xl font-semibold text-blue-200">VNĐ</span>
          </div>
          <p className="text-sm text-blue-100 max-w-md">
            Tiền thực nhận sau khi trừ phí sàn 15%. Bạn có thể rút số tiền này bất cứ lúc nào khi đạt hạn mức.
          </p>
        </div>

        <div className="flex-shrink-0 relative z-20"> {/* Thêm relative z-20 để chắc chắn không bị đè */}
          <button 
            type="button" // Bắt buộc có type="button" để tránh reload trang
            className="bg-white hover:bg-gray-100 text-[#1E40AF] border-none shadow-lg py-4 px-8 rounded-full flex items-center gap-3 font-semibold text-base transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
                console.log("Nút đã được click!"); // Bật F12 lên xem có dòng này không
                onWithdrawClick();
            }}
            disabled={Number(balance) < 500000} // Ép kiểu Number cho chắc chắn
          >
            <ArrowDownToLine size={20} />
            Yêu cầu rút tiền
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;