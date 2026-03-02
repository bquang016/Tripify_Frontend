import axiosInstance from "./axios.config";

export const systemSettingsService = {
  // 1. Nhóm Cấu hình chung
  getSettings: async () => {
    const response = await axiosInstance.get("/admin/settings");
    return response.data;
  },

  updateGeneralSettings: async (settings) => {
    const response = await axiosInstance.patch("/admin/settings", settings);
    return response.data;
  },

  // 2. Nhóm Quản lý Logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/admin/settings/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteLogo: async () => {
    const response = await axiosInstance.delete("/admin/settings/logo");
    return response.data;
  },

  // 3. Nhóm Tỷ giá
  getExchangeRates: async () => {
    const response = await axiosInstance.get("/admin/settings/exchange-rates");
    return response.data;
  },

  updateExchangeRate: async (rateData) => {
    const response = await axiosInstance.patch("/admin/settings/exchange-rates", rateData);
    return response.data;
  },

  // 4. Nhóm Vận hành
  updateMaintenanceMode: async (maintenanceData) => {
    const response = await axiosInstance.post("/admin/settings/maintenance", maintenanceData);
    return response.data;
  },
};
