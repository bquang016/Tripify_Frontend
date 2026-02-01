import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Bell, 
    CheckCheck, 
    Clock, 
    Info, 
    AlertTriangle, 
    CheckCircle, 
    XCircle,
    FileText,
    DollarSign,
    UserPlus,
    Home
} from "lucide-react";
import notificationService from "../../services/notification.service";
import moment from "moment";
import "moment/locale/vi"; // Import tiếng Việt cho moment

const AdminNotificationDropdown = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // --- 1. Gọi API lấy dữ liệu (Scope: ADMIN) ---
    const fetchNotifications = async () => {
        // Chỉ hiện loading lần đầu nếu chưa có dữ liệu để tránh flicker khi polling
        if (notifications.length === 0) setLoading(true);
        
        try {
            // [QUAN TRỌNG] Thêm tham số 'ADMIN' vào đây
            const data = await notificationService.getNotifications(0, 5, 'ADMIN'); 
            
            // Backend trả về map: { content: [], unreadCount: ... }
            if (data) {
                setNotifications(data.content || []);
                // Cập nhật số lượng chưa đọc từ data nếu có
                // Nếu API trả về unreadCount thì dùng, không thì tính thủ công từ list (tạm thời)
                setUnreadCount(data.unreadCount !== undefined ? data.unreadCount : (data.content || []).filter(n => !n.read && !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to load admin notifications");
        } finally {
            setLoading(false);
        }
        
    };

    // --- 2. Polling: Tự động cập nhật mỗi 60s ---
    useEffect(() => {
        fetchNotifications();
        // Cập nhật số lượng chưa đọc riêng biệt để icon chuông luôn đúng
        const fetchCount = async () => {
            try {
                const count = await notificationService.getUnreadCount('ADMIN');
                setUnreadCount(count);
            } catch (e) {}
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

    // --- 3. Xử lý hành động ---
    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        
        // Cập nhật UI trước cho mượt (Optimistic UI)
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));

        // [QUAN TRỌNG] Gọi API với scope ADMIN
        await notificationService.markAllAsRead('ADMIN');
        
        // Refresh lại dữ liệu thật từ server
        setTimeout(fetchNotifications, 500); 
    };

    const handleNotificationClick = async (notification) => {
        // 1. Đánh dấu đã đọc
        const isRead = notification.read || notification.isRead;
        if (!isRead) {
            await notificationService.markAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => 
                prev.map(n => n.id === notification.id ? { ...n, read: true, isRead: true } : n)
            );
        }

        // 2. Điều hướng dựa trên loại thông báo
        setOpen(false);
        const entityId = notification.relatedEntityId;

        switch (notification.type) {
            case "ADMIN_NEW_OWNER_REGISTRATION":
                // Điều hướng đến trang danh sách owner pending hoặc chi tiết owner
                // Ví dụ: /admin/users?role=OWNER&status=PENDING
                navigate(`/admin/users`); 
                break;
            case "ADMIN_NEW_PROPERTY_SUBMISSION":
                // Điều hướng đến trang duyệt khách sạn
                navigate(`/admin/hotels/pending`); 
                break;
            case "ADMIN_NEW_REFUND_REQUEST":
                // Điều hướng đến trang quản lý hoàn tiền
                navigate(`/admin/transactions/refunds`); 
                break;
            default:
                navigate("/admin/dashboard");
        }
    };

    // --- 4. Helper hiển thị ---
    const getIcon = (type) => {
        switch (type) {
            case 'ADMIN_NEW_OWNER_REGISTRATION': 
                return <UserPlus size={18} className="text-purple-600" />;
            case 'ADMIN_NEW_PROPERTY_SUBMISSION': 
                return <Home size={18} className="text-blue-600" />;
            case 'ADMIN_NEW_REFUND_REQUEST': 
                return <DollarSign size={18} className="text-red-600" />;
            case 'SUCCESS': return <CheckCircle size={18} className="text-green-500" />;
            case 'ERROR': return <XCircle size={18} className="text-red-500" />;
            case 'WARNING': return <AlertTriangle size={18} className="text-orange-500" />;
            default: return <Bell size={18} className="text-gray-500" />;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        return moment(dateString).fromNow();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button 
                onClick={() => {
                    setOpen(!open);
                    if (!open) fetchNotifications(); // Refresh khi mở
                }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600 focus:outline-none"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-white animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Content */}
            {open && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">
                    
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                        <h3 className="font-bold text-gray-800">Thông báo quản trị</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
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
                                <div className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-blue-500 rounded-full mb-2"></div>
                                <p className="text-xs">Đang tải...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((item) => {
                                    // Kiểm tra cả 2 trường hợp tên field JSON
                                    const isRead = item.read || item.isRead; 
                                    return (
                                        <div 
                                            key={item.id}
                                            onClick={() => handleNotificationClick(item)}
                                            className={`flex gap-3 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors relative group
                                                ${!isRead ? 'bg-white' : 'bg-gray-50/50 opacity-80'}
                                            `}
                                        >
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className={`p-2 rounded-full ${!isRead ? 'bg-white shadow-sm border border-gray-100' : 'bg-transparent'}`}>
                                                    {getIcon(item.type)}
                                                </div>
                                            </div>

                                            {/* Content */}
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

                                            {/* Unread Indicator */}
                                            {!isRead && (
                                                <div className="flex-shrink-0 self-center">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                                <p className="text-gray-800 font-medium text-sm">Không có thông báo mới</p>
                                <p className="text-gray-500 text-xs mt-1 max-w-[200px]">Các thông báo cần duyệt sẽ xuất hiện ở đây.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-1 bg-gray-50">
                        <Link 
                            to="/admin/notifications" 
                            onClick={() => setOpen(false)}
                            className="block w-full py-2 text-center text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
                        >
                            Xem tất cả thông báo
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificationDropdown;