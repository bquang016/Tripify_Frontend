import React, { useCallback, useEffect, useState } from "react";
import adminService from "@/services/admin.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react"; // ✅ IMPORT ICON

import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import BookingTrends from "./components/BookingTrends";
import UserGrowthChart from "./components/UserGrowthChart";
import RevenueOverview from "./components/RevenueOverview";
import TopHotels from "./components/TopHotels";
import RecentBookingsTable from "./components/RecentBookingsTable";
import DashboardFilterBar from "./components/DashboardFilterBar";

// ✅ IMPORT MODAL XUẤT BÁO CÁO ADMIN
import AdminExportReportModal from "./components/AdminExportReportModal";

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // ✅ THÊM STATE QUẢN LÝ MODAL BÁO CÁO
  const [showExportModal, setShowExportModal] = useState(false);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: "",
    city: "",
    ownerId: "",
    ownerLabel: "",
  });

  const fetchData = useCallback(async (customFilters) => {
    setLoading(true);
    const payload = customFilters ?? filters;
    try {
      const res = await adminService.getDashboardStats(payload);
      if (res?.data) setData(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData(filters);
  }, [fetchData]);

  const handleApplyFilter = useCallback(
    (filtersFromChild) => {
      if (loading) return;
      fetchData(filtersFromChild ?? filters);
    },
    [fetchData, filters, loading]
  );

  if (loading && !data) return <LoadingOverlay isLoading={true} />;

  const hasData = data !== null;

  return (
    <div className="space-y-6 pb-10 fade-in-up">
      
      {/* ✅ HEADER & NÚT XUẤT BÁO CÁO (Giao diện thẻ Card xịn xò) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {i18n.language === 'vi' ? 'Tổng quan Hệ thống' : 'System Overview'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {i18n.language === 'vi' 
              ? 'Theo dõi hoạt động kinh doanh và doanh thu toàn sàn.' 
              : 'Monitor platform business activity and revenue.'}
          </p>
        </div>
        
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
        >
          <Download size={18} />
          {i18n.language === 'vi' ? 'Xuất báo cáo' : 'Export Report'}
        </button>
      </div>

      <DashboardFilterBar
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilter}
        isLoading={loading}
      />

      {loading && data && (
        <div className="text-center py-2 text-gray-600 font-medium">
          {i18n.language === 'vi' ? 'Đang cập nhật dữ liệu...' : 'Updating data...'}
        </div>
      )}

      <StatCards stats={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{hasData && <RevenueChart data={data?.revenueChart} />}</div>
        <div className="lg:col-span-1">
          <TopHotels hotels={data?.topHotels} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasData && <BookingTrends data={data?.bookingTrends} />}
        {hasData && <UserGrowthChart data={data?.userGrowth} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">{hasData && <RevenueOverview data={data?.revenueByType} />}</div>
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={data?.recentBookings} />
        </div>
      </div>

      {/* ✅ GỌI MODAL XUẤT BÁO CÁO ADMIN */}
      <AdminExportReportModal 
        open={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
};

export default AdminDashboard;