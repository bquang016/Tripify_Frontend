import React, { useState, useEffect } from "react";
import { Ban, BedDouble, DollarSign, CheckCircle, AlertCircle, Eye, RotateCcw } from "lucide-react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import adminService from "@/services/admin.service";
import SuspendModal from "@/components/common/Modal/SuspendModal";
import ActionConfirmModal from "./ActionConfirmModal";
import RoomDetailModal from "./RoomDetailModal";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

const HotelRoomsModal = ({ isOpen, onClose, hotel }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // State Loading toàn màn hình

  const [suspendRoomModalOpen, setSuspendRoomModalOpen] = useState(false);
  const [activateRoomModalOpen, setActivateRoomModalOpen] = useState(false); 
  const [detailRoomModalOpen, setDetailRoomModalOpen] = useState(false);
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRooms = async () => {
    if (!hotel) return;
    setLoading(true);
    try {
      const res = await adminService.getPropertyRooms(hotel.propertyId);
      if (res.success) {
        setRooms(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen, hotel]);

  // Handlers
  const handleViewDetail = (room) => {
    setSelectedRoom(room);
    setDetailRoomModalOpen(true);
  };

  const handleSuspendClick = (room) => {
    setSelectedRoom(room);
    setSuspendRoomModalOpen(true);
  };

  const handleActivateClick = (room) => {
    setSelectedRoom(room);
    setActivateRoomModalOpen(true);
  };

  // Logic Dừng phòng
  const handleConfirmSuspendRoom = async (reason) => {
    setIsProcessing(true); // Bật loading
    try {
      await adminService.suspendRoom(selectedRoom.roomId, reason);
      setToast({ message: "Đã dừng phòng thành công", type: "success" });
      setSuspendRoomModalOpen(false); // Đóng modal suspend
      await fetchRooms();
    } catch (error) {
      setToast({ message: "Lỗi dừng phòng", type: "error" });
    } finally {
      setIsProcessing(false); // Tắt loading
    }
  };

  // Logic Mở lại phòng
  const handleConfirmActivateRoom = async () => {
    if (!selectedRoom) return;
    setIsProcessing(true); // Bật loading
    try {
      await adminService.activateRoom(selectedRoom.roomId);
      setToast({ message: "Đã mở lại phòng thành công", type: "success" });
      setActivateRoomModalOpen(false); // Đóng modal activate
      await fetchRooms(); 
    } catch (error) {
      setToast({ message: "Lỗi mở lại phòng", type: "error" });
    } finally {
      setIsProcessing(false); // Tắt loading
    }
  };

  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <>
      {/* [1] GLOBAL LOADING OVERLAY: Phủ toàn màn hình */}
      {isProcessing && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
            {/* Component LoadingOverlay của bạn sẽ nằm giữa màn hình */}
            <LoadingOverlay message="Đang xử lý yêu cầu..." />
        </div>
      )}

      {/* Modal Danh sách phòng */}
      <Modal 
        open={isOpen} 
        onClose={onClose} 
        title={`Danh sách phòng - ${hotel?.propertyName}`}
        maxWidth="max-w-3xl"
      >
        {/* Bỏ class relative ở đây vì overlay đã ra ngoài */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-2">
          
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          {loading ? (
            <div className="text-center py-8 text-gray-500">
               <LoadingOverlay message="Đang tải danh sách phòng..." />
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {rooms.map((room) => (
                <div 
                  key={room.roomId}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                    room.roomStatus === 'SUSPENDED' 
                      ? 'bg-red-50 border-red-100' 
                      : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  {/* Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                       room.roomStatus === 'SUSPENDED' ? 'bg-white text-red-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <BedDouble size={24} />
                    </div>
                    <div className={room.roomStatus === 'SUSPENDED' ? 'opacity-70' : ''}>
                      <h4 className="font-semibold text-gray-800">{room.roomName}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign size={14} />
                          {formatPrice(room.pricePerNight)}
                        </span>
                        <span>•</span>
                        <span>Sức chứa: {room.capacity} người</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {room.roomStatus === 'SUSPENDED' ? (
                      <>
                        <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 border border-red-200">
                          <AlertCircle size={14} />
                          Đã dừng
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-green-600 text-white hover:bg-green-700 border-none shadow-sm h-9 px-3"
                          onClick={() => handleActivateClick(room)}
                          disabled={isProcessing}
                          title="Mở lại phòng"
                        >
                          <RotateCcw size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1 border border-green-200">
                          <CheckCircle size={14} />
                          Hoạt động
                        </span>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none h-9 px-3"
                          onClick={() => handleViewDetail(room)}
                          disabled={isProcessing}
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </Button>

                        <Button 
                          size="sm" 
                          className="bg-red-600 text-white hover:bg-red-700 border-none shadow-sm h-9 px-4"
                          onClick={() => handleSuspendClick(room)}
                          disabled={isProcessing}
                        >
                          <Ban size={16} className="mr-1.5" />
                          Dừng
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8">
              <EmptyState title="Không có phòng nào" description="Khách sạn này chưa thêm phòng nào." />
            </div>
          )}
        </div>
      </Modal>

      {/* Các Modal Nested */}
      <SuspendModal 
        isOpen={suspendRoomModalOpen}
        onClose={() => setSuspendRoomModalOpen(false)}
        onConfirm={handleConfirmSuspendRoom}
        title="Dừng hoạt động Phòng"
        itemName={selectedRoom?.roomName}
        // Không cần truyền loading vào đây nữa vì overlay tổng đã chặn rồi
      />

      <ActionConfirmModal
        open={activateRoomModalOpen}
        onClose={() => setActivateRoomModalOpen(false)}
        onConfirm={handleConfirmActivateRoom}
        // Không cần truyền isLoading vì overlay tổng đã chặn rồi
        title="Mở lại phòng"
        message={`Bạn có muốn kích hoạt lại phòng "${selectedRoom?.roomName}"?`}
        confirmText="Mở lại"
        confirmColor="green"
        iconType="success"
      />

      <RoomDetailModal
        isOpen={detailRoomModalOpen}
        onClose={() => setDetailRoomModalOpen(false)}
        room={selectedRoom}
      />
    </>
  );
};

export default HotelRoomsModal;