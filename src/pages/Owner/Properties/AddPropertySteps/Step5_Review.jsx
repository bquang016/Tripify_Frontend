import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Info, MapPin, Sparkles, Image, ClipboardList, 
  Home, ShieldCheck
} from "lucide-react";
import ReviewImagePreview from "./components/ReviewImagePreview";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const ReviewItem = ({ label, value, highlight = false }) => (
  <div className="py-3 border-b border-gray-50 last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className={`text-sm font-medium text-right max-w-[70%] ${highlight ? 'text-[rgb(40,169,224)] font-bold' : 'text-gray-900'}`}>
      {value || "---"}
    </p>
  </div>
);

const ReviewHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50/80 border-b border-gray-100">
    <div className="p-2 bg-white rounded-lg shadow-sm text-[rgb(40,169,224)]">{icon}</div>
    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{title}</h3>
  </div>
);

const ImageGrid = ({ fileList }) => {
  const { t } = useTranslation();
  if (!fileList || fileList.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-400 italic">{t('owner.no_images')}</p>
      </div>
    );
  }
  const files = Array.from(fileList);
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
      {files.map((file, index) => (
        <ReviewImagePreview key={index} file={file} />
      ))}
    </div>
  );
};

export default function Step5_Review({ watch, register, errors }) {
  const { t, i18n } = useTranslation();
  const { currency } = useLanguage();
  const isVi = i18n.language === 'vi';
  
  const data = watch();
  const policies = data.policies || {};
  const isWholeUnit = ["VILLA", "HOMESTAY"].includes(data.propertyType);
  const unitData = data.unitData || {};

  const formatCurrency = (val) => {
      if (currency === 'USD') {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 25000);
      }
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
  };

  const getDisplayAddress = () => {
    let addr = data.address || "";
    const parts = [data.ward, data.city, data.province, data.country || "Việt Nam"];
    const suffix = parts.filter(p => p && p.trim() !== "").join(", ");
    return suffix ? `${addr}, ${suffix}` : addr;
  };

  const amenities = data.amenities ? Object.keys(data.amenities).filter(k => data.amenities[k]) : [];

  return (
    <motion.div className="space-y-8 animate-fadeIn max-w-5xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-4 mb-2">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl"><ClipboardList size={32} strokeWidth={2} /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('add_property_flow.step_review')}</h2>
          <p className="text-gray-500 text-sm mt-1">{isVi ? "Vui lòng rà soát kỹ trước khi gửi đơn đăng ký." : "Please review carefully before submitting."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<MapPin size={18} />} title={isVi ? "Thông tin chung & Vị trí" : "General Info & Location"} />
            <div className="p-5 space-y-1">
              <ReviewItem label={t('owner.property_name')} value={data.propertyName} highlight />
              <ReviewItem label={t('owner.property_type_label')} value={data.propertyType} />
              <ReviewItem label={t('add_property_flow.area_label')} value={data.area ? `${data.area} m²` : ""} />
              <ReviewItem label={isVi ? "Địa chỉ" : "Address"} value={getDisplayAddress()} />
            </div>
          </div>

          {isWholeUnit && (
            <div className="bg-white border border-[rgb(40,169,224)]/30 rounded-2xl shadow-sm overflow-hidden">
              <ReviewHeader icon={<Home size={18} />} title={isVi ? "Chi tiết cho thuê" : "Rental Details"} />
              <div className="p-5 space-y-1 bg-[rgb(40,169,224)]/5">
                <ReviewItem label={isVi ? "Giá thuê / đêm" : "Price / night"} value={formatCurrency(unitData.price)} highlight />
                <ReviewItem label={t('owner.capacity')} value={`${unitData.capacity || 0} ${t('owner.people')}`} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<ShieldCheck size={18} />} title={t('add_property_flow.step_policies')} />
            <div className="p-5 space-y-1">
               <ReviewItem label={t('add_property_flow.checkin_time')} value={`${policies.checkInFrom || '14:00'} - ${policies.checkInTo || '23:00'}`} />
               <ReviewItem label={t('add_property_flow.checkout_time')} value={`${policies.checkOutFrom || '06:00'} - ${policies.checkOutTo || '12:00'}`} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<Sparkles size={18} />} title={t('owner.amenities')} />
            <div className="p-5">
              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">{amenities.map(a => (<span key={a} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">{a}</span>))}</div>
              ) : <p className="text-gray-400 text-sm italic text-center py-2">{isVi ? "Chưa chọn tiện nghi nào" : "No amenities selected"}</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<Image size={18} />} title={`${t('add_property_flow.step_images')} (${data.propertyImages?.length || 0})`} />
            <div className="p-5"><ImageGrid fileList={data.propertyImages} /></div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
        <input type="checkbox" id="terms" {...register("terms")} className="w-5 h-5 mt-0.5 accent-[rgb(40,169,224)] cursor-pointer shrink-0" />
        <div>
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none leading-relaxed">
            {t('add_property_flow.terms_agree')}
          </label>
          {errors.terms && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1 animate-pulse"><Info size={14}/> {errors.terms.message}</p>}
        </div>
      </div>
    </motion.div>
  );
}
