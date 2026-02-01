import React from "react";
import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";

// ✅ QUAN TRỌNG: Phải có chữ 'default' ở đây
export default function UserStatusBadge({ status }) {
    const getConfig = (s) => {
        // Chuẩn hóa input để tránh lỗi case sensitive
        const normalizedStatus = s ? s.toUpperCase() : "";

        switch (normalizedStatus) {
            case "ACTIVE":
                return { color: "success", label: "Hoạt động" };
            case "BANNED":
                return { color: "danger", label: "Đã khóa" };
            case "PENDING":
                return { color: "warning", label: "Chờ duyệt" };
            case "INACTIVE":
                return { color: "gray", label: "Không hoạt động" };
            default:
                return { color: "primary", label: s || "Không rõ" };
        }
    };

    const config = getConfig(status);

    return <Badge color={config.color}>{config.label}</Badge>;
}

UserStatusBadge.propTypes = {
    status: PropTypes.string,
};