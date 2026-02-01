// src/pages/Admin/HotelSubmissions/components/ApproveHotelModal.jsx
import React from "react";
import ConfirmModal from "@/components/common/Modal/ConfirmModal";

const ApproveHotelModal = ({ open, onClose, onConfirm, application }) => {
  return (
    <ConfirmModal
      open={open}
      type="success"
      title="Phê duyệt cơ sở"
      message={
        <>
          Bạn có chắc chắn muốn phê duyệt cơ sở{" "}
          <span className="font-semibold text-gray-800">
            {application?.hotelName}
          </span>
          ?
        </>
      }
      confirmText="Phê duyệt"
      cancelText="Hủy"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export default ApproveHotelModal;
