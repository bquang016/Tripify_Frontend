// src/layouts/CustomerLayout/CustomerNotificationDropdown.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Bell, CheckCheck, Clock, Info, CheckCircle2, XCircle,
    Gift, AlertTriangle, RefreshCw
} from "lucide-react";
import notificationService from "@/services/notification.service";

const CustomerNotificationDropdown = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // --- 1. Gọi API lấy dữ liệu (Scope: CUSTOMER) ---
    const fetchNotifications = async () => {
        if (notifications.length === 0) setLoading(true);
        try {
            // [QUAN TRỌNG] Scope là CUSTOMER
            const data = await notificationService.getNotifications(0, 5, 'CUSTOMER');
            if (data) {
                setNotifications(data.content || []);
                // Tính số lượng chưa đọc từ danh sách hoặc dùng API riêng nếu có
                const count = data.unreadCount !== undefined
                    ? data.unreadCount
                    : (data.content || []).filter(n => !n.read && !n.isRead).length;
                setUnreadCount(count);
            }
        } catch (error) {
            console.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Polling: Tự động cập nhật mỗi 60s ---
    useEffect(() => {
        fetchNotifications();

        // Gọi thêm API đếm số lượng chính xác (nếu backend hỗ trợ)
        const fetchCount = async () => {
            try {
                const count = await notificationService.getUnreadCount('CUSTOMER');
                setUnreadCount(count);
            } catch (e) { }
        };
        fetchCount();

        const interval = setInterval(() => {
            fetchNotifications();
            fetchCount();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- 3. Hành động ---
    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));
        await notificationService.markAllAsRead('CUSTOMER');
        setTimeout(fetchNotifications, 500);
    };

    const handleNotificationClick = async (notification) => {
        const isRead = notification.read || notification.isRead;
        if (!isRead) {
            await notificationService.markAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, read: true, isRead: true } : n)
            );
        }
        // Điều hướng nếu cần (Ví dụ click vào booking -> trang chi tiết)
        // setOpen(false);
    };

    // --- 4. Helper hiển thị ---
    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING_SUCCESS':
            case 'PAYMENT_SUCCESS':
            case 'APPROVAL':
                return <CheckCircle2 size={18} className="text-green-500" />;

            case 'BOOKING_CANCELLED':
            case 'BOOKING_FAILED':
            case 'REJECTION':
                return <XCircle size={18} className="text-red-500" />;

            case 'REFUND_PROCESSED':
                return <RefreshCw size={18} className="text-purple-500" />;

            case 'PROMOTION':
                return <Gift size={18} className="text-pink-500" />;

            case 'SECURITY_ALERT':
                return <AlertTriangle size={18} className="text-orange-500" />;

            default: return <Info size={18} className="text-blue-500" />;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);

        if (diffInMinutes < 1) return "Vừa xong";
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => {
                    setOpen(!open);
                    if (!open) fetchNotifications();
                }}
                className={`
    notification-trigger
    relative p-2 rounded-full
    transition-all duration-200
    focus:outline-none

    /* default */
    text-current

    /* hover */
    hover:bg-[rgba(40,169,224,0.12)]
    hover:text-[rgb(40,169,224)]

    /* active (click) */
    active:scale-95

    /* open state */
    ${open ? "bg-[rgba(40,169,224,0.18)] text-[rgb(40,169,224)] shadow-sm" : ""}
  `}
            >
                <Bell size={24} strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                )}
            </button>

            {/* Dropdown Content */}
            {open && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                        <h3 className="font-bold text-gray-800 text-sm">Thông báo của bạn</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-[rgb(40,169,224)] hover:text-blue-700 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                                <CheckCheck size={14} />
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-gray-50/30">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <div className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-[rgb(40,169,224)] rounded-full mb-2"></div>
                                <p className="text-xs">Đang tải...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((item) => {
                                    const isRead = item.read || item.isRead;
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleNotificationClick(item)}
                                            className={`flex gap-3 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors relative group
                                                ${!isRead ? 'bg-white' : 'bg-gray-50/50 opacity-80'}
                                            `}
                                        >
                                            <div className="flex-shrink-0 pt-0.5">
                                                <div
                                                    className={[
                                                        "w-10 h-10 rounded-full grid place-items-center", // FIX: size cố định + căn giữa
                                                        !isRead
                                                            ? "bg-white shadow-sm border border-gray-100"
                                                            : "bg-transparent",
                                                    ].join(" ")}
                                                >
                                                    <span className="inline-flex items-center justify-center w-5 h-5">
                                                        {getIcon(item.type)}
                                                    </span>
                                                </div>
                                            </div>


                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-snug mb-1 ${!isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                    {item.message}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 font-medium">
                                                    <Clock size={10} />
                                                    <span>{formatTime(item.createdAt)}</span>
                                                </div>
                                            </div>

                                            {!isRead && (
                                                <div className="flex-shrink-0 self-center">
                                                    <div className="w-2 h-2 bg-[rgb(40,169,224)] rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">
                                    <Bell size={24} />
                                </div>
                                <p className="text-gray-800 font-medium text-sm">Chưa có thông báo</p>
                                <p className="text-gray-500 text-xs mt-1 max-w-[200px]">Cập nhật về đặt phòng và khuyến mãi sẽ hiện ở đây.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-1 bg-gray-50">
                        <Link
                            to="/customer/my-inbox"
                            onClick={() => setOpen(false)}
                            className="block w-full py-2 text-center text-xs font-semibold text-gray-600 hover:text-[rgb(40,169,224)] hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
                        >
                            Xem tất cả trong Hộp thư
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerNotificationDropdown;