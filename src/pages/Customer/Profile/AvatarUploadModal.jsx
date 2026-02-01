// src/pages/Customer/Profile/AvatarUploadModal.jsx
import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { Upload, Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage"; // Import hàm tiện ích vừa tạo

export default function AvatarUploadModal({ isOpen, onClose, onSave, isLoading }) {
  const [imageSrc, setImageSrc] = useState(null);
  
  // State cho Cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  // Reset khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // 1. Xử lý chọn file từ máy
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn ảnh dưới 5MB.");
        return;
      }
      // Đọc file dưới dạng URL để đưa vào Cropper
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  // 2. Lưu lại tọa độ khi người dùng di chuyển vùng cắt
  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 3. Xử lý khi bấm "Cập nhật"
  const handleConfirm = async () => {
    try {
      // Tạo file ảnh mới từ vùng đã cắt
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Chuyển Blob thành File object để gửi lên server
      const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      
      onSave(croppedFile);
    } catch (e) {
      console.error(e);
      alert("Đã có lỗi khi cắt ảnh.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Cập nhật ảnh đại diện"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center gap-6 py-2">
        
        {/* Vùng chứa Cropper hoặc Placeholder */}
        <div className="relative w-full h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
          {imageSrc ? (
            <div className="absolute inset-0">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // Tỉ lệ 1:1 (hình vuông/tròn)
                cropShape="round" // Vùng cắt hình tròn
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon size={48} className="mb-2" />
              <span className="text-sm">Chưa chọn ảnh</span>
            </div>
          )}
        </div>

        {/* Thanh điều chỉnh Zoom (chỉ hiện khi đã có ảnh) */}
        {imageSrc && (
          <div className="w-full px-4 flex items-center gap-3">
            <ZoomOut size={18} className="text-gray-500" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[rgb(40,169,224)]"
            />
            <ZoomIn size={18} className="text-gray-500" />
          </div>
        )}

        {/* Nút chọn ảnh khác */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          {!imageSrc && (
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload size={18} />}
            >
              Chọn ảnh từ thiết bị
            </Button>
          )}
          {imageSrc && (
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-[rgb(40,169,224)] hover:underline font-medium"
             >
                Chọn ảnh khác
             </button>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 w-full pt-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            fullWidth 
            onClick={handleConfirm}
            disabled={!imageSrc || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Đang tải lên..." : "Lưu & Cập nhật"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}