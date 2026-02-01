import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, Mail, User, X } from 'lucide-react';
import Button from '@/components/common/Button/Button';
import ModalPortal from './ModalPortal';
import Avatar from '@/components/common/Avatar/Avatar';

const AccountReviewModal = ({ open, userData, onClose }) => {
  if (!open || !userData) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[100] bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl overflow-hidden relative"
          >
            {/* Header Background */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-24 flex items-center justify-center relative">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white/80 hover:text-white transition"
              >
                <X size={24} />
              </button>
              <div className="bg-white p-3 rounded-full shadow-lg mt-16">
                <CheckCircle size={40} className="text-green-500" />
              </div>
            </div>

            <div className="pt-12 pb-8 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Thiết lập thành công!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Tài khoản của bạn đã được bảo mật. Bây giờ bạn có thể đăng nhập bằng Email và Mật khẩu.
              </p>

              {/* Thông tin tài khoản */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4 text-left">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Avatar 
                    src={userData.profilePhotoUrl || userData.avatarUrl} 
                    alt={userData.fullName} 
                    size="md" 
                  />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Tài khoản</p>
                    <p className="font-bold text-gray-800">{userData.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Email đăng nhập</p>
                    <p className="font-medium text-gray-800 truncate" title={userData.email}>
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-full">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Trạng thái bảo mật</p>
                    <p className="font-medium text-green-600">Đã kích hoạt mật khẩu</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button fullWidth onClick={onClose} size="lg">
                  Hoàn tất
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default AccountReviewModal;