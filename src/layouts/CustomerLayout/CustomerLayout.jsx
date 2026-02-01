// src/layouts/CustomerLayout/CustomerLayout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingChatBot from "./FloatingChatBot"; // Đảm bảo đã import

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative"> {/* Thêm relative nếu cần */}
      <Header />
      <main className="flex-grow bg-gray-50 pt-[64px]">
        {children}
      </main>
      <Footer />
      
      {/* ✅ Component Chatbot thả nổi */}
      <FloatingChatBot /> 
    </div>
  );
};

export default CustomerLayout;
