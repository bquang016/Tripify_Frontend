import React from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { MapPin, AlertTriangle, CheckCircle2, XCircle, EyeOff } from "lucide-react";

// Hàm tiện ích để hiển thị đúng Badge (sao chép từ PropertyCard)
const getStatusBadge = (status, isEnable) => {
  if (status === "PENDING") {
    return <Badge color="warning" icon={<AlertTriangle size={14} />}>Chờ duyệt</Badge>;
  }
  if (status === "REJECTED") {
    return <Badge color="danger" icon={<XCircle size={14} />}>Bị từ chối</Badge>;
  }
  if (status === "APPROVED") {
    if (isEnable) {
      return <Badge color="success" icon={<CheckCircle2 size={14} />}>Đang hoạt động</Badge>;
    } else {
      return <Badge color="gray" icon={<EyeOff size={14} />}>Đã vô hiệu hóa</Badge>;
    }
  }
  return <Badge color="gray">{status}</Badge>;
};

// Component con để hiển thị thông tin
const InfoRow = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-md text-gray-900">{value}</p>
  </div>
);

export default function ViewSubmissionModal({ open, onClose, property }) {
  if (!property) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chi tiết cơ sở lưu trú"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <InfoRow label="Tên cơ sở" value={property.name} />
        <InfoRow label="Địa chỉ" value={property.location} />
        
        <div>
          <span className="text-sm font-medium text-gray-500">Trạng thái hiện tại</span>
          <div className="mt-1">
            {getStatusBadge(property.status, property.isEnable)}
          </div>
        </div>

        {/* Hiển thị lý do nếu bị từ chối hoặc đang chờ */}
        {property.status === "PENDING" && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Đơn đăng ký của bạn đang được quản trị viên xem xét.
          </div>
        )}
        {property.status === "REJECTED" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong>Lý do từ chối (ví dụ):</strong> Thiếu hình ảnh giấy phép kinh doanh.
          </div>
        )}

      </div>
      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
}