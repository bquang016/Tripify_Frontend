import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TextArea from "@/components/common/Input/TextArea";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const LockReasonModal = ({ open, onClose, onConfirm, userName, isLoading }) => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError(isVi ? "Vui lòng nhập lý do khóa tài khoản" : "Please enter a reason for locking");
            return;
        }
        onConfirm(reason);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t('admin.users.lock_account')}
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-800">
                    <ShieldAlert className="shrink-0" size={24} />
                    <p className="text-sm leading-relaxed">
                        {isVi ? `Bạn đang thực hiện khóa tài khoản ${userName}.` : `You are locking account ${userName}.`}
                        <br/>
                        {isVi ? "Hành động này sẽ ngăn người dùng đăng nhập vào hệ thống." : "This action will prevent the user from logging into the system."}
                    </p>
                </div>

                <div>
                    <TextArea
                        label={t('admin.users.lock_reason_label')}
                        required
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder={t('admin.users.lock_reason_placeholder')}
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
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        {t('admin.users.confirm_lock')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default LockReasonModal;
