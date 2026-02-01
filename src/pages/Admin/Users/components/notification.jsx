import React from "react";
import toast from "react-hot-toast";
import ModernToast from "./ModernToast";

export const notify = {
    success: (message, title = "Thành công") =>
        toast.custom((t) => (
            <ModernToast t={t} type="success" title={title} message={message} />
        )),

    error: (message, title = "Đã xảy ra lỗi") =>
        toast.custom((t) => (
            <ModernToast t={t} type="error" title={title} message={message} />
        )),

    warning: (message, title = "Cảnh báo") =>
        toast.custom((t) => (
            <ModernToast t={t} type="warning" title={title} message={message} />
        )),

    info: (message, title = "Thông tin") =>
        toast.custom((t) => (
            <ModernToast t={t} type="info" title={title} message={message} />
        )),
};