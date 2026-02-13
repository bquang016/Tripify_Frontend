import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service";
import {
    User, LogOut, Calendar, Heart,
    Shield, Star, Award, Gem, ChevronRight, Crown, LayoutDashboard
} from "lucide-react";
import Avatar from "../../components/common/Avatar/Avatar";

// --- CẤU HÌNH GIAO DIỆN THEO HẠNG ---
const RANK_STYLES = {
    BRONZE: {
        label: "Hạng Đồng",
        gradient: "from-orange-700 to-orange-500",
        icon: <Shield size={16} className="text-orange-100" />,
        shadow: "shadow-orange-200"
    },
    SILVER: {
        label: "Hạng Bạc",
        gradient: "from-slate-600 to-slate-400",
        icon: <Star size={16} className="text-slate-100" />,
        shadow: "shadow-slate-200"
    },
    GOLD: {
        label: "Hạng Vàng",
        gradient: "from-yellow-600 to-yellow-400",
        icon: <Award size={16} className="text-yellow-100" />,
        shadow: "shadow-yellow-200"
    },
    DIAMOND: {
        label: "Hạng Kim Cương",
        gradient: "from-blue-600 to-cyan-400",
        icon: <Gem size={16} className="text-cyan-100" />,
        shadow: "shadow-cyan-200"
    }
};

const CustomerProfileDropdown = ({ onClose }) => {
    const { currentUser, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(currentUser);

    useEffect(() => {
        const fetchLatestData = async () => {
            try {
                const data = await userService.getUserDetail();
                if (data) setUserInfo(data);
            } catch (error) {
                console.error("Failed to update profile dropdown info:", error);
            }
        };
        fetchLatestData();
    }, []);

    const handleLogout = () => {
        if (onClose) onClose("LOGOUT_ACTION");
    };

    const currentRank = RANK_STYLES[userInfo?.membershipRank || "BRONZE"];

    // =====================================================
    // ✅ FIX THEO CONTRACT MỚI
    // Chỉ dùng profilePhotoUrl
    // =====================================================
    const displayAvatar = userInfo?.profilePhotoUrl || null;

    return (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">

            {/* --- HEADER: GRADIENT THEO RANK --- */}
            <div className={`bg-gradient-to-r ${currentRank.gradient} p-5 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-10">
                    <div className="transform scale-[5] origin-top-right">
                        {currentRank.icon}
                    </div>
                </div>

                <div className="relative z-10 flex items-start gap-3">
                    <div className="border-[3px] border-white/30 rounded-full shadow-sm">
                        <Avatar
                            src={displayAvatar}
                            name={userInfo?.fullName}
                            size={52}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg truncate leading-tight">
                            {userInfo?.fullName || "Khách hàng"}
                        </h4>
                        <p className="text-white/80 text-xs truncate mb-2 font-medium">
                            {userInfo?.email}
                        </p>

                        <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold border border-white/10 shadow-sm">
                            {currentRank.icon}
                            <span>{currentRank.label}</span>
                            <span className="w-[1px] h-3 bg-white/30 mx-1"></span>
                            <span className="text-white">{userInfo?.points || 0} điểm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MENU ITEMS --- */}
            <div className="p-2">
                {(userInfo?.isSuper || hasRole("ADMIN")) && (
                    <Link
                        to="/admin"
                        className="flex items-center gap-3 p-3 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors group mb-1"
                        onClick={() => onClose && onClose()}
                    >
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200 transition-colors">
                            <LayoutDashboard size={18} />
                        </div>
                        <div className="flex-1">
                            <span className="font-bold text-sm">Trang quản trị admin</span>
                        </div>
                        <ChevronRight size={16} className="text-blue-300 group-hover:text-blue-500 transition-colors" />
                    </Link>
                )}

                <Link
                    to="/customer/profile"
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => onClose && onClose()}
                >
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                        <User size={18} />
                    </div>
                    <div className="flex-1">
                        <span className="font-medium text-sm">Hồ sơ cá nhân</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>

                <Link
                    to="/customer/membership"
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => onClose && onClose()}
                >
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-full group-hover:bg-yellow-100 transition-colors">
                        <Crown size={18} />
                    </div>
                    <div className="flex-1">
                        <span className="font-medium text-sm">Hạng thành viên & Điểm</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>

                <Link
                    to="/customer/bookings"
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => onClose && onClose()}
                >
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-100 transition-colors">
                        <Calendar size={18} />
                    </div>
                    <div className="flex-1">
                        <span className="font-medium text-sm">Lịch sử đặt chỗ</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>

                <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group text-left"
                >
                    <div className="p-2 bg-red-50 text-red-500 rounded-full group-hover:bg-red-100 transition-colors">
                        <LogOut size={18} />
                    </div>
                    <span className="font-medium text-sm">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default CustomerProfileDropdown;
