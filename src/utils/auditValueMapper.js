// src/utils/auditValueMapper.js

export const formatAuditValue = (value, t = null) => {
    if (!value) return "-";

    // Nếu có truyền hàm t() từ react-i18next, ưu tiên dùng đa ngôn ngữ
    if (t) {
        // Kiểm tra xem value là action hay entity
        const actions = ["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "SUSPEND", "ACTIVATE", "LOGIN", "LOGOUT"];
        const entities = ["PROPERTY", "ROOM", "USER", "BOOKING", "PAYMENT", "PROMOTION", "TRANSACTION", "ROLE"];

        if (actions.includes(value)) {
            return t(`logs.actions.${value}`);
        }
        if (entities.includes(value)) {
            return t(`logs.entities.${value}`);
        }
    }
    
    // Fallback nếu không có t() hoặc value không nằm trong danh sách trên
    const mapping = {
        // LogAction
        "CREATE": "Tạo mới",
        "UPDATE": "Cập nhật",
        "DELETE": "Xóa",
        "APPROVE": "Phê duyệt",
        "REJECT": "Từ chối",
        "SUSPEND": "Tạm đình chỉ",
        "ACTIVATE": "Kích hoạt lại",
        "LOGIN": "Đăng nhập",
        "LOGOUT": "Đăng xuất",

        // LogEntityType
        "PROPERTY": "Nơi cư trú", // Thay thế cho HOTEL
        "ROOM": "Phòng",
        "USER": "Người dùng",
        "BOOKING": "Đặt phòng",
        "PAYMENT": "Thanh toán",
        "PROMOTION": "Khuyến mãi",
        "TRANSACTION": "Giao dịch",
        "ROLE": "Vai trò"
    };

    return mapping[value] || value;
};

export const getActionColor = (action) => {
    switch (action) {
        case 'CREATE':
            return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
        case 'UPDATE':
            return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
        case 'DELETE':
            return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' };
        case 'APPROVE':
            return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' };
        case 'REJECT':
            return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
        case 'SUSPEND':
            return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
        case 'ACTIVATE':
            return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100' };
        default:
            return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100' };
    }
};
