// src/pages/Customer/Profile/ChangePassword.jsx
import React, { useState } from "react";
import Card from "@/components/common/Card/Card";
import TextField from "@/components/common/Input/TextField";
import Button from "@/components/common/Button/Button";
import { Save, X } from "lucide-react";
import { authService } from "@/services/auth.service";

const initialFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};


export default function ChangePassword() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      if (res.data.success) {
        setSuccess(true);
        setFormData(initialFormState);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isDirty =
    JSON.stringify(formData) !== JSON.stringify(initialFormState);

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Đổi mật khẩu
        </h3>

        <TextField
          label="Mật khẩu hiện tại"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
        <TextField
          label="Mật khẩu mới (Tối thiểu 8 ký tự)"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mt-2">
            ✅ Mật khẩu đã được thay đổi thành công!
          </p>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            type="submit"
            leftIcon={<Save size={16} />}
            isLoading={loading}
            disabled={loading || !isDirty}
          >
            Lưu mật khẩu
          </Button>

          {isDirty && (
            <Button
              type="button" // Quan trọng: type="button" để không submit form
              variant="outline"
              leftIcon={<X size={16} />}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}