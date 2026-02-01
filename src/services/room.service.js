import api from "./axios.config";

const roomService = {

    // ✅ 1. Lấy danh sách ảnh của phòng (để refresh)
    getRoomImages: async (roomId) => {
        try {
            const response = await api.get(`/room-images/${roomId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // ✅ 2. Xóa ảnh phòng
    deleteRoomImage: async (roomId, imageId) => {
        try {
            const response = await api.delete(`/room-images/delete/${roomId}/${imageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ✅ 3. Đặt ảnh bìa phòng
    setRoomCoverImage: async (roomId, imageId) => {
        try {
            const response = await api.put(`/room-images/${roomId}/${imageId}/set-cover`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // 1. Lấy danh sách phòng theo Property ID
    getRoomsByProperty: async (propertyId) => {
        try {
            const response = await api.get(`/rooms/property/${propertyId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // 2. Thêm phòng mới (Multipart)
    addRoom: async (formData) => {
        try {
            const response = await api.post("/rooms/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // 3. Xóa phòng
    deleteRoom: async (roomId) => {
        try {
            const response = await api.delete(`/rooms/${roomId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // 4. Cập nhật phòng
    updateRoom: async (roomId, formData) => {
        try {
            const response = await api.put(`/rooms/${roomId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getRoomDetail: async (roomId) => {
        try {
            const response = await api.get(`/rooms/${roomId}`);
            return response.data?.data || response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    checkNameAvailability: async (propertyId, roomName, excludeRoomId = 0) => {
        return api.get(`/rooms/check-name`, {
            params: {
                propertyId,
                roomName,
                excludeRoomId
            }
        });
    },

    // ✅ [MỚI] Hàm lấy dữ liệu dự báo giá (Price Prediction)
    getPriceForecast: async (roomId, days = 14) => {
        try {
            const response = await api.get(`/rooms/${roomId}/price-forecast`, {
                params: { days }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy dự báo giá:", error);
            throw error;
        }
    }
};

export default roomService;