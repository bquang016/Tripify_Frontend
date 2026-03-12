import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Type, Maximize, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import TextArea from "@/components/common/Input/TextArea";
import TextField from "@/components/common/Input/TextField";
import propertyService from "@/services/property.service";
import { useTranslation } from "react-i18next";

const Step4_Details = ({ register, errors, watch, setError, clearErrors }) => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  
  const propertyNameValue = watch("propertyName");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (!propertyNameValue || propertyNameValue.trim() === "") {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    setIsAvailable(null);
    clearErrors("propertyName");

    const timer = setTimeout(async () => {
      try {
        await propertyService.checkNameAvailability(propertyNameValue);
        setIsAvailable(true);
      } catch (error) {
        setIsAvailable(false);
        if (error.response && error.response.status === 409) {
            const serverMessage = error.response.data?.message || (isVi ? "Tên chỗ nghỉ này đã được sử dụng. Vui lòng chọn tên khác." : "This property name is already taken. Please choose another.");
            setError("propertyName", { type: "manual", message: serverMessage });
        }
      } finally {
        setIsChecking(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [propertyNameValue]);

  return (
    <motion.div className="max-w-5xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl"><FileText size={32} strokeWidth={2} /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('add_property_flow.details_title')}</h2>
          <p className="text-gray-500 text-sm mt-1">{isVi ? "Hãy đặt một cái tên ấn tượng và mô tả thật hấp dẫn về chỗ nghỉ của bạn." : "Give your property an impressive name and an attractive description."}</p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-5 rounded-r-xl mb-8 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0"><Sparkles size={18} className="text-[rgb(40,169,224)]" /></div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <h4 className="font-bold text-gray-900 mb-1">{isVi ? "Mẹo nhỏ:" : "Pro tip:"}</h4>
          <p>{isVi ? "Một mô tả chi tiết nêu bật được không gian thường giúp tăng tỷ lệ đặt phòng." : "A detailed description highlighting the space often helps increase booking rates."}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-200 space-y-6">
        <div>
          <div className="relative">
            <TextField label={t('add_property_flow.property_name_label')} placeholder={isVi ? "Ví dụ: Villa Hạnh Phúc - View Biển Đà Nẵng" : "e.g. Happy Villa - Da Nang Beach View"} required icon={<Type size={18} />} {...register("propertyName")} error={errors.propertyName?.message} />
            <div className="absolute right-4 top-[42px]">
              {isChecking && <Loader2 size={20} className="animate-spin text-blue-500" />}
              {!isChecking && isAvailable === true && !errors.propertyName && (
                <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-md text-xs font-medium animate-in fade-in zoom-in"><CheckCircle size={14} /> {isVi ? "Hợp lệ" : "Valid"}</div>
              )}
              {!isChecking && isAvailable === false && <AlertCircle size={20} className="text-red-500 animate-in fade-in zoom-in" />}
            </div>
          </div>
          {!errors.propertyName && !isChecking && <p className="text-xs text-gray-400 mt-1 ml-1">{isVi ? "Tên này sẽ hiển thị nổi bật nhất trên trang tìm kiếm." : "This name will be displayed most prominently on the search page."}</p>}
        </div>

        <div><TextField label={t('add_property_flow.area_label')} type="number" placeholder="e.g. 120" required icon={<Maximize size={18} />} {...register("area")} error={errors.area?.message} /></div>

        <div>
          <TextArea label={t('add_property_flow.description_label')} placeholder={isVi ? "Mô tả những điểm nổi bật..." : "Describe the highlights..."} rows={8} required {...register("description")} error={errors.description?.message} />
          <div className="flex justify-between items-center mt-1 ml-1">
             {!errors.description && <p className="text-xs text-gray-400">{isVi ? "Tối thiểu 50 ký tự để đảm bảo chất lượng nội dung." : "Minimum 50 characters to ensure content quality."}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Step4_Details;
