import React, { useState } from "react";
import { X, MapPin, User, Mail, Phone, Star, Building, Expand } from "lucide-react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import ImageViewerModal from "@/components/common/Modal/ImageViewerModal"; // [NEW] Import

const PropertyDetailModal = ({ isOpen, onClose, property }) => {
  if (!property) return null;

  const [isViewerOpen, setIsViewerOpen] = useState(false); // [NEW]
  const [viewerIndex, setViewerIndex] = useState(0);       // [NEW]

  // Xử lý danh sách ảnh đầu vào
  let rawImages = [];
  try {
    if (Array.isArray(property.images)) {
      rawImages = property.images;
    } else if (typeof property.images === "string") {
      rawImages = JSON.parse(property.images);
    }
  } catch (e) {
    rawImages = property.coverImage ? [property.coverImage] : [];
  }

  // Nếu không có ảnh nào thì dùng ảnh bìa làm fallback
  if (rawImages.length === 0 && property.coverImage) {
    rawImages = [property.coverImage];
  }

  // Chuyển đổi sang format mà ImageViewerModal yêu cầu: { url, caption }
  const viewerImages = rawImages.map((img, idx) => ({
    url: typeof img === 'string' ? img : img.imageUrl,
    caption: `${property.propertyName} - Ảnh ${idx + 1}`
  }));

  // Hàm mở xem ảnh
  const handleOpenViewer = (index) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title="Chi tiết Cơ sở lưu trú"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 pb-4">
          
          {/* 1. Ảnh bìa & Gallery */}
          <div className="space-y-3">
            <div 
              className="h-64 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group cursor-pointer"
              onClick={() => handleOpenViewer(0)} // Click mở ảnh đầu tiên
            >
              <img
                src={property.coverImage || "/assets/images/placeholder.png"}
                alt={property.propertyName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <Expand className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all" size={32} />
              </div>
            </div>

            {/* List ảnh nhỏ */}
            {viewerImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {viewerImages.map((imgObj, idx) => (
                  <div 
                    key={idx} 
                    className="w-20 h-20 flex-shrink-0 cursor-pointer relative group rounded-lg overflow-hidden border border-gray-200"
                    onClick={() => handleOpenViewer(idx)}
                  >
                    <img
                      src={imgObj.url}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Thông tin chính */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {property.propertyName}
              </h2>
              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin size={18} className="mt-1 text-blue-500 flex-shrink-0" />
                <span>{property.address}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {property.propertyType || "Khách sạn"}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-medium text-gray-700">{property.rating || 0}</span>
                  <span className="text-gray-400 text-sm">({property.reviewCount || 0} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Thông tin chủ sở hữu */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={18} /> Thông tin Chủ sở hữu
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Họ tên:</span>
                  <span className="font-medium text-gray-800">{property.ownerName || "---"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><Mail size={14}/> Email:</span>
                  <span className="font-medium text-gray-800">{property.emailContact || "---"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><Phone size={14}/> SĐT:</span>
                  <span className="font-medium text-gray-800">{property.phoneContact || "---"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Mô tả */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-2">Mô tả giới thiệu</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {property.description || "Chưa có mô tả."}
            </p>
          </div>

          {/* 4. Tiện ích */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Tiện ích nổi bật</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((am, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm border border-gray-200">
                    {typeof am === 'string' ? am : am.amenityName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
          <Button onClick={onClose} variant="ghost" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
            Đóng
          </Button>
        </div>
      </Modal>

      {/* [NEW] Component xem ảnh full màn hình */}
      <ImageViewerModal
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={viewerImages}
        startIndex={viewerIndex}
      />
    </>
  );
};

export default PropertyDetailModal;