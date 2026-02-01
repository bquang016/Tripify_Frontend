import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StyledTextField from "@/components/common/Input/StyledTextField";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";

import SettingsPage from "@/pages/Customer/Profile/SettingsPage";
import ChangePassword from "@/pages/Customer/Profile/ChangePassword";
import AccountMenu from "@/pages/Customer/Profile/AccountMenu";
import LinkedAccounts from "@/pages/Customer/Profile/LinkedAccounts";

// ✅ 1. IMPORT FaFacebook
import { FaFacebook } from "react-icons/fa";
import { Save, X, Phone, MapPin, Flag, Building, Info, User, Users, Share2, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import DatePickerInput from "@/components/common/Input/DatePickerInput";
import CustomSelect from "@/components/common/Select/CustomSelect";

// ✅ 2. ĐỊNH NGHĨA COMPONENT GoogleIcon
const GoogleIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    width="20px" 
    height="20px" 
    className={className}
  >
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,30.397,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const PROFILE_TABS = [
  { id: "info", name: "Thông tin tài khoản" },
  { id: "social", name: "Liên kết mạng xã hội" },
  { id: "security", name: "Mật khẩu & Bảo mật" },
];

const parseApiDate = (isoDate) => {
  if (!isoDate || !isoDate.includes('-')) return null;
  try {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  } catch (e) { return null; }
};
const formatApiDate = (dateObj) => {
  if (!dateObj) return null;
  try {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${y}-${m}-${d}`;
  } catch (e) { return null; }
};

const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [activeSection, setActiveSection] = useState("account-settings");
  const [loading, setLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    userdetailId: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: null,
    address: "",
    city: "",
    country: "",
    profilePhotoUrl: "",
  });

  const mapDataToForm = (data) => ({
    userdetailId: data.userdetailId,
    fullName: data.fullName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    gender: data.gender || "",
    dateOfBirth: parseApiDate(data.dateOfBirth),
    address: data.address || "",
    city: data.city || "",
    country: data.country || "",
    profilePhotoUrl: data.profilePhotoUrl || "",
  });

  const showToastAndDismiss = (msg, type = "info", duration = 3000) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), duration);
  };

  const handleMenuSelect = (path) => {
    const internalSections = ["account-settings", "notification-settings"];
    if (internalSections.includes(path)) {
      setActiveSection(path);
    } else {
      navigate(`/customer/${path}`);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const profileData = await userService.getUserDetail();
        if (profileData) {
          const mapped = mapDataToForm(profileData);
          setUserData(mapped);
          setFormData(mapped);
        } else {
          throw new Error("Không nhận được dữ liệu hồ sơ");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError(error.message || "Lỗi kết nối máy chủ");
      }
    };
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = () => setFormData(userData);
  const isFormDirty = () => JSON.stringify(formData) !== JSON.stringify(userData);

  const handleDateChange = useCallback((dateString) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: dateString }));
  }, []);

  const handleAvatarUpload = async (file) => {
    setIsUploadingAvatar(true);
    try {
      const res = await userService.uploadAvatar(file);
      if (res.success && res.data) {
        const newUrl = res.data.profilePhotoUrl;
        setFormData(prev => ({ ...prev, profilePhotoUrl: newUrl }));
        setUserData(prev => ({ ...prev, profilePhotoUrl: newUrl }));
        updateUser({ profilePhotoUrl: newUrl });
        showToastAndDismiss("Cập nhật ảnh đại diện thành công!", "success");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      const msg = err.response?.data?.message || "Lỗi khi tải ảnh lên.";
      showToastAndDismiss(msg, "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToastAndDismiss("Họ tên không được để trống", "warning");
      return;
    }
    
    const payload = {
      ...formData,
      birthDate: formatApiDate(formData.dateOfBirth)
    };

    setLoading(true);
    try {
      const res = await userService.updateUserDetail(payload); 

      if (res.success) {
        const updatedData = res.data; 
        const newUserData = mapDataToForm(updatedData); 
        
        setUserData(newUserData);
        setFormData(newUserData);
        
        if (updatedData.fullName !== currentUser.fullName) {
          updateUser({ fullName: updatedData.fullName });
        }

        showToastAndDismiss("Lưu thông tin thành công!", "success");
      }
    } catch (err) {
      console.error("Save error:", err);

      if (err.response && err.response.status === 409) {
        try {
          const refreshData = await userService.getUserDetail();
          if (refreshData && refreshData.userdetailId) {
            const realId = refreshData.userdetailId;
            const retryData = { ...payload, userdetailId: realId }; 
            
            const retryRes = await userService.updateUserDetail(retryData);
            
            if (retryRes.success) {
              const newUserData = mapDataToForm(retryRes.data);
              setUserData(newUserData);
              setFormData(newUserData);
              
              if (retryRes.data.fullName !== currentUser.fullName) {
                updateUser({ fullName: retryRes.data.fullName });
              }

              showToastAndDismiss("Đã đồng bộ và cập nhật thành công!", "success");
              return;
            }
          }
        } catch (retryErr) {
          console.error("Auto-recovery failed:", retryErr);
        }
      }

      const errorMsg = err.response?.data?.message || "Có lỗi xảy ra khi lưu.";
      showToastAndDismiss(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderInfoTab = () => {
    const GENDER_OPTIONS = [
      { label: "Nam", value: "Nam" },
      { label: "Nữ", value: "Nữ" },
      { label: "Khác", value: "Khác" },
    ];
    const dirty = isFormDirty();

    const requiredLabel = (text) => (
        <span>
        {text} <span className="text-red-500">*</span>
      </span>
    );

    return (
        <div className="space-y-10 animate-fadeIn">
          <Card>
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4">
                Dữ liệu cá nhân
              </h3>

              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg">
                <Info size={20} className="flex-shrink-0" />
                <p className="text-sm italic">
                  Nếu bạn muốn đăng ký trở thành "Chủ sở hữu", hãy điền các trường có dấu *.
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <StyledTextField
                    label={requiredLabel("Họ và tên")}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    placeholder="Nhập họ và tên của bạn"
                />

                <StyledTextField
                    label={requiredLabel("Số điện thoại")}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    icon={<Phone size={16} />}
                    placeholder="Nhập số điện thoại"
                />

                <DatePickerInput
                    label={requiredLabel("Ngày sinh")}
                    value={formData.dateOfBirth}
                    onChange={(date) => {
                      setFormData((prev) => ({ ...prev, dateOfBirth: date }));
                    }}
                />

                <CustomSelect
                    label={requiredLabel("Giới tính")}
                    value={formData.gender}
                    onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
                    options={GENDER_OPTIONS}
                    placeholder="Chọn giới tính..."
                    icon={<Users size={16} />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StyledTextField
                      label="Thành phố / Tỉnh"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      icon={<Building size={16} />}
                      placeholder="Hà Nội, Hưng Yên,..."
                  />
                  <StyledTextField
                      label="Quốc gia"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      icon={<Flag size={16} />}
                      placeholder="Việt Nam"
                  />
                </div>
                <StyledTextField
                    label="Địa chỉ chi tiết"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={<MapPin size={16} />}
                    placeholder="Số nhà, tên đường, phường/xã..."
                />

                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                  <Button
                      type="submit"
                      leftIcon={<Save size={16} />}
                      isLoading={loading}
                      disabled={loading || !dirty}
                  >
                    {loading ? "Đang lưu..." : "Lưu thông tin"}
                  </Button>
                  {dirty && (
                      <Button
                          type="button"
                          variant="outline"
                          leftIcon={<X size={16} />}
                          onClick={handleCancel}
                      >
                        Hủy
                      </Button>
                  )}
                </div>
              </form>
            </div>
          </Card>

          {/* ✅ CARD EMAIL ĐÃ CẬP NHẬT ICON */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Địa chỉ Email</h3>
                  <p className="text-sm text-gray-500">
                    Quản lý các email liên kết với tài khoản của bạn.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* 1. Email Chính */}
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentUser?.email}</p>
                      <p className="text-xs text-blue-600 font-semibold">Email chính (Đăng nhập)</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full border border-green-200">
                    Đã xác thực
                  </span>
                </div>

                {/* 2. Email Mạng xã hội (Lặp qua socialAccounts) */}
                {currentUser?.socialAccounts?.map((acc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {/* ✅ HIỂN THỊ ICON GOOGLE/FACEBOOK */}
                      <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm w-10 h-10 flex items-center justify-center">
                        {acc.provider?.toLowerCase() === 'google' ? (
                           <GoogleIcon />
                        ) : acc.provider?.toLowerCase() === 'facebook' ? (
                           <FaFacebook className="text-[#1877F2] text-xl" />
                        ) : (
                           <span className="font-bold text-gray-500">#</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{acc.email}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          Tài khoản liên kết {acc.provider?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs bg-gray-200 px-2 py-1 rounded-full">
                      Đã liên kết
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
    );
  };

  const renderSecurityTab = () => (
      <div className="space-y-10 animate-fadeIn">
        <ChangePassword />
        <Card>
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-red-600">
              Xóa tài khoản
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-red-600">Xóa tài khoản</h4>
                <p className="text-sm text-gray-500">
                  Hành động này không thể hoàn tác. Mọi dữ liệu sẽ bị xóa vĩnh viễn.
                </p>
              </div>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                Xóa
              </Button>
            </div>
          </div>
        </Card>
      </div>
  );

  const renderSocialTab = () => (
    <div className="animate-fadeIn">
      <LinkedAccounts />
    </div>
  );

  const renderMainContent = () => {
    if (activeSection === "account-settings") {
      return (
          <>
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Chỉnh sửa hồ sơ cá nhân
              </h1>
            </div>
            <TabsComponent
                tabs={PROFILE_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <div className="mt-8 md:mt-10">{renderContent()}</div>
          </>
      );
    }
    if (activeSection === "notification-settings") {
      return <SettingsPage />;
    }
    return (
        <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg bg-white min-h-[300px] flex flex-col justify-center items-center">
          <h1 className="text-xl font-bold text-gray-700">Chức năng đang phát triển</h1>
          <p className="mt-2">Mục bạn chọn ({activeSection}) sẽ sớm được cập nhật.</p>
        </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "info": return renderInfoTab();
      case "social": return renderSocialTab();
      case "security": return renderSecurityTab();
      default: return null;
    }
  };

  if (error) {
    return (
        <div className="flex flex-col justify-center items-center h-[50vh] p-6">
          <p className="text-red-600 font-semibold">Đã xảy ra lỗi:</p>
          <p className="text-gray-700">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </div>
    );
  }

  if (!currentUser || !userData) {
    return (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
    );
  }

  return (
      <main className="w-full bg-gray-50 text-gray-800">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3">
              <AccountMenu
                  activeSection={activeSection}
                  onSelect={handleMenuSelect}
                  userData={userData || formData}
                  onAvatarUpload={handleAvatarUpload}
                  isUploadingAvatar={isUploadingAvatar}
              />
            </div>
            <div className="col-span-12 lg:col-span-9">
              {renderMainContent()}

              <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                      <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
              </ToastPortal>

            </div>
          </div>
        </div>
      </main>
  );
};

export default ProfilePage;