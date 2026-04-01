// src/layouts/CustomerLayout/ChatBot/ChatHeader.jsx
import React from "react";

const ChatHeader = ({ onClose, isExpanded, onToggleExpand }) => {
  return (
    <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[rgb(30,130,200)] text-white p-3 sm:p-4 flex justify-between items-center shadow-md flex-shrink-0 transition-all duration-300 rounded-t-2xl md:rounded-t-none">

      {/* Thông tin AI (Bên trái) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner  overflow-hidden">
          <img
            src="assets\logo\logo_tripify_xoafont.png"
            alt="AI Avatar"
            className="w-full h-full object-contain"
            onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png'}
          />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-bold text-base sm:text-lg leading-tight">Tripify AI</h3>
          <p className="text-xs text-blue-100 font-medium tracking-wide">Trợ lý du lịch thông minh</p>
        </div>
      </div>

      {/* Các nút hành động (Bên phải) */}
      <div className="flex items-center gap-1 sm:gap-2 text-white">
        {/* Nút Phóng to / Thu nhỏ */}
        <button
          onClick={onToggleExpand}
          className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
          title={isExpanded ? "Thu nhỏ" : "Mở rộng"}
        >
          {isExpanded ? (
            // Icon Thu nhỏ
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            // Icon Phóng to
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>

        {/* Nút Đóng (X) */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-400/80 rounded-full transition-all duration-200"
          title="Đóng chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;