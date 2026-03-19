import React, { useState, useEffect } from 'react';
import withdrawalService from '../../../services/withdrawal.service';
import toast from 'react-hot-toast'; // <-- Thêm dòng này (hoặc import từ 'react-toastify' tùy bạn đang dùng thư viện nào ở root)

// Import components con
import WalletBalanceCard from './WalletBalanceCard';
import WalletStats from './WalletStats';
import WithdrawalHistory from './WithdrawalHistory';
import RequestWithdrawalModal from './RequestWithdrawalModal';

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
    // API Call
    await withdrawalService.requestWithdrawal(amount);
    
    // Đã thay thế window.toastRef bằng thư viện chuẩn
    toast.success('Gửi yêu cầu rút tiền thành công!', {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#fff',
        color: '#1E40AF',
        fontWeight: 'bold',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      },
    });

    setIsModalOpen(false); // Đóng modal
    fetchData(); // Load lại lịch sử và số dư
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu ví...</p>
        </div>
      </div>
    );
  }

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

      <WithdrawalHistory history={history} />

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