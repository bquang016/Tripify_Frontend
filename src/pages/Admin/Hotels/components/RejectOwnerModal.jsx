import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { UserX } from "lucide-react";

/**
 * Modal TỪ CHỐI ĐƠN — giao diện mới, đẹp + disable nút khi không nhập lý do
 */
const RejectOwnerModal = ({ open, onClose, onConfirm, application }) => {
  const [reason, setReason] = useState("");

  if (!application) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const isDisabled = reason.trim().length === 0;

  return (
    <Modal open={open} onClose={handleClose} title={null} maxWidth="max-w-xl">

      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <UserX size={32} className="text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Từ chối đơn đăng ký Chủ sở hữu
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Vui lòng cung cấp lý do từ chối đơn đăng ký.
          </p>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-700">Bạn đang từ chối đơn của:</p>

        <p className="mt-1 font-semibold text-red-900 text-lg">
          {application.applicantFullName}
        </p>

        <p className="text-sm text-red-700">{application.applicantEmail}</p>
      </div>

      {/* Reason Input */}
      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lý do từ chối <span className="text-red-600">*</span>
        </label>

        <textarea
          id="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ví dụ: Giấy phép kinh doanh không hợp lệ..."
          className="
            w-full p-3 border rounded-lg shadow-sm text-sm
            focus:ring-red-500 focus:border-red-500
          "
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-4 mt-6">
        <button
          onClick={handleClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          Hủy
        </button>

        {/* Nút submit — DISABLED nếu không nhập lý do */}
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`
            px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition
            ${isDisabled 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-red-600 text-white hover:bg-red-700"
            }
          `}
        >
          Xác nhận từ chối
        </button>
      </div>
    </Modal>
  );
};

export default RejectOwnerModal;

