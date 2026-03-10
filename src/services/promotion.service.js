import axios from "./axios.config";

const API_URL = "/promotions";

// ✅ Helper: Format DateTime chuẩn ISO 8601 để gửi lên Backend
const formatDateTime = (dateInput, isEndOfDay = false) => {
    if (!dateInput) return null;
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const time = isEndOfDay ? '23:59:59' : '00:00:00';
        return `${dateInput}T${time}`;
    }
    if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }
    if (dateInput instanceof Date) {
        const year = dateInput.getFullYear();
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getDate()).padStart(2, '0');
        if (isEndOfDay) { return `${year}-${month}-${day}T23:59:59`; }
        const hour = String(dateInput.getHours()).padStart(2, '0');
        const minute = String(dateInput.getMinutes()).padStart(2, '0');
        const second = String(dateInput.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
    if (typeof dateInput === 'string' && dateInput.includes('T')) { return dateInput; }
    return dateInput;
};

// ✅ Helper: Parse số an toàn để tránh gửi chuỗi rỗng lên Backend gây lỗi 400
const parseNumber = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const cleanVal = String(val).replace(/\./g, ""); // Loại bỏ dấu chấm phân cách hàng nghìn nếu có
    return Number(cleanVal);
};

const promotionService = {
    // 1. Lấy tất cả khuyến mãi (Admin/System)
    getAllPromotions: async () => {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    },

    // 2. Lấy danh sách của Owner (cho trang quản lý của Owner)
    getOwnerPromotions: async () => {
        const response = await axios.get(`${API_URL}/owner/my-promotions`);
        return response.data;
    },

    // 3. API Public lấy danh sách khuyến mãi cho khách hàng xem chi tiết khách sạn
    getPromotionsByPropertyPublic: async (propertyId) => {
        const response = await axios.get(`${API_URL}/public/property/${propertyId}`);
        return response.data;
    },

    // 4. ✅ API Gợi ý khuyến mãi tốt nhất (cho tính năng Best Offer)
    getSuggestions: async (totalAmount) => {
        // Gọi endpoint: /api/v1/promotions/suggestions?totalAmount=...
        const response = await axios.get(`${API_URL}/suggestions`, {
            params: { totalAmount }
        });
        return response.data;
    },

    // 5. Tạo mới khuyến mãi
    createPromotion: async (data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",

            discountValue: parseNumber(data.value), // Parse số

            startDate: formatDateTime(data.startDate, false),
            endDate: formatDateTime(data.endDate, true),

            minBookingAmount: parseNumber(data.minOrder) || 0,
            maxDiscountAmount: parseNumber(data.maxDiscount) || 0,
            usageLimit: parseNumber(data.quantity) > 0 ? parseNumber(data.quantity) : null,

            status: "ACTIVE",
            minMembershipRank: data.minMembershipRank || "BRONZE",
            propertyId: data.propertyId // ✅ Gửi ID khách sạn
        };
        return await axios.post(`${API_URL}/create`, payload);
    },

    // 6. Cập nhật khuyến mãi
    updatePromotion: async (id, data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: parseNumber(data.value),
            startDate: formatDateTime(data.startDate, false),
            endDate: formatDateTime(data.endDate, true),
            minBookingAmount: parseNumber(data.minOrder) || 0,
            maxDiscountAmount: parseNumber(data.maxDiscount) || 0,
            usageLimit: parseNumber(data.quantity) > 0 ? parseNumber(data.quantity) : null,
            status: data.isActive ? "ACTIVE" : "PAUSED",
            minMembershipRank: data.minMembershipRank || "BRONZE",
            propertyId: data.propertyId // ✅ Gửi ID khách sạn để update
        };
        return await axios.put(`${API_URL}/update/${id}`, payload);
    },

    // 7. Xóa mềm (Chuyển trạng thái thành DELETED)
    softDeletePromotion: async (id, currentPromotionData) => {
        const dataToSend = { ...currentPromotionData, status: "DELETED" };
        return await promotionService.updatePromotion(id, dataToSend);
    },

    // 8. Xóa cứng
    deletePromotion: async (id) => { return await axios.delete(`${API_URL}/delete/${id}`); },

    // 9. Upload banner
    uploadBanner: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return await axios.post(`${API_URL}/${id}/banner`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },

    // 10. Toggle status
    togglePromotion: async (id) => {
        return await axios.put(`${API_URL}/toggle/${id}`);
    }
};

export default promotionService;