import React from "react";
// ✅ SỬA LỖI: Thêm AnimatePresence vào đây
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  ShieldCheck, Ban, Dog, Baby, CreditCard, AlertTriangle, Check, LogIn, LogOut, Moon 
} from "lucide-react";
import TextField from "@/components/common/Input/TextField";
import TextArea from "@/components/common/Input/TextArea";
import PolicyTimeSelector from "./components/PolicyTimeSelector"; 

// --- COMPONENT UI CON (Toggle & Card) ---

const ToggleSwitch = ({ label, subLabel, checked, onChange, icon }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 group select-none
      ${checked 
        ? "border-[rgb(40,169,224)] bg-[rgb(40,169,224)]/5 shadow-sm" 
        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
  >
    <div className="flex gap-3 items-start">
      {icon && (
        <div className={`p-2.5 rounded-full transition-colors ${checked ? "bg-[rgb(40,169,224)] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
          {icon}
        </div>
      )}
      <div>
        <span className={`block font-bold text-sm transition-colors ${checked ? "text-[rgb(40,169,224)]" : "text-gray-700"}`}>
          {label}
        </span>
        {subLabel && <span className="text-xs text-gray-500 mt-0.5 block font-medium">{subLabel}</span>}
      </div>
    </div>
    
    {/* Toggle UI */}
    <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 mt-1 ${checked ? 'bg-[rgb(40,169,224)]' : 'bg-gray-300'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="space-y-5">
    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
      <span className="w-1 h-6 bg-[rgb(40,169,224)] rounded-full"></span>
      {title}
    </h3>
    <div className="grid gap-5">{children}</div>
  </div>
);

// --- MAIN COMPONENT ---

const Step_Policies = ({ register, watch, setValue, errors }) => {
  const policies = watch("policies") || {};

  const handleToggle = (field) => {
    setValue(`policies.${field}`, !policies[field], { shouldDirty: true });
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-5 mb-8 border-b border-gray-100 pb-6">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl shadow-sm">
          <ShieldCheck size={36} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thiết lập Chính sách</h2>
          <p className="text-gray-500 text-sm mt-1">
            Thiết lập các quy tắc quan trọng để đảm bảo vận hành trơn tru.
          </p>
        </div>
      </div>

      {/* 1. Thời gian Nhận/Trả phòng */}
      <SectionCard title="Thời gian Nhận & Trả phòng">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Check-in */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[rgb(40,169,224)] mb-2">
                        <LogIn size={20} />
                        <span className="font-bold text-gray-700">Giờ Nhận phòng</span>
                    </div>
                    <PolicyTimeSelector 
                        label="Bắt đầu nhận khách từ" 
                        value={policies.checkInTime} 
                        onChange={(val) => setValue("policies.checkInTime", val, { shouldValidate: true })} 
                    />
                    {errors?.policies?.checkInTime && <p className="text-red-500 text-xs ml-1">{errors.policies.checkInTime.message}</p>}
                </div>

                {/* Check-out */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <LogOut size={20} />
                        <span className="font-bold text-gray-700">Giờ Trả phòng</span>
                    </div>
                    <PolicyTimeSelector 
                        label="Khách phải trả phòng trước" 
                        value={policies.checkOutTime} 
                        onChange={(val) => setValue("policies.checkOutTime", val, { shouldValidate: true })} 
                    />
                    {errors?.policies?.checkOutTime && <p className="text-red-500 text-xs ml-1">{errors.policies.checkOutTime.message}</p>}
                </div>

                {/* Quiet Hours */}
                <div className="md:col-span-2 pt-4 border-t border-dashed border-gray-200">
                     <div className="flex items-center gap-2 text-purple-500 mb-3">
                        <Moon size={18} />
                        <span className="font-bold text-gray-700 text-sm">Khung giờ yên tĩnh (Tùy chọn)</span>
                    </div>
                     <TextField 
                        placeholder="Ví dụ: 22:00 - 07:00"
                        {...register("policies.quietHours")}
                     />
                </div>
            </div>
        </div>
      </SectionCard>

      {/* 2. Quy định Cư trú */}
      <SectionCard title="Quy định Cư trú">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hút thuốc */}
          <div className="space-y-3">
            <ToggleSwitch 
              label="Cho phép hút thuốc" 
              checked={policies.smokingAllowed} 
              onChange={() => handleToggle("smokingAllowed")}
              icon={<Ban size={18} />}
            />
            <AnimatePresence>
                {policies.smokingAllowed && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height: "auto"}} exit={{opacity:0, height:0}}>
                     <TextField placeholder="Khu vực được phép hút thuốc..." {...register("policies.smokingPolicyDescription")} />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Thú cưng */}
          <div className="space-y-3">
            <ToggleSwitch 
              label="Cho phép thú cưng" 
              checked={policies.petsAllowed} 
              onChange={() => handleToggle("petsAllowed")}
              icon={<Dog size={18} />}
            />
            <AnimatePresence>
                {policies.petsAllowed && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height: "auto"}} exit={{opacity:0, height:0}}>
                     <TextField placeholder="Phụ phí, giới hạn cân nặng..." {...register("policies.petPolicyDescription")} />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
          
          {/* Trẻ em */}
          <div className="space-y-3 md:col-span-2">
            <ToggleSwitch 
              label="Phù hợp với trẻ em" 
              subLabel="Gia đình có trẻ nhỏ được chào đón"
              checked={policies.childrenAllowed} 
              onChange={() => handleToggle("childrenAllowed")}
              icon={<Baby size={18} />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Tuổi tối thiểu của khách chính</label>
                    <input 
                        type="number" 
                        className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:border-[rgb(40,169,224)] outline-none transition-all"
                        placeholder="18"
                        {...register("policies.minimumAge", { valueAsNumber: true })}
                    />
                </div>
                {policies.childrenAllowed && (
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Ghi chú về trẻ em</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:border-[rgb(40,169,224)] outline-none transition-all"
                            placeholder="VD: Miễn phí cho trẻ dưới 6 tuổi..."
                            {...register("policies.childrenPolicyDescription")}
                        />
                    </div>
                )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 3. Hủy phòng & Thanh toán */}
      <SectionCard title="Chính sách Hủy phòng & Thanh toán">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
          
          {/* Hủy phòng */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="flex-1 w-full">
                <ToggleSwitch 
                  label="Cho phép hủy miễn phí" 
                  subLabel="Thu hút nhiều khách hàng hơn"
                  checked={policies.allowFreeCancellation} 
                  onChange={() => handleToggle("allowFreeCancellation")}
                  icon={<Check size={18} />}
                />
             </div>
             <AnimatePresence>
                {policies.allowFreeCancellation && (
                    <motion.div 
                        initial={{opacity:0, x: -20}} animate={{opacity:1, x: 0}} exit={{opacity:0}}
                        className="flex-1 w-full space-y-4 bg-green-50 p-4 rounded-xl border border-green-100"
                    >
                       <TextField 
                          label="Hủy miễn phí trước (ngày)" 
                          type="number" 
                          placeholder="VD: 3 ngày"
                          {...register("policies.freeCancellationDays", { valueAsNumber: true })}
                       />
                       <TextArea 
                          label="Chi tiết chính sách hủy" 
                          rows={2}
                          placeholder="VD: Sau thời gian này sẽ tính phí 100% đêm đầu tiên..."
                          {...register("policies.cancellationPolicyDescription")}
                       />
                    </motion.div>
                )}
             </AnimatePresence>
          </div>

          <div className="w-full h-px bg-gray-100"></div>

          {/* Đặt cọc */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <span className="font-bold text-gray-800">Yêu cầu đặt cọc / Thanh toán trước</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <input type="checkbox" className="w-5 h-5 accent-[rgb(40,169,224)]" {...register("policies.requiresPrepayment")} />
                      <span className="font-medium text-gray-700">Yêu cầu thanh toán trước</span>
                  </label>
                  {policies.requiresPrepayment && (
                      <TextArea rows={3} placeholder="VD: Chuyển khoản 50% khi đặt..." {...register("policies.prepaymentPolicy")} />
                  )}
               </div>

               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <input type="checkbox" className="w-5 h-5 accent-[rgb(40,169,224)]" {...register("policies.securityDepositRequired")} />
                      <span className="font-medium text-gray-700">Yêu cầu đặt cọc hư hại</span>
                  </label>
                  {policies.securityDepositRequired && (
                      <div className="space-y-3 bg-gray-50 p-3 rounded-xl">
                         <input 
                            type="number" 
                            className="w-full p-3 text-sm border border-gray-200 bg-white rounded-lg outline-none focus:border-[rgb(40,169,224)]"
                            placeholder="Số tiền cọc (VNĐ)"
                            {...register("policies.securityDepositAmount", { valueAsNumber: true })}
                         />
                         <input 
                            type="text" 
                            className="w-full p-3 text-sm border border-gray-200 bg-white rounded-lg outline-none focus:border-[rgb(40,169,224)]"
                            placeholder="Quy định hoàn cọc..."
                            {...register("policies.securityDepositDescription")}
                         />
                      </div>
                  )}
               </div>
            </div>
          </div>

        </div>
      </SectionCard>
    </motion.div>
  );
};

export default Step_Policies;