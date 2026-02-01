// src/pages/Admin/HotelSubmissions/components/RejectHotelModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import TextArea from "@/components/common/Input/TextArea";

export default function RejectHotelModal({
  open,
  onClose,
  onConfirm,
  application,
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleReject = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(reason);
    onClose();
  };

  if (!open) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[100] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3 text-center">
                <XCircle size={32} className="text-red-500" />

                <h3 className="text-lg font-semibold text-gray-800">
                  Từ chối cơ sở
                </h3>

                <p className="text-gray-500 text-sm">
                  Bạn sắp từ chối cơ sở{" "}
                  <span className="font-semibold text-gray-800">
                    {application?.hotelName}
                  </span>
                  .
                </p>
              </div>

              {/* Input */}
              <div className="mt-4">
                <TextArea
                  label="Lý do từ chối"
                  placeholder="Vui lòng nêu rõ lý do..."
                  rows={4}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError(false);
                  }}
                  error={error ? "Lý do từ chối không được để trống." : null}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={onClose}>
                  Hủy
                </Button>

                <Button
                  variant="primary"
                  className={`text-white ${
                    reason.trim()
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                  disabled={!reason.trim()}
                  onClick={handleReject}
                >
                  Từ chối
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
