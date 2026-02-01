// src/pages/Admin/Transactions/components/RefundRow.jsx
import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import Badge from "@/components/common/Badge/Badge"; // Đảm bảo đường dẫn đúng tới Badge

// --- SUB-COMPONENT: Badge Trạng Thái (Nội bộ) ---
const RefundStatusBadge = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        // ✅ Thêm color="custom" và icon={false}
        <Badge 
            color="custom" 
            icon={false} 
            className="bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 w-fit mx-auto"
        >
          <CheckCircle2 size={14} strokeWidth={2.5} />
          <span className="font-bold text-xs">Đã hoàn tiền</span>
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge 
            color="custom" 
            icon={false}
            className="bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center gap-1.5 w-fit mx-auto animate-pulse"
        >
          <AlertTriangle size={14} strokeWidth={2.5} />
          <span className="font-bold text-xs">Chờ xử lý</span>
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge 
            color="custom" 
            icon={false}
            className="bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center gap-1.5 w-fit mx-auto"
        >
          <Ban size={14} strokeWidth={2.5} />
          <span className="font-bold text-xs">Đã từ chối</span>
        </Badge>
      );
    default:
      return (
        <Badge color="gray" icon={false} className="w-fit mx-auto">
          {status || '---'}
        </Badge>
      );
  }
};

// --- MAIN COMPONENT: RefundRow ---
const RefundRow = ({ item, onViewDetail }) => {
  // Helpers Format
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';

  return (
    <tr className="hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-none">
      <td className="px-6 py-4 font-bold text-blue-600">
        BK-{item.bookingId}
      </td>
      <td className="px-6 py-4 text-slate-600">
        {formatDate(item.refundInfo?.requestDate)}
      </td>
      <td className="px-6 py-4 font-bold text-slate-800">
        {formatMoney(item.refundInfo?.amount || 0)}
      </td>
      <td className="px-6 py-4 text-slate-600 font-medium uppercase text-xs">
        {item.refundInfo?.accountHolder || "---"}
      </td>
      
      {/* CỘT TRẠNG THÁI */}
      <td className="px-6 py-4 text-center">
        <RefundStatusBadge status={item.refundInfo?.status} />
      </td>

      {/* CỘT THAO TÁC */}
      <td className="px-6 py-4 text-right">
        <button 
          onClick={() => onViewDetail(item)}
          className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" 
          title="Xem chi tiết"
        >
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );
};

export default RefundRow;