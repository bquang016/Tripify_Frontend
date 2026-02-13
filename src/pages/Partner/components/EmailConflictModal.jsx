import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailConflictModal = ({ isOpen, onClose, email }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Top Decorative bar */}
          <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-rose-500" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-10 text-center">
            {/* Icon container */}
            <div className="mx-auto w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-rose-100 rounded-full animate-ping opacity-20" />
              <AlertCircle size={40} className="text-rose-500 relative z-10" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Email đã tồn tại
            </h3>
            
            <p className="text-slate-500 mb-8 leading-relaxed">
              Email <span className="font-bold text-slate-700">{email}</span> đã được đăng ký trên hệ thống của chúng tôi. 
              Bạn có muốn đăng nhập vào tài khoản này không?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 bg-[#28A9E0] hover:bg-[#2090C0] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Đăng nhập ngay <UserCheck size={20} />
              </button>
              
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
              >
                Dùng email khác <ArrowRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Bạn cần hỗ trợ? <span className="text-[#28A9E0] cursor-pointer hover:underline">Liên hệ trung tâm trợ giúp</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmailConflictModal;
