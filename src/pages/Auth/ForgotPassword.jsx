import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2, ArrowRight 
} from "lucide-react";
import { authService } from "../../services/auth.service";
import OTPModal from "@/components/auth/OTPModal";
import toast from "react-hot-toast";

// Ảnh nền (Tone xanh thiên nhiên, hy vọng)
const BG_URL = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const handleOTPSuccess = (secureToken) => {
    // Sau khi xác thực OTP thành công (đã nhận UUID từ Modal), 
    // chuyển hướng sang trang đặt lại mật khẩu kèm token (UUID)
    navigate("/reset-password", { 
        state: { 
            token: secureToken
        } 
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Địa chỉ email không đúng định dạng.");
      return;
    }

    setLoading(true);
    try {
      // Hiển thị Modal ngay lập tức như yêu cầu của bạn
      setShowOTPModal(true);

      // Gọi API gửi OTP cho luồng quên mật khẩu (chạy song song/nền)
      authService.sendOtp(email.trim(), "FORGOT_PASSWORD")
        .then(() => {
          toast.success("Mã xác thực đã được gửi đến email của bạn.");
        })
        .catch((err) => {
          console.error("Forgot Password Send OTP Error:", err);
          const msg = err.response?.data?.message || "Không tìm thấy tài khoản với email này.";
          setError(msg);
          toast.error(msg);
          // Nếu gửi lỗi thì đóng modal lại
          setShowOTPModal(false);
        })
        .finally(() => {
          setLoading(false);
        });

    } catch (err) {
      console.error("Forgot Password Submit Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans bg-slate-900 overflow-hidden px-4">
      
      {/* 1. BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat animate-ken-burns-slow"
        style={{ backgroundImage: `url(${BG_URL})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/60 to-cyan-900/40 backdrop-blur-[3px]" />
      </div>

      {/* 2. BACK BUTTON */}
      <button 
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 text-white/90 hover:text-white px-4 py-2 rounded-full bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all group backdrop-blur-md"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Quay lại</span>
      </button>

      {/* 3. MAIN CARD */}
      <div className="relative z-10 w-full max-w-[480px] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in border border-white/50">
        
        <div className="h-2 w-full bg-cyan-600"></div>

        <div className="p-8 md:p-12">
          
          <div className="text-center mb-8">
             <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-inner bg-cyan-50">
                <KeyRound size={36} className="text-cyan-600" />
             </div>
             
             <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                Quên mật khẩu?
             </h2>
             
             <p className="text-slate-500 font-medium leading-relaxed">
                Đừng lo lắng. Hãy nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.
             </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center animate-shake">
                    {error}
                </div>
            )}

            <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-cyan-600' : 'text-slate-400'}`}>
                    <Mail size={22} />
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-14 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none font-semibold text-slate-800 transition-all duration-300
                        ${focusedField === 'email' ? 'border-cyan-500 bg-white shadow-lg shadow-cyan-500/10' : 'border-slate-100 hover:border-slate-300'}
                    `}
                    placeholder="Nhập địa chỉ email của bạn"
                    autoFocus
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-cyan-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <> <Loader2 className="animate-spin" /> Đang xử lý... </>
                ) : (
                    "Gửi mã xác thực"
                )}
            </button>
          </form>

        </div>
      </div>

      {/* ✅ OTP MODAL */}
      <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          email={email}
          type="FORGOT_PASSWORD"
          onSuccess={handleOTPSuccess}
      />

      <style>{`
         @keyframes ken-burns-slow { 
             0% { transform: scale(1); } 
             100% { transform: scale(1.1); } 
         }
         .animate-ken-burns-slow { animation: ken-burns-slow 20s infinite alternate ease-in-out; }
         @keyframes zoom-in { 
             0% { opacity: 0; transform: scale(0.95); } 
             100% { opacity: 1; transform: scale(1); } 
         }
         .animate-zoom-in { animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default ForgotPassword;