import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  Mail, Lock, ArrowRight, CheckCircle2, Building2, ArrowLeft, Palmtree
} from "lucide-react";

import PartnerInput from "./components/PartnerInput";
import PasswordStrengthCheck from "./components/PasswordStrengthCheck";
import OTPModal from "./components/OTPModal";
import EmailConflictModal from "./components/EmailConflictModal";
import { authService } from "../../services/auth.service"; 
import logo from "../../assets/logo/logo_travelmate_xoafont.png"; 

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const OwnerRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailForReg, setEmailForReg] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: "onChange" });

  const passwordValue = watch("password");

  // --- LOGIC HANDLERS (Giữ nguyên) ---
  const onSendOtp = async (data) => {
    setIsLoading(true);
    try {
      await authService.sendOwnerOtp(data.email);
      setEmailForReg(data.email);
      setShowOtpModal(true);
      toast.success("Mã xác thực đã được gửi!");
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("đã được đăng ký") || error.response?.status === 409) {
        setEmailForReg(data.email);
        setShowConflictModal(true);
      } else {
        toast.error(msg || "Lỗi gửi OTP.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpVerified = (code) => {
    setOtpCode(code);
    setStep(2);
  };

  const onFinalRegister = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        email: emailForReg,
        otp: otpCode,
        password: data.password
      };
      
      const res = await authService.registerOwner(payload);
      if (res.data?.data?.accessToken) {
         localStorage.setItem("token", res.data.data.accessToken);
         localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }
      toast.success("Đăng ký thành công!");
      navigate("/partner/onboarding/step-1");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    if (step === 1) onSendOtp(data);
    else onFinalRegister(data);
  };

  // --- UI: COASTAL ELEGANCE ---
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans flex items-center justify-center p-4">
      
      {/* --- BACKGROUND BIỂN CAO CẤP --- */}
      <div className="absolute inset-0 z-0">
         {/* Ảnh Resort Maldives/Nha Trang sáng sủa */}
         <img 
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Coastal Resort" 
            className="w-full h-full object-cover blur-[2px]"
         />
         {/* Overlay màu trắng mờ để làm dịu ảnh nền */}
         <div className="absolute inset-0 bg-white/20"></div>
      </div>
      
      <OTPModal 
        isOpen={showOtpModal} 
        onClose={() => setShowOtpModal(false)}
        email={emailForReg}
        onSuccess={onOtpVerified}
      />

      <EmailConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        email={emailForReg}
      />

      {/* MAIN CARD: TRẮNG SỨ & KÍNH MỜ */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex w-full overflow-hidden rounded-[30px] shadow-2xl bg-white/90 backdrop-blur-xl lg:flex-row flex-col ring-1 ring-white/50">
          
          {/* LEFT SIDE: BRANDING (Ảnh + Overlay Xanh Nhẹ) */}
          <div className="relative flex flex-col justify-between p-10 lg:w-5/12 overflow-hidden bg-[#28A9E0]">
            {/* Ảnh nền cột trái */}
            <img 
                src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Partner Relaxing"
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
            {/* Gradient overlay nhẹ nhàng */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#28A9E0]/90 to-[#1e8ec0]/90"></div>
            
            <div className="relative z-10">
                <Link to="/" className="mb-8 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Trang chủ
                </Link>
                
                {/* Logo Trắng */}
                <img src={logo} alt="Tripify Logo" className="h-12 w-auto mb-8 brightness-0 invert drop-shadow-md" />
                
                <h2 className="text-3xl font-bold leading-tight text-white tracking-tight drop-shadow-sm">
                  {step === 1 ? "Mở rộng kinh doanh cùng Tripify." : "Bảo mật tài khoản."}
                </h2>
                
                <p className="mt-4 text-blue-50 text-base leading-relaxed font-medium">
                  {step === 1 
                    ? "Tiếp cận hàng triệu du khách và quản lý chỗ nghỉ dễ dàng hơn bao giờ hết."
                    : "Thiết lập mật khẩu an toàn để bắt đầu quản lý tài sản của bạn."
                  }
                </p>
            </div>

            {/* Steps Indicator (Trắng & Mềm mại) */}
            <div className="relative z-10 mt-12 flex gap-2">
               <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>
               <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>
               <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 3 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM (Trắng Sạch Sẽ) */}
          <div className="flex flex-col justify-center p-10 lg:w-7/12 bg-white">
            <div className="mx-auto w-full max-w-md">
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    {step === 1 ? "Đăng ký Đối tác" : "Tạo mật khẩu"}
                    {/* Icon cọ dừa nhỏ tạo vibe biển */}
                    <Palmtree className="text-[#28A9E0]" size={24} strokeWidth={1.5} />
                </h3>
                <p className="text-slate-500 mt-1 text-sm font-medium">
                    {step === 1 ? "Bắt đầu hành trình mới của bạn." : `Email: ${emailForReg}`}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* --- STEP 1 --- */}
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <PartnerInput
                      label="Email doanh nghiệp / cá nhân"
                      name="email"
                      type="email"
                      placeholder="partner@tripify.com"
                      icon={Mail}
                      register={register}
                      error={errors.email}
                      rules={{
                        required: "Vui lòng nhập email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email không đúng định dạng"
                        }
                      }}
                    />
                    
                    {/* Note Box mềm mại */}
                    <div className="mt-5 rounded-2xl bg-blue-50/50 border border-blue-100 p-4 text-sm text-slate-600">
                        <div className="flex gap-3 items-start">
                            <Building2 size={18} className="shrink-0 text-[#28A9E0] mt-0.5"/>
                            <span className="leading-relaxed">Mẹo: Dùng email bạn kiểm tra thường xuyên để nhận thông báo đặt phòng nhanh nhất.</span>
                        </div>
                    </div>
                  </div>
                )}

                {/* --- STEP 2 --- */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-2xl text-sm font-medium border border-green-100">
                        <CheckCircle2 size={18} className="text-green-500"/> 
                        <span>Email đã được xác thực thành công.</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <PartnerInput
                                label="Mật khẩu mới"
                                name="password"
                                type="password"
                                placeholder="Tạo mật khẩu..."
                                icon={Lock}
                                register={register}
                                error={errors.password}
                                rules={{
                                    required: "Vui lòng nhập mật khẩu",
                                    minLength: { value: 8, message: "Tối thiểu 8 ký tự" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: "Mật khẩu chưa đủ mạnh"
                                    }
                                }}
                            />
                            {/* Check Pass */}
                            <PasswordStrengthCheck password={passwordValue} />
                        </div>

                         <PartnerInput
                            label="Nhập lại mật khẩu"
                            name="confirmPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            icon={Lock}
                            register={register}
                            error={errors.confirmPassword}
                            rules={{
                                required: "Vui lòng xác nhận mật khẩu",
                                validate: (val) => watch('password') === val || "Mật khẩu không khớp"
                            }}
                        />
                    </div>
                  </div>
                )}

                {/* BUTTON GROUP - MÀU CHỦ ĐẠO */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#28A9E0] py-4 text-base font-bold text-white shadow-lg shadow-[#28A9E0]/30 transition-all duration-300 hover:bg-[#2090C0] hover:shadow-[#28A9E0]/40 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {isLoading ? <Spinner /> : null}
                    {step === 1 ? (
                        <>Tiếp tục <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5}/></>
                    ) : (
                        <>Hoàn tất đăng ký <CheckCircle2 size={20} strokeWidth={2.5}/></>
                    )}
                  </button>

                  {step === 2 && (
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-4 w-full text-center text-sm font-semibold text-slate-400 hover:text-[#28A9E0] transition-colors"
                    >
                        Quay lại thay đổi email
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Đã là đối tác của chúng tôi?{" "}
                <Link to="/login" className="font-bold text-[#28A9E0] hover:underline transition-colors">
                  Đăng nhập ngay
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegisterPage;