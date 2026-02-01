import React, { useEffect, useMemo, useState } from "react";
import { User, Phone, Mail, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import MissingProfileModal from "./MissingProfileModal";
import { userService } from "@/services/user.service";

const ContactInfoForm = ({ user, onChange, initialData }) => {
  // --- INIT DATA ---
  const [formData, setFormData] = useState({
    fullName: initialData?.contactName || "",
    phone: initialData?.contactPhone || "",
    email: initialData?.contactEmail || "",
    specialRequest: initialData?.specialRequest || "",
  });

  const [isSelfBooking, setIsSelfBooking] = useState(false);

  const [missingFields, setMissingFields] = useState([]);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // --- VALIDATION HELPERS ---
  const validateFullName = (v) => {
    const value = String(v ?? "").trim();
    if (!value) return "Họ và tên không được để trống.";
    // Cho phép chữ + khoảng trắng (có dấu)
    const regex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!regex.test(value)) return "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
    return "";
  };

  const validatePhone = (v) => {
    const value = String(v ?? "").trim();
    if (!value) return "Số điện thoại không được để trống.";
    const regex = /^0\d{9}$/; // 10 số và bắt đầu bằng 0
    if (!regex.test(value)) return "Số điện thoại phải đúng 10 số và bắt đầu bằng 0.";
    return "";
  };

  const validateEmail = (v) => {
    const value = String(v ?? "").trim();
    if (!value) return "Email không được để trống.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Email không hợp lệ.";
    return "";
  };

  const computeErrors = (data) => ({
    fullName: validateFullName(data.fullName),
    phone: validatePhone(data.phone),
    email: validateEmail(data.email),
  });

  // errors + touched để tránh đỏ ngay từ đầu (tuỳ bạn)
  const [errors, setErrors] = useState(() => computeErrors(formData));
  const [touched, setTouched] = useState({ fullName: false, phone: false, email: false });

  // isValid lấy từ errors
  const isValid = useMemo(() => {
    return !errors.fullName && !errors.phone && !errors.email;
  }, [errors]);

  // --- PUSH DATA UP TO PARENT ---
  useEffect(() => {
    // luôn recompute errors theo formData (đảm bảo auto-fill cũng validate)
    const nextErrors = computeErrors(formData);
    setErrors(nextErrors);

    const nextIsValid = !nextErrors.fullName && !nextErrors.phone && !nextErrors.email;

    onChange?.({
      ...formData,
      isSelfBooking,
      isValid: nextIsValid,
      errors: nextErrors, // nếu cha cần show message
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isSelfBooking]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // validate realtime cho field đang đổi
      const nextErrors = computeErrors(next);
      setErrors(nextErrors);
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === "fullName" || name === "phone" || name === "email") {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  // --- SELF BOOKING TOGGLE (FETCH FRESH PROFILE + VALIDATE) ---
  const handleSelfBookingToggle = async (e) => {
    const checked = e.target.checked;

    if (checked) {
      setIsChecking(true);
      try {
        let currentUserData = user;

        if (user?.userId) {
          try {
            const res = await userService.getUserProfile(user.userId);
            currentUserData = res?.data || res || user;
          } catch (err) {
            console.warn("Không thể lấy thông tin mới nhất, dùng thông tin hiện tại:", err);
          }
        }

        const missing = [];

        // Name
        if (!currentUserData?.fullName || String(currentUserData.fullName).trim() === "") {
          missing.push("Họ và tên");
        }

        // Phone (ưu tiên phoneNumber)
        const userPhone = currentUserData?.phoneNumber || currentUserData?.phone;
        if (!userPhone || String(userPhone).trim() === "") {
          missing.push("Số điện thoại");
        }

        // Email
        if (!currentUserData?.email || String(currentUserData.email).trim() === "") {
          missing.push("Email");
        }

        if (missing.length > 0) {
          setMissingFields(missing);
          setShowMissingModal(true);
          setIsSelfBooking(false);
          return;
        }

        // Auto-fill + mark touched để nếu format sai thì nó hiện luôn
        setFormData((prev) => ({
          ...prev,
          fullName: currentUserData.fullName || "",
          phone: userPhone ? String(userPhone) : "",
          email: currentUserData.email || "",
        }));
        setTouched({ fullName: true, phone: true, email: true });
        setIsSelfBooking(true);
      } finally {
        setIsChecking(false);
      }
    } else {
      // Bỏ chọn -> clear info (giữ lại specialRequest)
      setFormData((prev) => ({
        ...prev,
        fullName: "",
        phone: "",
        email: "",
      }));
      setTouched({ fullName: false, phone: false, email: false });
      setIsSelfBooking(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <User size={20} className="text-blue-600" /> Thông tin liên hệ
        </h3>

        {user && (
          <label
            className={`flex items-center gap-2 select-none group ${
              isChecking ? "cursor-wait opacity-70" : "cursor-pointer"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                isSelfBooking
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300 group-hover:border-blue-400"
              }`}
            >
              {isChecking ? (
                <Loader2 size={12} className="text-blue-600 animate-spin" />
              ) : (
                isSelfBooking && <CheckCircle2 size={14} className="text-white" />
              )}
            </div>

            <input
              type="checkbox"
              className="hidden"
              checked={isSelfBooking}
              onChange={handleSelfBookingToggle}
              disabled={isChecking}
            />

            <span className={`text-sm font-medium ${isSelfBooking ? "text-blue-700" : "text-slate-600"}`}>
              {isChecking ? "Đang kiểm tra..." : "Tôi đặt cho chính mình"}
            </span>
          </label>
        )}
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* FULL NAME */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="fullName"
                disabled={isSelfBooking || isChecking}
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                  isSelfBooking
                    ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                    : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } ${showError("fullName") ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                placeholder="VD: Nguyen Van A"
              />
            </div>
            {showError("fullName") && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="phone"
                disabled={isSelfBooking || isChecking}
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                  isSelfBooking
                    ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                    : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } ${showError("phone") ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                placeholder="VD: 0912345678"
              />
            </div>
            {showError("phone") && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
          </div>

          {/* EMAIL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Email nhận vé <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                disabled={isSelfBooking || isChecking}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                  isSelfBooking
                    ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                    : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } ${showError("email") ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                placeholder="VD: email@example.com"
              />
            </div>

            {isSelfBooking && (
              <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> Thông tin được lấy tự động từ hồ sơ của bạn.
              </p>
            )}

            {showError("email") && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* SPECIAL REQUEST */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Yêu cầu đặc biệt</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
              <textarea
                name="specialRequest"
                rows="3"
                value={formData.specialRequest}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="VD: Nhận phòng sớm, phòng không hút thuốc..."
              />
            </div>

            {/* Optional: hiển thị trạng thái valid để debug */}
            {/* <p className="text-xs mt-2">{isValid ? "✅ Form hợp lệ" : "❌ Form chưa hợp lệ"}</p> */}
          </div>
        </div>
      </div>

      <MissingProfileModal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        missingFields={missingFields}
      />
    </div>
  );
};

export default ContactInfoForm;
