import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

// Thêm prop className vào destructuring
export default function Badge({ children, color = "primary", icon, className = "" }) {
  const colors = {
    primary: "text-[rgb(40,169,224)] bg-[rgb(40,169,224,0.15)]",
    success: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    danger: "text-red-600 bg-red-100",
    gray: "text-gray-600 bg-gray-100",
    // ✅ Thêm 'custom' để không bị áp màu mặc định khi bạn muốn tự style
    custom: "", 
  };

  const icons = {
    primary: <Info size={14} />,
    success: <CheckCircle size={14} />,
    warning: <AlertTriangle size={14} />,
    danger: <XCircle size={14} />,
    // ✅ Custom không có icon mặc định
    custom: null,
  };

  return (
    <span
      // ✅ Nối chuỗi className để nhận style từ bên ngoài
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full shadow-sm ${colors[color]} ${className}`}
    >
      {/* Logic hiển thị icon: nếu icon={false} hoặc là 'custom' thì không hiện icon mặc định */}
      {icon !== false && color !== 'custom' && icons[color]}
      {children}
    </span>
  );
}