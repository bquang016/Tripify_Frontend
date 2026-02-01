import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  // ✅ LOGIC MỚI: Kiểm tra an toàn
  // 1. Lấy danh sách role từ 'roles' hoặc 'authorities'
  // 2. Chuẩn hóa về dạng mảng string ["CUSTOMER", "ADMIN"]
  const userRoles = getUserRoles(currentUser);

  // 3. Kiểm tra quyền
  if (roles && !userRoles.some(r => roles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Hàm helper để lấy role từ user object bất kể cấu trúc nào
function getUserRoles(user) {
  if (user?.roles && Array.isArray(user.roles)) {
    // Trường hợp User Entity: [{roleName: "CUSTOMER"}] hoặc ["CUSTOMER"]
    return user.roles.map(r => (typeof r === 'object' ? r.roleName : r));
  }
  
  if (user?.authorities && Array.isArray(user.authorities)) {
    // Trường hợp CustomUserDetails: [{authority: "ROLE_CUSTOMER"}]
    return user.authorities.map(a => a.authority.replace("ROLE_", ""));
  }

  return [];
}