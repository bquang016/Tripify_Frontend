// src/pages/Admin/Hotels/components/ApproveHotelModal.jsx
import React from "react";
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import { useTranslation } from "react-i18next";

const ApproveHotelModal = ({ open, onClose, onConfirm, application }) => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  return (
    <ConfirmModal
      open={open}
      type="success"
      title={isVi ? "Phê duyệt cơ sở" : "Approve Property"}
      message={
        <>
          {isVi ? "Bạn có chắc chắn muốn phê duyệt cơ sở" : "Are you sure you want to approve property"}{" "}
          <span className="font-semibold text-gray-800">
            {application?.hotelName}
          </span>
          ?
        </>
      }
      confirmText={t('hotels.approve')}
      cancelText={t('common.cancel')}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export default ApproveHotelModal;
