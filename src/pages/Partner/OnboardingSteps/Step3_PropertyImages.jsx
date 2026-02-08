
import React from 'react';
import { Images, UploadCloud, Sparkles } from 'lucide-react';
import ImageUploadGrid from '@/components/common/Input/ImageUploadGrid';

const Step3_PropertyImages = ({ errors, watch, setValue }) => {
  return (
    <div>
      {/* 1. Info Banner */}
      <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-5 rounded-r-xl mb-6 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <Sparkles size={18} className="text-[rgb(40,169,224)]" />
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <h4 className="font-bold text-gray-900 mb-1">Mẹo để có hình ảnh chất lượng:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 marker:text-[rgb(40,169,224)]">
            <li>Đăng tải ít nhất <strong>3 ảnh</strong> để hiển thị đầy đủ không gian.</li>
            <li>Ảnh đầu tiên bạn chọn sẽ là <strong>Ảnh bìa (Thumbnail)</strong>.</li>
            <li>Khuyến khích dùng ảnh ngang, ánh sáng tự nhiên (JPG/PNG/WEBP).</li>
          </ul>
        </div>
      </div>

      {/* 2. Upload Area */}
      <div className="min-h-[300px]">
        <ImageUploadGrid
          multiple={true}
          accept="image/png, image/jpeg, image/webp"
          value={watch("propertyInfo.propertyImages")}
          onChange={(files) => setValue("propertyInfo.propertyImages", files, { shouldValidate: true })}
          error={errors.propertyInfo?.propertyImages?.message}
        />
      </div>
    </div>
  );
};

export default Step3_PropertyImages;
