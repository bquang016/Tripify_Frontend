import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Plus, 
  Save, 
  Info, 
  Users, 
  Hotel, 
  CreditCard, 
  Settings as SettingsIcon, 
  FileText,
  AlertCircle
} from 'lucide-react';

const mockPermissions = [
  {
    group: "QUẢN LÝ NGƯỜI DÙNG",
    items: [
      { id: "USER_VIEW", name: "Xem danh sách người dùng", description: "Cho phép xem thông tin cơ bản của người dùng hệ thống." },
      { id: "USER_EDIT", name: "Chỉnh sửa người dùng", description: "Cho phép cập nhật thông tin và trạng thái người dùng." },
      { id: "USER_DELETE", name: "Xóa người dùng", description: "Quyền xóa hoặc vô hiệu hóa tài khoản người dùng." },
      { id: "ROLE_MANAGE", name: "Quản lý phân quyền", description: "Toàn quyền chỉnh sửa vai trò và ma trận quyền." }
    ]
  },
  {
    group: "QUẢN LÝ NƠI CƯ TRÚ",
    items: [
      { id: "HOTEL_VIEW", name: "Xem danh sách khách sạn", description: "Xem thông tin các khách sạn và căn hộ trên hệ thống." },
      { id: "HOTEL_APPROVE", name: "Duyệt khách sạn mới", description: "Phê duyệt hoặc từ chối yêu cầu đăng ký của chủ nhà." },
      { id: "HOTEL_EDIT", name: "Chỉnh sửa khách sạn", description: "Thay đổi thông tin, hình ảnh của các khách sạn." }
    ]
  },
  {
    group: "TÀI CHÍNH & GIAO DỊCH",
    items: [
      { id: "TRANSACTION_VIEW", name: "Xem lịch sử giao dịch", description: "Xem các luồng tiền, doanh thu và lịch sử đặt phòng." },
      { id: "REFUND_MANAGE", name: "Quản lý hoàn tiền", description: "Xử lý các yêu cầu hoàn tiền từ khách hàng." },
      { id: "FINANCE_REPORT", name: "Báo cáo doanh thu", description: "Xuất file và xem biểu đồ phân tích tài chính." }
    ]
  }
];

const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    isSuper: true,
    description: "Quản trị viên tối cao với toàn quyền hệ thống.",
    permissions: ["USER_VIEW", "USER_EDIT", "USER_DELETE", "ROLE_MANAGE", "HOTEL_VIEW", "HOTEL_APPROVE", "HOTEL_EDIT", "TRANSACTION_VIEW", "REFUND_MANAGE", "FINANCE_REPORT"]
  },
  {
    id: 2,
    name: "Quản trị viên",
    isSuper: false,
    description: "Quản lý các hoạt động vận hành hàng ngày.",
    permissions: ["USER_VIEW", "HOTEL_VIEW", "HOTEL_APPROVE", "HOTEL_EDIT", "TRANSACTION_VIEW"]
  },
  {
    id: 3,
    name: "Kế toán",
    isSuper: false,
    description: "Chuyên trách quản lý tài chính và báo cáo.",
    permissions: ["TRANSACTION_VIEW", "REFUND_MANAGE", "FINANCE_REPORT"]
  },
  {
    id: 4,
    name: "Hỗ trợ viên",
    isSuper: false,
    description: "Hỗ trợ giải đáp thắc mắc và xem thông tin khách hàng.",
    permissions: ["USER_VIEW", "HOTEL_VIEW"]
  }
];

const Toggle = ({ enabled, onChange, disabled }) => {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`${
        enabled ? 'bg-[#10B981]' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
};

const RoleManagementPage = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState(mockRoles[0]);
  const [activePermissions, setActivePermissions] = useState(mockRoles[0].permissions);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActivePermissions(selectedRole.permissions);
  }, [selectedRole]);

  const handleTogglePermission = (permissionId) => {
    if (selectedRole.isSuper) return;

    setActivePermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    // Giả lập API call
    setTimeout(() => {
      setRoles(prev => prev.map(r => 
        r.id === selectedRole.id ? { ...r, permissions: activePermissions } : r
      ));
      setIsSaving(false);
      alert('Đã lưu thay đổi quyền cho vai trò: ' + selectedRole.name);
    }, 800);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Phân quyền</h1>
          <p className="text-gray-500">Thiết lập và tùy chỉnh quyền hạn cho các vai trò trong hệ thống.</p>
        </div>

        <div className="flex gap-6">
          {/* Cột Trái: Danh sách Roles */}
          <div className="w-1/4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)]">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Danh sách vai trò</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                      selectedRole.id === role.id 
                        ? 'bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {role.isSuper ? (
                        <div className="p-1.5 bg-yellow-100 rounded-md">
                          <Crown size={16} className="text-yellow-600" />
                        </div>
                      ) : (
                        <div className={`p-1.5 rounded-md ${selectedRole.id === role.id ? 'bg-[#00AEEF]/10' : 'bg-gray-100'}`}>
                          <ShieldCheck size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm">{role.name}</div>
                        <div className={`text-xs ${selectedRole.id === role.id ? 'text-[#00AEEF]/80' : 'text-gray-400'}`}>
                          {role.permissions.length} quyền hạn
                        </div>
                      </div>
                    </div>
                    {role.isSuper && (
                      <span className="text-[10px] font-bold bg-yellow-500 text-white px-1.5 py-0.5 rounded uppercase">Root</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-[#00AEEF] hover:text-[#00AEEF] transition-all font-medium text-sm">
                  <Plus size={18} />
                  Thêm vai trò mới
                </button>
              </div>
            </div>
          </div>

          {/* Cột Phải: Permission Matrix */}
          <div className="w-3/4">
            <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-200px)] overflow-hidden">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Thiết lập quyền: <span className="text-[#00AEEF]">{selectedRole.name}</span>
                  </h2>
                  <p className="text-sm text-gray-500">{selectedRole.description}</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={selectedRole.isSuper || isSaving}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
                    selectedRole.isSuper 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#00AEEF] text-white hover:bg-[#0096ce] active:scale-95'
                  }`}
                >
                  {isSaving ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Lưu thay đổi
                </button>
              </div>

              {/* Matrix Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {selectedRole.isSuper && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 text-blue-800">
                    <Info size={20} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Lưu ý: Super Admin có toàn quyền hệ thống</p>
                      <p className="text-sm opacity-90">Để đảm bảo tính toàn vẹn của hệ thống, các quyền của Super Admin luôn ở trạng thái kích hoạt và không thể chỉnh sửa.</p>
                    </div>
                  </div>
                )}

                {mockPermissions.map((group) => (
                  <div key={group.group} className="space-y-4">
                    <div className="bg-gray-50 px-4 py-2 rounded-lg">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{group.group}</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {group.items.map((permission) => {
                        const isEnabled = selectedRole.isSuper || activePermissions.includes(permission.id);
                        return (
                          <div key={permission.id} className="py-4 flex items-center justify-between group">
                            <div className="pr-10">
                              <div className="font-bold text-gray-700 group-hover:text-[#00AEEF] transition-colors">
                                {permission.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {permission.description}
                              </div>
                            </div>
                            <Toggle 
                              enabled={isEnabled}
                              onChange={() => handleTogglePermission(permission.id)}
                              disabled={selectedRole.isSuper}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-gray-400 text-xs italic">
                <AlertCircle size={14} />
                Mọi thay đổi sẽ có hiệu lực ngay lập tức sau khi người dùng đăng nhập lại hoặc làm mới trang.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPage;