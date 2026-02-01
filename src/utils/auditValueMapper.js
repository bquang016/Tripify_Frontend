// src/utils/auditValueMapper.js

// Map enum / value backend → tiếng Việt cho Audit Log
export function formatAuditValue(value) {
    if (value === null || value === undefined) return null;

    // Nếu là chuỗi JSON rỗng
    if (value === "{}") return null;

    // Enum mapping
    const enumMap = {
        // PropertyStatus
        PENDING: "Chờ duyệt",
        APPROVE: "Đã duyệt",
        APPROVED: "Đã duyệt",
        REJECTED: "Từ chối",
        SUSPENDED: "Tạm dừng",
        ACTIVE: "Hoạt động",
        INACTIVE: "Ngưng hoạt động",

        // LogAction
        CREATE: "Tạo mới",
        UPDATE: "Cập nhật",
        DELETE: "Xóa",
        APPROVE_ACTION: "Phê duyệt",
        REJECT_ACTION: "Từ chối",

        // EntityType
        PROPERTY: "Cơ sở lưu trú",
        ROOM: "Phòng",
        USER: "Người dùng",
        BOOKING: "Đơn đặt phòng",
        PROMOTION: "Khuyến mãi",
        SYSTEM: "Hệ thống",
    };

    // Nếu value là enum
    if (enumMap[value]) {
        return enumMap[value];
    }

    // Nếu là JSON string → pretty
    if (typeof value === "string" && value.startsWith("{")) {
        try {
            const obj = JSON.parse(value);
            return JSON.stringify(obj, null, 2);
        } catch {
            return value;
        }
    }

    return value;
}
