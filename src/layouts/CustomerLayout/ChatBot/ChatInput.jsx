import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ChatInput = ({ onSend, disabled }) => {
  const { currentUser } = useAuth();
  const isGuest = !currentUser;

  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ❌ Guest hoặc đang loading → không làm gì
    if (isGuest || disabled) return;

    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
      <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-gray-100 flex gap-2 items-center bg-white"
      >
        <input
            type="text"
            placeholder={
              isGuest
                  ? "Không thể nhập tin nhắn"
                  : "Nhập tin nhắn..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled || isGuest}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
                   transition-all outline-none
                   focus:ring-2 focus:ring-[rgb(40,169,224,0.5)]
                   focus:border-[rgb(40,169,224)]
                   disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        />

        <button
            type="submit"
            disabled={isGuest || disabled || !text.trim()}
            className={`flex-shrink-0 p-2 rounded-full transition-colors flex items-center justify-center
          ${
                isGuest || disabled || !text.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6]"
            }
        `}
        >
          <Send size={18} />
        </button>
      </form>
  );
};

export default ChatInput;
