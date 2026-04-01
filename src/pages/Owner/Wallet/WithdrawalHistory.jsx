import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/priceUtils';
import { 
  Clock, CheckCircle2, XCircle, AlertTriangle, 
  ArrowUpRight, ReceiptText, MessageSquareQuote, 
  ChevronRight, X, Calendar, Hash
} from 'lucide-react';

// ==========================================
// 1. CUSTOM BADGE COMPONENT (Tạo mới nội bộ)
// ==========================================
const CustomBadge = ({ icon: Icon, label, colorClass, bgClass }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${bgClass} ${colorClass} border-opacity-20`}>
    <Icon size={14} strokeWidth={2.5} />
    {label}
  </span>
);

// ==========================================
// 2. MODAL CHI TIẾT GIAO DỊCH
// ==========================================
const TransactionDetailModal = ({ transaction, onClose, getStatusConfig }) => {
  if (!transaction) return null;
  const config = getStatusConfig(transaction.status);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn scale-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Chi tiết giao dịch</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Số tiền & Trạng thái */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-500 font-medium">Số tiền rút</p>
            <div className="text-4xl font-extrabold text-gray-900 tabular-nums">
              {formatCurrency(transaction.amount)}
            </div>
            <div className="flex justify-center mt-2">
              <CustomBadge icon={config.icon} label={config.label} colorClass={config.color} bgClass={config.bg} />
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* Thông tin chi tiết */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <Hash size={18} />
                <span className="text-sm font-medium">Mã giao dịch</span>
              </div>
              <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">#W{transaction.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={18} />
                <span className="text-sm font-medium">Thời gian tạo</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(transaction.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <ReceiptText size={18} />
                <span className="text-sm font-medium">Loại giao dịch</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Rút tiền về tài khoản/ thẻ cá nhân</span>
            </div>
          </div>

          {/* Ghi chú từ admin */}
          {transaction.adminNote && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-800 mb-1">
                <MessageSquareQuote size={18} />
                <span className="font-bold text-sm">Ghi chú từ hệ thống</span>
              </div>
              <p className="text-sm text-amber-900/80 leading-relaxed">
                {transaction.adminNote}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. COMPONENT CHÍNH
// ==========================================
const WithdrawalHistory = ({ history }) => {
  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State Chi tiết Modal
  const [selectedTx, setSelectedTx] = useState(null);

  // Logic Phân trang
  const totalPages = Math.ceil((history?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING': 
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 border-amber-200', label: 'Đang xử lý' };
      case 'APPROVED': 
        return { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100 border-blue-200', label: 'Đã duyệt' };
      case 'COMPLETED': 
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 border-green-200', label: 'Hoàn tất' };
      case 'REJECTED': 
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 border-red-200', label: 'Từ chối' };
      case 'FAILED': 
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 border-red-200', label: 'Thất bại' };
      default: 
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100 border-gray-200', label: status };
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fadeInDelay2">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ReceiptText className="text-blue-600" size={24} />
          Lịch sử giao dịch
        </h2>
        {history.length > 0 && (
          <span className="text-sm text-gray-500 font-medium">
            Tổng cộng: {history.length} giao dịch
          </span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <ReceiptText size={32} strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 font-medium">Bạn chưa có yêu cầu rút tiền nào.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-50">
            {currentItems.map((item) => {
              const config = getStatusConfig(item.status);

              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedTx(item)}
                  className="p-5 hover:bg-blue-50/50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Cột trái: Icon, ID, Ngày tháng */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl bg-gray-50 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shrink-0`}>
                      <ArrowUpRight size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Rút tiền về tài khoản</span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(item.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Cột phải: Số tiền, Badge, Icon Mũi tên */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
                    <div className="flex flex-col items-start sm:items-end gap-1.5">
                      <span className="text-lg font-bold text-gray-900 tabular-nums">
                        -{formatCurrency(item.amount)}
                      </span>
                      <CustomBadge 
                        icon={config.icon} 
                        label={config.label} 
                        colorClass={config.color} 
                        bgClass={config.bg} 
                      />
                    </div>
                    <div className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phân trang (Pagination) */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
              <p className="text-sm text-gray-500 font-medium">
                Hiển thị <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, history.length)}</span> trong số <span className="font-bold text-gray-900">{history.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </  >
      )}

      {/* Render Modal Chi tiết */}
      <TransactionDetailModal 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
        getStatusConfig={getStatusConfig}
      />
    </div>
  );
};

export default WithdrawalHistory;