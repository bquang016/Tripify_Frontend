// src/pages/Auth/OAuth2RedirectHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingOverlay from '../../components/common/Loading/LoadingOverlay';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth2 } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const action = searchParams.get('action'); // Lấy tham số action

    if (token) {
      if (action === 'require_email') {
        // 1. Lưu token tạm thời để gọi API update
        localStorage.setItem('accessToken', token);
        // 2. Chuyển sang trang nhập email bổ sung
        navigate('/auth/complete-profile');
      } else {
        // Luồng đăng nhập bình thường
        loginWithOAuth2(token)
          .then((success) => {
            if (success) navigate('/');
            else navigate('/login');
          });
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, loginWithOAuth2]);

  return <LoadingOverlay isLoading={true} message="Đang xử lý..." />;
};

export default OAuth2RedirectHandler;