import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    User, Crown, CalendarDays, RefreshCw, 
    Settings, LogOut, Heart, FileText 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import AvatarUpload from "@/components/common/Input/AvatarUpload"; 
import AvatarUploadModal from "./AvatarUploadModal"; 

const AccountMenu = ({ 
    activeSection, 
    onSelect, 
    userData, 
    onAvatarUpload, 
    isUploadingAvatar 
}) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const profileName = userData?.fullName || (i18n.language === 'vi' ? "Khách hàng" : "Customer");
    const profileImage = userData?.profilePhotoUrl || null;
    const profileEmail = userData?.email || "";
    const membershipRank = userData?.membershipRank || (i18n.language === 'vi' ? "Thành viên" : "Member");

    const menuItems = [
        { 
            label: t('profile.personal_info'), 
            path: "/customer/profile",
            internalId: "account-settings",
            icon: <User size={20} /> 
        },
        { 
            label: i18n.language === 'vi' ? "Hạng thành viên & Điểm" : "Membership & Points", 
            path: "/customer/membership", 
            icon: <Crown size={20} /> 
        },
        { 
            label: t('profile.my_bookings'), 
            path: "/customer/bookings", 
            icon: <CalendarDays size={20} /> 
        },
        { 
            label: t('profile.transactions'), 
            path: "/customer/transactions", 
            icon: <FileText size={20} /> 
        },
        { 
            label: i18n.language === 'vi' ? "Yêu cầu hoàn tiền" : "Refund Requests", 
            path: "/customer/refunds", 
            icon: <RefreshCw size={20} /> 
        },
        { 
            label: t('profile.settings'), 
            path: "/customer/settings", 
            icon: <Settings size={20} /> 
        },
    ];

    const handleItemClick = (item) => {
        if (onSelect && item.internalId) {
            onSelect(item.internalId);
        } else {
            navigate(item.path);
        }
    };

    const checkActive = (item) => {
        if (activeSection && item.internalId === activeSection) return true;
        if (location.pathname === item.path) return true;
        return false;
    };

    const handleSaveAvatar = async (file) => {
        if (onAvatarUpload) {
            await onAvatarUpload(file);
        }
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-50 to-white z-0"></div>
                
                <div className="relative z-10 mb-3">
                    <div className="p-1 rounded-full border-2 border-white shadow-md bg-white">
                        <AvatarUpload
                            src={profileImage}
                            name={profileName}
                            size={80}
                            onClick={() => setIsModalOpen(true)}
                            isLoading={isUploadingAvatar}
                            className="cursor-pointer hover:opacity-90 transition-opacity"
                        />
                    </div>
                    
                    <div 
                        className="absolute top-0 right-0 bg-yellow-400 p-1.5 rounded-full border-2 border-white shadow-sm transform translate-x-1 -translate-y-1" 
                        title={`Rank: ${membershipRank}`}
                    >
                        <Crown size={12} className="text-white fill-white" />
                    </div>
                </div>

                <div className="relative z-10">
                    <h3 className="font-bold text-gray-900 text-lg">{profileName}</h3>
                    <p className="text-gray-500 text-sm mb-2">{profileEmail}</p>
                    <span className="inline-block text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        {membershipRank}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <nav className="p-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = checkActive(item);
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleItemClick(item)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm group text-left ${
                                    isActive
                                        ? "bg-blue-50 text-[rgb(40,169,224)] shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <span className={`transition-colors duration-200 ${
                                    isActive ? "text-[rgb(40,169,224)]" : "text-gray-400 group-hover:text-gray-600"
                                }`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[rgb(40,169,224)]"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-100 mx-3 my-1"></div>

                <div className="p-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm group"
                    >
                        <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors" />
                        {t('common.logout')}
                    </button>
                </div>
            </div>

            <AvatarUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAvatar}
                isLoading={isUploadingAvatar}
            />
        </div>
    );
};

export default AccountMenu;
