import axios from "axios";

// =========================================================================
// 0. KHAI BÁO VÀ XUẤT CÁC BIẾN MÔI TRƯỜNG TẬP TRUNG
// Lấy từ .env, nếu không có thì mặc định lấy IP VPS hiện tại
// =========================================================================

// URL gốc của Backend (dùng để lấy ảnh, file, websocket) - Không có /api/v1
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://136.115.222.186:8386";

// URL dành riêng cho việc gọi API (Có chứa /api/v1)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://136.115.222.186:8386/api/v1";

// URL chuyên dùng để nối chuỗi khi hiển thị ảnh ở các Component
export const IMAGE_BASE_URL = `${BASE_URL}/images/`;



// =========================================================================
// KHỞI TẠO AXIOS INSTANCE
// =========================================================================
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Thêm dòng này để gửi kèm Cookie/Session
    headers: {
        "Content-Type": "application/json",
    },
});

// =========================================================================
// 1. REQUEST INTERCEPTOR: Gắn token nếu có
// =========================================================================
api.interceptors.request.use(
    (config) => {
        // CHỈ thêm token từ localStorage NẾU chưa có Authorization header
        if (!config.headers["Authorization"]) {
            const token =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token");

            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================================
// 2. RESPONSE INTERCEPTOR: Xử lý lỗi tập trung
// =========================================================================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response, config } = error;

        if (!response) {
            return Promise.reject(error);
        }

        const requestUrl = config?.url || "";

        // Kiểm tra có token hay không (phân biệt guest vs user)
        const hasToken =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("token");

        // =====================================================
        // CASE 1: 401 - Unauthorized
        // =====================================================
        if (response.status === 401) {
            // ❌ Login / refresh token thì trả lỗi về component
            if (
                requestUrl.includes("/auth/login") ||
                requestUrl.includes("/auth/token")
            ) {
                return Promise.reject(error);
            }

            // ✅ Nếu không có token (Guest) hoặc đang ở trang login thì không làm gì
            if (!hasToken || window.location.pathname === "/login") {
                return Promise.reject(error);
            }

            // 🔒 USER ĐÃ LOGIN → token hết hạn
            // Thay vì clear hết localStorage và redirect cứng (gây loop khi reload),
            // ta có thể phát event hoặc chỉ xóa các key liên quan đến auth
            // Ở đây ta sẽ để AuthContext hoặc component tự xử lý sau khi bắt lỗi 401
            console.warn("Unauthorized! Token might be expired.");
            
            // Tùy chọn: Có thể xóa token để tránh gửi tiếp các request lỗi
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("user");

            return Promise.reject(error);
        }

        // =====================================================
        // CASE 2: 403 - Forbidden (Account locked)
        // =====================================================
        if (response.status === 403) {
            // ❌ Guest thì bỏ qua
            if (!hasToken) {
                return Promise.reject(error);
            }

            const errorMessage =
                response.data?.message || response.data?.error || "";

            const isAccountLocked = [
                "khóa",
                "lock",
                "ban",
                "disabled",
                "inactive",
            ].some((keyword) =>
                errorMessage.toLowerCase().includes(keyword)
            );

            if (isAccountLocked) {
                window.dispatchEvent(
                    new CustomEvent("auth:account-locked", {
                        detail:
                            errorMessage ||
                            "Tài khoản của bạn đã bị khóa.",
                    })
                );
            }
        }

        return Promise.reject(error);
    }
);

export default api;