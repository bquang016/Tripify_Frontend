import React, { useState, useEffect } from 'react';
import withdrawalService from '../../../services/withdrawal.service';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import TextField from '../../../components/common/Input/TextField';
import { formatCurrency } from '../../../utils/priceUtils';
import { Landmark } from 'lucide-react'; // Bổ sung import icon mới

// Import components con mới
import WalletBalanceCard from './WalletBalanceCard';
import WalletStats from './WalletStats';
import WithdrawalHistoryTable from './WithdrawalHistoryTable';

const OwnerWalletPage = () => {
  const [wallet, setWallet] = useState({ availableBalance: 0, pendingBalance: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const amount = Number(withdrawAmount.replace(/[^0-9]/g, ''));

    if (amount < 500000) {
      setErrorMsg('Số tiền rút tối thiểu là 500,000 VNĐ');
      return;
    }
    if (amount > wallet.availableBalance) {
      setErrorMsg('Số dư khả dụng không đủ');
      return;
    }

    try {
      setIsSubmitting(true);
      await withdrawalService.requestWithdrawal(amount);
      
      window.toastRef?.current?.addMessage({ type: 'success', text: 'Gửi yêu cầu rút tiền thành công!' });
      setIsModalOpen(false);
      setWithdrawAmount('');
      fetchData(); 
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu ví...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      
      {/* 1. Thống kê số dư chính (Hero Card) */}
      <div className="flex flex-col lg:flex-row gap-6">
        <WalletBalanceCard 
          balance={wallet.availableBalance} 
          onWithdrawClick={() => setIsModalOpen(true)} 
        />
      </div>

      {/* 2. Thống kê phụ (Pending Balance) */}
      <WalletStats 
        pendingBalance={wallet.pendingBalance} 
        lifetimeEarned={wallet.availableBalance} // Fake dữ liệu, Backend cần bổ sung total_earned
      />

      {/* 3. Bảng lịch sử giao dịch */}
      <WithdrawalHistoryTable history={history} />

      {/* Modal Rút tiền */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yêu cầu rút tiền" size="sm">
        <form onSubmit={handleWithdraw} className="space-y-5 p-5">
          <div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm border border-blue-100 flex items-center gap-3">
            <Landmark className="text-blue-600" size={32} />
            <div>
              <p className="font-semibold">Số dư khả dụng:</p>
              <span className="font-extrabold text-2xl tabular-nums">{formatCurrency(wallet.availableBalance)} VNĐ</span>
            </div>
          </div>
          
          <TextField
            label="Số tiền muốn rút (VNĐ)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Nhập số tiền (Tối thiểu 500,000)"
            required
            className="rounded-xl border-gray-300 py-3"
          />

          {errorMsg && <p className="text-red-600 text-sm font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">{errorMsg}</p>}

          <div className="flex justify-end gap-3.5 mt-8 border-t border-gray-100 pt-5">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button" className="rounded-full py-3 px-6">Hủy</Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting} className="rounded-full py-3 px-7 bg-[#1E40AF]">Xác nhận rút</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OwnerWalletPage;