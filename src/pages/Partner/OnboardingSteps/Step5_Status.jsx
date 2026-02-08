
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, RotateCw } from 'lucide-react';
import Button from '@/components/common/Button/Button';

const Step5_Status = ({ error, onRetry }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Navigate to the property management page or dashboard
    navigate('/owner/properties'); 
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
      {error ? (
        <>
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Đã xảy ra lỗi!</h2>
          <p className="text-slate-600 mb-6 max-w-md">
            Rất tiếc, chúng tôi không thể xử lý đơn đăng ký của bạn lúc này. Vui lòng thử lại.
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6 font-mono max-w-md w-full">
            {error}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/partner/dashboard')}>
                Về trang chủ
            </Button>
            <Button onClick={onRetry} leftIcon={<RotateCw size={18} />}>
                Thử lại
            </Button>
          </div>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Hoàn tất!</h2>
          <p className="text-slate-600 mb-6 max-w-md">
            Thông tin chỗ nghỉ của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và thông báo cho bạn trong thời gian sớm nhất.
          </p>
          <Button onClick={handleNavigate}>
            Quản lý chỗ nghỉ
          </Button>
        </>
      )}
    </div>
  );
};

export default Step5_Status;
