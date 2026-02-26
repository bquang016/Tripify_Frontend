// src/services/systemLog.service.js
import axios from "./axios.config";

const systemLogService = {
    // Khôi phục lại endpoint cũ để hiển thị danh sách không bị lỗi
    getLogs: (page = 0) =>
        axios.get(`/system-logs?page=${page}`).then(res => res.data),

    // API Chi tiết vẫn giữ nguyên
    getLogDetail: (logId) =>
        axios.get(`/system-logs/${logId}`).then(res => res.data),

    // Giữ API Export nhưng lưu ý nó có thể chưa chạy nếu BE chưa có
    exportLogs: (params) => {
        return axios.get(`/api/v1/system-logs/export`, { 
            params,
            responseType: 'blob'
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `SystemLogs_Report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }
};

export default systemLogService;
