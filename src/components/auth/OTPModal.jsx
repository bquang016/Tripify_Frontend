import React, { useState, useRef, useEffect } from 'react';
import { X, Plane, Briefcase, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

const OTPModal = ({ isOpen, onClose, email, onSuccess, type = "REGISTER" }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Log để kiểm tra email khi modal mở
  useEffect(() => {
    if (isOpen) {
      console.log(`>>> OTP Modal target [${type}]:`, email);
    }
  }, [isOpen, email, type]);

  // Timer logic for resend OTP
  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // Handle OTP input changes
  const handleChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    // Lấy ký tự cuối cùng nếu người dùng nhập nhanh hoặc paste
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Xử lý phím Enter để verify
    if (e.key === 'Enter' && otp.every(val => val !== '')) {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('Vui lòng nhập đầy đủ 6 mã số');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Đang xử lý mã OTP...');
    try {
      if (type === "REGISTER") {
        // Luồng Đăng ký: Truyền otpCode ra cho cha xử lý verify-register
        console.log(">>> OTP for Register entered, passing to parent...");
        setTimeout(() => {
          toast.dismiss(loadingToast);
          if (onSuccess) onSuccess(otpCode);
          onClose();
        }, 500);
      } else {
        // Luồng khác (Quên mật khẩu...): Gọi verifyOtp trực tiếp
        console.log(`>>> Verifying OTP for current flow...`);
        await authService.verifyOtp(email, otpCode);
        toast.success('Xác thực mã OTP thành công!', { id: loadingToast });
        
        setTimeout(() => {
          if (onSuccess) onSuccess(otpCode);
          onClose();
        }, 800);
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      const errorMessage = error.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    const loadingToast = toast.loading('Đang gửi lại mã...');
    try {
      await authService.sendOtp(email, type);
      toast.success('Đã gửi lại mã OTP mới qua email của bạn', { id: loadingToast });
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (error) {
      toast.error('Không thể gửi lại mã, vui lòng thử lại sau', { id: loadingToast });
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-sans p-4">
        {/* Backdrop Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        />

        {/* Glass Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[500px] mx-4 p-8 md:p-10 rounded-[20px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/30 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
          }}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>

          {/* Content Stack */}
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Travel Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-40 rounded-full animate-pulse" />
              <div className="relative p-5 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <Briefcase className="text-white" size={36} />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="text-[24px] md:text-[28px] font-bold text-white tracking-wide leading-tight">
                Xác thực thông minh - Smart Booking
              </h2>
              <p className="text-[14px] md:text-[15px] text-white/90 max-w-[340px] mx-auto leading-relaxed">
                Nhập mã OTP đã gửi đến thông tin của bạn để hoàn tất quy trình xác thực.
              </p>
            </div>

            {/* OTP Inputs Layout */}
            <div className="flex gap-2 md:gap-3 justify-center my-6">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold bg-white/95 rounded-[10px] text-[#333] border-2 border-transparent focus:border-[#00C6FF] focus:shadow-[0_0_15px_rgba(0,198,255,0.6)] outline-none transition-all duration-200"
                />
              ))}
            </div>

            {/* Verify Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={loading}
              className="w-full h-12 md:h-14 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] rounded-[10px] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={24} />
              ) : (
                <>
                  <Plane size={24} className="rotate-[-45deg] transform transition-transform group-hover:translate-x-1" />
                  <span>Xác thực ngay</span>
                </>
              )}
            </motion.button>

            {/* Footer */}
            <div className="text-[14px] text-white/90 pt-2">
              Chưa nhận được mã?{' '}
              <button 
                onClick={handleResend}
                disabled={timer > 0 || isResending}
                className={`font-semibold transition-all duration-200 ${
                  timer > 0 || isResending 
                    ? 'text-white/50 cursor-not-allowed' 
                    : 'text-[#00C6FF] hover:text-white underline-offset-4 hover:underline'
                }`}
              >
                {timer > 0 ? `Gửi lại mã sau (${timer}s)` : 'Gửi lại mã OTP'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OTPModal;
