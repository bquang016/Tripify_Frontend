import React, { useEffect } from "react";
import { X } from "lucide-react";
import HotelReviews from "./HotelReviews";

// ✅ Nhận prop isOwner
const HotelReviewSidebar = ({ isOpen, onClose, propertyId, isAdmin, onOpenGallery, isOwner }) => {
  // Khóa cuộn body khi mở sidebar
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* 1. Backdrop (Nền mờ) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. Main Drawer */}
      <div 
        className="relative w-full md:w-[600px] lg:w-[700px] h-full bg-white shadow-2xl transform transition-transform duration-300 animate-slide-in-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Đánh giá & Nhận xét</h2>
            <p className="text-sm text-slate-500">Xem khách hàng nói gì về chúng tôi</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-6">
             {/* ✅ Truyền tiếp isOwner xuống HotelReviews */}
             <HotelReviews 
                propertyId={propertyId} 
                isAdmin={isAdmin} 
                isOwner={isOwner}
                onOpenGallery={onOpenGallery} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelReviewSidebar;