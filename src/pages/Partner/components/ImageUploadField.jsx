import React, { useState, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon, Trash2 } from 'lucide-react';

const ImageUploadField = ({ label, required, onChange, error, value }) => {
  const [preview, setPreview] = useState(null);

  // Sync preview nếu value có sẵn (trường hợp edit hoặc re-render)
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate sơ bộ (VD: < 5MB)
      if (file.size > 5 * 1024 * 1024) {
         alert("Vui lòng chọn ảnh nhỏ hơn 5MB");
         return;
      }
      onChange(file); // Gửi file ra ngoài cho React Hook Form
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null); // Reset value trong form
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!preview ? (
        <label className={`
          group flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${error 
            ? 'border-red-300 bg-red-50/50' 
            : 'border-slate-300 bg-slate-50 hover:border-[#28A9E0] hover:bg-blue-50/30'
          }
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className={`p-3 rounded-full mb-3 transition-colors ${error ? 'bg-red-100 text-red-500' : 'bg-white text-[#28A9E0] shadow-sm group-hover:scale-110'}`}>
                <UploadCloud size={24} />
            </div>
            <p className="mb-1 text-sm text-slate-600 font-medium group-hover:text-[#28A9E0]">
              Nhấn để tải ảnh hoặc kéo thả
            </p>
            <p className="text-xs text-slate-400">Hỗ trợ PNG, JPG, JPEG (Max 5MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
            <button 
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full text-red-500 text-sm font-bold shadow-lg hover:bg-white transition-all transform hover:-translate-y-1"
            >
              <Trash2 size={16} /> Xóa ảnh
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 ml-1 flex items-center gap-1 text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block"/>
            {error.message}
        </p>
      )}
    </div>
  );
};

export default ImageUploadField;