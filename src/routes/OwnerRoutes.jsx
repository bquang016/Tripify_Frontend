import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerDashboard from "../pages/Owner/Dashboard/OwnerDashboard";
import PropertyListPage from "@/pages/Owner/Properties/PropertyListPage";
import AddPropertyPage from "@/pages/Owner/Properties/AddPropertyPage";
import RoomManagementPage from "@/pages/Owner/Rooms/RoomManagementPage";
import RoomListPage from "@/pages/Owner/Rooms/RoomListPage";
import PlaceholderPage from "@/pages/Owner/PlaceholderPage";
import OwnerBookingsPage from "@/pages/Owner/Bookings/OwnerBookingsPage";
import OwnerPromotionManager from "@/pages/Owner/Promotions/OwnerPromotionManager";
// ✅ IMPORT TRANG THÔNG BÁO MỚI
import OwnerNotificationsPage from "@/pages/Owner/Notifications/OwnerNotificationsPage";

const ownerRoutes = [
    {
        path: "/owner",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <OwnerDashboard />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    // --- QUẢN LÝ TÀI SẢN ---
    {
        path: "/owner/properties",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <PropertyListPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    {
        path: "/owner/properties/new",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <AddPropertyPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },

    // --- QUẢN LÝ PHÒNG ---
    {
        path: "/owner/rooms",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <RoomListPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    {
        path: "/owner/rooms/:propertyId",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <RoomManagementPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },

    // --- QUẢN LÝ BOOKINGS ---
    {
        path: "/owner/bookings",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <OwnerBookingsPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    {
        path: "/owner/bookings/:propertyId",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <OwnerBookingsPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },

    // --- QUẢN LÝ KHUYẾN MÃI ---
    {
        path: "/owner/promotions",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <OwnerPromotionManager />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },

    // --- ✅ ROUTE MỚI: QUẢN LÝ THÔNG BÁO ---
    {
        path: "/owner/notifications",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <OwnerNotificationsPage />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },

    // --- CÁC TRANG KHÁC ---
    {
        path: "/owner/tasks",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <PlaceholderPage title="Quản lý Tác vụ" />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    {
        path: "/owner/reviews",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <PlaceholderPage title="Quản lý Đánh giá" />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    {
        path: "/owner/settings",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <PlaceholderPage title="Cài đặt Khách sạn" />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
    {
        path: "/owner/profile",
        element: (
            <OwnerLayout>
                <ProtectedRoute requiredRole="OWNER">
                    <PlaceholderPage title="Hồ sơ Chủ nhà" />
                </ProtectedRoute>
            </OwnerLayout>
        ),
    },
];

export default ownerRoutes;