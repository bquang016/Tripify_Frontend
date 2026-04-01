import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// IMPORT ROUTE ARRAYS
import customerRoutes from "./CustomerRoutes";
import adminRoutes from "./AdminRoutes";
import ownerRoutes from "./OwnerRoutes";

// AUTH SCREENS
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import OAuth2RedirectHandler from "@/pages/Auth/OAuth2RedirectHandler";
import CompleteProfile from "@/pages/Auth/CompleteProfile";

// DEV PREVIEW
import ComponentsPreview from "@/pages/ComponentsPreview";

// POLICY PAGES
import TermsOfService from "@/pages/Owner/TermsOfService/TermsOfService";
import PartnerPolicy from "@/pages/Owner/TermsOfService/PartnerPolicy";

import OwnerRegisterPage from "@/pages/Partner/OwnerRegisterPage";
import OwnerOnboardingStep1 from "@/pages/Partner/OwnerOnboardingStep1";
import OwnerOnboardingStep2 from '@/pages/Partner/OwnerOnboardingStep2';
import OwnerOnboardingStep3 from '@/pages/Partner/OwnerOnboardingStep3';
import OwnerOnboardingStep4 from '@/pages/Partner/OwnerOnboardingStep4';

// VNPAY RETURN HANDLER
import VNPayReturnPage from '@/pages/Customer/Booking/VNPayReturnPage';

// ERROR PAGES
import Forbidden from "@/pages/Error/Forbidden";

// ✅ 1. Import Component xử lý khóa tài khoản
import SessionExpiredHandler from "@/pages/Admin/Users/components/SessionExpiredHandler";
const AppRoutes = () => {
    return (
        // ✅ 2. Dùng thẻ Fragment để bọc SessionExpiredHandler và Routes
        <>
            {/* Component này sẽ lắng nghe sự kiện auth:account-locked toàn cục */}
            <SessionExpiredHandler />

            <Routes>
                {/* ... existing routes ... */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />

                {/* =========================================================
                    DEV TOOLS & POLICY
                ========================================================= */}
                <Route path="/components" element={<ComponentsPreview />} />
                <Route path="/owner/terms-of-service" element={<TermsOfService />} />
                <Route path="/owner/partner-policy" element={<PartnerPolicy />} />

                {/* =========================================================
                    CUSTOMER ROUTES
                ========================================================= */}
                <Route path="/partner/register" element={<OwnerRegisterPage />} />
                <Route path="/partner/onboarding/step-1" element={<OwnerOnboardingStep1 />} />
                <Route path="/partner/onboarding/step-2" element={<OwnerOnboardingStep2 />} />
                <Route path="/partner/onboarding/step-3" element={<OwnerOnboardingStep3 />} />
                <Route path="/partner/onboarding/step-4" element={<OwnerOnboardingStep4 />} />
                <Route path="/payment/vnpay-return" element={<VNPayReturnPage />} />
                {customerRoutes.map((route, index) => (
                    <Route
                        key={`customer-${index}`}
                        path={route.path}
                        element={route.element}
                    />
                ))}

                {/* =========================================================
                    ADMIN ROUTES
                ========================================================= */}
                {adminRoutes.map((route, index) => (
                    <Route
                        key={`admin-${index}`}
                        path={route.path}
                        element={route.element}
                    />
                ))}

                {/* =========================================================
                    OWNER ROUTES
                ========================================================= */}
                {ownerRoutes.map((route, index) => (
                    <Route
                        key={`owner-${index}`}
                        path={route.path}
                        element={route.element}
                    />
                ))}

                {/* =========================================================
                    ERROR ROUTES
                ========================================================= */}
                <Route path="/403" element={<Forbidden />} />

                {/* =========================================================
                    FALLBACK (404)
                ========================================================= */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;