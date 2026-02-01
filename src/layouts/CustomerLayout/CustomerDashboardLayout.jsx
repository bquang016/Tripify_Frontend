// src/layouts/CustomerLayout/CustomerDashboardLayout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// ❌ Bỏ import Outlet vì chúng ta dùng children
// import { Outlet } from "react-router-dom";

// ✅ 1. Nhận prop 'children'
const CustomerDashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <Header />

            <div className="flex flex-grow pt-[80px]">
                {/* ❌ ĐÃ XÓA Sidebar Cấp 1 */}

                <main className="flex-1 p-0"> {/* p-0 để ProfilePage tự quản lý padding */}
                    {/* ✅ 2. Thay Outlet bằng children để hiển thị nội dung trang con */}
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default CustomerDashboardLayout;