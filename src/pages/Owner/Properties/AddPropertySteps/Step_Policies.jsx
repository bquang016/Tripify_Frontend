import React from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  ShieldCheck, Ban, Dog, Baby, AlertTriangle, Check, LogIn, LogOut, Moon 
} from "lucide-react";
import TextField from "@/components/common/Input/TextField";
import TextArea from "@/components/common/Input/TextArea";
import PolicyTimeSelector from "./components/PolicyTimeSelector"; 
import { useTranslation } from "react-i18next";

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

const Step_Policies = ({ register, watch, setValue, errors }) => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
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
      <div className="flex items-center gap-5 mb-8 border-b border-gray-100 pb-6">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl shadow-sm">
          <ShieldCheck size={36} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('add_property_flow.step_policies')}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {t('add_property_flow.policies_subtitle')}
          </p>
        </div>
      </div>

      <SectionCard title={t('add_property_flow.checkin_checkout')}>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[rgb(40,169,224)] mb-2">
                        <LogIn size={20} />
                        <span className="font-bold text-gray-700">{t('add_property_flow.checkin_from')}</span>
                    </div>
                    <PolicyTimeSelector 
                        label={isVi ? "Bắt đầu nhận khách từ" : "Starts from"} 
                        value={policies.checkInTime} 
                        onChange={(val) => setValue("policies.checkInTime", val, { shouldValidate: true })} 
                    />
                    {errors?.policies?.checkInTime && <p className="text-red-500 text-xs ml-1">{errors.policies.checkInTime.message}</p>}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <LogOut size={20} />
                        <span className="font-bold text-gray-700">{t('add_property_flow.checkout_until')}</span>
                    </div>
                    <PolicyTimeSelector 
                        label={isVi ? "Khách phải trả phòng trước" : "Must check-out before"} 
                        value={policies.checkOutTime} 
                        onChange={(val) => setValue("policies.checkOutTime", val, { shouldValidate: true })} 
                    />
                    {errors?.policies?.checkOutTime && <p className="text-red-500 text-xs ml-1">{errors.policies.checkOutTime.message}</p>}
                </div>

                <div className="md:col-span-2 pt-4 border-t border-dashed border-gray-200">
                     <div className="flex items-center gap-2 text-purple-500 mb-3">
                        <Moon size={18} />
                        <span className="font-bold text-gray-700 text-sm">{t('add_property_flow.quiet_hours')}</span>
                    </div>
                     <TextField 
                        placeholder={t('add_property_flow.quiet_hours_placeholder')}
                        {...register("policies.quietHours")}
                     />
                </div>
            </div>
        </div>
      </SectionCard>

      <SectionCard title={t('add_property_flow.house_rules')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <ToggleSwitch 
              label={t('add_property_flow.smoking_allowed')} 
              checked={policies.smokingAllowed} 
              onChange={() => handleToggle("smokingAllowed")}
              icon={<Ban size={18} />}
            />
            <AnimatePresence>
                {policies.smokingAllowed && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height: "auto"}} exit={{opacity:0, height:0}}>
                     <TextField placeholder={t('add_property_flow.smoking_placeholder')} {...register("policies.smokingPolicyDescription")} />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            <ToggleSwitch 
              label={t('add_property_flow.pets_allowed')} 
              checked={policies.petsAllowed} 
              onChange={() => handleToggle("petsAllowed")}
              icon={<Dog size={18} />}
            />
            <AnimatePresence>
                {policies.petsAllowed && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height: "auto"}} exit={{opacity:0, height:0}}>
                     <TextField placeholder={t('add_property_flow.pets_placeholder')} {...register("policies.petPolicyDescription")} />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
          
          <div className="space-y-3 md:col-span-2">
            <ToggleSwitch 
              label={t('add_property_flow.children_allowed')} 
              subLabel={t('add_property_flow.children_welcome')}
              checked={policies.childrenAllowed} 
              onChange={() => handleToggle("childrenAllowed")}
              icon={<Baby size={18} />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">{t('add_property_flow.min_age_label')}</label>
                    <input 
                        type="number" 
                        className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:border-[rgb(40,169,224)] outline-none transition-all"
                        placeholder="18"
                        {...register("policies.minimumAge", { valueAsNumber: true })}
                    />
                </div>
                {policies.childrenAllowed && (
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">{t('add_property_flow.children_notes')}</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:border-[rgb(40,169,224)] outline-none transition-all"
                            placeholder={t('add_property_flow.children_notes_placeholder')}
                            {...register("policies.childrenPolicyDescription")}
                        />
                    </div>
                )}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t('add_property_flow.cancel_payment_policy')}>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="flex-1 w-full">
                <ToggleSwitch 
                  label={t('add_property_flow.free_cancel')} 
                  subLabel={t('add_property_flow.free_cancel_sub')}
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
                          label={t('add_property_flow.free_cancel_days')} 
                          type="number" 
                          placeholder="e.g. 3"
                          {...register("policies.freeCancellationDays", { valueAsNumber: true })}
                       />
                       <TextArea 
                          label={t('add_property_flow.cancel_policy_detail')} 
                          rows={2}
                          placeholder={t('add_property_flow.cancel_policy_placeholder')}
                          {...register("policies.cancellationPolicyDescription")}
                       />
                    </motion.div>
                )}
             </AnimatePresence>
          </div>

          <div className="w-full h-px bg-gray-100"></div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <span className="font-bold text-gray-800">{t('add_property_flow.deposit_prepay')}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <input type="checkbox" className="w-5 h-5 accent-[rgb(40,169,224)]" {...register("policies.requiresPrepayment")} />
                      <span className="font-medium text-gray-700">{t('add_property_flow.prepay_req')}</span>
                  </label>
                  {policies.requiresPrepayment && (
                      <TextArea rows={3} placeholder={t('add_property_flow.prepay_placeholder')} {...register("policies.prepaymentPolicy")} />
                  )}
               </div>

               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <input type="checkbox" className="w-5 h-5 accent-[rgb(40,169,224)]" {...register("policies.securityDepositRequired")} />
                      <span className="font-medium text-gray-700">{t('add_property_flow.damage_deposit')}</span>
                  </label>
                  {policies.securityDepositRequired && (
                      <div className="space-y-3 bg-gray-50 p-3 rounded-xl">
                         <input 
                            type="number" 
                            className="w-full p-3 text-sm border border-gray-200 bg-white rounded-lg outline-none focus:border-[rgb(40,169,224)]"
                            placeholder={t('add_property_flow.deposit_amount')}
                            {...register("policies.securityDepositAmount", { valueAsNumber: true })}
                         />
                         <input 
                            type="text" 
                            className="w-full p-3 text-sm border border-gray-200 bg-white rounded-lg outline-none focus:border-[rgb(40,169,224)]"
                            placeholder={t('add_property_flow.deposit_refund_rules')}
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
