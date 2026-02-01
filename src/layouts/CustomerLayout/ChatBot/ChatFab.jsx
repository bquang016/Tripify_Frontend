import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
 
const ChatFab = ({ open, onClick }) => {
  // 1. Thêm state để kiểm tra trạng thái hover
  const [isHovered, setIsHovered] = useState(false);
 
  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4"
      // 2. Bắt sự kiện di chuột vào/ra
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- BONG BÓNG HỘI THOẠI (Chỉ hiện khi HOVER và Chat chưa mở) --- */}
      <AnimatePresence>
        {!open && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            // Bỏ delay để phản hồi ngay lập tức khi hover
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-xl border border-gray-100 relative hidden md:block whitespace-nowrap"
          >
            <div className="text-sm font-semibold flex items-center gap-2">
              <span>Chat với trợ lý AI !</span>
              <span className="text-lg"></span>
            </div>
            {/* Mũi tên trỏ vào nút chat */}
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-r border-t border-gray-100"></div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* --- NÚT CHAT CHÍNH --- */}
      <motion.button
        onClick={onClick}
        className={`rounded-full p-4 shadow-lg transition-all duration-300 relative
          ${open
            ? "bg-red-500 text-white hover:bg-red-600 rotate-0"
            : "bg-gradient-to-r from-[#28A9E0] to-[#1b98d6] text-white"
          }`}
        aria-label={open ? "Đóng chat" : "Mở chat"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bot size={28} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
 
export default ChatFab;

