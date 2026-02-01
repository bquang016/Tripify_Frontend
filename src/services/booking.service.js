import api from "./axios.config";

const bookingService = {
  // ==========================================
  // 1. TẠO BOOKING MỚI
  // ==========================================
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings/create", bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 2. LẤY CHI TIẾT BOOKING
  // ==========================================
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 3. LẤY LỊCH SỬ ĐẶT PHÒNG CỦA USER
  // ==========================================
  getBookingsByUserId: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 4. HỦY ĐẶT PHÒNG (USER/OWNER)
  // ==========================================
  cancelBooking: async (bookingId, reason = "") => {
    try {
      // Có thể truyền lý do hủy nếu backend hỗ trợ body hoặc params
      const response = await api.put(`/bookings/cancel/${bookingId}`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 5. CHECK-IN (OWNER/ADMIN)
  // ==========================================
  checkInBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/check-in`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 6. LẤY DANH SÁCH BOOKING THEO KHÁCH SẠN
  // ==========================================
  getBookingsByPropertyId: async (propertyId) => {
    try {
      const response = await api.get(`/bookings/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 7. CHECK-OUT (OWNER/ADMIN)
  // ==========================================
  checkOutBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/checkout/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 8. LẤY TÌNH TRẠNG PHÒNG TRỐNG
  // ==========================================
  getRoomAvailability: async (roomId) => {
    try {
      const response = await api.get(`/bookings/room/${roomId}/availability`);
      return response.data;
    } catch (error) {
      console.error("Error fetching availability:", error);
      return { data: [] };
    }
  },

  // ==========================================
  // 9. ÁP DỤNG MÃ KHUYẾN MÃI
  // ==========================================
  applyPromotion: async (bookingId, code) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/apply-promotion`, null, {
        params: { code }
      });
      // Backend trả về ApiResponse, lấy phần data (BookingResponseDTO)
      return response.data?.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 10. HỦY/GỠ MÃ KHUYẾN MÃI
  // ==========================================
  // [FIX] Dùng tên removePromotion để khớp với PaymentPage.jsx
  removePromotion: async (bookingId, code) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/remove-promotion`, null, {
        params: { code }
      });
      return response.data?.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 11. [ADMIN] LẤY TẤT CẢ BOOKING TOÀN HỆ THỐNG
  // ==========================================
  getAllBookings: async () => {
    try {
      // Backend map là @GetMapping("") tại /api/v1/bookings
      const response = await api.get("/bookings");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 12. [ADMIN] DUYỆT YÊU CẦU HOÀN TIỀN
  // ==========================================
  approveRefund: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/approve-refund/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 13. [ADMIN] LẤY DANH SÁCH YÊU CẦU HOÀN TIỀN
  // ==========================================
  getAllRefundRequests: async () => {
    try {
      const response = await api.get("/bookings/admin/refund-requests");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách hoàn tiền:", error);
      throw error.response?.data || error.message;
    }
  }
};







export default bookingService;