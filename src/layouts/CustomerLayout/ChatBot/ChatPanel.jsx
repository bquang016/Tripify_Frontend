import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import HotelResultCard from "./HotelResultCard";
import { useAuth } from "@/context/AuthContext";

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const ChatPanel = ({ onClose, messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const isGuest = !currentUser;

  useEffect(() => {
    if (!isGuest) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isGuest]);

  return (
      <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{ transformOrigin: "bottom right" }}
          className="fixed bottom-24 right-6 bg-white w-[450px] max-w-[90vw] h-[600px] max-h-[80vh]
                 rounded-2xl shadow-2xl overflow-hidden z-[9999]
                 flex flex-col border border-gray-200/50"
      >
        {/* HEADER */}
        <ChatHeader onClose={onClose} />

        {/* BODY */}
        <div className="flex-1 p-4 overflow-y-auto text-sm bg-gray-50 custom-scrollbar">

          {/* =============================
            GUEST: HIỂN THỊ Ở ĐẦU KHUNG CHAT
        ============================= */}
          {isGuest && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-2 text-gray-600 text-sm shadow-sm max-w-[80%]">
                  Bạn cần đăng nhập để sử dụng tính năng trợ lý thông minh này
                </div>
              </div>
          )}

          {/* =============================
            USER ĐÃ LOGIN: CHAT BÌNH THƯỜNG
        ============================= */}
          {!isGuest && (
              <>
                {messages.map((msg) => {
                  if (msg.type === "hotel_list") {
                    return <HotelResultCard key={msg.id} data={msg.payload} />;
                  }
                  return <ChatMessage key={msg.id} message={msg} />;
                })}

                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                      <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-tl-none px-4 py-2 text-xs">
                        Đang soạn tin...
                      </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
              </>
          )}
        </div>

        {/* INPUT */}
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
      </motion.div>
  );
};

export default ChatPanel;
