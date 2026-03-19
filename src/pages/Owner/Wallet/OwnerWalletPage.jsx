import React, { useState, useEffect } from 'react';
import withdrawalService from '../../../services/withdrawal.service';

// Import components con
import WalletBalanceCard from './WalletBalanceCard';
import WalletStats from './WalletStats';
import WithdrawalHistoryTable from './WithdrawalHistoryTable';
import RequestWithdrawalModal from './RequestWithdrawalModal'; // <-- Import Component mới

const OwnerWalletPage = () => {
  const [wallet, setWallet] = useState({ availableBalance: 0, pendingBalance: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, historyRes] = await Promise.all([
        withdrawalService.getMyWallet(),
        withdrawalService.getOwnerHistory()
      ]);
      if (walletRes.data?.data) setWallet(walletRes.data.data);
      if (historyRes.data?.data) setHistory(historyRes.data.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu ví", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm xử lý API Rút tiền (Được gọi từ Modal)
  const handleWithdrawSubmit = async (amount) => {
    // API Call (Modal sẽ tự bật isSubmitting)
    await withdrawalService.requestWithdrawal(amount);
    
    // Nếu thành công (không lọt vào catch trong modal)
    window.toastRef?.current?.addMessage({ type: 'success', text: 'Gửi yêu cầu rút tiền thành công!' });
    setIsModalOpen(false); // Đóng modal
    fetchData(); // Load lại lịch sử và số dư
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu ví...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen relative">
      
      <div className="flex flex-col lg:flex-row gap-6">
        <WalletBalanceCard 
          balance={wallet.availableBalance} 
          onWithdrawClick={() => setIsModalOpen(true)} 
        />
      </div>

      <WalletStats 
        pendingBalance={wallet.pendingBalance} 
        lifetimeEarned={wallet.availableBalance} 
      />

      <WithdrawalHistoryTable history={history} />

      {/* Tích hợp Component Modal Mới */}
      <RequestWithdrawalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletBalance={wallet.availableBalance}
        onSubmit={handleWithdrawSubmit}
      />

    </div>
  );
};

export default OwnerWalletPage;