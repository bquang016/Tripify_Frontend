import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Download, FileText, FileSpreadsheet, Loader2, X, BarChart3 } from "lucide-react";
import { reportService } from "@/services/report.service";

export default function AdminExportReportModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("pdf"); 
  const [reportType, setReportType] = useState("MONTHLY"); 
  const [error, setError] = useState("");

  const currentDate = new Date();
  const [dailyRange, setDailyRange] = useState({ start: "", end: "" });
  const [yearlyData, setYearlyData] = useState(currentDate.getFullYear());

  // Với Admin, năm bắt đầu có thể set cố định từ khi hệ thống chạy (ví dụ 2023)
  const minYear = 2023; 
  const currentYear = currentDate.getFullYear();

  // Mảng dữ liệu cho Dropdown năm
  const yearsList = Array.from({ length: currentYear - minYear + 1 }, (_, i) => currentYear - i);

  // Xử lý khi nhấn Tải xuống
  const handleDownload = async () => {
    setError("");
    let finalStartDate = "";
    let finalEndDate = "";

    // Xử lý dữ liệu thời gian trước khi gửi xuống API
    if (reportType === "DAILY") {
      if (!dailyRange.start || !dailyRange.end) return setError("Vui lòng chọn đầy đủ ngày.");
      if (new Date(dailyRange.start) > new Date(dailyRange.end)) return setError("Ngày bắt đầu không hợp lệ.");
      finalStartDate = dailyRange.start;
      finalEndDate = dailyRange.end;
    } 
    else if (reportType === "MONTHLY") {
      finalStartDate = `${yearlyData}-01-01`;
      finalEndDate = `${yearlyData}-12-31`;
    } 
    else if (reportType === "YEARLY") {
      finalStartDate = `${minYear}-01-01`;
      finalEndDate = `${currentYear}-12-31`;
    }

    setLoading(true);
    try {
      // ✅ Đảm bảo bạn đã thêm hàm exportAdminRevenue vào report.service.js
      await reportService.exportAdminRevenue(finalStartDate, finalEndDate, format, reportType);
      onClose();
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Xuất Báo Cáo Doanh Thu Sàn" maxWidth="max-w-md">
      <div className="space-y-5 pt-4 animate-fade-in">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-start gap-2">
            <X size={16} className="mt-0.5 shrink-0" /><span>{error}</span>
          </div>
        )}

        {/* --- 1. CHỌN LOẠI BÁO CÁO --- */}
        <div>
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-blue-600" /> Chu kỳ báo cáo
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setReportType("DAILY")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportType === "DAILY" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>Theo Ngày</button>
            <button onClick={() => setReportType("MONTHLY")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportType === "MONTHLY" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>Theo Tháng</button>
            <button onClick={() => setReportType("YEARLY")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportType === "YEARLY" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>Theo Năm</button>
          </div>
        </div>

        {/* --- 2. GIAO DIỆN CHỌN THỜI GIAN ĐỘNG --- */}
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
          
          {/* A. THEO NGÀY */}
          {reportType === "DAILY" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 mb-1 block">Từ ngày</span>
                <input 
                  type="date" 
                  max={currentDate.toISOString().split('T')[0]} 
                  value={dailyRange.start} 
                  onChange={(e) => setDailyRange({ ...dailyRange, start: e.target.value })} 
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm" 
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 mb-1 block">Đến ngày</span>
                <input 
                  type="date" 
                  min={dailyRange.start} 
                  max={currentDate.toISOString().split('T')[0]} 
                  value={dailyRange.end} 
                  onChange={(e) => setDailyRange({ ...dailyRange, end: e.target.value })} 
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm" 
                />
              </div>
            </div>
          )}

          {/* B. THEO THÁNG */}
          {reportType === "MONTHLY" && (
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-1 block">
                Chọn Năm (Hệ thống sẽ thống kê doanh thu toàn sàn theo 12 tháng)
              </span>
              <select 
                value={yearlyData} 
                onChange={(e) => setYearlyData(parseInt(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm font-medium"
              >
                {yearsList.map(y => <option key={y} value={y}>Năm {y}</option>)}
              </select>
            </div>
          )}

          {/* C. THEO NĂM */}
          {reportType === "YEARLY" && (
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium text-center">
              Hệ thống sẽ thống kê tổng quan doanh thu qua tất cả các năm (Từ {minYear} đến {currentYear}).
            </div>
          )}
        </div>

        {/* --- 3. ĐỊNH DẠNG TẬP TIN --- */}
        <div className="flex gap-3">
          <button onClick={() => setFormat("pdf")} className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 ${format === "pdf" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-100 text-slate-400"}`}>
            <FileText size={24} /><span className="font-bold text-sm mt-1">PDF</span>
          </button>
          <button onClick={() => setFormat("excel")} className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 ${format === "excel" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-400"}`}>
            <FileSpreadsheet size={24} /><span className="font-bold text-sm mt-1">Excel</span>
          </button>
        </div>

        {/* Nút Submit */}
        <button onClick={handleDownload} disabled={loading} className={`w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 mt-2 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg active:scale-[0.98]"}`}>
          {loading ? <Loader2 className="animate-spin" /> : <Download size={20} />} {loading ? "Đang trích xuất..." : "Tải Báo Cáo Xuống"}
        </button>
      </div>
    </Modal>
  );
}