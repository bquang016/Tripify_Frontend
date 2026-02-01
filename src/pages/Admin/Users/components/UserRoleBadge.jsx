import React from "react";
import PropTypes from "prop-types"; // ✅ 1. Import PropTypes
import Badge from "@/components/common/Badge/Badge";

export default function UserRoleBadge({ role }) {
    const getConfig = (r) => {
        // Chuyển về chữ hoa để đảm bảo khớp case nếu data backend trả về không nhất quán
        const normalizedRole = r ? r.toUpperCase() : "";

        switch (normalizedRole) {
            case "ADMIN":
                return { color: "primary", label: "Quản trị viên" }; // Màu xanh dương
            case "OWNER":
                return { color: "primary", label: "Chủ khách sạn" }; // Màu vàng
            case "CUSTOMER":
                return { color: "success", label: "Khách hàng" };   // Màu xanh lá
            default:
                return { color: "gray", label: r || "Không rõ" };
        }
    };

    const config = getConfig(role);

    return <Badge color={config.color}>{config.label}</Badge>;
}

// ✅ 2. Thêm PropTypes để kiểm tra kiểu dữ liệu
UserRoleBadge.propTypes = {
    role: PropTypes.string,
};