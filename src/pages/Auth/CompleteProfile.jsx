import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthTextField from "../../components/common/Input/AuthTextField";
import Button from "../../components/common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/axios.config"; // Import axios instance của bạn

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // Hàm cập nhật context
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi API backend để update email
      const response = await api.post("/auth/update-email", { email });
      
      if (response.data && response.data.data) {
        // API trả về token mới và user mới
        const { accessToken, user } = response.data.data;
        
        // Lưu lại token xịn và user info
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Cập nhật context
        updateUser(user);
        
        // Xong! Về trang chủ
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật email thất bại. Email có thể đã được sử dụng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Hoàn tất đăng ký
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Tài khoản Facebook của bạn chưa cung cấp địa chỉ email. 
          Vui lòng nhập email để hoàn tất việc tạo tài khoản TravelMate.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthTextField
            label="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            icon={<Mail size={18} />}
            placeholder="example@gmail.com"
          />

          <Button type="submit" fullWidth isLoading={loading}>
            Xác nhận & Tiếp tục
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;