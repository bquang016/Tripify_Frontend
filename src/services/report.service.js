import api from "./axios.config.js";

const exportOwnerRevenue = async (startDate, endDate, format = "pdf", reportType = "MONTHLY", propertyId = "ALL") => {
  try {
    const response = await api.get(`/reports/owner/revenue`, {
      // ✅ Bổ sung propertyId vào query params
      params: { startDate, endDate, format, reportType, propertyId }, 
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    
    const extension = format === "excel" ? "xlsx" : "pdf";
    const propertyPrefix = propertyId === "ALL" ? "Tat_Ca_KS" : `KS_${propertyId}`;
    link.setAttribute("download", `Doanh_Thu_${propertyPrefix}_${reportType}.${extension}`);
    
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Lỗi khi tải báo cáo:", error);
    throw error;
  }
};

export const reportService = { exportOwnerRevenue };
export default reportService;