import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ roles, requiredRole, isSuperRequired, children }) {
  const { currentUser, hasRole } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  // 1. Kiểm tra quyền Super Admin nếu trang yêu cầu đặc quyền root
  if (isSuperRequired && !currentUser.isSuper) {
    return <Navigate to="/403" replace />;
  }

  // 2. Kiểm tra theo mảng Roles (Dùng cho các route cũ hoặc truyền nhiều role)
  if (roles && Array.isArray(roles)) {
    const hasAnyRole = roles.some(role => hasRole(role));
    if (!hasAnyRole) {
      console.warn(">>> [ProtectedRoute] User lacks required roles:", roles);
      return <Navigate to="/403" replace />;
    }
  }

  // 3. Kiểm tra theo Single Role (requiredRole) - Cách dùng phổ biến trong AdminRoutes
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn(">>> [ProtectedRoute] User lacks required role:", requiredRole);
    return <Navigate to="/403" replace />;
  }

  return children;
}