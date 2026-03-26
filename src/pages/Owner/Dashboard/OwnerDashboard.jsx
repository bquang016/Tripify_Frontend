import React, { useEffect, useState } from "react";
import ownerService from "@/services/owner.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import { Download } from "lucide-react"; // ✅ IMPORT THÊM ICON

import HotelStatCards from "./components/HotelStatCards";
import HotelRevenueChart from "./components/HotelRevenueChart";
import RecentReviewsWidget from "./components/RecentReviewsWidget";
import DailyActivityFeed from "./components/DailyActivityFeed";

// ✅ IMPORT MODAL (Đảm bảo bạn đã tạo file này ở đúng đường dẫn)
import ExportReportModal from "@/pages/Owner/Reports/ExportReportModal"; 

const OwnerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    // ✅ THÊM STATE QUẢN LÝ MODAL BÁO CÁO
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ownerService.getDashboardStats();
                if (res && (res.result || res.data)) {
                    setData(res.result || res.data);
                }
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingOverlay isLoading={true} />;

    // ✅ FIX LỖI WIDTH(-1): Chỉ render biểu đồ khi ĐÃ CÓ DATA
    const hasData = data !== null;

    return (
        <div className="space-y-6 pb-10 fade-in-up">
            
            {/* ✅ THÊM HEADER & NÚT XUẤT BÁO CÁO VÀO ĐÂY */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Tổng quan Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Theo dõi hoạt động kinh doanh và doanh thu của bạn.</p>
                </div>
                
                <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
                >
                    <Download size={18} />
                    Xuất báo cáo
                </button>
            </div>

            {/* 1. Thẻ thống kê */}
            <HotelStatCards stats={data} />

            {/* 2. Hàng giữa: Biểu đồ (2/3) + Feed hoạt động (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-h-[350px]"> 
                    {/* min-h để giữ chỗ tránh layout shift */}
                    {hasData && <HotelRevenueChart data={data?.revenueChart} />}
                </div>
                <div className="lg:col-span-1">
                    <DailyActivityFeed bookings={data?.recentBookings} />
                </div>
            </div>

            {/* 3. ✅ SỬA: Đánh giá gần đây - FULL WIDTH */}
            {/* Không đặt trong grid col-span-1 nữa, để nó tự nhiên chiếm 100% */}
            <div className="w-full">
                <RecentReviewsWidget reviews={data?.recentReviews} />
            </div>

            {/* ✅ GỌI MODAL XUẤT BÁO CÁO (Nó sẽ ẩn cho đến khi showExportModal = true) */}
            <ExportReportModal 
                open={showExportModal} 
                onClose={() => setShowExportModal(false)} 
            />
        </div>
    );
};

export default OwnerDashboard;
