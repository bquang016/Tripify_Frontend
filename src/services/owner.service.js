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
    try {
      const response = await api.post("/owner-registration/submit", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting final registration:", error);
      throw error;
    }
  },

  /**
   * 2. Cập nhật hồ sơ Owner (Onboarding Step 1)
   * ✅ MỚI THÊM: Hàm này xử lý việc upload ảnh CCCD + Avatar
   * @param {FormData} formData - Chứa file và json data
   */
  updateOwnerProfile: async (formData) => {
    try {
      const response = await api.post("/owner/onboarding/profile", formData);
      return response.data;
    } catch (error) {
      console.error("Error updating owner profile:", error);
      throw error; 
    }
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
};

// ✅ Quan trọng: Export cả 2 kiểu để tương thích
export { ownerService }; 
export default ownerService;