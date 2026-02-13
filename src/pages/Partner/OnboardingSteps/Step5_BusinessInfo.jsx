
import React from 'react';
import { ShieldCheck, UploadCloud } from 'lucide-react';
import PartnerInput from '../components/PartnerInput'; // Re-using the styled input
import ImageUploadGrid from '@/components/common/Input/ImageUploadGrid';

const Step4_BusinessInfo = ({ register, errors, watch, setValue }) => {
  return (
    <div className="space-y-8">
      {/* Business License Number */}
      <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[rgb(40,169,224)]" />
            Giấy phép kinh doanh
          </h3>
          <PartnerInput 
            label="Số giấy phép đăng ký kinh doanh" 
            name="propertyInfo.businessLicenseNumber"
            placeholder="Nhập số giấy phép..." 
            register={register}
            error={errors.propertyInfo?.businessLicenseNumber}
            rules={{ required: "Vui lòng nhập số giấy phép" }}
          />
      </div>

      {/* License Image Upload */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UploadCloud size={20} className="text-[rgb(40,169,224)]" />
            Ảnh minh chứng
        </h3>
        <ImageUploadGrid
            multiple={false} // Only one image
            accept="image/png, image/jpeg, image/webp"
            value={watch("propertyInfo.businessLicenseImage")}
            onChange={(files) => setValue("propertyInfo.businessLicenseImage", files, { shouldValidate: true })}
            error={errors.propertyInfo?.businessLicenseImage?.message}
        />
      </div>
    </div>
  );
};

export default Step4_BusinessInfo;
