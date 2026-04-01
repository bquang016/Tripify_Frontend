import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm bổ trợ để chuẩn hóa thông tin User (Phân biệt Super Admin và Admin)
  const enrichUserData = (user) => {
    if (!user) return null;
    
    // 1. Lấy danh sách tên vai trò
    const roles = user.roles || [];
    const roleNames = roles.map(r => {
      if (typeof r === 'object') return (r.roleName || r.name || r.authority || "").replace("ROLE_", "");
      return r.replace("ROLE_", "");
    });

    // 2. Lấy danh sách mã quyền hạn (Permission Codes)
    const permissions = user.permissions || [];
    const permissionCodes = permissions.map(p => {
      if (typeof p === 'object') return p.code || p.name;
      return p;
    });

    const isSuper = user.isSuper || user.is_super || user.isRoot || roleNames.includes("SUPER_ADMIN");
    const isAdmin = roleNames.includes("ADMIN") || isSuper;

    return {
      ...user,
      isSuper,
      isAdmin,
      roleNames,
      permissionCodes
    };
  };

  // Tự động đồng bộ profile khi vào trang
  useEffect(() => {
    const syncUser = async () => {
      const token = authService.getAccessToken();
      // Chỉ sync nếu có token và token hợp lệ (không phải string "null" hoặc "undefined")
      if (token && token !== "null" && token !== "undefined") {
        try {
          const latestUser = await authService.fetchUserProfile();
          if (latestUser) {
            const enriched = enrichUserData(latestUser);
            setCurrentUser(enriched);
            localStorage.setItem('user', JSON.stringify(enriched));
          }
        } catch (err) {
          console.error("Failed to sync user profile:", err);
          // CHỈ logout nếu thực sự là lỗi 401 từ server và không phải ở trang login
          if (err.response?.status === 401 && window.location.pathname !== "/login") {
            console.warn("Session expired or invalid token. Logging out...");
            logout();
          }
        }
      } else if (currentUser) {
        // Nếu có user state nhưng không có token trong localStorage -> logout để đồng bộ
        console.warn("No token found but user exists in state. Logging out...");
        logout();
      }
    };
    syncUser();
  }, []);

  // 1. Đăng nhập thường
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      if (data && data.user && data.accessToken) { 
        const enriched = enrichUserData(data.user);
        setCurrentUser(enriched);
        localStorage.setItem('accessToken', data.accessToken); 
        localStorage.setItem('user', JSON.stringify(enriched));
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Login failed'); 
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. Đăng nhập bằng OAuth2 (Google/Facebook)
  const loginWithOAuth2 = async (token) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('accessToken', token);
      const user = await authService.fetchUserProfile();
      if (user) {
        const enriched = enrichUserData(user);
        setCurrentUser(enriched);
        localStorage.setItem('user', JSON.stringify(enriched));
        return true;
      }
      return false;
    } catch (err) {
      console.error("OAuth2 Login Error:", err);
      authService.logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. Đăng xuất
  const logout = () => {
    const currentToken = authService.getAccessToken();
    authService.logout(currentToken);
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // 4. Cập nhật User State
  const updateUser = (userData) => {
    setCurrentUser((prev) => {
      const updated = enrichUserData({ ...prev, ...userData });
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ 5. Cập nhật trạng thái First Login
  const updateFirstLoginStatus = () => {
    if (currentUser) {
      updateUser({ isFirstLogin: false });
    }
  };

  // 6. Kiểm tra Role hoặc Permission
  const hasRole = (target) => {
    if (!currentUser) return false;
    if (currentUser.isSuper) return true;
    if (currentUser.roleNames?.includes(target)) return true;
    if (target === "ADMIN" && currentUser.isAdmin) return true;
    if (currentUser.permissionCodes?.includes(target)) return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginWithOAuth2,
        logout,
        updateUser, 
        updateFirstLoginStatus, // ✅ Export hàm ra ngoài
        loading,
        error,
        hasRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};