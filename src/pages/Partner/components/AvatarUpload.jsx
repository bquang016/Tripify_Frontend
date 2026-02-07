import React, { useState, useEffect } from 'react';
import { Camera, User, X } from 'lucide-react';

const AvatarUpload = ({ onChange, value, error }) => {
  const [preview, setPreview] = useState(null);

  // Sync preview khi có value từ form (hoặc từ API trả về)
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         alert("Ảnh quá lớn! Vui lòng chọn ảnh < 5MB");
         return;
      }
      onChange(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      
      {/* Avatar Circle Container */}
      <div className="relative group">
        <div 
            className={`
                w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-lg relative bg-slate-50
                ${error 
                    ? 'border-red-300 shadow-red-100' 
                    : 'border-white shadow-slate-200 group-hover:border-[#28A9E0] group-hover:shadow-blue-200'
                }
            `}
        >
            {preview ? (
                <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={64} strokeWidth={1.5} />
                </div>
            )}
            
            {/* Overlay Hover (Chỉ hiện khi có ảnh) */}
            {preview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                     <button 
                        onClick={handleRemove}
                        className="p-2 bg-white/20 hover:bg-red-500 rounded-full text-white transition-colors"
                        title="Xóa ảnh"
                     >
                        <X size={20} />
                     </button>
                </div>
            )}
        </div>

        {/* Camera Upload Button (Absolute Position) */}
        <label className="absolute bottom-0 right-0 cursor-pointer">
            <div className="w-10 h-10 bg-[#28A9E0] hover:bg-[#2090C0] text-white rounded-full flex items-center justify-center shadow-md border-[3px] border-white transition-transform hover:scale-110 active:scale-95">
                <Camera size={18} />
            </div>
            <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
        </label>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">Tải ảnh đại diện</p>
        <p className="text-xs text-slate-400 mt-1">Hỗ trợ JPG, PNG (Max 5MB)</p>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error.message}</p>}
      </div>

    </div>
  );
};

export default AvatarUpload;