import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";

const ActionConfirmModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message, 
  isLoading, 
  confirmText = "Đồng ý", 
  confirmColor = "green", // 'green' | 'blue' | 'red'
  iconType = "warning"    // 'warning' | 'success' | 'danger'
}) => {
  
  // Render icon dựa trên type
  const renderIcon = () => {
    switch (iconType) {
      case "success":
        return <div className="p-3 bg-green-50 rounded-full text-green-600"><CheckCircle size={24} /></div>;
      case "danger":
        return <div className="p-3 bg-red-50 rounded-full text-red-600"><X size={24} /></div>;
      case "warning":
      default:
        return <div className="p-3 bg-yellow-50 rounded-full text-yellow-600"><AlertTriangle size={24} /></div>;
    }
  };

  // Render button class dựa trên color
  const getButtonClass = () => {
    switch (confirmColor) {
      case "red": return "bg-red-600 hover:bg-red-700 text-white";
      case "blue": return "bg-blue-600 hover:bg-blue-700 text-white";
      case "green":
      default: return "bg-green-600 hover:bg-green-700 text-white";
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          {renderIcon()}
          <div className="pt-1">
            <p className="text-gray-600 leading-relaxed text-base">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-50 mt-4">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Hủy bỏ
          </Button>
          <Button 
            onClick={onConfirm} 
            isLoading={isLoading} 
            className={`${getButtonClass()} shadow-sm`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmModal;