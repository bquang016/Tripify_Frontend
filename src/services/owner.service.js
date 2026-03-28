import api from "./axios.config.js";

// Định nghĩa object service
const ownerService = {
  /**
   * 1. Gửi đơn đăng ký làm Owner
   * (Dùng cho luồng cũ hoặc trang BecomeOwnerPage nếu còn dùng)
   */
  submitApplication: async (payload) => {
    try {
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
   * NEW: Submit final registration application
   * Endpoint: /api/v1/owner-registration/submit
   * @param {FormData} formData - Contains all registration data and files
   * @param {string} token - The temporary token from OTP verification
   */
submitRegistration: async (formData, token) => {
    // Lưu ý: formData truyền vào phải là đối tượng FormData đã chứa đầy đủ file và json
    return await axios.post("/owner/register/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}` // Token tạm thời (nếu backend yêu cầu)
      },
    });
  },

 /**
   * NEW: Submit final registration application
   * Endpoint: /api/v1/owner-registration/submit
   * @param {FormData} formData - Contains all registration data and files
   * @param {string} token - The temporary token from OTP verification
   */
  submitRegistration: async (formData, token) => {
    // SỬA LỖI Ở ĐÂY: Thay axios.post bằng api.post
    return await api.post("/owner/register/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}` 
      },
    });
  },

  /**
   * 3. Đăng ký đầy đủ thông tin đối tác (Full Onboarding)
   * Endpoint: /api/v1/owner/onboarding/register-full
   * @param {FormData} formData - Chứa data (JSON string) và các file ảnh
   */
  registerFullOnboarding: async (formData) => {
    try {
      const response = await api.post("/owner/onboarding/register-full", formData);
      return response.data;
    } catch (error) {
      console.error("Error registering full onboarding:", error);
      throw error;
    }
  },

  /**
   * 4. Lấy thống kê Dashboard
   * (Dùng cho trang OwnerDashboard)
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get("/owner/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching owner dashboard stats:", error);
      throw error;
    }
  },
  /**
   * [GIAI ĐOẠN 3] Lấy thông tin thanh toán (Payout Settings)
   * Endpoint: GET /api/v1/owner/wallet/payout-settings
   */
  getPayoutSettings: async () => {
    try {
      const response = await api.get("/owner/wallet/payout-settings");
      return response.data;
    } catch (error) {
      console.error("Error fetching payout settings:", error);
      throw error;
    }
  },

  /**
   * [GIAI ĐOẠN 3] Cập nhật thông tin thanh toán (Payout Settings)
   * Endpoint: PUT /api/v1/owner/wallet/payout-settings
   */
  updatePayoutSettings: async (data) => {
    try {
      const response = await api.put("/owner/wallet/payout-settings", data);
      return response.data;
    } catch (error) {
      console.error("Error updating payout settings:", error);
      throw error;
    }
  },
  deletePayoutMethod: async (type) => {
    try {
      const response = await api.delete(`/owner/wallet/payout-settings/${type}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting payout method:", error);
      throw error;
    }
  },
  replyToReview: async (reviewId, replyText) => {
    try {
      const response = await api.post(`/owner/reviews/${reviewId}/reply`, { reply: replyText });
      return response.data;
    } catch (error) {
      console.error("Error replying to review:", error);
      throw error;
    }
  },
};

// ✅ Quan trọng: Export cả 2 kiểu để tương thích
export { ownerService }; 
export default ownerService;