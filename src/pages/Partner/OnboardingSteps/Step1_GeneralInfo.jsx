
import React from 'react';
import { Controller } from 'react-hook-form';
import { Building2 } from 'lucide-react';

import PartnerInput from '../components/PartnerInput';
import PartnerSelect from '../components/PartnerSelect';

const Step1_GeneralInfo = ({ register, errors, control }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span className="w-1 h-6 bg-[rgb(40,169,224)] rounded-full"></span>
        Thông tin chung
      </h3>
      
      <div className="space-y-5">
        <PartnerInput 
          label="Tên chỗ nghỉ (Khách sạn/Resort/Homestay)" 
          name="propertyInfo.propertyName"
          placeholder="Ví dụ: Tripify Ocean Resort" 
          register={register}
          error={errors.propertyInfo?.propertyName}
          rules={{ required: "Vui lòng nhập tên chỗ nghỉ" }}
          icon={Building2}
        />

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">Mô tả</label>
            <textarea
              {...register("propertyInfo.description", { 
                  required: "Vui lòng nhập mô tả",
                  minLength: { value: 50, message: "Mô tả cần ít nhất 50 ký tự" },
                  maxLength: { value: 2000, message: "Tối đa 2000 ký tự" } 
              })}
              rows={4}
              className={`w-full px-4 py-3 rounded-2xl border bg-white focus:ring-4 focus:ring-[rgb(40,169,224)]/10 focus:border-[rgb(40,169,224)] focus:outline-none transition-all resize-none text-slate-700 placeholder-slate-400 font-medium shadow-sm
                ${errors.propertyInfo?.description ? 'border-red-300' : 'border-slate-200'}
              `}
              placeholder="Mô tả những điểm nổi bật, vị trí, phong cách thiết kế..."
            />
            {errors.propertyInfo?.description && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.propertyInfo?.description.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_GeneralInfo;
