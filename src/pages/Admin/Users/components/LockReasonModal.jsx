import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TextArea from "@/components/common/Input/TextArea";
import { ShieldAlert } from "lucide-react";

const LockReasonModal = ({ open, onClose, onConfirm, userName, isLoading }) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError("Vui lòng nhập lý do khóa tài khoản");
            return;
        }
        onConfirm(reason);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Khóa tài khoản"
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-800">
                    <ShieldAlert className="shrink-0" size={24} />
                    <p className="text-sm leading-relaxed">
                        Bạn đang thực hiện khóa tài khoản {userName}.
                        <br/>
                        Hành động này sẽ ngăn người dùng đăng nhập vào hệ thống.
                    </p>
                </div>

                <div>
                    <TextArea
                        label="Lý do khóa"
                        required
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="Nhập lý do khóa tài khoản..."
                        error={error}
                        rows={4}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="text"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        Xác nhận khóa
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default LockReasonModal;