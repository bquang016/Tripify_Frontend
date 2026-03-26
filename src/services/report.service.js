import api from "./axios.config.js";

const exportOwnerRevenue = async (startDate, endDate, format = "pdf") => {
  try {
    const response = await api.get(`/reports/owner/revenue`, {
      params: { startDate, endDate, format },
      responseType: "blob", // Cực kỳ quan trọng để xử lý file nhị phân
    });

    // Tạo URL ảo từ Blob data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Tạo thẻ <a> ẩn để ép trình duyệt tải file xuống
    const link = document.createElement("a");
    link.href = url;
    
    // Đặt tên file dựa theo định dạng
    const extension = format === "excel" ? "xlsx" : "pdf";
    link.setAttribute("download", `Bao_Cao_Doanh_Thu_${startDate}_den_${endDate}.${extension}`);
    
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp thẻ <a> sau khi tải xong
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Lỗi khi tải báo cáo:", error);
    throw error;
  }
};

export const reportService = {
  exportOwnerRevenue,
};

export default reportService;