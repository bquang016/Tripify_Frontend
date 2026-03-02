import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { useTranslation } from "react-i18next";

import AccountMenu from "@/pages/Customer/Profile/AccountMenu";
import ToggleSwitch from "@/components/common/Input/ToggleSwitch";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import CustomSelect from "@/components/common/Select/CustomSelect";
import OTPModal from "@/components/auth/OTPModal"; 
import toast from "react-hot-toast";

import { 
    Bell, Globe, Shield, 
    Check, ChevronRight, Mail 
} from "lucide-react";

const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const { currentUser, updateUser } = useAuth();
    
    const [settings, setSettings] = useState({
        emailNoti: true,
        smsNoti: false,
        deviceNoti: true,
        twoFactor: false,
        notificationEmail: "" 
    });

    const [loading, setLoading] = useState(false);
    const [show2faOtp, setShow2faOtp] = useState(false);
    const [availableEmails, setAvailableEmails] = useState([]);
    const [userInfo, setUserInfo] = useState(currentUser);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await userService.getUserDetail();
                if (data) {
                    setUserInfo(data);
                    const emails = [
                        { value: data.email, label: `${data.email} (${i18n.language === 'vi' ? 'Email chính' : 'Primary Email'})` }
                    ];

                    if (data.socialAccounts && data.socialAccounts.length > 0) {
                        data.socialAccounts.forEach(acc => {
                            if (acc.email !== data.email) {
                                emails.push({
                                    value: acc.email,
                                    label: `${acc.email} (${i18n.language === 'vi' ? 'Liên kết' : 'Linked'} ${acc.provider})`
                                });
                            }
                        });
                    }
                    setAvailableEmails(emails);
                    setSettings(prev => ({
                        ...prev,
                        notificationEmail: data.notificationEmail || data.email
                    }));
                }
            } catch (error) {
                console.error("Lỗi tải thông tin:", error);
            }
        };
        fetchUserData();
    }, [i18n.language]);

    useEffect(() => {
        if (currentUser) {
            const isEnabled = currentUser.twoFactorEnabled || currentUser['2faEnabled'] || currentUser.is2faEnabled || false;
            setSettings(prev => ({
                ...prev,
                twoFactor: isEnabled
            }));
        }
    }, [currentUser]);

    const handleAvatarUpload = async (file) => {
        setIsUploadingAvatar(true);
        try {
            const res = await userService.uploadAvatar(file);
            if (res.success && res.data) {
                const newUrl = res.data.profilePhotoUrl;
                setUserInfo(prev => ({ ...prev, profilePhotoUrl: newUrl }));
                updateUser({ profilePhotoUrl: newUrl });
                toast.success(i18n.language === 'vi' ? "Cập nhật ảnh đại diện thành công!" : "Avatar updated successfully!");
            }
        } catch (err) {
            toast.error(i18n.language === 'vi' ? "Lỗi khi tải ảnh lên." : "Upload failed.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleToggle = async (key) => {
        if (key === "twoFactor") {
            setShow2faOtp(true);
            const loadingToast = toast.loading(i18n.language === 'vi' ? "Đang khởi tạo yêu cầu bảo mật..." : "Initializing security request...");
            try {
                authService.request2faToggle()
                    .then(() => {
                        toast.success(i18n.language === 'vi' ? "Mã xác thực đã được gửi về email của bạn." : "Verification code sent to your email.", { id: loadingToast });
                    })
                    .catch((error) => {
                        toast.error(i18n.language === 'vi' ? "Không thể yêu cầu thay đổi lúc này." : "Cannot request changes at this time.", { id: loadingToast });
                        setShow2faOtp(false);
                    });
            } catch (error) {
                setShow2faOtp(false);
            }
            return;
        }
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handle2faOtpSuccess = async (otpCode) => {
        setLoading(true);
        try {
            const res = await authService.toggle2fa(otpCode);
            if (res.success) {
                const newState = !settings.twoFactor;
                setSettings(prev => ({ ...prev, twoFactor: newState }));
                updateUser({ twoFactorEnabled: newState });
                toast.success(newState 
                    ? (i18n.language === 'vi' ? "Đã bật xác thực 2 lớp thành công!" : "Two-factor authentication enabled!") 
                    : (i18n.language === 'vi' ? "Đã tắt xác thực 2 lớp thành công!" : "Two-factor authentication disabled!"));
                setShow2faOtp(false);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = { notificationEmail: settings.notificationEmail };
            const res = await userService.updateUserDetail(payload);
            if (res.success) {
                updateUser({ notificationEmail: settings.notificationEmail });
                toast.success(i18n.language === 'vi' ? "Đã lưu cài đặt thành công!" : "Settings saved successfully!");
            }
        } catch (err) {
            toast.error(i18n.language === 'vi' ? "Lưu thất bại." : "Save failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-3">
                        <AccountMenu 
                            userData={userInfo} 
                            onAvatarUpload={handleAvatarUpload}
                            isUploadingAvatar={isUploadingAvatar}
                        /> 
                    </div>

                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{t('profile.settings')}</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    {i18n.language === 'vi' ? 'Quản lý thông báo và tuỳ chọn ứng dụng' : 'Manage notifications and app preferences'}
                                </p>
                            </div>
                            <Button onClick={handleSave} isLoading={loading} className="px-6">
                                {t('profile.save_changes')}
                            </Button>
                        </div>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                                <Bell size={20} className="text-blue-500" /> {i18n.language === 'vi' ? 'Cài đặt thông báo' : 'Notification Settings'}
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <CustomSelect
                                        label={i18n.language === 'vi' ? 'Địa chỉ Email nhận thông báo' : 'Notification Email Address'}
                                        options={availableEmails}
                                        value={settings.notificationEmail}
                                        onChange={(val) => setSettings(prev => ({...prev, notificationEmail: val}))}
                                        icon={<Mail size={18} />}
                                        placeholder={i18n.language === 'vi' ? 'Chọn email...' : 'Select email...'}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-700">{i18n.language === 'vi' ? 'Thông báo qua Email' : 'Email Notifications'}</p>
                                            <p className="text-xs text-gray-500">{i18n.language === 'vi' ? 'Nhận cập nhật về đơn đặt phòng và khuyến mãi' : 'Receive updates on bookings and promotions'}</p>
                                        </div>
                                        <ToggleSwitch checked={settings.emailNoti} onChange={() => handleToggle("emailNoti")} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-700">SMS</p>
                                            <p className="text-xs text-gray-500">{i18n.language === 'vi' ? 'Nhận mã OTP và thông báo khẩn cấp' : 'Receive OTP codes and emergency alerts'}</p>
                                        </div>
                                        <ToggleSwitch checked={settings.smsNoti} onChange={() => handleToggle("smsNoti")} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                                <Shield size={20} className="text-red-500" /> {i18n.language === 'vi' ? 'Bảo mật nâng cao' : 'Advanced Security'}
                            </h3>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-700">{i18n.language === 'vi' ? 'Xác thực 2 yếu tố (2FA)' : 'Two-Factor Authentication (2FA)'}</p>
                                    <p className="text-xs text-gray-500">{i18n.language === 'vi' ? 'Tăng cường bảo mật khi đăng nhập' : 'Enhanced security for logging in'}</p>
                                </div>
                                <ToggleSwitch checked={settings.twoFactor} onChange={() => handleToggle("twoFactor")} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <OTPModal
                isOpen={show2faOtp}
                onClose={() => setShow2faOtp(false)}
                email={userInfo?.email}
                type="TWO_FACTOR_AUTH"
                onSuccess={handle2faOtpSuccess}
            />
        </main>
    );
};

export default SettingsPage;
