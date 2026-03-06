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
            } catch (_) {}
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
            const res = await aiService.sendMessage(text);

            const action = res.data?.action;
            const responseText = res.data?.response;
            const payload = res.data?.payload;

            let cleanResponse = responseText;
            if (cleanResponse) {
                cleanResponse = cleanResponse.split("PAYLOAD:")[0].trim();
            }

            // ============================
            // CASE 1: Chat thường
            // ============================
            if (action === "ASKING" || action === "NORMAL_CHAT") {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        sender: "ai",
                        text: cleanResponse,
                        payload: payload || null,
                        timestamp: new Date(),
                    },
                ]);
            }

            // ============================
            // CASE 2: Search room
            // ============================
            if (action === "SEARCH_ROOM_RESULT") {
                // ❗ NO RESULT → trả text
                if (payload?.type === "NO_RESULT") {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + 2,
                            sender: "ai",
                            text: payload.message || cleanResponse,
                            payload,
                            timestamp: new Date(),
                        },
                    ]);
                }
                // ✅ CÓ RESULT → hiển thị list
                else {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + 2,
                            sender: "ai",
                            type: "hotel_list",
                            payload,
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
                    text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
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
