console.warn("LOG BẮT BUỘC: File CustomerRoutes.jsx (bản mới nhất) ĐÃ CHẠY!");
import React from "react";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import CustomerDashboardLayout from "@/layouts/CustomerLayout/CustomerDashboardLayout";
import HomePage from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
import HelpPage from "@/pages/Customer/About/HelpPage";
import Contact from "@/pages/Customer/About/Contact";
import HotelSearchPage from "@/pages/Customer/HotelSearch/HotelSearchPage";
import HotelDetailPage from "@/pages/Customer/HotelDetail/HotelDetailPage";
import Refunds from "@/pages/Customer/Profile/Refunds";
import OAuth2RedirectHandler from "@/pages/Auth/OAuth2RedirectHandler";
import BookingPage from "@/pages/Customer/Booking/BookingPage";
import PaymentPage from "@/pages/Customer/Booking/PaymentPage";
import MyBookings from "@/pages/Customer/Profile/MyBookings";
import MyInboxPage from "@/pages/Customer/About/MyInboxPage";
import ProfilePage from "@/pages/Customer/Profile/ProfilePage";
import SettingsPage from "@/pages/Customer/Profile/SettingsPage";
import ChangePassword from "@/pages/Customer/Profile/ChangePassword";
import LanguageSettings from "@/pages/Customer/Profile/LanguageSettings";
import PartnerLandingPage from "@/pages/Partner/PartnerLandingPage";
import BecomeOwnerPage from "@/pages/Customer/Profile/BecomeOwnerPage";
import ExploreMapPage from "@/pages/Customer/Explore/ExploreMapPage";
import TransactionHistory from "@/pages/Customer/Profile/TransactionHistory/TransactionHistory";
import MembershipPage from "@/pages/Customer/Profile/MembershipPage";
import PromotionPage from "@/pages/Customer/Promotion/PromotionPage";
import PromotionDetailPage from "@/pages/Customer/Promotion/components/PromotionDetailModal.jsx";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PartnerRoute from "@/routes/PartnerRoute";
import CompleteProfile from "@/pages/Auth/CompleteProfile";


const customerRoutes = [
    {
    path: "/auth/complete-profile",
    element: <CompleteProfile />
    },
    {
        path: "/oauth2/redirect",
        element: <OAuth2RedirectHandler />
    },
    {
        path: "/",
        element: (
            <CustomerLayout>
                <HomePage />
            </CustomerLayout>
        ),
    },
    {
        path: "/about",
        element: (
            <CustomerLayout>
                <About />
            </CustomerLayout>
        ),
    },
    {
        path: "/help",
        element: (
            <CustomerLayout>
                <HelpPage />
            </CustomerLayout>
        ),
    },
    {
        path: "/contact",
        element: (
            <CustomerLayout>
                <Contact />
            </CustomerLayout>
        ),
    },
    {
        path: "/hotels",
        element: (
            <CustomerLayout>
                <HotelSearchPage />
            </CustomerLayout>
        ),
    },
    {
        path: "/hotels/:hotelId",
        element: (
            <CustomerLayout>
                <HotelDetailPage />
            </CustomerLayout>
        ),
    },

    // ✅ ROUTE KHUYẾN MÃI (PROMOTIONS)
    {
        path: "/promotions",
        element: (
            <CustomerLayout>
                <PromotionPage />
            </CustomerLayout>
        ),
    },
    {
        path: "/promotions/:id",
        element: (
            <CustomerLayout>
                <PromotionDetailPage />
            </CustomerLayout>
        ),
    },

    // ✅ ROUTE ĐẶT PHÒNG (Yêu cầu đăng nhập)
    {
        path: "/booking/:propertyId",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerLayout>
                    <BookingPage />
                </CustomerLayout>
            </ProtectedRoute>
        ),
    },

    // ✅ ROUTE THANH TOÁN (Yêu cầu đăng nhập)
    {
        path: "/booking/payment/:bookingId",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerLayout>
                    <PaymentPage />
                </CustomerLayout>
            </ProtectedRoute>
        ),
    },

    {
        path: "/partner-with-us",
        element: (
            <CustomerLayout>
                <PartnerLandingPage />
            </CustomerLayout>
        ),
    },
    {
        path: "/customer/profile",
        element: (
            <CustomerLayout>
                <ProtectedRoute roles={["CUSTOMER"]}>
                    <ProfilePage />
                </ProtectedRoute>
            </CustomerLayout>
        ),
    },
    {
        path: "/customer/profile/settings",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <SettingsPage />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/customer/profile/change-password",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <ChangePassword />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "explore",
        element: <ExploreMapPage />,
        title: "Khám phá trên bản đồ"
    },
    {
        path: "/customer/settings",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <SettingsPage />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/customer/profile/language",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <LanguageSettings />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

    // ✅ CẬP NHẬT: Dùng MyBookings Component
    {
        path: "/customer/bookings",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <MyBookings />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

    {
        path: "/customer/my-inbox",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <MyInboxPage />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

    {
        path: "/customer/transactions",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <TransactionHistory />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

    {
        path: "/partner/register",
        element: (
            <PartnerRoute>
                <BecomeOwnerPage />
            </PartnerRoute>
        ),
    },
    {
        path: "/customer/refunds",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <Refunds />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

    {
        path: "/customer/membership",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <MembershipPage />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

];

export default customerRoutes;