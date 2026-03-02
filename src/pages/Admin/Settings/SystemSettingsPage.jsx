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
import { extractErrorMessage } from "@/utils/errorHandler";
import { useTranslation } from "react-i18next";

const SystemSettingsPage = () => {
  const { t } = useTranslation();
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
    { id: "general", label: t('settings.general_tab'), icon: <Globe size={18} /> },
    { id: "payments", label: t('settings.payment_tab'), icon: <CreditCard size={18} /> },
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
        toast.error("Access denied.");
        setIsLoading(false);
        return;
      }

      setSettings(settingsResponse.data || settingsResponse.result || settingsResponse);
      setExchangeRates(ratesResponse.data || ratesResponse.result || ratesResponse);
    } catch (error) {
      console.error("Fetch data error:", error);
      toast.error(extractErrorMessage(error, "Failed to load config."));
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

      if (response.code === 403 || response.success === false) {
        const errorMsg = response.message || "Action denied.";
        toast.error(errorMsg);
      } else {
        toast.success("Success! Reloading...");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Update failed"));
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
        toast.error("Upload denied.");
      } else {
        setSettings(prev => ({ ...prev, logoUrl: response.data }));
        toast.success("Logo uploaded!");
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Upload failed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm("Are you sure?")) return;
    setIsSaving(true);
    try {
      const response = await systemSettingsService.deleteLogo();
      if (response.code === 403) {
        toast.error("Delete denied.");
      } else {
        setSettings(prev => ({ ...prev, logoUrl: null }));
        toast.success("Logo deleted");
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Delete failed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRate = async (pair, newRate) => {
    try {
      const response = await systemSettingsService.updateExchangeRate({ pair, rate: parseFloat(newRate) });
      if (response.code === 403) {
        toast.error("Update denied.");
      } else {
        setExchangeRates(prev => prev.map(r => r.pair === pair ? { ...r, rate: parseFloat(newRate) } : r));
        toast.success(`Updated ${pair}`);
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Update failed"));
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
        toast.error("Toggle denied.");
      } else {
        setSettings(prev => ({ ...prev, isMaintenanceMode: nextState }));
        toast.success(`Maintenance ${nextState ? "ON" : "OFF"}`);
      }
    } catch (error) {
      toast.error("Action failed");
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-gray-500 font-medium tracking-tight">Loading...</p>
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
                {t('settings.title')}
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">{t('settings.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
              >
                <RefreshCcw size={18} />
                {t('settings.refresh')}
              </button>
              <button 
                onClick={handleSaveGeneral}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {t('settings.save_all')}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tabs */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white py-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                <div className="px-6 mb-8">
                   <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">Admin Panel</h3>
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
                        <span className={`text-[15px] tracking-wide transition-all duration-300 ${isActive ? "font-semibold" : "font-medium"}`}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "general" && (
                <>
                  <Card title={t('settings.logo_section')} description={t('settings.logo_desc')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Logo</label>
                        <div className="flex-1 min-h-[160px] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-6 transition-all hover:bg-gray-100/50">
                          {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="max-h-20 w-auto object-contain" />
                          ) : (
                            <Upload size={32} strokeWidth={1} className="text-gray-300" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upload New</label>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleLogoUpload(e.target.files[0])} className="hidden" accept="image/*" />
                        <div onClick={() => fileInputRef.current.click()} className="flex-1 min-h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer hover:border-blue-300 bg-white transition-all">
                          <Upload size={20} className="text-gray-400 mb-2" />
                          <p className="text-xs font-bold text-gray-700">Click to upload</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title={t('settings.app_name')} description={t('settings.app_name_desc')}>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-800 min-h-[80px]"
                      value={settings.appName || ""}
                      onChange={(e) => handleUpdateSetting("appName", e.target.value)}
                    />
                  </Card>

                  <Card title={t('settings.regional_settings')} description={t('settings.regional_desc')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-gray-700">{t('settings.default_lang')}</label>
                          <select 
                            value={settings.defaultLanguage}
                            onChange={(e) => handleUpdateSetting("defaultLanguage", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-sm cursor-pointer"
                          >
                            <option value="vi">Tiếng Việt (VN)</option>
                            <option value="en">English (US)</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-gray-700">{t('settings.main_currency')}</label>
                          <select 
                            value={settings.defaultCurrency}
                            onChange={(e) => handleUpdateSetting("defaultCurrency", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-sm cursor-pointer"
                          >
                            <option value="VND">VND (₫)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                       </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemSettingsPage;
