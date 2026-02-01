import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaFacebook } from 'react-icons/fa';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import { Link2, AlertCircle, ExternalLink, Trash2, CheckCircle, Lock } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Toast from '@/components/common/Notification/Toast';
import ToastPortal from '@/components/common/Notification/ToastPortal';
import ConfirmModal from '@/components/common/Modal/ConfirmModal';
import CreatePasswordModal from '@/components/common/Modal/CreatePasswordModal';
import AccountReviewModal from '@/components/common/Modal/AccountReviewModal';
import { useNavigate } from 'react-router-dom';

// ✅ 1. ĐỊNH NGHĨA COMPONENT GoogleIcon TẠI ĐÂY
const GoogleIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    width="24px" 
    height="24px" 
    className={className}
  >
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,30.397,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const LinkedAccounts = () => {
  const { currentUser, updateUser } = useAuth();
  // const navigate = useNavigate(); // Không cần dùng navigate nữa vì đã có modal
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [providerToUnlink, setProviderToUnlink] = useState(null);

  // State cho Modal tạo mật khẩu
  const [isCreatePassOpen, setIsCreatePassOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Logic kiểm tra an toàn
  const isSafeToUnlink = currentUser?.hasPassword || (currentUser?.socialAccounts?.length > 1);

  useEffect(() => {
    if (currentUser && currentUser.socialAccounts) {
      const providers = currentUser.socialAccounts.map((acc) =>
        acc.provider ? acc.provider.toLowerCase() : ""
      );
      setLinkedProviders(providers);
    } else {
      setLinkedProviders([]);
    }
  }, [currentUser]);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({...prev, show: false})), 3000);
  };

  const handleLink = (provider) => {
    // 1. Lấy token hiện tại
    const token = localStorage.getItem('accessToken');
    
    if (token) {
        // ✅ CẬP NHẬT: Set Cookie với SameSite=Lax để đảm bảo nó được gửi khi redirect
        document.cookie = `LINKING_TOKEN=${token}; path=/; max-age=300; SameSite=Lax`;
        console.log("Cookie LINKING_TOKEN set:", document.cookie); // Debug log
    } else {
        console.error("No access token found to link account!");
        return;
    }

    // 2. Chuyển hướng
    window.location.href = `http://localhost:8386/oauth2/authorization/${provider}`;
  };

  const handleUnlinkExecution = async () => {
    if (!providerToUnlink) return;
    setLoading(true);
    try {
      await authService.unlinkSocialAccount(providerToUnlink);
      
      // Cập nhật state local
      const updatedProviders = linkedProviders.filter(p => p !== providerToUnlink);
      setLinkedProviders(updatedProviders);

      // Cập nhật context global
      const updatedSocialAccounts = currentUser.socialAccounts.filter(
        acc => acc.provider.toLowerCase() !== providerToUnlink
      );
      updateUser({ socialAccounts: updatedSocialAccounts });

      showToast(`Đã ngắt kết nối ${providerToUnlink} thành công!`, "success");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
      setIsUnlinkModalOpen(false);
      setProviderToUnlink(null);
    }
  };

  const confirmUnlink = (provider) => {
    if (!isSafeToUnlink && linkedProviders.length <= 1) {
       showToast("Bạn cần tạo mật khẩu trước khi ngắt kết nối tài khoản này!", "error");
       return;
    }
    setProviderToUnlink(provider);
    setIsUnlinkModalOpen(true);
  };

  const handleCreatePasswordSuccess = () => {
    setTimeout(() => setIsReviewOpen(true), 300);
  };

  const SocialItem = ({ provider, icon, title, description, isConnected, colorClass }) => {
    // Logic khóa nút: Nếu đã kết nối + là duy nhất + chưa có pass => KHÓA
    const isLocked = isConnected && !isSafeToUnlink && linkedProviders.length === 1;

    return (
      <div className="group flex flex-col sm:flex-row items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white">
        <div className="flex items-center gap-5 mb-4 sm:mb-0 w-full sm:w-auto">
          <div className={`w-14 h-14 flex items-center justify-center rounded-full shadow-sm border border-gray-100 ${colorClass} bg-opacity-10`}>
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              {title}
              {isConnected && <CheckCircle size={16} className="text-green-500" />}
            </h4>
            <p className="text-sm text-gray-500 max-w-[300px]">
              {isLocked 
                ? <span className="text-red-500 font-medium">Đây là phương thức đăng nhập duy nhất.</span>
                : (isConnected ? `Đã liên kết với tài khoản ${title}.` : description)
              }
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          {isConnected ? (
            isLocked ? (
              // Nút Tạo mật khẩu (khi bị khóa)
              <Button
                variant="primary"
                onClick={() => setIsCreatePassOpen(true)} 
                className="w-full sm:w-auto min-w-[160px] justify-center"
                leftIcon={<Lock size={16} />}
              >
                Tạo mật khẩu
              </Button>
            ) : (
              // Nút Ngắt kết nối (khi an toàn)
              <Button
                variant="outline"
                onClick={() => confirmUnlink(provider)}
                isLoading={loading && providerToUnlink === provider}
                className="w-full sm:w-auto min-w-[160px] justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                leftIcon={<Trash2 size={16} />}
              >
                Ngắt kết nối
              </Button>
            )
          ) : (
            // Nút Kết nối
            <Button
              variant="outline"
              onClick={() => handleLink(provider)}
              className="w-full sm:w-auto min-w-[160px] justify-center hover:bg-gray-50"
              rightIcon={<ExternalLink size={14} />}
            >
              Kết nối {title}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Link2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Liên kết tài khoản</h3>
              <p className="text-sm text-gray-500">Quản lý các phương thức đăng nhập bổ sung</p>
            </div>
          </div>

          {!currentUser?.hasPassword && (
             <div className="mb-6 bg-orange-50 border border-orange-100 text-orange-800 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle size={22} className="mt-0.5 flex-shrink-0 text-orange-600" />
                <div className="text-sm leading-relaxed">
                  <strong>Chú ý:</strong> Bạn chưa thiết lập mật khẩu. Vui lòng <strong>Tạo mật khẩu</strong> để bảo vệ tài khoản tốt hơn và tránh mất quyền truy cập.
                </div>
             </div>
          )}

          <div className="space-y-4">
            <SocialItem 
              provider="google" 
              title="Google" 
              description="Sử dụng tài khoản Google để đăng nhập một chạm." 
              isConnected={linkedProviders.includes('google')} 
              icon={<GoogleIcon />} // ✅ Sử dụng Component đã định nghĩa
              colorClass="bg-white" 
            />

            <SocialItem 
              provider="facebook" 
              title="Facebook" 
              description="Kết nối với Facebook để đăng nhập dễ dàng." 
              isConnected={linkedProviders.includes('facebook')} 
              icon={<FaFacebook className="text-[#1877F2] text-3xl" />} 
              colorClass="bg-blue-50" 
            />
          </div>
        </div>
      </Card>

      {/* Modal xác nhận xóa */}
      <ConfirmModal 
        open={isUnlinkModalOpen}
        type="danger"
        title="Ngắt kết nối tài khoản"
        message={`Bạn có chắc chắn muốn ngắt kết nối tài khoản ${providerToUnlink}?`}
        confirmText="Ngắt kết nối"
        cancelText="Hủy bỏ"
        onConfirm={handleUnlinkExecution}
        onClose={() => setIsUnlinkModalOpen(false)}
      />

      {/* Modal Tạo mật khẩu */}
      <CreatePasswordModal
        open={isCreatePassOpen}
        onClose={() => setIsCreatePassOpen(false)}
        onSuccess={handleCreatePasswordSuccess}
      />

      {/* Modal Review thông tin */}
      <AccountReviewModal
        open={isReviewOpen}
        userData={currentUser}
        onClose={() => setIsReviewOpen(false)}
      />

      <ToastPortal>
        {toast.show && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
            <Toast message={toast.msg} type={toast.type} />
          </div>
        )}
      </ToastPortal>
    </div>
  );
};

export default LinkedAccounts;