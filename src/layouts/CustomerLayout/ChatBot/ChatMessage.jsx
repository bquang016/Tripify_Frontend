import React from "react";
import { Bot } from "lucide-react";
import AIPayloadCard from "./AIPayloadCard";
import ReactMarkdown from "react-markdown";

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
                className={`p-3 rounded-2xl max-w-[85%] break-words shadow-sm text-sm leading-relaxed
                ${isBot
                        ? "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-md"
                        : "bg-[#28A9E0] text-white rounded-tr-none shadow-md"
                    }`}
            >
                {/* Nội dung text xử lý bằng React Markdown */}
                {displayText && (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown
                            components={{
                                // Custom thẻ a (Link)
                                a: ({ node, ...props }) => (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors duration-200"
                                    />
                                ),
                                // Custom thẻ strong (In đậm)
                                strong: ({ node, ...props }) => (
                                    <strong {...props} className="font-bold text-gray-900" />
                                ),
                                // Custom thẻ ul (Danh sách không thứ tự)
                                ul: ({ node, ...props }) => (
                                    <ul {...props} className="list-disc pl-5 space-y-1" />
                                ),
                                // Custom thẻ ol (Danh sách có thứ tự)
                                ol: ({ node, ...props }) => (
                                    <ol {...props} className="list-decimal pl-5 space-y-1" />
                                ),
                                // Custom thẻ p (Đoạn văn) để màu chữ cho bot và user chuẩn
                                p: ({ node, ...props }) => (
                                    <p {...props} className={`${isBot ? "text-gray-800" : "text-white"} mb-2 last:mb-0`} />
                                ),
                            }}
                        >
                            {displayText}
                        </ReactMarkdown>
                    </div>
                )}

                {/* ========== PAYLOAD ========== */}
                {isBot && payload && (
                    <div className="mt-3">
                        <AIPayloadCard payload={payload} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
