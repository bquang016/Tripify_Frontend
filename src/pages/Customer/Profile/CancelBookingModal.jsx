import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TextArea from "@/components/common/Input/TextArea";
import { XCircle , AlertCircle} from "lucide-react";
import CancelReasonSelect from "./CancelReasonSelect.jsx";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// --- Dữ liệu lý do giữ nguyên ---
const CANCELLATION_REASONS = [
    { label: "Đặt phòng không được xác nhận kịp thời", value: "NO_CONFIRMATION" },
    { label: "Không thật sự tin tưởng vào uy tín của dịch vụ", value: "NO_TRUST" },
    { label: "Lo lắng về sự an toàn cho vị trí khách sạn", value: "SAFETY_CONCERNS" },
    { label: "Quyết định chọn khách sạn khác", value: "FOUND_ELSEWHERE" },
    { label: "Không thích chính sách hủy phòng", value: "POLICY_DISLIKE" },
    { label: "Không hài lòng với cách thanh toán", value: "PAYMENT_DISLIKE" },
    { label: "Buộc phải hủy phòng hay hoãn hành trình", value: "FORCED_CANCEL" },
    { label: "Tìm thấy giá thấp hơn trên mạng", value: "FOUND_CHEAPER_ONLINE" },
    { label: "Tìm được giá thấp hơn qua dịch vụ địa phương", value: "FOUND_CHEAPER_LOCAL" },
    { label: "Thiên Tai", value: "NATURAL_DISASTER" },
    { label: "Sẽ đặt khách sạn khác trên website của chúng tôi", value: "BOOK_ANOTHER" },
    { label: "Sẽ đặt phòng trực tiếp với khách sạn", value: "BOOK_DIRECT" },
    { label: "Khác", value: "OTHER" },
];

const Step1_Confirm = ({ onKeep, onContinue }) => (
  <div className="px-7 pt-6 pb-6 sm:px-8">
    {/* Hero */}
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-2xl bg-red-50 ring-1 ring-red-100 flex items-center justify-center shadow-sm">
        <XCircle size={22} className="text-red-600" />
      </div>

      <div className="flex-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          Xác nhận hủy đặt phòng
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Bạn sắp hủy một đặt phòng đang có hiệu lực. Hành động này{" "}
          <span className="font-semibold text-slate-800">không thể hoàn tác</span>.
        </p>
      </div>
    </div>

    {/* Info cards */}
    <div className="mt-5 space-y-3">
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/70 p-4">
        <p className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/70 ring-1 ring-amber-200/60">⚠️</span>
          Trước khi hủy, bạn nên biết
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-amber-900/80 leading-relaxed list-disc list-inside">
          <li>Ưu đãi hiện tại có thể không còn nếu bạn đặt lại</li>
          <li>Chính sách hoàn tiền phụ thuộc vào thời điểm hủy</li>
          <li>Một số quyền lợi đi kèm có thể bị mất</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          💡 <span className="font-semibold">Gợi ý:</span> Nếu bạn chỉ muốn thay đổi kế hoạch, hãy xem chính sách hủy/đổi trước khi tiếp tục.
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <Button
        onClick={onContinue}
        variant="ghost"
        fullWidth
        className="sm:!w-auto !text-red-600 hover:!bg-red-50"
      >
        Tôi vẫn muốn hủy
      </Button>

      <Button
        onClick={onKeep}
        variant="primary"
        fullWidth
        className="sm:!w-auto shadow-lg shadow-blue-500/20"
      >
        Giữ đặt phòng
      </Button>
    </div>
  </div>
);

const Step2_Reason = ({ onClose, onConfirmSubmit, booking }) => {
  const [reasonLabel, setReasonLabel] = useState("");
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");

  const showOtherInput = reasonLabel === "Khác";

  const isFreeCancel = booking?.cancellationPolicy?.includes("Miễn phí");
  const policyText = isFreeCancel ? "Hủy không mất phí" : "Hủy có thể mất phí";
  const policyDesc = isFreeCancel
    ? "Nếu hủy phòng bây giờ bạn sẽ không bị tính tiền."
    : booking?.cancellationPolicy || "Vui lòng kiểm tra chi tiết chính sách hủy.";

  const handleSubmit = () => {
    const selectedOption = CANCELLATION_REASONS.find(r => r.label === reasonLabel);
    const reasonValue = selectedOption ? selectedOption.value : "";

    if (!reasonValue) {
      setError("Vui lòng chọn lý do hủy.");
      return;
    }
    if (reasonValue === "OTHER" && !otherText.trim()) {
      setError("Vui lòng cung cấp thêm chi tiết cho lý do 'Khác'.");
      return;
    }

    setError("");
    onConfirmSubmit(reasonValue, otherText);
  };

  const isSubmitDisabled =
    !reasonLabel || (reasonLabel === "Khác" && !otherText.trim());

  return (
    <div className="px-6 pt-6 pb-7 sm:px-8 bg-gradient-to-b from-white to-slate-50/40">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-extrabold text-slate-900">
          Lý do hủy đặt phòng
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Thông tin này giúp chúng tôi cải thiện chất lượng dịch vụ.
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] p-5 sm:p-6 space-y-4">
        <CancelReasonSelect
          label="Lý do hủy phòng:"
          options={CANCELLATION_REASONS}
          value={reasonLabel}
          onChange={(label) => {
            setReasonLabel(label);
            setError("");
          }}
        />

        {showOtherInput && (
          <div className="animate-fadeIn">
            <TextArea
              label="Vui lòng cung cấp thêm chi tiết"
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value);
                setError("");
              }}
              rows={4}
              error={error && reasonLabel === "Khác" ? error : ""}
            />
          </div>
        )}

        {error && !showOtherInput && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Policy */}
      <div
        className={[
          "mt-4 rounded-2xl border p-4 flex items-start gap-3",
          isFreeCancel
            ? "bg-emerald-50/60 border-emerald-200/60"
            : "bg-amber-50/60 border-amber-200/60",
        ].join(" ")}
      >
        <div
          className={[
            "h-10 w-10 rounded-2xl bg-white flex items-center justify-center ring-1",
            isFreeCancel
              ? "text-emerald-600 ring-emerald-200/70"
              : "text-amber-700 ring-amber-200/70",
          ].join(" ")}
        >
          <AlertCircle size={18} />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-extrabold text-slate-900">
            {policyText}
          </h4>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">
            {policyDesc}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button variant="outline" onClick={onClose} fullWidth className="sm:!w-auto">
          Đóng
        </Button>

        <Button
          variant="primary"
          className="!bg-red-600 hover:!bg-red-700 disabled:!bg-slate-300 disabled:!opacity-70 shadow-lg shadow-red-500/20 sm:!w-auto"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          fullWidth
        >
          Tiếp tục hủy
        </Button>
      </div>
    </div>
  );
};



export default function CancelBookingModal({ open, onClose, booking, onConfirm }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setStep(1);
            setIsLoading(false);
        }
    }, [open]);
    useEffect(() => {
  if (!open) return;

  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, scrollY);
  };
}, [open]);


    const handleConfirmCancel = async (reasonValue, otherText) => {
        setIsLoading(true);
        try {
            // ✅ SỬA LOGIC: Gọi onConfirm với tham số phù hợp
            // MyBookings đang dùng: onConfirm={(reason) => ...}
            // Nên ta truyền reasonValue (hoặc kết hợp với otherText) vào.
            // Component cha (MyBookings) đã giữ 'selectedBooking' nên không cần truyền lại booking object từ đây.
            await onConfirm(reasonValue, otherText); 
        } catch (error) {
            console.error("Lỗi khi hủy:", error);
        } finally {
            // ✅ SỬA LỖI LOADING: Luôn tắt loading khi kết thúc (dù thành công hay thất bại)
            setIsLoading(false);
        }
    };

    const title = "Hủy đặt phòng";

    return (
        <>
            <Modal
                open={open}
                onClose={isLoading ? undefined : onClose}
                title={title}
                maxWidth={step === 1 ? "max-w-2xl" : "max-w-3xl"}
            >
                {step === 1 ? (
                    <Step1_Confirm
                        onKeep={onClose}
                        onContinue={() => setStep(2)}
                    />
                ) : (
                    <Step2_Reason
                        onClose={onClose}
                        onConfirmSubmit={handleConfirmCancel}
                        booking={booking}
                    />
                )}
            </Modal>

            {isLoading && (
                <LoadingOverlay message="Đang xử lý yêu cầu hủy phòng..." />
            )}
        </>
    );
}