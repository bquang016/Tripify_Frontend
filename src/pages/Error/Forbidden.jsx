import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <ShieldAlert size={64} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-9xl font-extrabold text-gray-900 tracking-widest mb-4">
          403
        </h1>
        
        <div className="bg-[#FF6B6B] px-2 text-sm rounded rotate-12 absolute transform -translate-y-12 translate-x-24 hidden sm:block">
          Access Denied
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bạn không có quyền truy cập
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Rất tiếc, bạn không có quyền xem nội dung này. Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200"
          >
            <Home size={20} />
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
