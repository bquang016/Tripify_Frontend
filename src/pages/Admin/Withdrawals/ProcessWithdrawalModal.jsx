import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatCurrency } from '../../../utils/priceUtils';
import { X, CheckCircle, AlertCircle, AlertTriangle, ArrowRightLeft, Calendar, Hash, User } from 'lucide-react';

const ProcessWithdrawalModal = ({ isOpen, onClose, request, onApprove, onReject, isProcessing }) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleRejectSubmit = () => {
    if (!adminNote.trim()) return;
    onReject(request.id, adminNote);
  };

  const resetAndClose = () => {
    if (!isProcessing) {
      setIsRejecting(false);
      setAdminNote('');
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" 
      style={{ top: 0, left: 0, right: 0, bottom: 0 }} 
    >
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={resetAndClose}
      ></div>

      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn scale-100 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <ArrowRightLeft size={20} />
            </div>
            Xử lý Rút tiền
          </h3>
          <button 
            onClick={resetAndClose} 
            disabled={isProcessing} 
            className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-100/50 space-y-4">
            
            {/* THÊM THÔNG TIN OWNER VÀO ĐÂY */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-50/50">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                {request.ownerName ? request.ownerName.charAt(0).toUpperCase() : <User size={20}/>}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Người yêu cầu (Owner)</p>
                <p className="font-bold text-gray-900 truncate" title={request.ownerName}>
                  {request.ownerName || 'Không xác định'}
                </p>
                <p className="text-xs text-gray-500 truncate" title={request.ownerEmail}>
                  {request.ownerEmail || 'Chưa cập nhật email'}
                </p>
              </div>
            </div>

            <div className="text-center space-y-1 pb-4 border-b border-blue-100/50 mt-4">
              <p className="text-sm font-medium text-gray-500">Số tiền yêu cầu</p>
              <p className="text-4xl font-extrabold text-blue-600 tabular-nums">
                {formatCurrency(request.amount)}
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <Hash size={16} />
                  <span className="text-sm">Mã giao dịch</span>
                </div>
                <span className="font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">
                  #W{request.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span className="text-sm">Ngày tạo lệnh</span>
                </div>
                <span className="font-medium text-gray-900 text-sm">
                  {new Date(request.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {!isRejecting && (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200/50 flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed">
                Khi bấm <b>Duyệt tiền</b>, hệ thống sẽ gọi Stripe để chuyển tiền thật vào tài khoản ngân hàng của Owner. Thao tác này không thể hoàn tác.
              </p>
            </div>
          )}

          {isRejecting && (
            <div className="space-y-2 animate-fadeIn">
              <label className="block text-sm font-bold text-gray-900">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ví dụ: Thông tin tài khoản không hợp lệ..."
                className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 resize-none h-28 text-sm transition-all"
              />
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-white flex gap-3">
          {isRejecting ? (
            <>
              <button 
                onClick={() => setIsRejecting(false)} 
                disabled={isProcessing}
                className="flex-[1] py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Quay lại
              </button>
              <button 
                onClick={handleRejectSubmit} 
                disabled={isProcessing || !adminNote.trim()}
                className="flex-[2] py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : 'Xác nhận Từ chối'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsRejecting(true)} 
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-white border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                <AlertTriangle size={18} /> Từ chối
              </button>
              <button 
                onClick={() => onApprove(request.id)} 
                disabled={isProcessing}
                className="flex-[2] py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : <><CheckCircle size={18} /> Duyệt tiền ngay</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ProcessWithdrawalModal;