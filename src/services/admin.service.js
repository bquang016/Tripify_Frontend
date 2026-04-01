import api from "./axios.config.js";

const adminService = {
  // ============================
  // 🧑‍💼 LẤY CÁC ĐƠN ĐĂNG KÝ OWNER (LEGACY)
  // ============================
  getOwnerApplications: async (status) => {
    try {
      const response = await api.get(`/admin/owner-applications`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching owner applications:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch applications");
    }
  },

  /**
   * Duyệt đơn đăng ký Owner
   * Endpoint: POST /api/v1/admin/owner-applications/{id}/approve
   */
  approveOwnerApplication: async (applicationId) => {
    try {
      const response = await api.post(`/admin/owner-applications/${applicationId}/approve`);
      return response.data;
    } catch (error) {
      console.error("Error approving application:", error);
      // Ném ra error message chi tiết để hiển thị toast
      throw new Error(error.response?.data?.message || "Lỗi khi duyệt đơn");
    }
  },

  /**
   * Từ chối đơn đăng ký Owner
   * Endpoint: POST /api/v1/admin/owner-applications/{id}/reject
   * Body: { reason: string }
   */
  rejectOwnerApplication: async (applicationId, reason) => {
    try {
      const response = await api.post(`/admin/owner-applications/${applicationId}/reject`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting application:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi từ chối đơn");
    }
  },

  // ============================
  // 🏨 QUẢN LÝ KHÁCH SẠN (LIST & ACTIONS)
  // ============================

  getPropertiesList: async (page = 0, size = 10, status = "APPROVE") => {
    try {
      const response = await api.get(`/admin/properties/list`, {
        params: { page, size, status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching properties list:", error);
      throw error;
    }
  },

  getPropertiesByStatus: async (status) => {
    try {
      const response = await api.get(`/admin/properties/status`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  reviewProperty: async (propertyId, reviewData) => {
    try {
      const response = await api.post(`/admin/properties/${propertyId}/review`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error reviewing property:", error);
      throw error;
    }
  },

  suspendProperty: async (propertyId, reason) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      console.error("Error suspending property:", error);
      throw error;
    }
  },

  activateProperty: async (propertyId) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/activate`);
      return response.data;
    } catch (error) {
      console.error("Error activating property:", error);
      throw error;
    }
  },

  // ============================
  // 🛏️ QUẢN LÝ PHÒNG
  // ============================
  getPropertyRooms: async (propertyId) => {
    try {
      const response = await api.get(`/admin/properties/${propertyId}/rooms`);
      return response.data;
    } catch (error) {
      console.error("Error fetching property rooms:", error);
      throw error;
    }
  },

  suspendRoom: async (roomId, reason) => {
    try {
      const response = await api.put(`/admin/properties/rooms/${roomId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      console.error("Error suspending room:", error);
      throw error;
    }
  },

  activateRoom: async (roomId) => {
    try {
      const response = await api.put(`/admin/properties/rooms/${roomId}/activate`);
      return response.data;
    } catch (error) {
      console.error("Error activating room:", error);
      throw error;
    }
  },

  // ============================
  // 📊 DASHBOARD (FILTERS + OPTIONS)
  // ============================
  getDashboardStats: async (filters = {}) => {
    try {
      const params = {
        ...(filters.year ? { year: filters.year } : {}),
        ...(filters.month ? { month: filters.month } : {}),
        ...(filters.city?.trim() ? { city: filters.city.trim() } : {}),
        ...(filters.ownerId?.trim() ? { ownerId: filters.ownerId.trim() } : {}),
      };

      const response = await api.get("/admin/owner-applications/dashboard-stats", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  getDashboardOwners: async () => {
    try {
      const response = await api.get("/admin/owner-applications/dashboard/owners");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard owners:", error);
      throw error;
    }
  },

  getDashboardCities: async () => {
    try {
      const response = await api.get("/admin/owner-applications/dashboard/cities");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard cities:", error);
      throw error;
    }
  },

  // ============================
  // 👥 QUẢN LÝ NGƯỜI DÙNG (USERS)
  // ============================
  // 👇 Đã sửa đoạn này 👇
  getAllUsers: async (page = 0, size = 10, search = "", role = "ALL", status = "ALL", rank = "ALL") => {
    const params = {
      page,
      size,
      keyword: search || undefined, // Mapping search -> keyword
    };

    if (role !== "ALL") params.role = role;
    if (status !== "ALL") params.status = status;
    if (rank !== "ALL") params.rank = rank;

    try {
      const response = await api.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách người dùng");
    }
  },

  updateUserStatus: async (userId, newStatus, reason = "") => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, null, {
        params: {
          status: newStatus,
          reason: reason
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw new Error(error.response?.data?.message || "Lỗi cập nhật trạng thái người dùng");
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  },
  getAllPayouts: async () => {
    return await api.get('/admin/payouts');
  },

  calculatePayout: async (ownerId) => {
    return await api.post(`/admin/payouts/calculate/${ownerId}`);
  },

  processPayout: async (payoutId) => {
    return await api.post(`/admin/payouts/process/${payoutId}`);
  }
};

export default adminService;