import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  Mail, ArrowRight, Building2, ArrowLeft, Palmtree 
} from "lucide-react";

import PartnerInput from "./components/PartnerInput";
import OTPModal from "./components/OTPModal";
import EmailConflictModal from "./components/EmailConflictModal";
import { authService } from "../../services/auth.service"; 
import { useOnboarding } from "../../context/OnboardingContext"; // Import useOnboarding
import logo from "../../assets/logo/logo_travelmate_xoafont.png"; 

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const OwnerRegisterPage = () => {
  const navigate = useNavigate();
  const { updateFormData } = useOnboarding();
  const [emailForReg, setEmailForReg] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictModalMessage, setConflictModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onChange" });

  const handleCheckEmail = async (data) => {
    setIsLoading(true);
    try {
      // Step 1.1: Check Email
      await authService.checkOwnerEmail(data.email);
      
      // Hiển thị Modal ngay lập tức sau khi check email thành công
      setEmailForReg(data.email);
      setShowOtpModal(true);

      // Step 1.2: Send OTP (chạy trong nền)
      authService.sendOwnerOtp(data.email)
        .then(() => {
          toast.success("Mã xác thực đã được gửi đến email của bạn!");
        })
        .catch((error) => {
          const msg = error.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại.";
          toast.error(msg);
          setShowOtpModal(false); // Đóng modal nếu lỗi gửi OTP
        })
        .finally(() => {
          setIsLoading(false);
        });

    } catch (error) {
      const msg = error.response?.data?.message || "Đã có lỗi xảy ra.";
      const status = error.response?.status;

      if (status === 409) {
          if (msg.includes("đang được chờ duyệt")) {
               setConflictModalMessage("Tài khoản của bạn hiện đang trong quá trình chờ xét duyệt... Vui lòng chờ kết quả qua email.");
          } else {
               setConflictModalMessage("Email này đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng email khác hoặc đăng nhập.");
          }
        setShowConflictModal(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSuccess = (token) => {
    // Step 1.3: OTP verified, we have the temporary token
    updateFormData({ temporaryToken: token, email: emailForReg }); // Save token and email to context
    setShowOtpModal(false);
    toast.success("Xác thực email thành công!");
    navigate("/partner/onboarding/step-1"); // Navigate to the main form
  };

  // --- UI: COASTAL ELEGANCE ---
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans flex items-center justify-center p-4">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Coastal Resort" 
            className="w-full h-full object-cover blur-[2px]"
         />
         <div className="absolute inset-0 bg-white/20"></div>
      </div>
      
      <OTPModal 
        isOpen={showOtpModal} 
        onClose={() => setShowOtpModal(false)}
        email={emailForReg}
        onSuccess={onOtpSuccess} // Updated to handle token
        verifyOtpApi={authService.verifyOwnerOtp} // Pass the verify function
      />

      <EmailConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        email={emailForReg}
        message={conflictModalMessage}
      />

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex w-full overflow-hidden rounded-[30px] shadow-2xl bg-white/90 backdrop-blur-xl lg:flex-row flex-col ring-1 ring-white/50">
          
          {/* --- LEFT SIDE: BRANDING --- */}
          <div className="relative flex flex-col justify-between p-10 lg:w-5/12 overflow-hidden bg-[#28A9E0]">
            <img 
                src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Partner Relaxing"
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#28A9E0]/90 to-[#1e8ec0]/90"></div>
            
            <div className="relative z-10">
                <Link to="/" className="mb-8 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Trang chủ
                </Link>
                
                <img src={logo} alt="Tripify Logo" className="h-12 w-auto mb-8 brightness-0 invert drop-shadow-md" />
                
                <h2 className="text-3xl font-bold leading-tight text-white tracking-tight drop-shadow-sm">
                  Mở rộng kinh doanh cùng Tripify.
                </h2>
                
                <p className="mt-4 text-blue-50 text-base leading-relaxed font-medium">
                  Tiếp cận hàng triệu du khách và quản lý chỗ nghỉ dễ dàng hơn bao giờ hết.
                </p>
            </div>

            <div className="relative z-10 mt-12 flex gap-2">
               <div className='w-8 h-1.5 rounded-full bg-white'></div>
               <div className='w-2 h-1.5 rounded-full bg-white/40'></div>
               <div className='w-2 h-1.5 rounded-full bg-white/40'></div>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM --- */}
          <div className="flex flex-col justify-center p-10 lg:w-7/12 bg-white">
            <div className="mx-auto w-full max-w-md">
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Đăng ký Đối tác
                    <Palmtree className="text-[#28A9E0]" size={24} strokeWidth={1.5} />
                </h3>
                <p className="text-slate-500 mt-1 text-sm font-medium">
                    Bắt đầu bằng cách xác thực email của bạn.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleCheckEmail)} className="space-y-6">
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
                    
                    <div className="mt-5 rounded-2xl bg-blue-50/50 border border-blue-100 p-4 text-sm text-slate-600">
                        <div className="flex gap-3 items-start">
                            <Building2 size={18} className="shrink-0 text-[#28A9E0] mt-0.5"/>
                            <span className="leading-relaxed">Mẹo: Dùng email bạn kiểm tra thường xuyên để nhận thông báo đặt phòng nhanh nhất.</span>
                        </div>
                    </div>
                  </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#28A9E0] py-4 text-base font-bold text-white shadow-lg shadow-[#28A9E0]/30 transition-all duration-300 hover:bg-[#2090C0] hover:shadow-[#28A9E0]/40 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {isLoading ? <Spinner /> : "Xác thực Email"}
                    {!isLoading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5}/>}
                  </button>
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