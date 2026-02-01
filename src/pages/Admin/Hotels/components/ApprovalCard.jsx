import React, { forwardRef } from "react";
import { User, Eye, Clock, CheckCircle, XCircle, Briefcase, Calendar, MapPin } from "lucide-react";
import Button from "@/components/common/Button/Button";

// URL Base cho ảnh
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

// Helper: Cấu hình Badge trạng thái
const getStatusConfig = (status) => {
  switch (status) {
    case "PENDING":
      return { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700 border-yellow-300 ring-2 ring-yellow-400/50 shadow-sm animate-pulse", icon: <Clock size={14} className="animate-spin-slow" /> };
    case "APPROVED":
      return { label: "Đã duyệt", className: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14} /> };
    case "REJECTED":
      return { label: "Từ chối", className: "bg-red-100 text-red-700 border-red-200", icon: <XCircle size={14} /> };
    default:
      return { label: status, className: "bg-gray-100 text-gray-600", icon: null };
  }
};

const ApprovalCard = forwardRef(({ application, onViewDetails }, ref) => {
  if (!application) return null;

  const statusConfig = getStatusConfig(application.status);
  
  // Ảnh Avatar người nộp (hoặc Placeholder)
  const avatarUrl = getImageUrl(application.avatar); 
  const userInitial = application.fullName ? application.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div 
      ref={ref}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer relative"
      onClick={onViewDetails}
    >
      {/* === HEADER (AVATAR + STATUS) === */}
      <div className="relative h-28 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-4 flex items-center justify-between">
         <div className="flex items-center gap-3 z-10">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-white flex items-center justify-center overflow-hidden text-2xl font-bold text-blue-600">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e)=>e.target.style.display='none'}/>
                ) : userInitial}
            </div>
            <div>
                <h3 className="text-base font-bold text-gray-900 line-clamp-1" title={application.fullName}>
                    {application.fullName}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Briefcase size={12}/> {application.businessName}
                </p>
            </div>
         </div>

         {/* Badge Status */}
         <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${statusConfig.className}`}>
            {statusConfig.icon} {statusConfig.label}
         </div>
      </div>

      {/* === BODY === */}
      <div className="p-4 flex-1 space-y-3">
        <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400 shrink-0"/>
                <span className="truncate">{application.permanentAddress || "Chưa cập nhật địa chỉ"}</span>
            </div>
            <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400 shrink-0"/>
                <span className="truncate">{application.email}</span>
            </div>
        </div>

        <div className="pt-3 mt-auto border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1"><Calendar size={12}/> Nộp ngày:</span>
            <span className="font-medium text-gray-800">{application.submittedDate}</span>
        </div>
      </div>

      {/* === FOOTER === */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
            onClick={(e) => {
                e.stopPropagation(); 
                onViewDetails();
            }}
        >
            <Eye size={14} className="mr-2"/> Xem hồ sơ
        </Button>
      </div>
    </div>
  );
});

export default ApprovalCard;