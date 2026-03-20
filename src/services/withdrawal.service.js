import axiosInstance from './axios.config';

const withdrawalService = {
  // ==========================================
  // OWNER APIs
  // ==========================================
  
  // Lấy thông tin số dư ví (Khả dụng & Đang chờ)
  getMyWallet: () => {
    return axiosInstance.get('/owner/withdrawals/wallet');
  },

  // Tạo yêu cầu rút tiền
  requestWithdrawal: (amount) => {
    return axiosInstance.post('/owner/withdrawals/request', { amount });
  },

  // Lấy lịch sử rút tiền của Chủ nhà
  getOwnerHistory: () => {
    return axiosInstance.get('/owner/withdrawals/history');
  },

  // ==========================================
  // ADMIN APIs
  // ==========================================

  // Lấy tất cả yêu cầu rút tiền của hệ thống
  getAllRequests: () => {
    return axiosInstance.get('/admin/withdrawals');
  },

  // Admin duyệt yêu cầu (Bắn tiền qua Stripe)
  approveRequest: (requestId) => {
    return axiosInstance.post(`/admin/withdrawals/${requestId}/approve`);
  },

  // Admin từ chối yêu cầu
  rejectRequest: (requestId, adminNote) => {
    return axiosInstance.post(`/admin/withdrawals/${requestId}/reject`, { adminNote });
  },
};

export default withdrawalService;