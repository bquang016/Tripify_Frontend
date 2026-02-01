// src/services/notification.service.js
import axios from "./axios.config";

const API_URL = "/notifications";

const notificationService = {
  // Lấy danh sách thông báo (hỗ trợ scope)
  getNotifications: async (page = 0, size = 10, scope = "ALL") => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { page, size, scope }, // Backend nhận param ?scope=ADMIN
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  // Đếm số lượng chưa đọc
  getUnreadCount: async (scope = "ALL") => {
    try {
      const response = await axios.get(`${API_URL}/unread-count`, {
        params: { scope },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  },

  // Đánh dấu 1 cái đã đọc
  markAsRead: async (id) => {
    return await axios.put(`${API_URL}/${id}/read`);
  },

  // Đánh dấu tất cả đã đọc theo scope
  markAllAsRead: async (scope = "ALL") => {
    return await axios.put(`${API_URL}/read-all`, null, {
      params: { scope },
    });
  },
};

export default notificationService;