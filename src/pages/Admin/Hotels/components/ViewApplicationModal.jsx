import React, { useState } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { 
    X, User, Mail, Phone, Calendar, Briefcase, MapPin, CreditCard, 
    CheckCircle, XCircle, Image as ImageIcon, ShieldCheck, AlertOctagon, 
    Cake, Home, DollarSign, Users as UsersIcon, Maximize, Clock, Info, Banknote, Map,
    Sparkles, Compass
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/Button/Button";
import ImageViewerModal from "./ImageViewerModal";

const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getImgUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

const formatDateVN = (dateString, locale = 'vi-VN') => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale, {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(date);
    } catch (e) { return "N/A"; }
};

const formatCurrency = (amount, locale = 'vi-VN') => {
    if (typeof amount !== 'number') return "0 đ";
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount);
};

const AmenityBadge = ({ amenity }) => (
    <div className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <Sparkles size={12} className="text-yellow-500" />
        {amenity}
    </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
        <Icon size={18} className="text-blue-500"/> {title}
    </h3>
);

const InfoRow = ({ icon, label, value, isHighlight = false, children }) => (
  <div className={`flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0 ${isHighlight ? 'bg-yellow-50/50 -mx-3 px-3 rounded' : ''}`}>
    <div className={`mt-0.5 shrink-0 ${isHighlight ? 'text-yellow-600' : 'text-gray-400'}`}>{icon}</div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">{label}</p>
      {children ? children : <p className={`text-sm font-medium break-words ${isHighlight ? 'text-yellow-900' : 'text-gray-900'}`}>{value || "---"}</p>}
    </div>
  </div>
);

export default function ViewApplicationModal({ isOpen, onClose, application, onApprove, onReject }) {
  const { t, i18n } = useTranslation();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!isOpen || !application) return null;

  const currentLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  const getStatusLabel = (status) => {
      switch (status) {
          case "PENDING": return t('hotels.pending');
          case "APPROVED": return t('hotels.approved');
          case "REJECTED": return t('hotels.rejected');
          default: return status;
      }
  };

  const getPropertyTypeLabel = (type) => {
      switch (type) {
          case "HOTEL": return t('add_property_flow.hotel_label');
          case "RESORT": return t('add_property_flow.resort_label');
          case "VILLA": return t('add_property_flow.villa_label');
          case "HOMESTAY": return t('add_property_flow.homestay_label');
          case "APARTMENT": return t('add_property_flow.apartment_label') || "Apartment";
          default: return type;
      }
  };

  const getGenderLabel = (gender) => {
      if (!gender) return t('owner_approvals.modal.gender.not_updated');
      switch (gender.toUpperCase()) {
          case "MALE": return t('owner_approvals.modal.gender.male');
          case "FEMALE": return t('owner_approvals.modal.gender.female');
          case "OTHER": return t('owner_approvals.modal.gender.other');
          default: return gender;
      }
  };

  const { propertyInfo = {}, paymentInfo = {} } = application;
  const policies = propertyInfo.policies || {};

  const personalImages = [
    { url: getImgUrl(application.cardFrontImage), caption: t('owner_approvals.modal.card_front') },
    { url: getImgUrl(application.cardBackImage), caption: t('owner_approvals.modal.card_back') }
  ].filter(img => application.cardFrontImage && application.cardBackImage);

  const businessImages = [
    { url: getImgUrl(application.businessLicenseImage), caption: t('owner_approvals.modal.business_license_img') }
  ].filter(img => application.businessLicenseImage);

  const propertyImages = (propertyInfo.propertyImageUrls || []).map((url, idx) => ({
    url: getImgUrl(url),
    caption: t('owner_approvals.modal.property_img_caption', { index: idx + 1 })
  }));

  const allImages = [...personalImages, ...businessImages, ...propertyImages];
  const isReviewed = application.status !== "PENDING";
  const isRejected = application.status === "REJECTED";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl flex flex-col h-full max-h-[95vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                <span className="text-blue-600 bg-blue-50 p-1.5 rounded-lg"><Briefcase size={20}/></span>
                {t('owner_approvals.modal.detail_title', { id: application.id })}
              </h2>
              <div className="flex items-center gap-4 mt-0.5 ml-10">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12}/> {t('owner_approvals.submitted_date')}: {formatDateVN(application.createdAt, currentLocale)}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                      application.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      application.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-red-50 text-red-700 border-red-200'
                  }`}>
                      {getStatusLabel(application.status)}
                  </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={20} /></button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* CỘT 1: THÔNG TIN CÁ NHÂN & THANH TOÁN */}
              <div className="lg:col-span-3 space-y-6">
                {/* Personal Info */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={User} title={t('owner_approvals.modal.personal_info')} />
                    <div className="space-y-1">
                        <InfoRow icon={<User size={14}/>} label={t('owner_approvals.modal.full_name')} value={application.applicantFullName} />
                        <InfoRow icon={<Phone size={14}/>} label={t('owner_approvals.modal.phone')} value={application.applicantPhoneNumber} />
                        <InfoRow icon={<Mail size={14}/>} label={t('owner_approvals.modal.email')} value={application.applicantEmail} />
                        <InfoRow icon={<CreditCard size={14}/>} label={t('owner_approvals.modal.id_card')} value={application.personalIdCard} />
                        <InfoRow icon={<Cake size={14}/>} label={t('owner_approvals.modal.dob')} value={formatDateVN(application.applicantDob, currentLocale)} />
                        <InfoRow icon={<UsersIcon size={14}/>} label={t('owner_approvals.modal.gender.label')} value={getGenderLabel(application.gender)} />
                        {/* Hiển thị địa chỉ thường trú, nếu null thì hiện --- */}
                        <InfoRow icon={<MapPin size={14}/>} label={t('owner_approvals.modal.address')} value={application.permanentAddress} />
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={Banknote} title={t('owner_approvals.modal.payment_info')} />
                    <div className="space-y-1">
                        <InfoRow icon={<DollarSign size={14}/>} label={t('owner_approvals.modal.payment_method')} value={paymentInfo?.paymentMethod === 'BANK_TRANSFER' ? t('owner_approvals.modal.bank_transfer') : paymentInfo?.paymentMethod} />
                        <InfoRow icon={<Briefcase size={14}/>} label={t('owner_approvals.modal.bank_name')} value={paymentInfo?.bankName} />
                        <InfoRow icon={<User size={14}/>} label={t('owner_approvals.modal.account_holder')} value={paymentInfo?.accountHolderName} />
                        <InfoRow icon={<CreditCard size={14}/>} label={t('owner_approvals.modal.account_number')} value={paymentInfo?.accountNumber} />
                    </div>
                </div>

                {isReviewed && (
                    <div className={`p-5 rounded-2xl border shadow-sm ${isRejected ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <SectionTitle icon={isRejected ? AlertOctagon : ShieldCheck} title={t('owner_approvals.modal.review_result')} />
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">{t('owner_approvals.modal.reviewer')}:</span>
                                <span className="font-bold">{application.reviewedByAdminName || t('owner_approvals.modal.admin')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">{t('owner_approvals.modal.review_date')}:</span>
                                <span className="font-bold">{formatDateVN(application.reviewedAt, currentLocale)}</span>
                            </div>
                            {isRejected && (
                                <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-100">
                                    <p className="text-[10px] font-bold text-red-500 uppercase mb-1">{t('owner_approvals.modal.reject_reason')}:</p>
                                    <p className="text-xs text-red-700 italic">"{application.adminReason || t('owner_approvals.modal.no_reason')}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
              </div>

              {/* CỘT 2: THÔNG TIN CHỖ NGHỈ & CHÍNH SÁCH */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={Home} title={t('owner_approvals.modal.property_info')} />
                    <div className="space-y-1">
                        <InfoRow icon={<Home size={14}/>} label={t('owner_approvals.modal.property_name')} value={propertyInfo.propertyName} />
                        <InfoRow icon={<Briefcase size={14}/>} label={t('owner_approvals.modal.property_type')} value={getPropertyTypeLabel(propertyInfo.propertyType)} />
                        <InfoRow icon={<MapPin size={14}/>} label={t('owner_approvals.modal.property_address')} value={propertyInfo.propertyAddress} />
                        <InfoRow icon={<Map size={14}/>} label={t('owner_approvals.modal.area_info')} value={`${propertyInfo.propertyWard || ''}, ${propertyInfo.propertyDistrict || ''}, ${propertyInfo.propertyCity || ''}`.replace(/, , /g, ', ').trim().replace(/^,|,$/g, '')} />
                        
                        {/* FIX LIÊN KẾT GOOGLE MAPS */}
                        <InfoRow icon={<Compass size={14}/>} label={t('owner_approvals.modal.view_on_map')}>
                            {propertyInfo.latitude && propertyInfo.longitude ? (
                                <a 
                                    href={`https://www.google.com/maps?q=${propertyInfo.latitude},${propertyInfo.longitude}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    {t('owner_approvals.modal.view_on_map')} <Maximize size={12}/>
                                </a>
                            ) : (
                                <span className="text-gray-400 text-xs italic">{t('owner_approvals.modal.no_coords')}</span>
                            )}
                        </InfoRow>

                        <InfoRow icon={<Info size={14}/>} label={t('owner_approvals.modal.description')}>
                           <p className="text-sm font-medium text-gray-800 whitespace-pre-line line-clamp-4 hover:line-clamp-none transition-all cursor-default">
                               {propertyInfo.description || '---'}
                           </p>
                        </InfoRow>
                        <InfoRow icon={<DollarSign size={14}/>} label={t('owner_approvals.modal.base_price')} value={formatCurrency(propertyInfo.price, currentLocale)} />
                        <InfoRow icon={<DollarSign size={14}/>} label={t('owner_approvals.modal.weekend_price')} value={formatCurrency(propertyInfo.weekendPrice, currentLocale)} />
                        <InfoRow icon={<UsersIcon size={14}/>} label={t('owner_approvals.modal.capacity')} value={t('owner_approvals.modal.capacity_value', { count: propertyInfo.capacity || 0 })} />
                        <InfoRow icon={<Maximize size={14}/>} label={t('owner_approvals.modal.area')} value={t('owner_approvals.modal.area_value', { count: propertyInfo.area || 0 })} />
                        <InfoRow icon={<ShieldCheck size={14}/>} label={t('owner_approvals.modal.business_license')} value={propertyInfo.businessLicenseNumber || application.businessLicenseNumber} isHighlight />
                    </div>
                </div>

                 {propertyInfo.amenityNames && propertyInfo.amenityNames.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <SectionTitle icon={Sparkles} title={t('owner_approvals.modal.amenities')} />
                        <div className="flex flex-wrap gap-2">
                            {propertyInfo.amenityNames.map((amenity, idx) => (
                                <AmenityBadge key={idx} amenity={amenity} />
                            ))}
                        </div>
                    </div>
                 )}

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={Clock} title={t('owner_approvals.modal.operation_policy')} />
                    <div className="grid grid-cols-2 gap-x-4">
                        <InfoRow icon={<Clock size={14}/>} label={t('owner_approvals.modal.check_in')} value={policies.checkInTime} />
                        <InfoRow icon={<Clock size={14}/>} label={t('owner_approvals.modal.check_out')} value={policies.checkOutTime} />
                        <InfoRow icon={<UsersIcon size={14}/>} label={t('owner_approvals.modal.min_age')} value={policies.minimumAge ? t('owner_approvals.modal.age_value', { count: policies.minimumAge }) : 'N/A'} />
                        <InfoRow icon={<XCircle size={14}/>} label={t('owner_approvals.modal.free_cancel')} value={policies.allowFreeCancellation ? t('owner_approvals.modal.yes') : t('owner_approvals.modal.no')} />
                        {policies.allowFreeCancellation && (
                            <div className="col-span-2">
                                <InfoRow icon={<Calendar size={14}/>} label={t('owner_approvals.modal.free_cancel_days')} value={policies.freeCancellationDays ? t('owner_approvals.modal.free_cancel_days_value', { count: policies.freeCancellationDays }) : 'N/A'} />
                            </div>
                        )}
                    </div>
                </div>
              </div>

              {/* CỘT 3: HÌNH ẢNH MINH CHỨNG */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-full">
                    <SectionTitle icon={ImageIcon} title={t('owner_approvals.modal.proof_images', { count: allImages.length })} />
                    
                    <div className="space-y-6">
                        {/* CCCD & License Group */}
                        {([...personalImages, ...businessImages].length > 0) ? (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">{t('owner_approvals.modal.legal_docs')}</p>
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                                    {[...personalImages, ...businessImages].map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            className="relative group cursor-pointer aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 hover:border-blue-400 transition"
                                            onClick={() => { 
                                                const globalIdx = allImages.findIndex(ai => ai.url === img.url);
                                                setViewerIndex(globalIdx !== -1 ? globalIdx : 0); 
                                                setViewerOpen(true); 
                                            }}
                                        >
                                            <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                                <p className="text-[10px] text-white font-bold text-center leading-tight">{img.caption}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-400">{t('owner_approvals.modal.no_legal_docs')}</p>
                            </div>
                        )}

                        {/* Property Images Group */}
                        {propertyImages.length > 0 ? (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">{t('owner_approvals.modal.property_images')}</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {propertyImages.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            className="relative group cursor-pointer aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-blue-400 transition"
                                            onClick={() => { 
                                                const globalIdx = allImages.findIndex(ai => ai.url === img.url);
                                                setViewerIndex(globalIdx !== -1 ? globalIdx : 0); 
                                                setViewerOpen(true); 
                                            }}
                                        >
                                            <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                               <p className="text-[10px] text-white font-bold">{t('owner_approvals.modal.property_img_caption', { index: idx + 1 })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-400">{t('owner_approvals.modal.no_property_images')}</p>
                            </div>
                        )}
                    </div>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm rounded-b-2xl flex justify-end gap-3 shrink-0">
            {application.status === "PENDING" ? (
                <>
                    <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => onReject(application)} className="bg-white text-red-600 border-red-200 hover:bg-red-50 font-semibold">
                        {t('owner_approvals.modal.reject_btn')}
                    </Button>
                    <Button variant="primary" leftIcon={<CheckCircle size={18} />} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 font-semibold" onClick={() => onApprove(application)}>
                        {t('owner_approvals.modal.approve_btn')}
                    </Button>
                </>
            ) : (
                <div className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 ${
                    application.status === 'APPROVED' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                     {application.status === 'APPROVED' ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                     {t('owner_approvals.modal.reviewed_status', { status: getStatusLabel(application.status).toLowerCase() })}
                 </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      {viewerOpen && (
        <ImageViewerModal 
            open={viewerOpen} 
            onClose={() => setViewerOpen(false)} 
            images={allImages} 
            startIndex={viewerIndex}
        />
      )}
    </ModalPortal>
  );
}