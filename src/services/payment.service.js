// src/services/payment.service.js

import api from "./axios.config";

const paymentService = {
  // ============================================================
  // 🛒 KHÁCH HÀNG (CUSTOMER)
  // ============================================================

  // 1. Khách hàng thanh toán
  submitPayment: async (bookingId, note = "", promotionCode = null, method = "Online Banking") => {
    try {
      // Tạo object params cơ bản
      const params = {
        note,
        method
      };

      // Nếu có mã khuyến mãi (chuỗi string "CODE1,CODE2"), thêm vào params
      if (promotionCode) {
        params.promotionCode = promotionCode;
      }

      const response = await api.post(`/payments/${bookingId}/pay`, null, {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. Lịch sử giao dịch của User (Bao gồm cả Refund)
  // ✅ SỬA: Đổi tên hàm và Endpoint để khớp với Refunds.jsx và Backend
  getMyTransactionHistory: async () => {
    try {
      // Backend endpoint: /payments/my-history (Lấy user từ token)
      const response = await api.get("/payments/my-history");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch:", error);
      return [];
    }
  },

  // 3. Gửi yêu cầu hoàn tiền
  requestRefund: async (bookingId, refundData) => {
  try {
    const response = await api.post(`/payments/${bookingId}/refund-request`, refundData);
    return response.data;
  } catch (error) {
    const data = error.response?.data;
    const msg = data?.message || data?.error || error.message || "Refund request failed";
    throw new Error(msg);
  }
},

  // ============================================================
  // 👮 ADMIN (QUẢN LÝ GIAO DỊCH & HOÀN TIỀN)
  // ============================================================

  // 4. Lấy tất cả giao dịch (Cho trang TransactionManagementPage)
  getAllTransactions: async () => {
    try {
      const response = await api.get("/payments/all"); // ✅ API số nhiều
      // Xử lý linh hoạt: trả về mảng data bất kể cấu trúc ApiResponse
      const result = response.data;
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách giao dịch:", error);
      throw new Error(error.response?.data?.message || "Không thể tải dữ liệu giao dịch");
    }
  },

  // 5. Xử lý hoàn tiền (Duyệt/Từ chối) (Cho trang RefundManagementPage)
  processRefundRequest: async (requestId, isApproved, note) => {
    try {
      const response = await api.put(`/payments/refund-process/${requestId}`, null, {
        params: { approve: isApproved, note }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;