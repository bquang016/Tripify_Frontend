import React, { useEffect, useState } from "react";
import ownerService from "@/services/owner.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

import HotelStatCards from "./components/HotelStatCards";
import HotelRevenueChart from "./components/HotelRevenueChart";
import RecentReviewsWidget from "./components/RecentReviewsWidget";
import DailyActivityFeed from "./components/DailyActivityFeed";

const OwnerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

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
        </div>
    );
};

export default OwnerDashboard;