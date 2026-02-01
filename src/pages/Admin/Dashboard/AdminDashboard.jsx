// File: src/pages/Admin/Dashboard/AdminDashboard.jsx
import React, { useCallback, useEffect, useState } from "react";
import adminService from "@/services/admin.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import BookingTrends from "./components/BookingTrends";
import UserGrowthChart from "./components/UserGrowthChart";
import RevenueOverview from "./components/RevenueOverview";
import TopHotels from "./components/TopHotels";
import RecentBookingsTable from "./components/RecentBookingsTable";
import DashboardFilterBar from "./components/DashboardFilterBar";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: "",
    city: "",
    ownerId: "",
    ownerLabel: "",
  });

  const fetchData = useCallback(async (customFilters) => {
    // chống spam call khi user bấm liên tục
    setLoading((prev) => {
      if (prev) return prev;
      return true;
    });

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

  // gọi lần đầu
  useEffect(() => {
    fetchData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // nhận filters từ DashboardFilterBar (nếu có) để tránh lệch state
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
    <div className="space-y-6 pb-10">
      <h2 className="text-2xl font-bold text-gray-800">Thống kê hệ thống</h2>

      <DashboardFilterBar
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilter}
        isLoading={loading}
      />

      {/* Loading nhẹ khi đang lọc lại dữ liệu mà không che toàn màn hình */}
      {loading && data && (
        <div className="text-center py-2 text-gray-600 font-medium">
          Đang cập nhật dữ liệu...
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
    </div>
  );
};

export default AdminDashboard;