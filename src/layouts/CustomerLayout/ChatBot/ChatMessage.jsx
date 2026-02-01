import React from "react";
import { Bot } from "lucide-react";
import AIPayloadCard from "./AIPayloadCard";

// Icon bullet
const BulletIcon = () => (
    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2 mt-[0.4rem] shrink-0"></span>
);

// Format text
const formatMessage = (text, isBot) => {
    if (!text) return null;

    const lines = text.split("\n");

    return (
        <div className="space-y-1">
            {lines.map((line, index) => {
                const trimmed = line.trim();

                // Tiêu đề
                if (trimmed.endsWith(":") && !trimmed.startsWith("-")) {
                    return (
                        <div
                            key={index}
                            className="mt-2 mb-1 font-semibold text-gray-900 text-[0.95rem]"
                        >
                            {trimmed}
                        </div>
                    );
                }

                // Bullet
                if (trimmed.startsWith("- ")) {
                    return (
                        <div key={index} className="flex items-start ml-3 text-gray-800">
                            <BulletIcon />
                            <span>{trimmed.replace("- ", "")}</span>
                        </div>
                    );
                }

                // Dòng bình thường
                return (
                    <p key={index} className={`${isBot ? "text-gray-800" : "text-white"}`}>
                        {trimmed}
                    </p>
                );
            })}
        </div>
    );
};

const ChatMessage = ({ message }) => {
    const { text, sender, payload } = message;
    const isBot = sender === "ai" || sender === "bot";

    // ✅ FALLBACK: nếu BE không trả text thì dùng payload.message
    const displayText = text || payload?.message;

    // Không có gì để hiển thị thì bỏ qua
    if (!displayText && !payload) return null;

    return (
        <div className={`flex w-full ${isBot ? "justify-start" : "justify-end"} mb-4`}>
            {/* Bot avatar */}
            {isBot && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white mr-2 shadow-sm shrink-0 mt-1">
                    <Bot size={16} />
                </div>
            )}

            {/* Bubble */}
            <div
                className={`p-3 rounded-2xl max-w-[75%] break-words shadow-sm text-sm leading-relaxed
                ${
                    isBot
                        ? "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-md"
                        : "bg-[#28A9E0] text-white rounded-tr-none shadow-md"
                }`}
            >
                {/* Nội dung text */}
                {formatMessage(displayText, isBot)}

                {/* ========== PAYLOAD ========== */}
                {isBot && payload && (
                    <AIPayloadCard payload={payload} />
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
