import React, { useState } from "react";
import { BedDouble, DollarSign, Users, CheckCircle, Info, Image as ImageIcon, Expand } from "lucide-react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import ImageViewerModal from "@/components/common/Modal/ImageViewerModal"; // [NEW] Import

const RoomDetailModal = ({ isOpen, onClose, room }) => {
  if (!room) return null;

  const [isViewerOpen, setIsViewerOpen] = useState(false); // [NEW]
  const [viewerIndex, setViewerIndex] = useState(0);       // [NEW]

  // Chuyển đổi list string sang list object { url, caption }
  const viewerImages = (room.images || []).map((url, idx) => ({
    url: url,
    caption: `${room.roomName} - Ảnh ${idx + 1}`
  }));

  const handleOpenViewer = (index) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  // Format tiền tệ
  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title="Chi tiết Phòng"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 pb-4">
          
          {/* 1. Hình ảnh phòng */}
          <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {viewerImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-2">
                {/* Ảnh đầu tiên to hơn */}
                <div 
                  className="col-span-2 h-48 relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => handleOpenViewer(0)}
                >
                  <img 
                    src={viewerImages[0].url} 
                    alt="Main room" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                     <Expand className="text-white opacity-0 group-hover:opacity-100" />
                  </div>
                </div>

                {/* Các ảnh phụ */}
                {viewerImages.slice(1).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="h-24 relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => handleOpenViewer(idx + 1)} // idx + 1 vì slice mất phần tử đầu
                  >
                    <img 
                      src={img.url} 
                      alt={`Room sub ${idx}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={40} className="mb-2 opacity-50"/>
                <span className="text-sm">Chưa có hình ảnh</span>
              </div>
            )}
          </div>

          {/* 2. Thông tin cơ bản */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-gray-800">{room.roomName}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  room.roomStatus === 'AVAILABLE' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {room.roomStatus === 'AVAILABLE' ? 'Đang hoạt động' : 'Đã dừng'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-xs text-blue-600 uppercase font-semibold mb-1 block">Loại phòng</span>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <BedDouble size={18} className="text-blue-500" />
                  {room.roomCategory || "Standard"}
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <span className="text-xs text-purple-600 uppercase font-semibold mb-1 block">Sức chứa</span>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <Users size={18} className="text-purple-500" />
                  {room.capacity} người lớn
                </div>
              </div>
            </div>
          </div>

          {/* 3. Giá phòng */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign size={18} /> Bảng giá niêm yết
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Giá ngày thường (T2-T5):</span>
                <span className="font-bold text-lg text-blue-600">{formatPrice(room.pricePerNight)}</span>
              </div>
              {room.weekendPrice && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 border-dashed">
                  <span className="text-gray-600">Giá cuối tuần (T6-CN):</span>
                  <span className="font-bold text-lg text-orange-600">{formatPrice(room.weekendPrice)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Mô tả & Tiện ích */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Info size={18} /> Mô tả
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                {room.description || "Không có mô tả chi tiết."}
              </p>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle size={18} /> Tiện nghi phòng
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((am, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs border border-gray-200">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
          <Button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
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

export default RoomDetailModal;