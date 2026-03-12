import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import PendingApprovalsPage from "../pages/Admin/Hotels/PendingApprovalsPage";
import HotelSubmissionsPage from "../pages/Admin/Hotels/HotelSubmissionsPage";
import RefundManagementPage from "../pages/Admin/Transactions/RefundManagementPage"; 
import ActiveHotelsPage from "../pages/Admin/Hotels/ActiveHotelsPage";
import AuditLogsPage from "../pages/Admin/AuditLogs/AuditLogsPage";
import AdminNotificationsPage from "../pages/Admin/Notifications/AdminNotificationsPage"; // [IMPORT]


// 👇 (Mới từ nhánh của bạn) Import Component Quản lý Khuyến mãi
import PromotionManager from "../pages/Admin/Promotions/PromotionManager";

// 👇 (Mới) Import trang Quản lý Người dùng
import UserManagementPage from "../pages/Admin/Users/UserManagementPage";

// 👇 Import Component Quản lý Giao dịch (đảm bảo đường dẫn đúng với alias @ hoặc tương đối)
import TransactionManagementPage from "../pages/Admin/Transactions/TransactionManagementPage";
import RoleManagementPage from "../pages/Admin/Roles/RoleManagementPage";
import SystemSettingsPage from "../pages/Admin/Settings/SystemSettingsPage";

const adminRoutes = [
    {
        path: "/admin",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/roles",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN" isSuperRequired={true}>
                    <RoleManagementPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/settings",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN" isSuperRequired={true}>
                    <SystemSettingsPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/hotels/list", // Route mới theo yêu cầu của bạn
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <ActiveHotelsPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/approvals",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <PendingApprovalsPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/hotels/submissions",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <HotelSubmissionsPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    // 👇 ROUTE MỚI CHO QUẢN LÝ NGƯỜI DÙNG
    {
        path: "/admin/users",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <UserManagementPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/transactions",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <TransactionManagementPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/promotions",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <PromotionManager />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/refunds",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <RefundManagementPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },

    {
        path: "/admin/audit-logs",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <AuditLogsPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
    {
        path: "/admin/notifications",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <AdminNotificationsPage />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
];

export default adminRoutes;