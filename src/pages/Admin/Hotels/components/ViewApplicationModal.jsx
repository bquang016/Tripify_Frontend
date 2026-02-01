import React, { useState } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { 
    X, User, Mail, Phone, Calendar, Briefcase, MapPin, CreditCard, 
    CheckCircle, XCircle, Image as ImageIcon, ShieldCheck, AlertOctagon, Cake
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

// ✅ Helper Việt hóa trạng thái
const getStatusLabel = (status) => {
    switch (status) {
        case "PENDING": return "Chờ duyệt";
        case "APPROVED": return "Đã duyệt";
        case "REJECTED": return "Từ chối";
        default: return status;
    }
};

const InfoRow = ({ icon, label, value, isHighlight = false }) => (
  <div className={`flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 ${isHighlight ? 'bg-yellow-50/50 -mx-2 px-2 rounded' : ''}`}>
    <div className={`mt-1 shrink-0 ${isHighlight ? 'text-yellow-600' : 'text-gray-400'}`}>{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-sm mt-0.5 font-medium break-words ${isHighlight ? 'text-yellow-900' : 'text-gray-900'}`}>{value || "---"}</p>
    </div>
  </div>
);

export default function ViewApplicationModal({ isOpen, onClose, application, onApprove, onReject }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!isOpen || !application) return null;

  const proofImages = [
    { url: getImgUrl(application.cardFrontImage), caption: "CCCD Mặt trước" },
    { url: getImgUrl(application.cardBackImage), caption: "CCCD Mặt sau" },
    { url: getImgUrl(application.businessLicenseImage), caption: "Giấy phép KD" }
  ].filter(img => img.url && !img.url.includes("placeholder"));

  const isReviewed = application.status !== "PENDING";
  const isRejected = application.status === "REJECTED";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-blue-600 bg-blue-50 p-2 rounded-lg"><Briefcase size={24}/></span>
                Hồ sơ đối tác #{application.id}
              </h2>
              <div className="flex items-center gap-4 mt-1 ml-12">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14}/> Nộp ngày: {formatDateVN(application.createdAt || application.submittedDate)}
                  </p>
                  
                  {/* ✅ Badge trạng thái (Header) - Tiếng Việt */}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                      application.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      application.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-red-50 text-red-700 border-red-200'
                  }`}>
                      {application.status === 'PENDING' && <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span></span>}
                      {getStatusLabel(application.status)}
                  </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={24} /></button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* CỘT TRÁI (5/12) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><User size={100}/></div>
                        <h4 className="font-bold text-base mb-2 opacity-90 relative z-10">Thông tin người nộp</h4>
                        <h3 className="text-2xl font-bold relative z-10">{application.applicantFullName}</h3>
                    </div>
                    <div className="p-5">
                        <InfoRow icon={<Mail size={16}/>} label="Email" value={application.applicantEmail} />
                        <InfoRow icon={<Phone size={16}/>} label="SĐT" value={application.applicantPhoneNumber} />
                        <InfoRow icon={<Cake size={16}/>} label="Ngày sinh" value={formatDateVN(application.applicantDob)} />
                        <InfoRow icon={<CreditCard size={16}/>} label="Số CCCD" value={application.personalIdCard} />
                        <InfoRow icon={<MapPin size={16}/>} label="Quê quán" value={application.hometownAddress} />
                        <InfoRow icon={<MapPin size={16}/>} label="Thường trú" value={application.permanentAddress} />
                    </div>
                </div>

                {isReviewed && (
                    <div className={`rounded-2xl border shadow-sm overflow-hidden ${isRejected ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className={`px-6 py-4 border-b flex items-center gap-2 ${isRejected ? 'border-red-200 text-red-800' : 'border-green-200 text-green-800'}`}>
                            {isRejected ? <AlertOctagon size={20}/> : <ShieldCheck size={20}/>}
                            <h4 className="font-bold text-base">Kết quả xét duyệt</h4>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                <span className="text-sm font-medium opacity-70">Người duyệt:</span>
                                <span className="font-bold">{application.reviewedByAdminName || "Admin"}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                <span className="text-sm font-medium opacity-70">Ngày duyệt:</span>
                                <span className="font-bold">{formatDateVN(application.reviewedAt)}</span>
                            </div>
                            
                            {isRejected && (
                                <div className="pt-2">
                                    <span className="text-xs font-bold uppercase opacity-70 block mb-1">Lý do từ chối:</span>
                                    <p className="bg-white/60 p-3 rounded-lg text-red-700 text-sm italic border border-red-100">
                                        "{application.adminReason || "Không có lý do cụ thể"}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
              </div>

              {/* CỘT PHẢI (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ImageIcon size={18} className="text-blue-500"/> Ảnh minh chứng ({proofImages.length})
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {proofImages.map((img, idx) => (
                            <div 
                                key={idx} 
                                className={`relative group cursor-pointer overflow-hidden rounded-xl border border-gray-100 shadow-sm ${idx === 2 ? 'col-span-2 h-56' : 'h-48'}`}
                                onClick={() => { setViewerIndex(idx); setViewerOpen(true); }}
                            >
                                <img src={img.url} alt={img.caption} className="w-full h-full object-contain bg-gray-50 transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                    {img.caption}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={20}/></div>
                        <div>
                            <p className="text-xs text-blue-600 font-semibold uppercase">Số Giấy phép kinh doanh</p>
                            <p className="text-lg font-bold text-blue-900 tracking-wide">{application.businessLicenseNumber}</p>
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl flex justify-end gap-3 shrink-0 z-10">
            {application.status === "PENDING" ? (
                <>
                    <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => onReject(application)} className="bg-white text-red-600 border-red-200 hover:bg-red-50 px-6">
                        Từ chối hồ sơ
                    </Button>
                    <Button variant="primary" leftIcon={<CheckCircle size={18} />} className="bg-green-600 hover:bg-green-700 border-green-600 text-white px-8 shadow-lg shadow-green-200" onClick={() => onApprove(application)}>
                        Phê duyệt ngay
                    </Button>
                </>
            ) : (
                // ✅ Badge trạng thái (Footer) - Tiếng Việt
                <div className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm ${
                    application.status === 'APPROVED' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                     {application.status === 'APPROVED' ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                     {getStatusLabel(application.status)}
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
            images={proofImages} 
            startIndex={viewerIndex}
        />
      )}
    </ModalPortal>
  );
}
