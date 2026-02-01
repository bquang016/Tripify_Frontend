import React, { useState, useEffect } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { 
  X, MapPin, Hotel, Home, Building, Info, Image as ImageIcon, Ruler,
  ShieldCheck, Clock, Ban, Baby, Dog, CreditCard, AlertTriangle, Calendar,
  Mail, Phone, CheckCircle, XCircle, Maximize2
} from "lucide-react";
import ImageViewerModal from "./ImageViewerModal"; 
import Button from "@/components/common/Button/Button";
import propertyService from "@/services/property.service";
// Import component hiển thị chính sách
import PropertyPoliciesView from "./PropertyPoliciesView";

// --- HELPERS ---

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric", month: "long", day: "numeric"
  });
};

const getPropertyTypeLabel = (type) => {
  const map = {
    HOTEL: { label: "Khách sạn", icon: <Hotel size={16} />, color: "text-blue-600 bg-blue-50 border-blue-200" },
    VILLA: { label: "Biệt thự", icon: <Home size={16} />, color: "text-purple-600 bg-purple-50 border-purple-200" },
    HOMESTAY: { label: "Homestay", icon: <Building size={16} />, color: "text-green-600 bg-green-50 border-green-200" },
  };
  return map[type] || { label: type, icon: <Hotel size={16} />, color: "text-gray-600 bg-gray-50" };
};

const formatAddress = (submission) => {
    const addr = submission.address || "";
    const province = submission.province || "";
    // Loại bỏ prefix "Tỉnh/Thành phố" để so sánh
    const cleanProvince = province.replace(/^(Thành phố|Tỉnh)\s+/i, "").trim();

    // Nếu địa chỉ đã chứa tên tỉnh thì không nối thêm
    if (cleanProvince && addr.toLowerCase().includes(cleanProvince.toLowerCase())) {
        return addr;
    }

    const parts = [addr, submission.ward, submission.city, submission.province];
    return parts.filter(Boolean).join(", ");
};

const InfoRow = ({ icon, label, value, isLink = false }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="mt-1 text-gray-400 shrink-0">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      {isLink ? (
        <a href={value} className="text-blue-600 hover:underline break-all text-sm mt-0.5 block font-medium">
          {value}
        </a>
      ) : (
        <p className="text-gray-900 text-sm mt-0.5 font-medium break-words">{value || "---"}</p>
      )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function ViewHotelSubmissionModal({ 
  isOpen, onClose, submission, onApprove, onReject 
}) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // State cho Policies
  const [policies, setPolicies] = useState(null);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  // Fetch Policies khi mở Modal
  useEffect(() => {
    if (isOpen && submission?.propertyId) {
        const fetchPolicies = async () => {
            setLoadingPolicies(true);
            try {
                const data = await propertyService.getPropertyPolicies(submission.propertyId);
                setPolicies(data);
            } catch (error) {
                // console.error("Failed to fetch policies:", error);
                setPolicies(null);
            } finally {
                setLoadingPolicies(false);
            }
        };
        fetchPolicies();
    } else {
        setPolicies(null);
    }
  }, [isOpen, submission]);

  if (!isOpen || !submission) return null;

  // --- KHAI BÁO BIẾN ĐẦY ĐỦ ---
  const fullAddress = formatAddress(submission);
  const ownerName = submission.ownerName || "Không tên";
  const ownerEmail = submission.ownerEmail || "Chưa cập nhật";
  const ownerPhone = submission.ownerPhone || "Chưa cập nhật";
  const submittedDate = submission.createdAt ? formatDate(submission.createdAt) : "N/A";
  const typeInfo = getPropertyTypeLabel(submission.propertyType);
  
  // Xử lý ảnh
  const API_IMAGE_BASE = "http://localhost:8386/images/"; 
  const ownerAvatarUrl = submission.ownerAvatar 
    ? (submission.ownerAvatar.startsWith("http") ? submission.ownerAvatar : `${API_IMAGE_BASE}${submission.ownerAvatar}`)
    : null;

  let imageList = [];
  if (submission.coverImage) imageList.push(submission.coverImage);
  if (submission.images && Array.isArray(submission.images)) {
     imageList = [...imageList, ...submission.images];
  }
  
  const formattedImageUrls = [...new Set(imageList)].map(img => 
      img.startsWith("http") ? img : `${API_IMAGE_BASE}${img}`
  );

  const viewerImages = formattedImageUrls.map(url => ({
      url: url,
      caption: submission.propertyName
  }));

  const MAX_DISPLAY_IMAGES = 5;
  const displayImages = formattedImageUrls.slice(0, MAX_DISPLAY_IMAGES);
  const remainingImagesCount = formattedImageUrls.length - MAX_DISPLAY_IMAGES;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-blue-600 bg-blue-50 p-2 rounded-lg"><Hotel size={24}/></span>
                Chi tiết hồ sơ đăng ký #{submission.propertyId}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1 ml-12">
                <Calendar size={14}/> Ngày gửi: {submittedDate}
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* CỘT TRÁI */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. INFO */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2 ${typeInfo.color}`}>
                                {typeInfo.icon} {typeInfo.label}
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{submission.propertyName}</h1>
                            <div className="flex items-center gap-2 text-gray-600 mt-2">
                                <MapPin size={18} className="text-red-500 shrink-0" />
                                <span className="font-medium">{fullAddress}</span>
                            </div>
                        </div>
                     </div>
                     <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Info size={16} className="text-blue-500"/> Giới thiệu</h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words text-justify">
                            {submission.description || "Không có mô tả."}
                        </p>
                     </div>
                </div>

                {/* ✅ 2. CHÍNH SÁCH (SỬ DỤNG COMPONENT CON MỚI) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    {loadingPolicies ? (
                        <div className="flex justify-center py-10 text-gray-400 animate-pulse text-sm">
                            Đang tải dữ liệu chính sách...
                        </div>
                    ) : (
                        <PropertyPoliciesView policies={policies} />
                    )}
                </div>

                {/* 3. HÌNH ẢNH */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ImageIcon size={18} className="text-blue-500"/> Thư viện hình ảnh ({formattedImageUrls.length})
                    </h3>
                    {displayImages.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2 h-[320px]">
                            {displayImages.map((img, idx) => {
                                const isMain = idx === 0;
                                return (
                                    <div key={idx} className={`relative group cursor-pointer overflow-hidden rounded-xl border border-gray-100 ${isMain ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`} onClick={() => { setCurrentImageIndex(idx); setIsViewerOpen(true); }}>
                                        <img src={img} alt={`Hotel ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => e.target.src = "/placeholder-hotel.jpg"}/>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        {isMain && <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">Ảnh bìa</span>}
                                        {idx === MAX_DISPLAY_IMAGES - 1 && remainingImagesCount > 0 && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg group-hover:bg-black/70 transition-colors">+{remainingImagesCount}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 italic">Không có hình ảnh</div>
                    )}
                </div>

                {/* 4. TIỆN NGHI */}
                 {submission.propertyAmenities && submission.propertyAmenities.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Tiện nghi nổi bật</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {submission.propertyAmenities.map((am, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                    <span className="text-sm text-gray-700 font-medium truncate">{am.amenity?.amenityName || am}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
              </div>

              {/* CỘT PHẢI (SIDEBAR) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white">
                        <h4 className="font-bold text-base mb-4 opacity-90">Thông tin đối tác</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full border-4 border-white/20 bg-white/10 overflow-hidden shrink-0">
                                {ownerAvatarUrl ? <img src={ownerAvatarUrl} alt="Owner" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold text-xl">{ownerName.charAt(0)}</div>}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-lg leading-snug truncate" title={ownerName}>{ownerName}</p>
                                <span className="text-blue-900 text-[10px] bg-white/90 px-2 py-0.5 rounded-full mt-1 inline-block font-bold uppercase tracking-wider shadow-sm">Chủ sở hữu</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 space-y-1">
                        <InfoRow icon={<Mail size={16} />} label="Email" value={ownerEmail} isLink={true} />
                        <InfoRow icon={<Phone size={16} />} label="Số điện thoại" value={ownerPhone} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 font-bold text-gray-700 text-sm flex items-center gap-2"><Ruler size={16}/> Thông số kỹ thuật</div>
                    <div className="p-5">
                        <InfoRow icon={<Hotel size={16} />} label="Diện tích đất" value={submission.area ? `${submission.area} m²` : "Chưa cập nhật"} />
                        {submission.floorArea && <InfoRow icon={<Maximize2 size={16} />} label="Diện tích sàn" value={`${submission.floorArea} m²`} />}
                        <InfoRow icon={<MapPin size={16} />} label="Tọa độ GPS" value={`${submission.latitude}, ${submission.longitude}`} />
                    </div>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl flex justify-end gap-3 shrink-0 z-10 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)]">
            {submission.propertyStatus === "PENDING" && (
                <>
                    <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => onReject(submission)} className="bg-white text-red-600 border-red-200 hover:bg-red-50 px-6 shadow-sm">Từ chối hồ sơ</Button>
                    <Button variant="primary" leftIcon={<CheckCircle size={18} />} className="bg-green-600 hover:bg-green-700 border-green-600 text-white px-8 shadow-lg shadow-green-200" onClick={() => onApprove(submission)}>Phê duyệt ngay</Button>
                </>
            )}
             {submission.propertyStatus !== "PENDING" && (
                 <div className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${submission.propertyStatus === 'APPROVE' || submission.propertyStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {submission.propertyStatus === 'APPROVE' || submission.propertyStatus === 'APPROVED' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                     {submission.propertyStatus === 'APPROVE' || submission.propertyStatus === 'APPROVED' ? 'Đã phê duyệt' : 'Đã từ chối'}
                 </div>
            )}
          </div>

        </div>
      </div>

      {isViewerOpen && <ImageViewerModal open={isViewerOpen} onClose={() => setIsViewerOpen(false)} images={viewerImages} startIndex={currentImageIndex} />}
    </ModalPortal>
  );
}