// src/pages/Customer/About/MyInboxPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  CheckCircle2, XCircle, Bell, X, Search, 
  MoreVertical, Mail, Trash2,
  AlertTriangle, CreditCard, RefreshCw, Star 
} from 'lucide-react'; // Import thêm icon phù hợp
import inboxIllustration from '../../../assets/logo/inbox-illustration.png';
import { useNavigate } from 'react-router-dom';
import { authService } from "@/services/auth.service";
import notificationService from "@/services/notification.service"; 
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";

// [CẬP NHẬT] Mapping các Enum mới của Customer
const typeToVietnamese = {
  'GENERAL': 'Thông báo chung',
  'ACCOUNT_UPDATE': 'Tài khoản',
  'SECURITY_ALERT': 'Bảo mật',
  'BOOKING_SUCCESS': 'Đặt phòng thành công',
  'BOOKING_CANCELLED': 'Đã hủy phòng',
  'BOOKING_FAILED': 'Đặt phòng thất bại',
  'PAYMENT_SUCCESS': 'Thanh toán thành công',
  'REFUND_PROCESSED': 'Hoàn tiền',
  'PROMOTION': 'Khuyến mãi',
  'REMINDER_CHECKIN': 'Nhắc nhở',
  'APPROVAL': 'Đơn được duyệt',
  'REJECTION': 'Đơn bị từ chối'
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 0) return "Vừa xong";
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  return "Vài giây trước";
};

// [CẬP NHẬT] Icon tương ứng với từng loại thông báo
const getNotificationIcon = (type) => {
  switch (type) {
    case 'APPROVAL': 
    case 'BOOKING_SUCCESS':
    case 'PAYMENT_SUCCESS':
      return { icon: <CheckCircle2 size={18} />, class: "text-green-500" };
    
    case 'REJECTION': 
    case 'BOOKING_CANCELLED':
    case 'BOOKING_FAILED':
      return { icon: <XCircle size={18} />, class: "text-red-500" };
      
    case 'REFUND_PROCESSED':
      return { icon: <RefreshCw size={18} />, class: "text-purple-500" };

    case 'PROMOTION':
      return { icon: <Star size={18} />, class: "text-yellow-500" };

    case 'SECURITY_ALERT':
      return { icon: <AlertTriangle size={18} />, class: "text-orange-500" };

    default: return { icon: <Bell size={18} />, class: "text-blue-500" };
  }
};

const MyInboxPage = () => {
  const { currentUser, updateUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedNoti, setSelectedNoti] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isRefreshingRole, setIsRefreshingRole] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const activeFilterClass = "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6]";

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- 1. CALL API LẤY DANH SÁCH ---
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      try {
        // [QUAN TRỌNG] Thêm tham số 'CUSTOMER' vào hàm getNotifications
        const data = await notificationService.getNotifications(currentPage - 1, itemsPerPage, 'CUSTOMER');
        
        if (data && data.content) {
            setNotifications(data.content);
            setTotalPages(data.totalPages || 1);
        } else {
            setNotifications([]);
        }
      } catch (err) {
        console.error("Lỗi tải thông báo:", err);
        setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser, currentPage]); 

  // --- 2. XỬ LÝ ACTION ---

  const handleMarkAllAsRead = async () => {
    try {
      // [QUAN TRỌNG] Chỉ đánh dấu đã đọc cho Customer Scope
      await notificationService.markAllAsRead('CUSTOMER');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
      showToast("Đã đánh dấu tất cả là đã đọc", "success");
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật", "error");
    }
  };

  const handleMarkAsReadSingle = async (noti) => {
    const isRead = noti.isRead !== undefined ? noti.isRead : noti.read;
    if (isRead) return; 

    try {
        // Đánh dấu lẻ thì không cần scope, chỉ cần ID
        await notificationService.markAsRead(noti.id);
        setNotifications(prev => prev.map(n => 
            n.id === noti.id ? { ...n, isRead: true, read: true } : n
        ));
    } catch (error) {
        console.error("Lỗi đánh dấu đã đọc", error);
    }
  };

  const handleAccessOwnerChannel = async () => {
    setIsRefreshingRole(true);
    if (hasRole("OWNER")) {
      navigate("/owner");
      setIsRefreshingRole(false);
      return;
    }
    try {
      const res = await authService.getMe();
      if (res.data.success && res.data.data) {
        const backendUser = res.data.data;
        const newRoles = backendUser.authorities.map(a => a.authority.replace("ROLE_", ""));
        if (newRoles.includes("OWNER")) {
          const userForContext = {
            ...currentUser,
            userId: backendUser.userId,
            roles: newRoles,
          };
          updateUser(userForContext);
          navigate("/owner");
        } else {
          showToast("Đơn của bạn vẫn đang chờ hoặc chưa được duyệt.", "info");
        }
      }
    } catch (error) {
      showToast("Có lỗi xảy ra, vui lòng đăng nhập lại.", "error");
      logout();
    } finally {
      setIsRefreshingRole(false);
      setSelectedNoti(null);
    }
  };

  const promptDelete = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(null); 
    setNotificationToDelete(id); 
  };

  const handleDeleteConfirm = () => {
    if (!notificationToDelete) return;
    setNotifications(prev => prev.filter(n => n.id !== notificationToDelete));
    showToast("Đã ẩn thông báo", "success");
    setNotificationToDelete(null); 
  };

  const handleMenuToggle = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(prevId => (prevId === id ? null : id)); 
  };

  // --- 3. FILTER CLIENT-SIDE ---
  const filteredNotifications = notifications
    .filter(n => {
      const isRead = n.isRead !== undefined ? n.isRead : n.read;
      if (filter === 'UNREAD') return !isRead;
      if (filter === 'READ') return isRead;
      return true;
    })
    .filter(n => {
      const term = searchTerm.trim().toLowerCase(); 
      if (!term) return true;
      const title = (n.title || '').toLowerCase();
      const msg = (n.message || '').toLowerCase();
      const typeVN = (typeToVietnamese[n.type] || '').toLowerCase();
      
      return title.includes(term) || msg.includes(term) || typeVN.includes(term);
    });

  const renderContent = () => {
    if (loading) return <div className="p-16 text-center text-gray-500">Đang tải thông báo...</div>;
    if (error) return <div className="p-16 text-center text-red-600">{error}</div>;
    
    if (!loading && !error && notifications.length === 0) {
      return (
        <div className="p-8 md:p-16 flex flex-col items-center text-center animate-fadeIn">
          <img src={inboxIllustration} alt="Hộp thư trống" className="w-full max-w-xs h-auto mb-8" />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Hộp thư trống</h2>
          <p className="text-gray-500">Bạn chưa có thông báo nào.</p>
        </div>
      );
    }

    if (filteredNotifications.length === 0) {
        return <div className="p-16 text-center text-gray-500">Không tìm thấy thông báo nào trong trang này.</div>;
    }

    return (
      <>
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b gap-4">
          <button onClick={handleMarkAllAsRead} className="text-sm text-blue-600 hover:underline">
            Đánh dấu tất cả là đã đọc
          </button>
          <div className="relative w-full md:w-auto">
            <Search size={18} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm trong trang này..."
              value={currentSearchTerm} 
              onChange={(e) => setCurrentSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSearchTerm(e.target.value); }}
              className="border rounded px-2 py-1 text-sm w-full md:w-64 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-100" 
            />
          </div>
        </div>

        <ul className="divide-y divide-gray-200 animate-fadeIn">
          {filteredNotifications.map((noti) => {
            const iconInfo = getNotificationIcon(noti.type);
            const isRead = noti.isRead !== undefined ? noti.isRead : noti.read;

            return (
              <li
                key={noti.id}
                onClick={() => {
                  setSelectedNoti(noti);
                  setOpenMenuId(null); 
                  if (!isRead) handleMarkAsReadSingle(noti);
                }}
                className={`relative flex items-start gap-4 p-4 md:p-6 cursor-pointer transition-colors ${
                  !isRead ? 'bg-blue-50/60' : 'bg-white'
                } hover:bg-gray-50`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}>
                  {iconInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base ${!isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                    {noti.title}
                  </h3>
                  <p className={`text-sm mt-1 truncate ${!isRead ? 'text-gray-800' : 'text-gray-500'}`}>
                    {noti.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(noti.createdAt)}</p>
                </div>
                
                <div className="w-2.5 flex-shrink-0 mt-1.5 flex items-center justify-center">
                    {!isRead && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" title="Chưa đọc" />
                    )}
                </div>
                
                <div className="relative z-20 flex-shrink-0 ml-2">
                  <button
                    onClick={(e) => handleMenuToggle(e, noti.id)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === noti.id && (
                    <div 
                      className="absolute top-full right-0 mt-1 bg-white shadow-xl rounded-lg border w-48 py-1 z-30"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <button 
                        onClick={(e) => promptDelete(e, noti.id)} 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <Trash2 size={16} /> Ẩn thông báo
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t">
            <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                Trước
            </button>
            <span className="text-sm font-medium">Trang {currentPage} / {totalPages}</span>
            <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                Sau
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <ToastPortal>
        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </ToastPortal>

      {openMenuId && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}

      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col md:flex-row gap-8">
          
          <aside className="w-full md:w-64 bg-white shadow-lg rounded-lg p-6 h-fit flex-shrink-0 animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">Hộp thư</h2>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => { setFilter('ALL'); setSearchTerm(''); }} 
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium ${filter === 'ALL' ? activeFilterClass : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Bell size={18} /> Tất cả
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter('UNREAD')} 
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium ${filter === 'UNREAD' ? activeFilterClass : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ml-1 mr-0.5 ${filter === 'UNREAD' ? 'bg-white' : 'bg-blue-500'}`}></span> Chưa đọc
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter('READ')} 
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium ${filter === 'READ' ? activeFilterClass : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <CheckCircle2 size={18} /> Đã đọc
                  </button>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-600">
                * Bộ lọc và tìm kiếm hiện chỉ áp dụng trên danh sách hiển thị.
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Thông báo của tôi</h1>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {selectedNoti && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
                onClick={() => setSelectedNoti(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedNoti.type === 'REJECTION' || selectedNoti.type === 'BOOKING_CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                    {typeToVietnamese[selectedNoti.type] || 'Thông báo'}
                </span>
            </div>

            <h2 className="text-xl font-bold mb-3 text-gray-900">{selectedNoti.title}</h2>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
                <p className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">{selectedNoti.message}</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t mt-2">
                <p className="text-xs text-gray-400">
                    {new Date(selectedNoti.createdAt).toLocaleString('vi-VN')}
                </p>
            </div>

            {selectedNoti.type === 'APPROVAL' && (
              <div className="mt-6">
                <Button fullWidth onClick={handleAccessOwnerChannel} isLoading={isRefreshingRole} disabled={isRefreshingRole}>
                    {isRefreshingRole ? "Đang xử lý..." : "Truy cập Kênh Chủ nhà"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {notificationToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4" onClick={() => setNotificationToDelete(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Ẩn thông báo này?</h2>
              <p className="text-gray-500 mb-6 text-sm">Thông báo sẽ bị ẩn khỏi danh sách hiển thị tạm thời.</p>
              <div className="flex justify-center gap-3 w-full">
                <button 
                  onClick={() => setNotificationToDelete(null)} 
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Huỷ
                </button>
                <button 
                  onClick={handleDeleteConfirm} 
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                  Ẩn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyInboxPage;