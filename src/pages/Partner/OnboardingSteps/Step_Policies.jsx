import React from "react";
import { Controller } from 'react-hook-form';
import { 
  ShieldCheck, Ban, Dog, Baby, CreditCard, AlertTriangle, Check, LogIn, LogOut, Moon 
} from "lucide-react";
import TextField from "@/components/common/Input/TextField";
import TextArea from "@/components/common/Input/TextArea";
import PolicyTimeSelector from "./components/PolicyTimeSelector"; 
import CurrencyInput from "@/components/common/Input/CurrencyInput"; 

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
  const policies = watch("propertyInfo.policies") || {};
  const policyErrors = errors.propertyInfo?.policies || {};

  const handleToggle = (field) => {
    setValue(`propertyInfo.policies.${field}`, !policies[field], { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <SectionCard title="Thời gian Nhận & Trả phòng">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                    <PolicyTimeSelector 
                        label="Bắt đầu nhận khách từ" 
                        value={policies.checkInTime} 
                        onChange={(val) => setValue("propertyInfo.policies.checkInTime", val, { shouldValidate: true })} 
                    />
                    {policyErrors.checkInTime && <p className="text-red-500 text-xs ml-1 mt-1">{policyErrors.checkInTime.message}</p>}
                </div>
                <div className="space-y-1">
                    <PolicyTimeSelector 
                        label="Khách phải trả phòng trước" 
                        value={policies.checkOutTime} 
                        onChange={(val) => setValue("propertyInfo.policies.checkOutTime", val, { shouldValidate: true })} 
                    />
                    {policyErrors.checkOutTime && <p className="text-red-500 text-xs ml-1 mt-1">{policyErrors.checkOutTime.message}</p>}
                </div>
            </div>
        </div>
      </SectionCard>

      <SectionCard title="Quy định Cư trú">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToggleSwitch 
            label="Cho phép hút thuốc" 
            checked={!!policies.smokingAllowed} 
            onChange={() => handleToggle("smokingAllowed")}
            icon={<Ban size={18} />}
          />
          <ToggleSwitch 
            label="Cho phép thú cưng" 
            checked={!!policies.petsAllowed} 
            onChange={() => handleToggle("petsAllowed")}
            icon={<Dog size={18} />}
          />
          <div className="md:col-span-2 space-y-3">
            <ToggleSwitch 
              label="Phù hợp với trẻ em" 
              subLabel="Gia đình có trẻ nhỏ được chào đón"
              checked={!!policies.childrenAllowed} 
              onChange={() => handleToggle("childrenAllowed")}
              icon={<Baby size={18} />}
            />
            <TextField 
                label="Tuổi tối thiểu của khách chính"
                type="number"
                placeholder="18"
                {...register("propertyInfo.policies.minimumAge", { valueAsNumber: true })}
                error={policyErrors.minimumAge?.message}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Chính sách Hủy phòng & Thanh toán">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1 w-full">
                <ToggleSwitch 
                  label="Cho phép hủy miễn phí" 
                  subLabel="Thu hút nhiều khách hàng hơn"
                  checked={!!policies.allowFreeCancellation} 
                  onChange={() => handleToggle("allowFreeCancellation")}
                  icon={<Check size={18} />}
                />
             </div>
             {policies.allowFreeCancellation && (
                <div className="flex-1 w-full">
                   <TextField 
                      label="Hủy miễn phí trước (ngày)" 
                      type="number" 
                      placeholder="VD: 3"
                      {...register("propertyInfo.policies.freeCancellationDays", { valueAsNumber: true })}
                      error={policyErrors.freeCancellationDays?.message}
                   />
                </div>
              )}
          </div>
          <div className="w-full h-px bg-gray-100"></div>
          <div className="space-y-4">
            <ToggleSwitch 
              label="Yêu cầu đặt cọc hư hại"
              checked={!!policies.securityDepositRequired} 
              onChange={() => handleToggle("securityDepositRequired")}
              icon={<AlertTriangle size={18}/>}
            />
            {policies.securityDepositRequired && (
               <div className="pl-6">
                  <Controller
                     name="propertyInfo.policies.securityDepositAmount"
                     control={control}
                     render={({ field }) => (
                         <CurrencyInput
                             {...field}
                             label="Số tiền cọc (VNĐ)"
                             placeholder="500.000"
                             error={policyErrors.securityDepositAmount?.message}
                         />
                     )}
                   />
              </div>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default Step_Policies;
