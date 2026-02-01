// src/components/common/Modal/ConfirmModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Button from "../Button/Button";
import ModalPortal from "./ModalPortal";

export default function ConfirmModal({
  open,
  type = "info", // "info" | "warning" | "danger" | "success"
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn tiếp tục?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  const colors = {
    info: "text-[rgb(40,169,224)]",
    warning: "text-yellow-500",
    danger: "text-red-500",
    success: "text-green-500",
  };

  const icons = {
    info: <CheckCircle2 size={28} className={colors.info} />,
    warning: <AlertTriangle size={28} className={colors.warning} />,
    danger: <XCircle size={28} className={colors.danger} />,
    success: <CheckCircle2 size={28} className={colors.success} />,
  };

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
              className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl text-center"
            >
              <div className="flex flex-col items-center gap-3">
                {icons[type]}
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <div className="text-gray-500 text-sm">{message}</div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <Button variant="ghost" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button
                  variant={type === "danger" ? "primary" : "outline"}
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
