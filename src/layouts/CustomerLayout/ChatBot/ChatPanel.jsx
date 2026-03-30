// src/layouts/CustomerLayout/ChatBot/ChatPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import HotelResultCard from "./HotelResultCard";
import { useAuth } from "@/context/AuthContext";

const ChatPanel = ({ onClose, messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const isGuest = !currentUser;

  // State quản lý phóng to / thu nhỏ nội bộ trong Panel
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isGuest) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isGuest]);

  // CHUYỂN ĐỔI CSS DỰA VÀO TRẠNG THÁI isExpanded
  // 💡 SỬA LỖI BO GÓC: Thêm "overflow-hidden" vào cả 2 trường hợp phóng to và thu nhỏ
  const panelClasses = isExpanded
    ? "fixed inset-0 md:inset-6 z-[9999] bg-white md:rounded-3xl shadow-2xl flex flex-col border border-gray-200/50 overflow-hidden transition-all duration-300 ease-in-out"
    : "fixed bottom-24 right-4 sm:right-6 w-[400px] max-w-[92vw] h-[600px] max-h-[80vh] z-[9999] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200/50 overflow-hidden transition-all duration-300 ease-in-out";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ transformOrigin: "bottom right" }}
      className={panelClasses}
    >
      {/* HEADER */}
      <ChatHeader
        onClose={onClose}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {/* BODY */}
      <div className="flex-1 p-4 overflow-y-auto text-sm bg-[#f4f7f9] custom-scrollbar">
        {/* Dành cho tài khoản chưa Login */}
        {isGuest && (
          <div className="flex justify-center mb-6 mt-4">
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 text-gray-600 text-sm shadow-sm text-center max-w-[85%]">
              Vui lòng <span className="font-semibold text-blue-500">Đăng nhập</span> để bắt đầu trò chuyện cùng Tripify AI nhé!
            </div>
          </div>
        )}

        {/* Dành cho tài khoản đã Login */}
        {!isGuest && (
          <div className={`mx-auto ${isExpanded ? "max-w-5xl" : "w-full"}`}>
            {messages.map((msg) => {
              if (msg.type === "hotel_list") {
                return <HotelResultCard key={msg.id} data={msg.payload} />;
              }
              return <ChatMessage key={msg.id} message={msg} />;
            })}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className={`bg-white border-t border-gray-100 ${isExpanded ? "p-2 sm:p-4" : ""}`}>
        <div className={`mx-auto ${isExpanded ? "max-w-5xl" : "w-full"}`}>
          <ChatInput onSend={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPanel;