// src/services/ai.service.js
import api from "./axios.config";

const aiService = {
  // Gửi tin nhắn tới AI
  sendMessage: async (message) => {
    try {
      // Backend yêu cầu body là ChatRequestDTO: { message: "..." }
      const response = await api.post("/ai/chat", { message });
      
      // Backend trả về ApiResponse<ChatResponseDTO>
      // response.data sẽ là cấu trúc ApiResponse
      return response.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default aiService;