import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const action = searchParams.get('action');
    const error = searchParams.get('error');

    const authData = { token, action, error };

    // 1. Gửi qua postMessage (Nếu trình duyệt không chặn)
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(authData, window.location.origin);
    } 
    // 2. Fallback siêu cấp: Dùng LocalStorage để "đánh điện" cho cửa sổ mẹ
    else {
      localStorage.setItem('oauth2_data', JSON.stringify(authData));
      // Xóa ngay lập tức để kích hoạt sự kiện 'storage' bên kia
      setTimeout(() => localStorage.removeItem('oauth2_data'), 500); 
    }

    // Nhiệm vụ hoàn tất -> Rút lui!
    window.close();
  }, [searchParams]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
      <p className="text-white font-bold text-lg animate-pulse">Đang hoàn tất đăng nhập...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;