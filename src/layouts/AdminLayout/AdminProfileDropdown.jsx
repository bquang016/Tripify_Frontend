import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    User, Settings, LogOut, ShieldCheck, 
    ChevronRight, Mail 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service"; // ✅ Import service
import Avatar from "../../components/common/Avatar/Avatar";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";

const AdminProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  // ✅ State lưu thông tin chi tiết (để lấy Avatar mới nhất)
  const [userInfo, setUserInfo] = useState(currentUser);

  // ✅ Gọi API lấy thông tin chi tiết khi Component Mount
  useEffect(() => {
    const fetchLatestData = async () => {
        try {
            const data = await userService.getUserDetail();
            // Nếu API trả về data, cập nhật vào state
            if (data) {
                setUserInfo(data);
            }
        } catch (error) {
            console.error("Failed to fetch admin profile:", error);
        }
    };

    if (currentUser) {
        fetchLatestData();
    }
  }, [currentUser]);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  // Theme màu sắc cho Admin
  const adminTheme = {
    gradient: "from-indigo-600 to-purple-600",
    icon: <ShieldCheck size={16} className="text-purple-100" />,
    label: "Quản trị hệ thống"
  };

  // Ưu tiên lấy ảnh từ API chi tiết (profilePhotoUrl) rồi mới đến avatar từ context
  const displayAvatar = userInfo?.profilePhotoUrl || userInfo?.avatar || currentUser?.avatar;
  const displayName = userInfo?.fullName || currentUser?.fullName || "Admin";
  const displayEmail = userInfo?.email || currentUser?.email;

  return (
    <>
      <div className="relative" ref={ref}>
        {/* --- TRIGGER BUTTON --- */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
        >
          <div className="relative">
            {/* Avatar nhỏ ở Header */}
            <Avatar 
              src={displayAvatar} 
              name={displayName} 
              size={38} 
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="text-left hidden md:block mr-1">
            <div className="font-bold text-sm text-gray-800 leading-tight">
              {displayName}
            </div>
            <div className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
              Administrator
            </div>
          </div>
        </button>

        {/* --- DROPDOWN CONTENT --- */}
        {open && (
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">
            
            {/* Header Gradient */}
            <div className={`bg-gradient-to-r ${adminTheme.gradient} p-5 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-10">
                    <div className="transform scale-[5] origin-top-right">
                        <ShieldCheck />
                    </div>
                </div>

                <div className="relative z-10 flex items-start gap-3">
                    <div className="border-[3px] border-white/30 rounded-full shadow-sm">
                        {/* Avatar lớn trong Dropdown */}
                        <Avatar 
                            src={displayAvatar} 
                            name={displayName} 
                            size={52} 
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg truncate leading-tight">
                            {displayName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-white/80 text-xs mb-2 mt-1">
                             <Mail size={10} />
                             <span className="truncate">{displayEmail}</span>
                        </div>
                        
                        <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold border border-white/10 shadow-sm">
                            {adminTheme.icon}
                            <span>{adminTheme.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
                <Link 
                    to="/admin/profile" 
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setOpen(false)}
                >
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-100 transition-colors">
                        <User size={18} />
                    </div>
                    <div className="flex-1">
                        <span className="font-medium text-sm">Hồ sơ cá nhân</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>

                <Link 
                    to="/admin/settings" 
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setOpen(false)}
                >
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-full group-hover:bg-gray-200 transition-colors">
                        <Settings size={18} />
                    </div>
                    <div className="flex-1">
                        <span className="font-medium text-sm">Cài đặt hệ thống</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>

                <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>

                <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group text-left"
                >
                    <div className="p-2 bg-red-50 text-red-500 rounded-full group-hover:bg-red-100 transition-colors">
                        <LogOut size={18} />
                    </div>
                    <span className="font-medium text-sm">Đăng xuất</span>
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal xác nhận đăng xuất */}
      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Xác nhận Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?"
        type="danger"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </>
  );
};

export default AdminProfileDropdown;