import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  CheckCircle2, Bell, Search, 
  MoreHorizontal, Trash2, CalendarCheck, 
  DollarSign, AlertTriangle, Briefcase, Filter, Check,
  X, ExternalLink, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from "@/services/notification.service"; 
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { useTranslation } from "react-i18next";

const OwnerNotificationsPage = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const typeToName = {
    'BOOKING_RECEIVED': isVi ? 'Đơn đặt phòng mới' : 'New Booking',
    'BOOKING_CANCELLED_BY_GUEST': isVi ? 'Khách hủy phòng' : 'Booking Cancelled',
    'REVENUE_REPORT': isVi ? 'Báo cáo doanh thu' : 'Revenue Report',
    'PROPERTY_SUSPENDED': isVi ? 'Cảnh báo tài sản' : 'Property Warning',
    'PAYOUT_SUCCESS': isVi ? 'Tiền về ví' : 'Payout Success',
    'GENERAL': isVi ? 'Thông báo hệ thống' : 'System Notification',
    'APPROVAL': isVi ? 'Tin được duyệt' : 'Approved',
    'REJECTION': isVi ? 'Tin bị từ chối' : 'Rejected'
  };

  const formatFullDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(isVi ? 'vi-VN' : 'en-US', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(isVi ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateGroup = (dateString) => {
    if (!dateString) return isVi ? "Khác" : "Other";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return isVi ? "Hôm nay" : "Today";
    if (date.toDateString() === yesterday.toDateString()) return isVi ? "Hôm qua" : "Yesterday";
    return date.toLocaleDateString(isVi ? 'vi-VN' : 'en-US', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); 
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedNoti, setSelectedNoti] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const brandButtonClass = "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6] shadow-md transition-colors";

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(0, 50, 'OWNER');
      if (data && data.content) setNotifications(data.content);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleNotificationClick = (noti) => {
    setSelectedNoti(noti); 
    if (!noti.isRead && !noti.read) handleMarkRead(noti);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead('OWNER');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
      showToast(isVi ? "Đã đánh dấu tất cả là đã đọc" : "Marked all as read", "success");
    } catch (e) { showToast(isVi ? "Lỗi hệ thống" : "System error", "error"); }
  };

  const handleMarkRead = async (noti) => {
    try {
      await notificationService.markAsRead(noti.id);
      setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true, read: true } : n));
    } catch (e) { console.error(e); }
  };

  const promptDelete = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(null); 
    setNotificationToDelete(id); 
  };

  const handleDeleteConfirm = () => {
    if (!notificationToDelete) return;
    setNotifications(prev => prev.filter(n => n.id !== notificationToDelete));
    setNotificationToDelete(null);
    showToast(isVi ? "Đã ẩn thông báo" : "Notification hidden", "success");
  };

  const getFilteredNotifications = () => {
    return notifications.filter(n => {
      const isRead = n.isRead !== undefined ? n.isRead : n.read;
      if (filterType === 'BOOKING' && !['BOOKING_RECEIVED', 'BOOKING_CANCELLED_BY_GUEST'].includes(n.type)) return false;
      if (filterType === 'MONEY' && !['PAYOUT_SUCCESS', 'REVENUE_REPORT'].includes(n.type)) return false;
      if (filterType === 'SYSTEM' && ['BOOKING_RECEIVED', 'BOOKING_CANCELLED_BY_GUEST', 'PAYOUT_SUCCESS', 'REVENUE_REPORT'].includes(n.type)) return false;
      if (showUnreadOnly && isRead) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return n.title?.toLowerCase().includes(term) || n.message?.toLowerCase().includes(term);
      }
      return true;
    });
  };

  const groups = (() => {
    const filtered = getFilteredNotifications();
    const g = {};
    filtered.forEach(n => {
      const key = formatDateGroup(n.createdAt);
      if (!g[key]) g[key] = [];
      g[key].push(n);
    });
    return g;
  })();

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'BOOKING_RECEIVED': return { icon: <CalendarCheck size={20} />, bg: "bg-green-100", text: "text-green-700" };
      case 'PAYOUT_SUCCESS':
      case 'REVENUE_REPORT': return { icon: <DollarSign size={20} />, bg: "bg-yellow-100", text: "text-yellow-700" };
      case 'BOOKING_CANCELLED_BY_GUEST':
      case 'REJECTION':
      case 'PROPERTY_SUSPENDED': return { icon: <AlertTriangle size={20} />, bg: "bg-red-100", text: "text-red-700" };
      case 'APPROVAL': return { icon: <Briefcase size={20} />, bg: "bg-blue-100", text: "text-blue-700" };
      default: return { icon: <Bell size={20} />, bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  return (
    <>
      <ToastPortal>{toast.show && <Toast message={toast.message} type={toast.type} />}</ToastPortal>
      {openMenuId && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}

      <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('owner.notifications')}</h1>
              <p className="text-gray-500 text-sm">{isVi ? "Cập nhật hoạt động kinh doanh" : "Business activity updates"}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setShowUnreadOnly(!showUnreadOnly)} className={`px-3 py-2 rounded-lg text-sm border flex items-center gap-2 transition ${showUnreadOnly ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white hover:bg-gray-50'}`}><Filter size={16} /> {showUnreadOnly ? (isVi ? 'Đang lọc: Chưa đọc' : 'Filtering: Unread') : (isVi ? 'Lọc: Chưa đọc' : 'Filter: Unread')}</button>
                <button onClick={handleMarkAllRead} className="px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"><Check size={16} /> {isVi ? "Đọc tất cả" : "Mark all read"}</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-1 mb-6 flex flex-col md:flex-row gap-2">
            <div className="flex p-1 gap-1 overflow-x-auto flex-1">
                {[{id:'ALL',l:isVi?'Tất cả':'All'}, {id:'BOOKING',l:isVi?'Đặt phòng':'Booking'}, {id:'MONEY',l:isVi?'Tài chính':'Finance'}, {id:'SYSTEM',l:isVi?'Hệ thống':'System'}].map(t => (
                    <button key={t.id} onClick={() => setFilterType(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filterType === t.id ? brandButtonClass : 'text-gray-500 hover:bg-gray-100'}`}>{t.l}</button>
                ))}
            </div>
            <div className="relative p-1 md:w-64"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder={isVi?"Tìm kiếm...":"Search..."} className="w-full pl-9 pr-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-gray-300 rounded-lg text-sm outline-none border transition" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>
          ) : Object.keys(groups).length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed"><Bell size={32} className="text-gray-300 mx-auto mb-2" /><p className="text-gray-500">{isVi ? "Không có thông báo nào" : "No notifications"}</p></div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groups).map((date) => (
                <div key={date}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1">{date}</h3>
                  <div className="bg-white rounded-xl shadow-sm border divide-y divide-gray-100 overflow-hidden">
                    {groups[date].map(noti => {
                      const style = getNotificationStyle(noti.type);
                      const isRead = noti.isRead !== undefined ? noti.isRead : noti.read;
                      return (
                        <div key={noti.id} onClick={() => handleNotificationClick(noti)} className={`group flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 transition relative ${!isRead ? 'bg-blue-50/40' : ''}`}>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${style.bg} ${style.text}`}>{style.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start"><h4 className={`text-sm ${!isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{noti.title}</h4><span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatTime(noti.createdAt)}</span></div>
                                <p className={`text-sm truncate mt-0.5 ${!isRead ? 'text-gray-800' : 'text-gray-500'}`}>{noti.message}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === noti.id ? null : noti.id); }} className="p-2 rounded-full text-gray-400 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition"><MoreHorizontal size={18} /></button>
                            {openMenuId === noti.id && (
                                <div className="absolute right-10 top-8 w-32 bg-white border shadow-lg rounded-lg z-20 py-1"><button onClick={(e) => promptDelete(e, noti.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> {isVi ? "Xóa" : "Delete"}</button></div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalPortal>
        {selectedNoti && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNoti(null)}>
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
                    <div className={`h-3 w-full ${getNotificationStyle(selectedNoti.type).bg}`} /> 
                    <div className="p-6 relative">
                        <button onClick={() => setSelectedNoti(null)} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100"><X size={20} /></button>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationStyle(selectedNoti.type).bg} ${getNotificationStyle(selectedNoti.type).text}`}>{getNotificationStyle(selectedNoti.type).icon}</div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{typeToName[selectedNoti.type] || (isVi ? 'Thông báo' : 'Notification')}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={12} /> {formatFullDateTime(selectedNoti.createdAt)}</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{selectedNoti.title}</h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm whitespace-pre-line mb-6">{selectedNoti.message}</div>
                        {selectedNoti.relatedEntityId && (
                            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4 mb-4"><span>{isVi ? "Mã tham chiếu:" : "Reference ID:"}</span><span className="font-mono font-medium bg-gray-100 px-2 py-0.5 rounded">#{selectedNoti.relatedEntityId}</span></div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setSelectedNoti(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">{isVi ? "Đóng" : "Close"}</button>
                            {(selectedNoti.type === 'BOOKING_RECEIVED' || selectedNoti.type === 'BOOKING_CANCELLED_BY_GUEST') && (<button onClick={() => navigate('/owner/bookings')} className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg ${brandButtonClass}`}>{isVi ? "Xem Booking" : "View Booking"} <ExternalLink size={16} /></button>)}
                            {selectedNoti.type === 'REVENUE_REPORT' && (<button onClick={() => navigate('/owner/dashboard')} className="flex-1 py-2.5 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 flex items-center justify-center gap-2 shadow-lg">{isVi ? "Doanh thu" : "Revenue"} <ExternalLink size={16} /></button>)}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </ModalPortal>

      <ModalPortal>
        {notificationToDelete && (
            <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setNotificationToDelete(null)}>
                <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4"><Trash2 size={24} className="text-red-600" /></div>
                        <h2 className="text-lg font-bold mb-2 text-gray-900">{isVi ? "Ẩn thông báo này?" : "Hide this notification?"}</h2>
                        <p className="text-gray-500 mb-6 text-sm">{isVi ? "Thông báo sẽ bị ẩn khỏi danh sách hiển thị." : "The notification will be hidden from the list."}</p>
                        <div className="flex justify-center gap-3 w-full">
                            <button onClick={() => setNotificationToDelete(null)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">{t('common.cancel')}</button>
                            <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">{isVi ? "Ẩn ngay" : "Hide now"}</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </ModalPortal>
    </>
  );
};

export default OwnerNotificationsPage;
