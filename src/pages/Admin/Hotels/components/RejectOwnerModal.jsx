import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { UserX } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Modal TỪ CHỐI ĐƠN — giao diện mới, đẹp + disable nút khi không nhập lý do
 */
const RejectOwnerModal = ({ open, onClose, onConfirm, application }) => {
  const { t } = useTranslation();
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
            {t('owner_approvals.reject_modal.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('owner_approvals.reject_modal.subtitle')}
          </p>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-700">{t('owner_approvals.reject_modal.rejecting_for')}</p>

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
          {t('owner_approvals.reject_modal.reason_label')} <span className="text-red-600">*</span>
        </label>

        <textarea
          id="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('owner_approvals.reject_modal.reason_placeholder')}
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
          {t('owner_approvals.reject_modal.cancel')}
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
          {t('owner_approvals.reject_modal.confirm')}
        </button>
      </div>
    </Modal>
  );
};

export default RejectOwnerModal;

