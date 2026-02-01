import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/user.service";
import LoadingOverlay from "../components/common/Loading/LoadingOverlay";
import ConfirmModal from "../components/common/Modal/ConfirmModal";
import "./PartnerRoute.css"; // <--- NHỚ IMPORT CSS VỪA TẠO

const PartnerRoute = ({ children }) => {
  // console.log("LOG 1: PartnerRoute ĐÃ CHẠY");

  const { currentUser, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // State để lưu danh sách trường thiếu
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    // 1. CHƯA ĐĂNG NHẬP
    if (!currentUser) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    // 2. ADMIN hoặc OWNER
    if (hasRole("ADMIN") || hasRole("OWNER")) {
      navigate(hasRole("ADMIN") ? "/admin/dashboard" : "/owner/dashboard", { replace: true });
      return;
    }

    // 3. CUSTOMER → kiểm tra hồ sơ
    const checkProfile = async () => {
      try {
        const res = await userService.getProfileStatus();

        if (res.profileComplete) {
          setIsAuthorized(true);
        } else {
          setMissingFields(res.missingFields || ["Thông tin chưa đầy đủ"]);
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error("Lỗi hồ sơ:", error);
        // Nếu lỗi server thì tạm thời đẩy về trang chủ
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [currentUser, hasRole, navigate]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  const handleLoginModalConfirm = () => {
    setShowLoginModal(false);
    navigate("/login", {
      state: { from: location },
      replace: true,
    });
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    navigate(-1); // Quay lại trang trước
  };

  // KHI BẤM TIẾP TỤC -> Sang trang profile
  const handleProfileModalConfirm = () => {
    setShowProfileModal(false);
    // Đây là đường dẫn đến trang cập nhật hồ sơ trong Smart Booking Frontend
    navigate("/customer/profile", { replace: true });
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    navigate("/", { replace: true }); // Bấm hủy thì về trang chủ
  };

  // ----------------------------------------------------------------
  // RENDER GIAO DIỆN
  // ----------------------------------------------------------------

  // 1. Modal yêu cầu đăng nhập (Vẫn dùng ConfirmModal đơn giản)
  if (showLoginModal) {
    return (
        <ConfirmModal
            open={true}
            onClose={handleLoginModalClose}
            onConfirm={handleLoginModalConfirm}
            title="Yêu cầu đăng nhập"
            message="Bạn cần đăng nhập tài khoản để đăng ký làm đối tác."
            confirmText="Đăng nhập ngay"
            cancelText="Để sau"
        />
    );
  }

  // 2. MODAL YÊU CẦU BỔ SUNG HỒ SƠ (Giao diện đẹp Glassmorphism)
  if (showProfileModal) {
    return (
        <div className="partner-route-overlay">
          <div className="glass-modal">

            {/* Icon */}
            {/* Thay đoạn ⚠️ cũ bằng đoạn này */}
            <div className="warning-icon">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Tiêu đề */}
            <h2 className="modal-title">Hồ sơ chưa hoàn tất</h2>

            {/* Mô tả */}
            <p className="modal-desc">
              Để trở thành đối tác, vui lòng cập nhật các thông tin sau:
            </p>

            {/* Box danh sách thiếu */}
            <div className="missing-info-box">
              <ul>
                {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                ))}
              </ul>
            </div>

            {/* Nút bấm */}
            <div className="button-group">
              <button
                  className="btn-cancel"
                  onClick={handleProfileModalClose}
              >
                Hủy
              </button>
              <button
                  className="btn-continue"
                  onClick={handleProfileModalConfirm}
              >
                Tiếp tục
              </button>
            </div>

          </div>
        </div>
    );
  }

  // 3. Loading
  if (isLoading) {
    return <LoadingOverlay open={true} />;
  }

  // 4. Được phép truy cập -> Render nội dung bên trong
  return isAuthorized ? children : null;
};

export default PartnerRoute;