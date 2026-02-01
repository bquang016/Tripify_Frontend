import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { AlertTriangle, Info } from "lucide-react";
import TextField from "@/components/common/Input/TextField"; // Hoặc Input của bạn

const DeactivateConfirmModal = ({ isOpen, onClose, onConfirm, propertyName, isLoading }) => {
  const [confirmText, setConfirmText] = useState("");
  const REQUIRED_TEXT = "tamngungkinhdoanh";
  const isMatch = confirmText === REQUIRED_TEXT;

  // Reset text khi mở lại modal
  useEffect(() => {
    if (isOpen) setConfirmText("");
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Xác nhận tạm ngưng kinh doanh"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Cảnh báo */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <div className="text-sm text-red-800">
            <p className="font-bold mb-1">Cảnh báo hành động quan trọng!</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Khách hàng sẽ <strong>không tìm thấy</strong> "{propertyName}" trên hệ thống.</li>
              <li>Các đơn đặt phòng hiện tại vẫn giữ nguyên, nhưng sẽ không nhận đơn mới.</li>
              <li>Bạn có thể bật lại trạng thái kinh doanh bất cứ lúc nào.</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 items-center text-sm text-blue-800">
          <Info size={18} />
          <span>Để tiếp tục, vui lòng nhập chính xác cụm từ: <strong>{REQUIRED_TEXT}</strong></span>
        </div>

        {/* Input nhập text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhập xác nhận
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            placeholder={`Nhập "${REQUIRED_TEXT}"`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            // Chặn copy paste nếu muốn bảo mật cao hơn (tuỳ chọn)
            onPaste={(e) => e.preventDefault()}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button
            variant="danger" // Giả sử bạn có variant này, nếu không dùng className="bg-red-600 text-white..."
            onClick={onConfirm}
            disabled={!isMatch || isLoading}
            isLoading={isLoading}
            className={`transition-all ${!isMatch ? 'opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            Xác nhận tạm ngưng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateConfirmModal;