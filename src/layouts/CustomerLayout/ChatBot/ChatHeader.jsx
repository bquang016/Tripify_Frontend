// src/layouts/CustomerLayout/ChatBot/ChatHeader.jsx
import React from "react";
// (Đã xóa import 'X')

// ✅ (Yêu cầu 2) Xóa prop 'onClose'
const ChatHeader = () => {
  return (
    // ✅ (Yêu cầu 2) Thay 'justify-between' bằng 'justify-center' để căn giữa tiêu đề
    <div className="bg-[rgb(40,169,224)] text-white p-4 font-semibold flex justify-center items-center shadow-sm flex-shrink-0">
      <span>AI Travel Assistant</span>
      
      {/* ✅ (Yêu cầu 2) Đã xóa nút 'X' */}
    </div>
  );
};

export default ChatHeader;