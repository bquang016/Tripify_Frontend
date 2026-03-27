import api from "./axios.config"; // Dùng instance axios của bạn để nó tự đính kèm Token đăng nhập nhé!

const aiService = {
  sendMessage: async (message) => {
    try {
      // 1. Chỉ gọi về Backend Java, KHÔNG truyền sessionId nữa (Java tự lấy từ Token rồi)
      const response = await api.post("/ai/chat", {
        message: message
      });

      // Bóc đúng lớp vỏ mà Java đang bọc (response.data.data)
      const javaDto = response.data.data || response.data;

      // 3. Đóng gói lại thành format mà FloatingChatBot đang chờ đợi
      return {
        data: {
          // Bắt mọi trường hợp tên biến mà Java có thể trả về
          action: javaDto.action,
          response: javaDto.response,
          payload: javaDto.payload
        }
      };

    } catch (error) {
      console.error("❌ Lỗi kết nối đến Backend Java:", error);
      throw error;
    }
  },
};

export default aiService;