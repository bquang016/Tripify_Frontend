import React from "react";
import Modal from "@/components/common/Modal/Modal";
import { UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Modal DUYỆT ĐƠN ĐĂNG KÝ — giao diện mới, không dùng ConfirmModal
 */
const ApproveOwnerModal = ({ open, onClose, onConfirm, application }) => {
  const { t } = useTranslation();
  if (!application) return null;

  return (
    <Modal 
      open={open}
      onClose={onClose}
      title={null}
      maxWidth="max-w-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <UserCheck size={32} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('owner_approvals.approve_modal.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('owner_approvals.approve_modal.subtitle')}
          </p>
        </div>
      </div>

      {/* Applicant info box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-700">{t('owner_approvals.approve_modal.approving_for')}</p>

        <p className="mt-1 font-semibold text-green-900 text-lg">
          {application.applicantFullName}
        </p>

        <p className="text-sm text-green-700">{application.applicantEmail}</p>

        <p className="text-sm text-green-700 mt-3">
          {t('owner_approvals.approve_modal.role_note')}
        </p>
      </div>

      {/* Confirmation Message */}
      <div className="my-6 text-center">
        <p className="text-md text-slate-700">
          {t('owner_approvals.approve_modal.auto_account_note')}
        </p>
        <p className="font-semibold text-slate-800">{t('owner_approvals.approve_modal.confirm_question')}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        {/* Cancel */}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          {t('owner_approvals.approve_modal.cancel')}
        </button>

        {/* Approve */}
        <button
          onClick={onConfirm}
          className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          {t('owner_approvals.approve_modal.confirm')}
        </button>
      </div>
    </Modal>
  );
};

export default ApproveOwnerModal;
