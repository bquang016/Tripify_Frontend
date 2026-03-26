import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Download, FileText, FileSpreadsheet, Calendar, Loader2, X } from "lucide-react";
import { reportService } from "@/services/report.service";
// Nếu bạn dùng react-hot-toast, hãy uncomment dòng dưới
// import toast from "react-hot-toast"; 

export default function ExportReportModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("pdf"); // 'pdf' | 'excel'
  
  // Mặc định lấy từ đầu tháng đến ngày hiện tại
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const currentDay = today.toISOString().split('T')[0];

  const [dates, setDates] = useState({ start: firstDay, end: currentDay });
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setError("");
    if (!dates.start || !dates.end) {
      setError("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.");
      return;
    }

    if (new Date(dates.start) > new Date(dates.end)) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    setLoading(true);
    try {
      await reportService.exportOwnerRevenue(dates.start, dates.end, format);
      // toast.success("Tải báo cáo thành công!");
      alert("Tải báo cáo thành công!");
      onClose();
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Xuất Báo Cáo Doanh Thu" maxWidth="max-w-md">
      <div className="space-y-6 pt-4 animate-fade-in">
        
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-start gap-2">
            <X size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* --- Chọn khoảng thời gian --- */}
        <div>
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-emerald-600" />
            Thời gian báo cáo
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-1 block">Từ ngày</span>
              <input
                type="date"
                value={dates.start}
                onChange={(e) => setDates({ ...dates, start: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-1 block">Đến ngày</span>
              <input
                type="date"
                value={dates.end}
                onChange={(e) => setDates({ ...dates, end: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* --- Chọn định dạng --- */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-3">
            Định dạng tập tin
          </label>
          <div className="flex gap-3">
            {/* Nút PDF */}
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                format === "pdf"
                  ? "border-rose-500 bg-rose-50 text-rose-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              <FileText size={28} strokeWidth={1.5} />
              <span className="font-bold text-sm">Tài liệu PDF</span>
            </button>

            {/* Nút Excel */}
            <button
              type="button"
              onClick={() => setFormat("excel")}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                format === "excel"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm"
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              <FileSpreadsheet size={28} strokeWidth={1.5} />
              <span className="font-bold text-sm">Bảng tính Excel</span>
            </button>
          </div>
        </div>

        {/* --- Nút Tải xuống --- */}
        <div className="pt-4 border-t border-slate-100 mt-2">
          <button
            onClick={handleDownload}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
              loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/30 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang trích xuất dữ liệu...
              </>
            ) : (
              <>
                <Download size={20} />
                Tải báo cáo ngay
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}