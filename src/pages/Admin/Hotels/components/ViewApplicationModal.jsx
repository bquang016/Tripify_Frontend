import React, { useState } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { 
    X, User, Mail, Phone, Calendar, Briefcase, MapPin, CreditCard, 
    CheckCircle, XCircle, Image as ImageIcon, ShieldCheck, AlertOctagon, 
    Cake, Home, DollarSign, Users as UsersIcon, Maximize, Clock, Info, Banknote, Map,
    Sparkles, Compass, BedDouble
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import ImageViewerModal from "./ImageViewerModal";

const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getImgUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

const formatDateVN = (dateString) => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(date);
    } catch (e) { return "N/A"; }
};

const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0 đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusLabel = (status) => {
    switch (status) {
        case "PENDING": return "Chờ duyệt";
        case "APPROVED": return "Đã duyệt";
        case "REJECTED": return "Từ chối";
        default: return status;
    }
};

const getPropertyTypeLabel = (type) => {
    switch (type) {
        case "HOTEL": return "Khách sạn";
        case "RESORT": return "Resort";
        case "VILLA": return "Villa";
        case "HOMESTAY": return "Homestay";
        case "APARTMENT": return "Căn hộ";
        default: return type;
    }
};

const getGenderLabel = (gender) => {
    if (!gender) return "Chưa cập nhật";
    switch (gender.toUpperCase()) {
        case "MALE": return "Nam";
        case "FEMALE": return "Nữ";
        case "OTHER": return "Khác";
        default: return gender;
    }
};

const AmenityBadge = ({ amenity }) => (
    <div className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-gray-200">
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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!isOpen || !application) return null;

  const { propertyInfo = {}, paymentInfo = {} } = application;
  const policies = propertyInfo.policies || {};
  const unitData = propertyInfo.unitData; // Lấy unitData nếu có

  // --- PHÂN LOẠI ẢNH ---
  const personalImages = [
    { url: getImgUrl(application.cardFrontImage), caption: "CCCD Mặt trước" },
    { url: getImgUrl(application.cardBackImage), caption: "CCCD Mặt sau" }
  ].filter(img => application.cardFrontImage && application.cardBackImage);

  const businessImages = [
    { url: getImgUrl(application.businessLicenseImage), caption: "Giấy phép Kinh doanh" }
  ].filter(img => application.businessLicenseImage);

  const propertyImages = (propertyInfo.propertyImageUrls || []).map((url, idx) => ({
    url: getImgUrl(url),
    caption: `Ảnh khuôn viên ${idx + 1}`
  }));

  const unitImages = (propertyInfo.unitImageUrls || []).map((url, idx) => ({
    url: getImgUrl(url),
    caption: `Ảnh trong căn/phòng ${idx + 1}`
  }));

  // Gộp tất cả ảnh lại để truyền vào Image Viewer có thể lướt qua lại
  const allImages = [...personalImages, ...businessImages, ...propertyImages, ...unitImages];
  
  const isReviewed = application.status !== "PENDING";
  const isRejected = application.status === "REJECTED";

  // Hàm render 1 Grid ảnh
  const renderImageGrid = (images, title) => {
      if (!images || images.length === 0) return null;
      return (
          <div className="mb-5 last:mb-0">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3 px-1 border-l-2 border-blue-400 pl-2">{title}</p>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                      <div 
                          key={idx} 
                          className="relative group cursor-pointer aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                          onClick={() => { 
                              const globalIdx = allImages.findIndex(ai => ai.url === img.url);
                              setViewerIndex(globalIdx !== -1 ? globalIdx : 0); 
                              setViewerOpen(true); 
                          }}
                      >
                          <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                              <p className="text-[10px] text-white font-bold text-center leading-tight">{img.caption}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

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
                Chi tiết Hồ sơ Đối tác #{application.id}
              </h2>
              <div className="flex items-center gap-4 mt-0.5 ml-10">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12}/> Nộp ngày: {formatDateVN(application.createdAt)}
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
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* CỘT 1: THÔNG TIN CÁ NHÂN & THANH TOÁN */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={User} title="Thông tin cá nhân" />
                    <div className="space-y-1">
                        <InfoRow icon={<User size={14}/>} label="Họ và tên" value={application.applicantFullName} />
                        <InfoRow icon={<Phone size={14}/>} label="Số điện thoại" value={application.applicantPhoneNumber} />
                        <InfoRow icon={<Mail size={14}/>} label="Email" value={application.applicantEmail} />
                        <InfoRow icon={<CreditCard size={14}/>} label="Số định danh (CCCD)" value={application.personalIdCard} />
                        <InfoRow icon={<Cake size={14}/>} label="Ngày sinh" value={formatDateVN(application.applicantDob)} />
                        <InfoRow icon={<UsersIcon size={14}/>} label="Giới tính" value={getGenderLabel(application.gender)} />
                        <InfoRow icon={<MapPin size={14}/>} label="Địa chỉ" value={application.permanentAddress} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={Banknote} title="Thanh toán" />
                    <div className="space-y-1">
                        <InfoRow icon={<DollarSign size={14}/>} label="Phương thức" value={paymentInfo?.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : paymentInfo?.paymentMethod} />
                        <InfoRow icon={<Briefcase size={14}/>} label="Ngân hàng" value={paymentInfo?.bankName} />
                        <InfoRow icon={<User size={14}/>} label="Chủ tài khoản" value={paymentInfo?.accountHolderName} />
                        <InfoRow icon={<CreditCard size={14}/>} label="Số tài khoản" value={paymentInfo?.accountNumber} />
                    </div>
                </div>

                {isReviewed && (
                    <div className={`p-5 rounded-2xl border shadow-sm ${isRejected ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <SectionTitle icon={isRejected ? AlertOctagon : ShieldCheck} title="Kết quả xét duyệt" />
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Người duyệt:</span>
                                <span className="font-bold">{application.reviewedByAdminName || "Quản trị viên"}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Ngày duyệt:</span>
                                <span className="font-bold">{formatDateVN(application.reviewedAt)}</span>
                            </div>
                            {isRejected && (
                                <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-100">
                                    <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Lý do từ chối:</p>
                                    <p className="text-xs text-red-700 italic">"{application.adminReason || "Không cung cấp lý do"}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
              </div>

              {/* CỘT 2: THÔNG TIN CHỖ NGHỈ & NGUYÊN CĂN */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={Home} title="Thông tin tổng quan" />
                    <div className="space-y-1">
                        <InfoRow icon={<Home size={14}/>} label="Tên chỗ nghỉ" value={propertyInfo.propertyName} />
                        <InfoRow icon={<Briefcase size={14}/>} label="Loại hình" value={getPropertyTypeLabel(propertyInfo.propertyType)} />
                        <InfoRow icon={<MapPin size={14}/>} label="Địa chỉ chỗ nghỉ" value={propertyInfo.propertyAddress} />
                        <InfoRow icon={<Map size={14}/>} label="Khu vực" value={`${propertyInfo.propertyWard || ''}, ${propertyInfo.propertyDistrict || ''}, ${propertyInfo.propertyCity || ''}`.replace(/, , /g, ', ').trim().replace(/^,|,$/g, '')} />
                        <InfoRow icon={<Compass size={14}/>} label="Vị trí trên bản đồ">
                            {propertyInfo.latitude && propertyInfo.longitude ? (
                                <a 
                                    href={`https://www.google.com/maps?q=${propertyInfo.latitude},${propertyInfo.longitude}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    Xem Google Maps <Maximize size={12}/>
                                </a>
                            ) : (
                                <span className="text-gray-400 text-xs italic">Chưa có tọa độ</span>
                            )}
                        </InfoRow>
                        <InfoRow icon={<Info size={14}/>} label="Mô tả">
                           <p className="text-sm font-medium text-gray-800 whitespace-pre-line line-clamp-3 hover:line-clamp-none transition-all cursor-default">
                               {propertyInfo.description || '---'}
                           </p>
                        </InfoRow>
                        
                        <InfoRow icon={<Maximize size={14}/>} label="Diện tích khuôn viên" value={propertyInfo.area ? `${propertyInfo.area} m²` : '---'} />
                        <InfoRow icon={<ShieldCheck size={14}/>} label="Giấy phép KD" value={propertyInfo.businessLicenseNumber || application.businessLicenseNumber} isHighlight />
                    </div>
                </div>

                {/* --- CHỈ HIỆN KHI CÓ DATA NGUYÊN CĂN --- */}
                {unitData && Object.keys(unitData).length > 0 && (
                     <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -z-10 opacity-50"></div>
                        <SectionTitle icon={BedDouble} title="Chi tiết Nguyên Căn" />
                        <div className="space-y-1">
                            <InfoRow icon={<Home size={14}/>} label="Tên căn/phòng" value={unitData.name} />
                            {/* Trỏ giá trị vào unitData.price */}
                            <InfoRow icon={<DollarSign size={14}/>} label="Giá cơ bản/đêm" value={formatCurrency(unitData.price)} />
                            <InfoRow icon={<DollarSign size={14}/>} label="Giá cuối tuần/đêm" value={formatCurrency(unitData.weekendPrice)} />
                            <InfoRow icon={<UsersIcon size={14}/>} label="Sức chứa tiêu chuẩn" value={`${unitData.capacity || 0} người`} />
                            <InfoRow icon={<Maximize size={14}/>} label="Diện tích sử dụng" value={`${unitData.area || 0} m²`} />
                            
                            <InfoRow icon={<Info size={14}/>} label="Mô tả chi tiết">
                               <p className="text-sm font-medium text-gray-800 whitespace-pre-line line-clamp-3 hover:line-clamp-none transition-all">
                                   {unitData.description || '---'}
                               </p>
                            </InfoRow>
                            
                            {unitData.amenityNames && unitData.amenityNames.length > 0 && (
                                <InfoRow icon={<Sparkles size={14}/>} label="Tiện nghi trong căn">
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {unitData.amenityNames.map((am, i) => (
                                            <span key={i} className="text-[11px] font-medium bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200 shadow-sm">
                                                {am}
                                            </span>
                                        ))}
                                    </div>
                                </InfoRow>
                            )}
                        </div>
                     </div>
                )}
                {/* -------------------------------------- */}

                 {propertyInfo.amenityNames && propertyInfo.amenityNames.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <SectionTitle icon={Sparkles} title="Tiện ích khuôn viên chung" />
                        <div className="flex flex-wrap gap-2">
                            {propertyInfo.amenityNames.map((amenity, idx) => (
                                <AmenityBadge key={idx} amenity={amenity} />
                            ))}
                        </div>
                    </div>
                 )}

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <SectionTitle icon={Clock} title="Chính sách vận hành" />
                    <div className="grid grid-cols-2 gap-x-4">
                        <InfoRow icon={<Clock size={14}/>} label="Giờ nhận phòng" value={policies.checkInTime} />
                        <InfoRow icon={<Clock size={14}/>} label="Giờ trả phòng" value={policies.checkOutTime} />
                        <InfoRow icon={<UsersIcon size={14}/>} label="Tuổi tối thiểu" value={policies.minimumAge ? `${policies.minimumAge} tuổi` : 'Không quy định'} />
                        <InfoRow icon={<XCircle size={14}/>} label="Hủy miễn phí" value={policies.allowFreeCancellation ? "Có hỗ trợ" : "Không"} />
                        {policies.allowFreeCancellation && (
                            <div className="col-span-2">
                                <InfoRow icon={<Calendar size={14}/>} label="Hạn hủy miễn phí" value={policies.freeCancellationDays ? `Được hủy trước ${policies.freeCancellationDays} ngày` : 'N/A'} />
                            </div>
                        )}
                    </div>
                </div>
              </div>

              {/* CỘT 3: HÌNH ẢNH MINH CHỨNG */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-full">
                    <SectionTitle icon={ImageIcon} title={`Hình ảnh minh chứng (${allImages.length})`} />
                    
                    <div className="space-y-6 mt-4">
                        {allImages.length > 0 ? (
                            <>
                                {renderImageGrid([...personalImages, ...businessImages], "Định danh & Pháp lý")}
                                {renderImageGrid(propertyImages, "Khuôn viên Cơ sở lưu trú")}
                                {renderImageGrid(unitImages, "Chi tiết Phòng / Nguyên căn")}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <ImageIcon className="text-gray-300 mb-2" size={40} />
                                <p className="text-sm text-gray-400 font-medium">Chưa có hình ảnh nào được tải lên</p>
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
                    <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => onReject(application)} className="bg-white text-red-600 border border-red-200 hover:bg-red-50 font-semibold shadow-sm">
                        Từ chối
                    </Button>
                    <Button variant="primary" leftIcon={<CheckCircle size={18} />} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 font-semibold" onClick={() => onApprove(application)}>
                        Duyệt hồ sơ
                    </Button>
                </>
            ) : (
                <div className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 ${
                    application.status === 'APPROVED' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                     {application.status === 'APPROVED' ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                     Hồ sơ đã được {getStatusLabel(application.status).toLowerCase()}
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
