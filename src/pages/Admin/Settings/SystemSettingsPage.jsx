import React, { useState } from "react";
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  CreditCard, 
  Save, 
  RefreshCcw,
  AlertTriangle,
  Activity,
  Users,
  TrendingUp,
  Cpu,
  Upload,
  Trash2,
  Check,
  Image as ImageIcon,
  Type,
  Wrench,
  Database,
  Info,
  CloudLightning
} from "lucide-react";

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isDragging, setIsDragging] = useState(false);

  const tabs = [
    { id: "general", label: "Cấu hình chung", icon: <Globe size={18} /> },
    { id: "payments", label: "Thanh toán & Phí", icon: <CreditCard size={18} /> },
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none mt-1">{value}</p>
      </div>
    </div>
  );

  const Card = ({ title, children, description }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 mb-6 transition-all hover:shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InputGroup = ({ label, type = "text", placeholder, value, helper }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input 
        type={type} 
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium"
        placeholder={placeholder}
        defaultValue={value}
      />
      {helper && <span className="text-xs text-gray-400 font-medium italic">{helper}</span>}
    </div>
  );

  return (
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
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors border border-red-100">
              <RefreshCcw size={18} />
              Hủy thay đổi
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Save size={18} />
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
                    {/* Active Indicator Line - Thinner and more refined */}
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
                      <img 
                        src="/assets/logo/logo_travelmate_xoafont.png" 
                        alt="Current Logo" 
                        className="max-h-20 w-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Upload Dropzone */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tải lên logo mới</label>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
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
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                      <Trash2 size={16} />
                      Xóa Logo
                   </button>
                   <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10">
                      <Check size={16} />
                      Cập nhật
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
                      defaultValue="Tripify"
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
                        <select className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white font-medium text-sm appearance-none cursor-pointer">
                          <option value="vi">Tiếng Việt (VN)</option>
                          <option value="en">English (US)</option>
                        </select>
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Tiền tệ chính</label>
                      <div className="relative">
                        <select className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white font-medium text-sm appearance-none cursor-pointer">
                          <option value="vnd">Việt Nam Đồng (₫)</option>
                          <option value="usd">Đô la Mỹ ($)</option>
                        </select>
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                   </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === "payments" && (
            <Card title="Tỷ giá quy đổi" description="Cấu hình tỷ giá hối đoái tự động cho các giao dịch quốc tế.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputGroup label="Tỷ giá USD → VND" value="25,450" helper="Đơn vị: VNĐ / 1 USD" />
                 <InputGroup label="Tỷ giá EUR → VND" value="27,120" helper="Đơn vị: VNĐ / 1 EUR" />
              </div>
            </Card>
          )}
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
    </div>
  );
};

export default SystemSettingsPage;