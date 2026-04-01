import React from 'react';
import { formatCurrency } from '../../../utils/priceUtils';
import { Clock, TrendingUp, BarChart3 } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, unit = 'VNĐ', description, color='blue' }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-900' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-900' },
  };
  const theme = colorMap[color];

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col space-y-2 flex-1 min-w-[280px]`}>
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <Icon size={18} />
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className={`text-3xl font-bold ${theme.value} flex items-baseline gap-1.5`}>
        {formatCurrency(value)}
        <span className="text-xl font-semibold text-gray-500">{unit}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const WalletStats = ({ pendingBalance, lifetimeEarned=0 }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 animate-fadeInDelay">
      <StatCard 
        icon={Clock} 
        title="Số dư đang chờ (Pending)" 
        value={pendingBalance} 
        description="Tiền phòng sẽ được chuyển sang số dư khả dụng sau 48 giờ kể từ lúc khách Check-out."
        color="amber"
      />
      <StatCard 
        icon={TrendingUp} 
        title="Tổng thu nhập khả dụng" 
        value={lifetimeEarned} 
        description="Tổng số tiền thực nhận bạn đã tích lũy được trên Tripify kể từ khi bắt đầu."
        color="blue"
      />
    </div>
  );
};

export default WalletStats;