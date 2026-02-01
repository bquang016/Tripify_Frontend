import api from "./axios.config.js";

// Định nghĩa object service
const ownerService = {
  /**
   * 1. Gửi đơn đăng ký làm Owner
   * (Dùng cho trang BecomeOwnerPage)
   */
  submitApplication: async (payload) => {
    try {
      // ✅ FIX: Ghi đè header Content-Type thành multipart/form-data
      const res = await api.post("/applications/submit-owner", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error submitting owner application:", error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Gửi đơn thất bại");
      }
      throw new Error("Không thể kết nối máy chủ");
    }
  },

  /**
   * ✅ 2. Lấy thống kê Dashboard (API mới)
   * (Dùng cho trang OwnerDashboard)
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get("/owner/dashboard/stats");
      return response.data; // Trả về ApiResponse
    } catch (error) {
      console.error("Error fetching owner dashboard stats:", error);
      throw error;
    }
  },
};

// ✅ Quan trọng: Export cả 2 kiểu để tương thích với code cũ và mới
export { ownerService }; // Cho import { ownerService }
export default ownerService; // Cho import ownerService