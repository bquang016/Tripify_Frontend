import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  CreditCard, 
  Save, 
  RefreshCcw,
  AlertTriangle,
  Upload,
  Trash2,
  Check,
  Loader2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { systemSettingsService } from "../../../services/systemSettings.service";
import toast from "react-hot-toast";

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [settings, setSettings] = useState({
    appName: "",
    defaultLanguage: "vi",
    defaultCurrency: "VND",
    logoUrl: null,
    isMaintenanceMode: false,
    maintenanceMessage: ""
  });
  
  const [exchangeRates, setExchangeRates] = useState([]);

  const tabs = [
    { id: "general", label: "Cấu hình chung", icon: <Globe size={18} /> },
    { id: "payments", label: "Thanh toán & Phí", icon: <CreditCard size={18} /> },
  ];

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const settingsResponse = await systemSettingsService.getSettings();
      const ratesResponse = await systemSettingsService.getExchangeRates();
      
      // Handle the case where backend returns 200 but code 403 in body
      if (settingsResponse.code === 403 || ratesResponse.code === 403) {
        toast.error("Bạn không có quyền truy cập dữ liệu này.");
        setIsLoading(false);
        return;
      }

      setSettings(settingsResponse.data);
      setExchangeRates(ratesResponse.data);
    } catch (error) {
      console.error("Fetch data error:", error);
      toast.error("Không thể tải dữ liệu cấu hình. Vui lòng kiểm tra quyền hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const response = await systemSettingsService.updateGeneralSettings({
        appName: settings.appName,
        defaultLanguage: settings.defaultLanguage,
        defaultCurrency: settings.defaultCurrency
      });

      if (response.code === 403) {
        toast.error("Bạn không có quyền thực hiện thao tác này.");
      } else {
        toast.success("Cập nhật cấu hình thành công");
      }
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setIsSaving(true);
    try {
      const response = await systemSettingsService.uploadLogo(file);
      if (response.code === 403) {
        toast.error("Bạn không có quyền tải lên logo.");
      } else {
        setSettings(prev => ({ ...prev, logoUrl: response.data }));
        toast.success("Tải lên Logo thành công");
      }
    } catch (error) {
      toast.error("Tải lên Logo thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa Logo và quay về mặc định?")) return;
    setIsSaving(true);
    try {
      const response = await systemSettingsService.deleteLogo();
      if (response.code === 403) {
        toast.error("Bạn không có quyền xóa logo.");
      } else {
        setSettings(prev => ({ ...prev, logoUrl: null }));
        toast.success("Đã xóa Logo");
      }
    } catch (error) {
      toast.error("Xóa Logo thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRate = async (pair, newRate) => {
    try {
      const response = await systemSettingsService.updateExchangeRate({ pair, rate: parseFloat(newRate) });
      if (response.code === 403) {
        toast.error("Bạn không có quyền cập nhật tỷ giá.");
      } else {
        setExchangeRates(prev => prev.map(r => r.pair === pair ? { ...r, rate: parseFloat(newRate) } : r));
        toast.success(`Cập nhật tỷ giá ${pair} thành công`);
      }
    } catch (error) {
      toast.error("Cập nhật tỷ giá thất bại");
    }
  };

  const handleToggleMaintenance = async () => {
    const nextState = !settings.isMaintenanceMode;
    try {
      const response = await systemSettingsService.updateMaintenanceMode({
        isEnabled: nextState,
        message: settings.maintenanceMessage
      });
      if (response.code === 403) {
        toast.error("Bạn không có quyền thay đổi chế độ bảo trì.");
      } else {
        setSettings(prev => ({ ...prev, isMaintenanceMode: nextState }));
        toast.success(`Đã ${nextState ? "Bật" : "Tắt"} chế độ bảo trì`);
      }
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  const Card = ({ title, children, description, action }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 mb-6 transition-all hover:shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && action}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InputGroup = ({ label, type = "text", placeholder, value, onChange, helper }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input 
        type={type} 
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium"
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {helper && <span className="text-xs text-gray-400 font-medium italic">{helper}</span>}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-gray-500 font-medium tracking-tight">Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <div className="max-w-7xl mx-auto animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <Settings size={20} />
                </div>
                Cấu hình hệ thống
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">Quản lý và thiết lập các thông số vận hành của nền tảng SuperAdmin.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
              >
                <RefreshCcw size={18} />
                Làm mới
              </button>
              <button 
                onClick={handleSaveGeneral}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Lưu tất cả thay đổi
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tabs */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white py-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                <div className="px-6 mb-8">
                   <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">Cài đặt hệ thống</h3>
                </div>
                
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-300 relative group
                          ${isActive 
                            ? "text-blue-600 bg-blue-50/30" 
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"}`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-blue-600 rounded-r-full shadow-[1px_0_6px_rgba(37,99,235,0.2)]"></div>
                        )}
                        
                        <div className={`transition-all duration-300 ${isActive ? "text-blue-600 scale-105" : "text-gray-300 group-hover:text-gray-500"}`}>
                          {React.cloneElement(tab.icon, { 
                            size: 20,
                            strokeWidth: isActive ? 2 : 1.5
                          })}
                        </div>
                        
                        <span className={`text-[15px] tracking-wide transition-all duration-300 
                          ${isActive ? "font-semibold" : "font-medium"}`}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Elegant Info Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4">
                    <Shield size={40} className="text-blue-50 opacity-[0.05]" />
                 </div>
                 <div className="relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                       <Shield size={16} className="text-blue-500" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 mb-1">Chế độ SuperAdmin</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                       Mọi thay đổi tại đây sẽ được lưu vào nhật ký hệ thống để đảm bảo tính an toàn và minh bạch.
                    </p>
                 </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "general" && (
                <>
                  {/* KHỐI CẤU HÌNH LOGO */}
                  <Card 
                    title="Logo hệ thống" 
                    description="Quản lý logo hiển thị trên toàn bộ giao diện website và ứng dụng."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {/* Current Logo */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo hiện tại</label>
                        <div className="flex-1 min-h-[160px] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-6 transition-all hover:bg-gray-100/50">
                          {settings.logoUrl ? (
                            <img 
                              src={settings.logoUrl} 
                              alt="Current Logo" 
                              className="max-h-20 w-auto object-contain"
                            />
                          ) : (
                            <div className="text-gray-300 flex flex-col items-center">
                              <Upload size={32} strokeWidth={1} />
                              <span className="text-[10px] mt-2 font-bold uppercase tracking-tighter">Chưa có Logo</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload Dropzone */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tải lên logo mới</label>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={(e) => handleLogoUpload(e.target.files[0])}
                          className="hidden" 
                          accept="image/*"
                        />
                        <div 
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleLogoUpload(e.dataTransfer.files[0]); }}
                          onClick={() => fileInputRef.current.click()}
                          className={`flex-1 min-h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all cursor-pointer
                            ${isDragging 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"}`}
                        >
                          <div className={`p-3 rounded-xl mb-2 ${isDragging ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                            <Upload size={20} />
                          </div>
                          <p className="text-xs font-bold text-gray-700">Kéo thả hoặc click để tải lên</p>
                          <p className="text-[10px] text-gray-400 mt-1 text-center px-4 italic">Hỗ trợ định dạng PNG, SVG, WEBP (Dưới 2MB)</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                       <button 
                          onClick={handleDeleteLogo}
                          disabled={!settings.logoUrl || isSaving}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-red-500 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Xóa Logo
                       </button>
                    </div>
                  </Card>

                  {/* KHỐI TÊN HỆ THỐNG */}
                  <Card 
                    title="Tên hệ thống" 
                    description="Thiết lập tên hiển thị chính thức của nền tảng."
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Tên ứng dụng</label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-800 min-h-[80px]"
                          value={settings.appName || ""}
                          onChange={(e) => handleUpdateSetting("appName", e.target.value)}
                          placeholder="Nhập tên ứng dụng của bạn..."
                        />
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                          <span className="text-[11px] text-gray-500 font-medium italic">Cập nhật tên hiển thị trên toàn bộ hệ thống (Email, Title website, Dashboard).</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Các cài đặt khác */}
                  <Card title="Cài đặt khu vực" description="Ngôn ngữ và tiền tệ mặc định cho toàn hệ thống.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-gray-700">Ngôn ngữ mặc định</label>
                          <div className="relative">
                            <select 
                              value={settings.defaultLanguage}
                              onChange={(e) => handleUpdateSetting("defaultLanguage", e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white font-medium text-sm appearance-none cursor-pointer"
                            >
                              <option value="vi">Tiếng Việt (VN)</option>
                              <option value="en">English (US)</option>
                            </select>
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-gray-700">Tiền tệ chính</label>
                          <div className="relative">
                            <select 
                              value={settings.defaultCurrency}
                              onChange={(e) => handleUpdateSetting("defaultCurrency", e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white font-medium text-sm appearance-none cursor-pointer"
                            >
                              <option value="VND">Việt Nam Đồng (₫)</option>
                              <option value="USD">Đô la Mỹ ($)</option>
                            </select>
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          </div>
                       </div>
                    </div>
                  </Card>

                  {/* CHẾ ĐỘ BẢO TRÌ */}
                  <Card 
                    title="Chế độ bảo trì" 
                    description="Khóa toàn bộ hệ thống để thực hiện bảo trì kỹ thuật."
                    action={
                      <button 
                        onClick={handleToggleMaintenance}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all
                          ${settings.isMaintenanceMode 
                            ? "bg-red-500 text-white shadow-lg shadow-red-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        {settings.isMaintenanceMode ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        {settings.isMaintenanceMode ? "Đang Bật" : "Đang Tắt"}
                      </button>
                    }
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Thông báo bảo trì</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm min-h-[80px]"
                        value={settings.maintenanceMessage || ""}
                        onChange={(e) => handleUpdateSetting("maintenanceMessage", e.target.value)}
                        placeholder="Thông báo hiển thị cho người dùng khi vào trang web..."
                      />
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "payments" && (
                <Card title="Tỷ giá quy đổi" description="Cấu hình tỷ giá hối đoái cho các giao dịch quốc tế.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {exchangeRates.map((rate) => (
                       <div key={rate.pair} className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-gray-700">Tỷ giá {rate.pair.replace("_", " → ")}</label>
                          <div className="flex gap-2">
                            <input 
                              type="number"
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                              value={rate.rate}
                              onChange={(e) => setExchangeRates(prev => prev.map(r => r.pair === rate.pair ? { ...r, rate: e.target.value } : r))}
                            />
                            <button 
                              onClick={() => handleUpdateRate(rate.pair, rate.rate)}
                              className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                              title="Cập nhật tỷ giá này"
                            >
                              <Check size={20} />
                            </button>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium italic">Đơn vị: {rate.pair.split("_")[1]} / 1 {rate.pair.split("_")[0]}</span>
                       </div>
                     ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </>
  );
};

export default SystemSettingsPage;
