import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';

/**
 * Component Upload File đã được nâng cấp với tính năng PREVIEW ẢNH.
 * @param {string} name - Tên của trường (vd: "personalIdFront")
 * @param {string} label - Nhãn hiển thị
 * @param {function} watch - Hàm 'watch' từ react-hook-form
 * @param {function} setValue - Hàm 'setValue' từ react-hook-form
 * @param {string} error - Tin nhắn lỗi (nếu có)
 */
const FileUpload = ({ name, label, watch, setValue, error }) => {
  // 1. State để lưu URL preview (vd: "blob:http://...")
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // 2. Theo dõi giá trị file từ react-hook-form
  const fileList = watch(name); // Đây là một FileList object

  useEffect(() => {
    const file = fileList && fileList[0] ? fileList[0] : null;

    if (file) {
      // Chỉ tạo preview nếu là file ảnh
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        
        // Cleanup: Hủy URL khi component unmount
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        // Nếu là file khác (PDF, v.v.) thì không tạo preview ảnh
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [fileList]); // Chạy lại khi 'fileList' thay đổi

  // 3. Xử lý khi người dùng chọn file
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setValue(name, event.target.files, { shouldValidate: true });
    }
  };

  // 4. Xử lý khi nhấn nút "Xóa"
  const handleRemoveFile = () => {
    setValue(name, null, { shouldValidate: true });
    // Reset input để có thể chọn lại file y hệt
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const file = fileList && fileList[0] ? fileList[0] : null;

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* 5. HIỂN THỊ PREVIEW (NẾU CÓ) */}
      {file ? (
        <div className="group relative rounded-lg border border-gray-300 p-2">
          {preview ? (
            // 5a. Nếu là ảnh -> Hiển thị ảnh
            <img
              src={preview}
              alt="Xem trước"
              className="w-full h-32 object-contain rounded-md"
            />
          ) : (
            // 5b. Nếu là file (PDF) -> Hiển thị tên file
            <div className="flex items-center justify-center h-32 text-gray-500">
              <FileIcon className="w-8 h-8 mr-2" />
              <span className="text-sm truncate">{file.name}</span>
            </div>
          )}
          
          {/* Nút Xóa */}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 z-10 p-1 bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Xóa file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        // 6. KHU VỰC UPLOAD (NẾU CHƯA CÓ FILE)
        <label
        
          className={`relative flex flex-col items-center justify-center w-full h-32 border-2 
                      ${error ? 'border-red-400' : 'border-gray-300'} 
                      border-dashed rounded-lg cursor-pointer bg-gray-50 
                      hover:bg-gray-100 transition-colors`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className={`w-8 h-8 mb-3 ${error ? 'text-red-500' : 'text-gray-400'}`} />
            <p className="mb-2 text-sm text-gray-500 text-center">
              <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
            </p>
            <p className="text-xs text-gray-500">JPG, PNG hoặc WEBP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
          />
        </label>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;