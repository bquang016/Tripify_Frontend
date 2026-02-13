import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Plus, 
  Save, 
  Info, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { roleService } from '../../../services/role.service';

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
  const [roles, setRoles] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [activePermissionCodes, setActivePermissionCodes] = useState([]);
  
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch danh sách Roles & Permissions Group khi mount
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoadingRoles(true);
        const [rolesData, permsData] = await Promise.all([
          roleService.getRoles(),
          roleService.getGroupedPermissions()
        ]);
        
        // Kiểm tra data hợp lệ trước khi set
        const finalRoles = Array.isArray(rolesData) ? rolesData : [];
        const finalPerms = permsData || {};
        
        setRoles(finalRoles);
        setGroupedPermissions(finalPerms);
        
        if (finalRoles.length > 0) {
          handleSelectRole(finalRoles[0]);
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || "Không thể tải dữ liệu phân quyền. Vui lòng kiểm tra lại Server/Database.";
        setError(msg);
        console.error(err);
      } finally {
        setIsLoadingRoles(false);
      }
    };
    initData();
  }, []);

  // 2. Fetch chi tiết quyền của một Role khi chọn
  const handleSelectRole = async (role) => {
    setSelectedRole(role);
    setIsLoadingPermissions(true);
    setError(null);
    try {
      const data = await roleService.getRoleWithPermissions(role.id);
      // Chuyển danh sách object permission thành mảng code để dễ quản lý state
      const codes = data.permissions.map(p => p.code);
      setActivePermissionCodes(codes);
    } catch (err) {
      setError(`Không thể tải quyền hạn cho vai trò ${role.name}`);
      console.error(err);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleTogglePermission = (code) => {
    if (selectedRole?.isSuper || selectedRole?.is_super) return;

    setActivePermissionCodes(prev => 
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleSave = async () => {
    if (!selectedRole || selectedRole.isSuper || selectedRole.is_super) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await roleService.updateRolePermissions(selectedRole.id, activePermissionCodes);
      // Cập nhật lại số lượng quyền hiển thị ở danh sách bên trái
      setRoles(prev => prev.map(r => 
        r.id === selectedRole.id ? { ...r, permissionCount: activePermissionCodes.length } : r
      ));
      alert('Đã cập nhật quyền thành công!');
    } catch (err) {
      setError("Cập nhật thất bại. Vui lòng kiểm tra lại quyền truy cập.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingRoles) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-[#00AEEF]" size={40} />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu phân quyền...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Phân quyền</h1>
            <p className="text-gray-500">Thiết lập và tùy chỉnh quyền hạn dựa trên vai trò hệ thống.</p>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 border border-red-100 text-sm font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Cột Trái: Danh sách Roles */}
          <div className="w-1/4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)] border border-gray-100">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Danh sách vai trò</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                      selectedRole?.id === role.id 
                        ? 'bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {role.isSuper ? (
                        <div className="p-1.5 bg-yellow-100 rounded-md">
                          <Crown size={16} className="text-yellow-600" />
                        </div>
                      ) : (
                        <div className={`p-1.5 rounded-md ${selectedRole?.id === role.id ? 'bg-[#00AEEF]/10' : 'bg-gray-100'}`}>
                          <ShieldCheck size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm">{role.name}</div>
                        <div className={`text-[11px] ${selectedRole?.id === role.id ? 'text-[#00AEEF]/80' : 'text-gray-400'}`}>
                          {role.isSuper ? 'Toàn quyền' : 'Tùy chỉnh quyền'}
                        </div>
                      </div>
                    </div>
                    {role.isSuper && (
                      <span className="text-[9px] font-black bg-yellow-500 text-white px-1.5 py-0.5 rounded uppercase">Root</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-[#00AEEF] hover:text-[#00AEEF] transition-all font-bold text-sm">
                  <Plus size={18} />
                  Thêm vai trò mới
                </button>
              </div>
            </div>
          </div>

          {/* Cột Phải: Permission Matrix */}
          <div className="w-3/4">
            <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-200px)] overflow-hidden border border-gray-100">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${selectedRole?.isSuper ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                    {selectedRole?.isSuper ? <Crown className="text-yellow-600" size={24} /> : <ShieldCheck className="text-blue-600" size={24} />}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-800">
                      Quyền hạn: <span className="text-[#00AEEF]">{selectedRole?.name}</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">{selectedRole?.description || 'Cấu hình các module mà vai trò này được phép truy cập'}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={selectedRole?.isSuper || isSaving || isLoadingPermissions}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-md ${
                    selectedRole?.isSuper 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-[#00AEEF] text-white hover:bg-[#0096ce] hover:shadow-lg active:scale-95'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Lưu thay đổi
                </button>
              </div>

              {/* Matrix Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {isLoadingPermissions ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
                    <Loader2 className="animate-spin text-[#00AEEF]" size={32} />
                    <p className="text-gray-400 text-sm">Đang tải ma trận quyền hạn...</p>
                  </div>
                ) : (
                  <>
                    {selectedRole?.isSuper && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4 text-blue-800 shadow-sm animate-fadeIn">
                        <div className="bg-blue-600 text-white p-1 rounded-full">
                          <Info size={18} />
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">Hệ thống bảo vệ: Super Admin</p>
                          <p className="text-sm opacity-80 mt-1 leading-relaxed">
                            Vai trò <strong>{selectedRole.name}</strong> là vai trò gốc của hệ thống. 
                            Tất cả các quyền hạn đã được kích hoạt mặc định và không thể bị tước bỏ để tránh rủi ro bảo mật.
                          </p>
                        </div>
                      </div>
                    )}

                    {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
                      <div key={groupName} className="space-y-4">
                        <div className="bg-gray-50/80 px-4 py-2 rounded-lg border-l-4 border-[#00AEEF]">
                          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">{groupName}</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-50 border-x border-b border-gray-50 rounded-b-xl overflow-hidden">
                          {permissions.map((permission) => {
                            const isEnabled = selectedRole?.isSuper || activePermissionCodes.includes(permission.code);
                            return (
                              <div key={permission.code} className="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                                <div className="pr-10">
                                  <div className={`font-bold text-sm transition-colors ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {permission.name}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 font-medium">
                                    {permission.description || `Mã quyền: ${permission.code}`}
                                  </div>
                                </div>
                                <Toggle 
                                  enabled={isEnabled}
                                  onChange={() => handleTogglePermission(permission.code)}
                                  disabled={selectedRole?.isSuper || isSaving}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer info */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle size={14} className="text-[#00AEEF]" />
                Thay đổi quyền hạn sẽ có hiệu lực sau khi vai trò được lưu và người dùng đăng nhập lại.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPage;