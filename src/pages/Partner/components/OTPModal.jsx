import React, { useState, useRef, useEffect } from 'react';
import { X, Plane, Briefcase, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../services/auth.service';
import toast from 'react-hot-toast';

const OTPModal = ({ isOpen, onClose, email, onSuccess, verifyOtpApi }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Ưu tiên dùng api được truyền vào, nếu không thì dùng mặc định
  const verifyApi = verifyOtpApi || authService.verifyOwnerOtp;

  // Focus input đầu tiên khi mở modal
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0].focus(), 100);
    }
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // Handle Input Change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace & Paste
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'Enter' && otp.every(val => val !== '')) {
      handleVerify();
    }
  };

  // Logic Paste OTP (tiện lợi cho UX)
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      pasteData.forEach((val, i) => {
        if (i < 6 && /^\d$/.test(val)) newOtp[i] = val;
      });
      setOtp(newOtp);
      // Focus vào ô cuối cùng có dữ liệu
      const lastIndex = Math.min(pasteData.length, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('Vui lòng nhập đầy đủ 6 mã số');
      return;
    }

    setLoading(true);
    try {
      console.log("Verifying OTP for email:", email, "code:", otpCode);
      const response = await verifyApi(email, otpCode);
      
      console.log("Full Backend Response:", response);
      console.log("Response Data Content:", response.data);

      // Thử nhiều trường hợp để lấy token (Ưu tiên temporaryToken theo log thực tế, sau đó đến registrationToken)
      const token = 
        response.data?.data?.temporaryToken || 
        response.data?.data?.registrationToken || 
        response.data?.temporaryToken || 
        response.data?.registrationToken ||
        (typeof response.data?.data === 'string' ? response.data.data : null);

      console.log("Extracted Token:", token);

      if (token) {
        onSuccess(token);
        onClose();
      } else {
        console.error("Token not found in response structure");
        toast.error('Xác thực thành công nhưng không tìm thấy mã đăng ký trong phản hồi.');
      }
    } catch (error) {
      console.error("OTP Verification Error Details:", error);
      const msg = error.response?.data?.message || 'Mã xác thực không chính xác hoặc đã hết hạn.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    try {
      await authService.sendOwnerOtp(email);
      toast.success('Đã gửi lại mã OTP!');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error('Gửi lại thất bại.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-sans p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-[500px] p-8 rounded-[24px] shadow-2xl border border-white/20 overflow-hidden bg-white/10 backdrop-blur-md"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="p-4 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full shadow-lg shadow-cyan-500/30">
                <Briefcase className="text-white" size={32} />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Xác thực Đối tác</h2>
              <p className="text-white/80 text-sm">
                Nhập mã 6 số được gửi tới <span className="font-bold text-cyan-300">{email}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/90 text-slate-800 focus:ring-4 focus:ring-cyan-400/50 outline-none border-none shadow-inner"
                />
              ))}
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <>Xác thực ngay <Plane className="rotate-45" size={20}/></>}
            </motion.button>

            {/* Resend Link */}
            <div className="text-sm text-white/80">
              Chưa nhận được mã?{' '}
              <button 
                onClick={handleResend}
                disabled={timer > 0 || isResending}
                className="text-cyan-300 hover:text-white font-semibold underline disabled:text-white/50 disabled:no-underline"
              >
                {timer > 0 ? `Gửi lại sau ${timer}s` : 'Gửi lại mã'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OTPModal;