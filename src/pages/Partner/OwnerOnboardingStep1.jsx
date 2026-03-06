import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { 
  User, Phone, MapPin, CreditCard, Flag, ArrowRight, Building2, Phone as PhoneIcon, Check 
} from "lucide-react";

import { useOnboarding } from "@/context/OnboardingContext";
import PartnerInput from "./components/PartnerInput";
import OnboardingStepper from "./components/OnboardingStepper";
import ImageUploadField from "./components/ImageUploadField";
import DatePickerInput from "../../components/common/Input/DatePickerInput";
import logo from "@/assets/logo/logo_tripify_xoafont.png"; 
import AvatarUpload from "./components/AvatarUpload";

import AdminSelectorsWithApi from "./OnboardingSteps/components/AdminSelectorsWithApi";

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const OwnerOnboardingStep1 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm({ 
      mode: "onChange",
      defaultValues: formData,
  });

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleMajorStepClick = (stepId) => {
    // FIX: Chỉ lưu các trường thuộc Step 1 để bảo toàn propertyInfo và paymentInfo đã điền
    const data = getValues();
    updateFormData({
        avatar: data.avatar,
        cccdFront: data.cccdFront,
        cccdBack: data.cccdBack,
        identityCardNumber: data.identityCardNumber,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : null,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        streetAddress: data.streetAddress,
        provinceCode: data.provinceCode,
        districtCode: data.districtCode,
        wardCode: data.wardCode,
        provinceName: data.provinceName,
        districtName: data.districtName,
        wardName: data.wardName,
    });
    
    if (stepId === 1) navigate("/partner/onboarding/step-1");
    if (stepId === 2) navigate("/partner/onboarding/step-2");
    if (stepId === 3) navigate("/partner/onboarding/step-3");
    if (stepId === 4) navigate("/partner/onboarding/step-4");
  };

  const onSubmit = (data) => {
    const profileData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : null,
    };
    updateFormData(profileData);
    navigate("/partner/onboarding/step-2"); 
  };


  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans pb-20">
      
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Tripify" className="h-9 w-auto" />
                <div className="h-6 w-px bg-slate-300 mx-1"></div>
                <span className="font-bold text-slate-700 tracking-tight">Partner Center</span>
            </div>
            
            {/* Desktop Stepper */}
            <div className="hidden md:block w-[500px]">
                <OnboardingStepper currentStep={1} onStepClick={handleMajorStepClick} />
            </div>

            {/* Mobile: Simple Step Text */}
            <div className="md:hidden text-sm font-semibold text-[#28A9E0]">
                Bước 1/3
            </div>
        </div>
      </header>

      {/* Mobile Stepper */}
      <div className="md:hidden px-4 mt-4">
          <OnboardingStepper currentStep={1} onStepClick={handleMajorStepClick} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* --- LEFT: FORM NHẬP LIỆU --- */}
            <div className="flex-1 w-full">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Xác minh danh tính</h1>
                    <p className="text-slate-500 mt-2 text-lg">Cung cấp thông tin CCCD/CMND để kích hoạt tài khoản và nhận thanh toán.</p>
                </div>

                <form className="space-y-8">
                    
                    {/* --- GROUP 1: ẢNH ĐẠI DIỆN (ĐÃ CUSTOM UI) --- */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                         {/* Header nhỏ gọn hơn */}
                         <div className="flex justify-between items-start mb-6">
                             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg text-[#28A9E0]">
                                    <User size={24} />
                                </div>
                                Hồ sơ cá nhân
                            </h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-wide">
                                Không bắt buộc
                            </span>
                         </div>
                        
                        {/* Avatar Upload Chính Giữa */}
                        <div className="flex justify-center py-4">
                             <Controller
                                control={control}
                                name="avatar"
                                render={({ field: { onChange, value } }) => (
                                    <AvatarUpload 
                                        onChange={onChange}
                                        value={value}
                                        error={errors.avatar}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* --- GROUP 2: THÔNG TIN ĐỊNH DANH (Có DatePickerInput) --- */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                             <div className="p-2 bg-blue-50 rounded-lg text-[#28A9E0]">
                                <CreditCard size={24} />
                             </div>
                            Thông tin cá nhân
                        </h2>
                        
                        {/* CCCD UPLOAD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Controller
                                control={control}
                                name="cccdFront"
                                rules={{ required: "Vui lòng tải ảnh mặt trước" }}
                                render={({ field: { onChange, value } }) => (
                                    <ImageUploadField 
                                        label="Mặt trước CCCD"
                                        required
                                        onChange={onChange}
                                        value={value}
                                        error={errors.cccdFront}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="cccdBack"
                                rules={{ required: "Vui lòng tải ảnh mặt sau" }}
                                render={({ field: { onChange, value } }) => (
                                    <ImageUploadField 
                                        label="Mặt sau CCCD"
                                        required
                                        onChange={onChange}
                                        value={value}
                                        error={errors.cccdBack}
                                    />
                                )}
                            />
                        </div>

                        {/* TEXT INPUTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PartnerInput
                                label="Số CCCD / CMND"
                                name="identityCardNumber"
                                placeholder="Nhập 12 số trên thẻ"
                                icon={CreditCard}
                                register={register}
                                error={errors.identityCardNumber}
                                rules={{ required: "Vui lòng nhập số CCCD", minLength: {value: 9, message: "Tối thiểu 9 số"} }}
                            />
                            <PartnerInput
                                label="Họ và tên (Theo CCCD)"
                                name="fullName"
                                placeholder="VD: NGUYEN VAN A"
                                icon={User}
                                register={register}
                                error={errors.fullName}
                                rules={{ required: "Vui lòng nhập họ tên" }}
                            />
                            
                            {/* --- DATE PICKER INPUT (TÍCH HỢP VALIDATE 18+) --- */}
                            <Controller
                                control={control}
                                name="dateOfBirth"
                                rules={{ 
                                    required: "Vui lòng chọn ngày sinh",
                                    validate: (value) => {
                                        if (!value) return true; // Bỏ qua nếu chưa chọn (đã có required lo)
                                        
                                        const selectedDate = new Date(value);
                                        const today = new Date();
                                        
                                        // Tính tuổi chính xác từng ngày
                                        let age = today.getFullYear() - selectedDate.getFullYear();
                                        const m = today.getMonth() - selectedDate.getMonth();
                                        if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
                                            age--;
                                        }

                                        return age >= 18 || "Bạn phải đủ 18 tuổi để đăng ký";
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <DatePickerInput
                                        label="Ngày sinh"
                                        value={value}
                                        onChange={onChange}
                                        // Lấy lỗi trực tiếp từ errors object
                                        error={errors.dateOfBirth?.message}
                                        maxDate={new Date()} // Không cho chọn tương lai
                                    />
                                )}
                            />

                            <div className="w-full">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Giới tính</label>
                                <div className="relative">
                                    <select 
                                        {...register("gender", { required: "Chọn giới tính" })}
                                        className="w-full rounded-2xl py-3.5 pl-4 pr-10 bg-white border border-slate-200 text-slate-700 font-medium outline-none focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 transition-all shadow-sm appearance-none cursor-pointer hover:border-[#28A9E0]"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                                {errors.gender && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.gender.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* --- GROUP 3: LIÊN HỆ & ĐỊA CHỈ --- */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                             <div className="p-2 bg-blue-50 rounded-lg text-[#28A9E0]">
                                <MapPin size={24} />
                             </div>
                            Thông tin liên hệ
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="md:col-span-2">
                                <PartnerInput
                                    label="Số điện thoại chính"
                                    name="phoneNumber"
                                    placeholder="0912 345 678"
                                    icon={Phone}
                                    register={register}
                                    error={errors.phoneNumber}
                                    rules={{ 
                                        required: "Vui lòng nhập SĐT",
                                        pattern: { value: /^[0-9]{10,11}$/, message: "SĐT không hợp lệ" }
                                    }}
                                />
                            </div>
                            
                            {/* --- NEW: Structured Address --- */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <AdminSelectorsWithApi control={control} setValue={setValue} errors={errors} watch={watch} />
                            </div>

                            <div className="md:col-span-2">
                                <PartnerInput
                                    label="Địa chỉ chi tiết (Số nhà, tên đường)"
                                    name="streetAddress"
                                    placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
                                    icon={MapPin}
                                    register={register}
                                    error={errors.streetAddress}
                                    rules={{ required: "Vui lòng nhập địa chỉ chi tiết" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- BUTTON SUBMIT --- */}
                    <div className="flex justify-end pt-4 pb-10">
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            className="group flex items-center gap-3 rounded-2xl bg-[#28A9E0] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#28A9E0]/30 transition-all hover:bg-[#2090C0] hover:shadow-[#28A9E0]/50 hover:-translate-y-1"
                        >
                            <span>Lưu hồ sơ & Tiếp tục</span>
                            <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>

                </form>
            </div>

            {/* --- RIGHT: SIDEBAR INFO --- */}
            <div className="hidden lg:block w-1/3 min-w-[320px]">
                <div className="sticky top-28 space-y-6">
                    
                    {/* Card 1: Benefit */}
                    <div className="bg-gradient-to-br from-[#28A9E0] to-[#0077B6] rounded-[32px] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                        
                        <h3 className="text-xl font-bold mb-4 relative z-10">Tại sao cần xác minh?</h3>
                        <p className="text-blue-50 text-sm leading-relaxed mb-6 opacity-90 relative z-10">
                            Việc xác minh danh tính giúp xây dựng hệ thống đối tác tin cậy, bảo vệ quyền lợi của bạn và đảm bảo an toàn thanh toán.
                        </p>
                        <ul className="space-y-4 text-sm font-medium relative z-10">
                            <li className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                Tăng độ uy tín hiển thị
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                Kích hoạt cổng thanh toán
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                Huy hiệu "Đối tác xác thực"
                            </li>
                        </ul>
                    </div>

                    {/* Card 2: Help */}
                    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                         <h3 className="text-lg font-bold text-slate-800 mb-2">Cần hỗ trợ?</h3>
                         <p className="text-slate-500 text-sm mb-6">Bạn gặp khó khăn khi tải ảnh hoặc điền thông tin? Liên hệ ngay:</p>
                         
                         <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#28A9E0]/30 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#28A9E0] shadow-sm group-hover:scale-110 transition-transform">
                                <PhoneIcon size={22} strokeWidth={2.5}/>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 mb-0.5 uppercase tracking-wider">Hotline Đối tác</div>
                                <span className="text-xl font-bold text-slate-800 group-hover:text-[#28A9E0] transition-colors">1900 1234</span>
                            </div>
                         </div>
                    </div>

                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default OwnerOnboardingStep1;