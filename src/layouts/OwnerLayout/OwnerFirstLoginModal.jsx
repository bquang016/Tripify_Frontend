import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { 
  Save, 
  X, 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Loader2, 
  ShieldCheck 
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

const initialFormState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// --- Component Badge hiển thị điều kiện ---
const Badge = ({ active, text }) => (
  <div
    className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1.5 rounded-md transition-all duration-300 ${
      active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
    }`}
  >
    {active ? (
      <Check size={12} strokeWidth={4} />
    ) : (
      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
    )}
    {text}
  </div>
);

export default function OwnerFirstLoginModal({ open, onClose }) {
  const { currentUser, updateFirstLoginStatus } = useAuth();

  // view: 'suggest' (Màn hình gợi ý) | 'form' (Form đổi MK) | 'success' (Đổi MK thành công)
  const [view, setView] = useState("suggest"); 
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI States
  const [focusedField, setFocusedField] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ newPassword: false });

  // Password Strength States
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false,
  });
  const [passwordScore, setPasswordScore] = useState(0);

  // --- Validate Password Strength ---
  const getPasswordCriteria = (pwd = "") => ({
    length: pwd.length >= 6,
    hasNumber: /\d/.test(pwd),
    hasUpper: /[A-Z]/.test(pwd),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  });

  useEffect(() => {
    const pwd = formData.newPassword;
    const criteria = getPasswordCriteria(pwd);
    setPasswordCriteria(criteria);
    setPasswordScore(Object.values(criteria).filter(Boolean).length);
  }, [formData.newPassword]);

  const getStrengthColor = () => {
    if (passwordScore <= 1) return "bg-rose-500";
    if (passwordScore === 2) return "bg-amber-500";
    if (passwordScore === 3) return "bg-sky-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordScore === 0) return "Chưa nhập";
    if (passwordScore <= 1) return "Quá yếu";
    if (passwordScore === 2) return "Trung bình";
    if (passwordScore === 3) return "Tốt";
    return "Tuyệt vời";
  };

  const isFormValid =
    passwordScore >= 4 &&
    formData.oldPassword.trim() !== "" &&
    formData.newPassword === formData.confirmPassword;

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (passwordScore < 4) {
      setTouched((prev) => ({ ...prev, newPassword: true }));
      setError("Mật khẩu mới chưa đủ mạnh.");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(currentUser.userId, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      // Thay vì dùng alert, chuyển sang màn hình thành công
      setView("success");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    updateFirstLoginStatus(); // Cập nhật context & local storage -> sẽ tự ẩn Modal bên Layout
    handleClose();
  };

  const handleClose = () => {
    setView("suggest");
    setFormData(initialFormState);
    setError(null);
    setPasswordScore(0);
    setTouched({ newPassword: false });
    onClose();
  };

  // Tránh việc user click ra ngoài để tắt Modal nếu đang ở form bắt buộc đổi
  const handleModalClose = () => {
    // Chỉ cho phép đóng nếu ở màn hình suggest (để sau) hoặc success (hoàn tất)
    if (view === "suggest" || view === "success") {
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      title={
        view === "suggest" ? "Bảo mật tài khoản" :
        view === "success" ? "Hoàn tất" : "Cập nhật mật khẩu"
      }
      maxWidth="max-w-md"
    >
      {view === "suggest" && (
        // ==========================================
        // 🛡️ MÀN HÌNH CHÀO MỪNG (GỢI Ý)
        // ==========================================
        <div className="flex flex-col items-center text-center space-y-4 py-4 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <ShieldAlert size={40} />
          </div>
          <h4 className="text-2xl font-black text-slate-800">
            Chào mừng đối tác mới!
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed px-2">
            Chúng tôi nhận thấy bạn đang sử dụng mật khẩu mặc định được cấp bởi hệ thống. 
            Để đảm bảo an toàn tuyệt đối cho doanh thu và thông tin khách sạn, 
            chúng tôi khuyến nghị bạn nên <span className="font-bold text-slate-700">đổi mật khẩu mới</span> ngay lúc này.
          </p>

          <div className="flex w-full gap-3 pt-6 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Để sau
            </button>
            <button
              type="button"
              onClick={() => setView("form")}
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
            >
              Đổi mật khẩu ngay
            </button>
          </div>
        </div>
      )}

      {view === "success" && (
        // ==========================================
        // 🎉 MÀN HÌNH THÀNH CÔNG
        // ==========================================
        <div className="flex flex-col items-center text-center space-y-4 py-4 animate-zoom-in">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h4 className="text-2xl font-black text-slate-800">
            Đổi mật khẩu thành công!
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed px-2">
            Tài khoản của bạn đã được cập nhật mật khẩu mới và bảo vệ an toàn. Bạn có thể tiếp tục sử dụng hệ thống ngay bây giờ.
          </p>

          <div className="w-full pt-6 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
            >
              Tiếp tục sử dụng
            </button>
          </div>
        </div>
      )}

      {view === "form" && (
        // ==========================================
        // 🔒 MÀN HÌNH FORM ĐỔI MẬT KHẨU
        // ==========================================
        <div className="animate-zoom-in pt-2">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-shake shadow-sm">
              <X size={18} className="shrink-0" /> <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --- Mật khẩu hiện tại --- */}
            <div className="relative group">
              <div
                className={`absolute left-4 top-3.5 transition-colors ${
                  focusedField === "oldPassword" ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                <Lock size={20} />
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                onFocus={() => setFocusedField("oldPassword")}
                onBlur={() => setFocusedField(null)}
                value={formData.oldPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl outline-none font-semibold text-slate-800 transition-all ${
                  focusedField === "oldPassword"
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-500/10"
                    : "border-slate-100 hover:border-slate-300"
                }`}
                placeholder="Mật khẩu mặc định hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* --- Mật khẩu mới --- */}
            <div className="relative group">
              <div
                className={`absolute left-4 top-3.5 transition-colors ${
                  focusedField === "newPassword" ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                <Lock size={20} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => {
                  setFocusedField(null);
                  setTouched((prev) => ({ ...prev, newPassword: true }));
                }}
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl outline-none font-semibold text-slate-800 transition-all ${
                  focusedField === "newPassword"
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-500/10"
                    : "border-slate-100 hover:border-slate-300"
                }`}
                placeholder="Mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* --- Password Strength Checker --- */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                formData.newPassword ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Độ mạnh mật khẩu
                  </span>
                  <span className={`text-xs font-bold transition-colors text-${getStrengthColor().replace('bg-', '')}`}>
                    {getStrengthText()}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getStrengthColor()}`}
                    style={{ width: `${(passwordScore / 4) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Badge active={passwordCriteria.length} text="Ít nhất 6 ký tự" />
                  <Badge active={passwordCriteria.hasNumber} text="Có chứa số" />
                  <Badge active={passwordCriteria.hasUpper} text="Chữ in hoa" />
                  <Badge active={passwordCriteria.hasSpecial} text="Ký tự đặc biệt" />
                </div>

                {formData.newPassword && touched.newPassword && passwordScore < 4 && (
                  <div className="mt-3 flex items-start gap-2 text-rose-600">
                    <X size={16} className="mt-0.5 shrink-0" />
                    <p className="text-sm font-semibold leading-relaxed">
                      Mật khẩu chưa đủ mạnh. Cần hoàn thiện các điều kiện trên.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* --- Xác nhận mật khẩu mới --- */}
            <div className="relative group">
              <div
                className={`absolute left-4 top-3.5 transition-colors ${
                  focusedField === "confirmPassword" ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                <Check size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl outline-none font-semibold text-slate-800 transition-all ${
                  focusedField === "confirmPassword"
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-500/10"
                    : "border-slate-100 hover:border-slate-300"
                }`}
                placeholder="Nhập lại mật khẩu mới"
              />

              {formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* --- Buttons --- */}
            <div className="flex gap-3 pt-4 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setView("suggest")}
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} /> Quay lại
              </button>
              
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`flex-[2] py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  isFormValid
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 active:scale-[0.98]"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={18} /> Lưu mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}