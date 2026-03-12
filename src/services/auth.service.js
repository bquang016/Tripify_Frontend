import api from "./axios.config.js"; 

// ============================
// 🔒 AUTH SERVICE
// ============================

// 1. Đăng nhập thường
const login = async (email, password) => {
  try {
    const response = await api.post(`/auth/login`, {
      email,
      password,
    });

    if (response.data && response.data.data.accessToken) { 
      const { accessToken, user } = response.data.data; 
      localStorage.setItem("accessToken", accessToken); 
      localStorage.setItem("user", JSON.stringify(user));
      return response.data.data; 
    }
    
    // Trường hợp API trả về 200 nhưng không có data (Logic dự phòng)
    return response.data;
  } catch (error) {
    // ⚠️ SỬA LỖI QUAN TRỌNG: 
    // Phải ném error gốc ra để component Login bắt được error.response.status (401, 403)
    console.error("Auth Service Login Error:", error);
    throw error; 
  }
};

// 2. Đăng ký
const register = async (fullName, email, password, confirmPassword) => {
  try {
    const response = await api.post(`/auth/register`, {
      fullName,
      email: email.toLowerCase().trim(),
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    // Cũng nên throw error gốc để hứng lỗi Validate (400) hoặc Conflict (409)
    throw error;
  }
};

// 3. Đăng xuất
const logout = (token) => {
  if (token) {
    api.post(`/auth/logout`, {}).catch(err => console.error(err));
  }
  
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken"); 
  localStorage.removeItem("token"); 
};

// 4. Lấy user từ LocalStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

// 5. Lấy token
const getAccessToken = () => {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

// 6. Quên mật khẩu
const forgotPassword = async (email) => {
  try {
    const response = await api.post(`/auth/forgot-password`, { 
      email: email.toLowerCase().trim() 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 7. Reset mật khẩu
const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const payload = { 
      token: token?.toString().trim(), 
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };
    console.log(">>> [STEP 3] Reset Password Payload:", payload);
    const response = await api.post(`/auth/reset-password`, payload);
    return response.data;
  } catch (error) {
    console.error(">>> [STEP 3] Reset Password Error:", error.response?.data || error.message);
    throw error;
  }
};

// 8. Xác thực Email
const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email`, { 
        params: { token } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 9. Gửi mã OTP
const sendOtp = async (email, type) => {
  try {
    const response = await api.post(`/auth/send-otp`, { 
      email: email.toLowerCase().trim(), 
      type 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 10. Xác thực mã OTP chung (Dùng cho luồng Quên mật khẩu...)
const verifyOtp = async (email, otpCode, type) => {
  try {
    const payload = { 
      email: email.toLowerCase().trim(), 
      otp: otpCode.toString().trim(),
      type: type // Đảm bảo type (ví dụ: "FORGOT_PASSWORD") luôn được gửi đi
    };
    console.log(">>> [STEP 2] Verify OTP Payload:", payload);
    const response = await api.post(`/auth/verify-otp`, payload);
    return response.data;
  } catch (error) {
    console.error(">>> [STEP 2] Verify OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

// 11. Hoàn tất đăng ký kèm xác thực OTP (Mới)
const verifyRegister = async (email, otpCode) => {
  try {
    const payload = {
      email: email.toLowerCase().trim(),
      otp: otpCode.toString().trim(),
      type: "REGISTER" // Thêm lại type theo nghi ngờ của người dùng về backend logic
    };
    console.log(">>> [STEP 3] Finalizing Registration (With Session & Type):", payload);
    const response = await api.post(`/auth/verify-register`, payload);
    
    // Nếu thành công và có token, lưu vào localStorage
    if (response.data && response.data.success && response.data.data?.accessToken) {
      const { accessToken, user } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    // LOG CHI TIẾT ĐỂ PHÂN TÍCH TRIỆT ĐỂ
    const serverData = error.response?.data;
    console.group("❌ VERIFY REGISTER FAILED");
    console.error("Status:", error.response?.status);
    console.error("Message:", serverData?.message);
    console.error("Validation Details:", serverData?.data);
    console.groupEnd();
    
    throw error;
  }
};

// 12. Yêu cầu bật/tắt 2FA (Trong Settings)
const request2faToggle = async () => {
  try {
    const response = await api.post(`/auth/2fa/request-toggle`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 13. Xác nhận bật/tắt 2FA
const toggle2fa = async (otp) => {
  try {
    const response = await api.post(`/auth/2fa/toggle`, { 
      otp: otp.toString().trim() 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 14. Xác thực OTP để hoàn tất Đăng nhập (2FA)
const verify2faLogin = async (email, otp) => {
  try {
    const response = await api.post(`/auth/2fa/verify-login`, {
      email: email.toLowerCase().trim(),
      otp: otp.toString().trim(),
    });

    if (response.data && response.data.success && response.data.data?.accessToken) {
      const { accessToken, user } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me'); 
    console.log(">>> [DEBUG] Raw /auth/me Response:", response.data);
    const userData = response.data.data || response.data;

    if (userData && !userData.roles && userData.authorities) {
      userData.roles = userData.authorities.map(auth => ({
        roleName: auth.authority.replace("ROLE_", "") // Bỏ tiền tố ROLE_
      }));
    }

    return userData;
  } catch (error) {
    console.error("Fetch profile error:", error);
    throw error;
  }
};

const unlinkSocialAccount = async (provider) => {
  try {
    // Gọi method DELETE: /api/v1/auth/social/unlink?provider=google
    const response = await api.delete(`/auth/social/unlink`, {
      params: { provider }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createPassword = async (password) => {
  try {
    const response = await api.post(`/auth/create-password`, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendOwnerOtp = (email) => {
  return api.post("/auth/owner/send-otp", { email });
};

const checkOwnerEmail = (email) => {
  return api.post("/auth/owner/check-email", { email });
};

const verifyOwnerOtp = (email, otpCode) => {
  return api.post("/auth/owner/verify-otp", { 
     email: email, 
     otp: otpCode 
  });
};

const registerOwner = (data) => {
  return api.post("/auth/owner/register", data);
};


export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendOtp,
  verifyOtp,
  verifyRegister,
  request2faToggle,
  toggle2fa,
  verify2faLogin,
  fetchUserProfile,
  unlinkSocialAccount,
  createPassword,
  sendOwnerOtp,
  checkOwnerEmail,
  verifyOwnerOtp,
  registerOwner,
};

export default authService;