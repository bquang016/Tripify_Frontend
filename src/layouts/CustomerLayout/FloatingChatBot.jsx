import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ChatFab from "./ChatBot/ChatFab";
import ChatPanel from "./ChatBot/ChatPanel";
import aiService from "@/services/ai.service";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "Tripify_chat_history";

const FloatingChatBot = () => {
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (_) { }
        }

        return [
            {
                id: 1,
                sender: "ai",
                text: "Xin chào! Tôi là trợ lý ảo Tripify. Tôi có thể giúp gì cho bạn hôm nay?",
                timestamp: new Date(),
            },
        ];
    });

    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setOpen((prev) => !prev);

    useEffect(() => {
        if (messages.length > 1) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        if (!currentUser) {
            localStorage.removeItem(STORAGE_KEY);
            setMessages([
                {
                    id: 1,
                    sender: "ai",
                    text: "Xin chào! Tôi là trợ lý ảo Tripify. Tôi có thể giúp gì cho bạn hôm nay?",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [currentUser]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        if (!currentUser) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "ai",
                    text: "Vui lòng đăng nhập để sử dụng tính năng Chatbot.",
                    timestamp: new Date(),
                },
            ]);
            return;
        }

        localStorage.removeItem(STORAGE_KEY);

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        setIsLoading(true);

        try {
            // 1. CHỈ CẦN GỌI TEXT (Bỏ cái userEmail đi)
            const res = await aiService.sendMessage(text);
            console.log("👉 DỮ LIỆU REACT NHẬN ĐƯỢC TỪ JAVA:", res);

            // 2. LẤY DỮ LIỆU SẠCH TỪ JAVA TRẢ VỀ (Không cần dùng split để cắt chữ PAYLOAD nữa)
            const action = res.data?.action;
            const cleanResponse = res.data?.response;
            const payload = res.data?.payload;

            // 3. PUSH CÂU CHỮ CỦA AI TRƯỚC (Dù là chat thường hay tìm phòng, AI vẫn phải nói chuyện)
            if (cleanResponse) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        sender: "ai",
                        text: cleanResponse,
                        timestamp: new Date(),
                    },
                ]);
            }

            // 4. PUSH THẺ KHÁCH SẠN (Nếu hành động là tìm phòng và có payload)
            if (action === "SEARCH_ROOM_RESULT" && payload) {
                if (payload.type === "NO_RESULT") {
                    // Nếu không có kết quả, không cần đẩy Card, AI đã nói ở text trên rồi
                } else {
                    // Đẩy Card Khách sạn xuống dưới câu nói của AI
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + 2,
                            sender: "ai",
                            type: "hotel_list",
                            payload: payload,
                            timestamp: new Date(),
                        },
                    ]);
                }
            }

        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "ai",
                    text: "Đã có lỗi xảy ra hoặc hết phiên đăng nhập. Vui lòng thử lại sau.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ChatFab open={open} onClick={toggleChat} />

            <AnimatePresence>
                {open && (
                    <ChatPanel
                        onClose={() => setOpen(false)}
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleSendMessage}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingChatBot;
