import React, { useState } from "react";
import PropTypes from "prop-types";
import { X, AlertTriangle } from "lucide-react";

export default function LockReasonModal({ isOpen, onClose, onConfirm, userName }) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError("Vui lòng nhập lý do khóa tài khoản");
            return;
        }
        onConfirm(reason);
        setReason("");
        setError("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={20} />
                        Khóa tài khoản
                    </h3>
                    <button
                        type="button" // ✅ Fix lỗi reload
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Bạn đang thực hiện khóa tài khoản <strong>{userName}</strong>.
                        Hành động này sẽ ngăn người dùng đăng nhập vào hệ thống.
                    </p>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Lý do khóa <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className={`w-full p-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                                error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                            }`}
                            rows="3"
                            placeholder="Nhập lý do chi tiết..."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError("");
                            }}
                        />
                        {error && <span className="text-xs text-red-500">{error}</span>}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button" // ✅ Fix lỗi reload
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="button" // ✅ Fix lỗi reload
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-200 transition-colors"
                    >
                        Xác nhận khóa
                    </button>
                </div>
            </div>
        </div>
    );
}

LockReasonModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    userName: PropTypes.string
};