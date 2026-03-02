import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, BedDouble, Loader2 } from "lucide-react";
import Button from "@/components/common/Button/Button";
import RoomCard from "./components/RoomCard";
import EditRoomModal from "./components/EditRoomModal";
import roomService from "@/services/room.service";
import api from "@/services/axios.config";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/components/common/Notification/Toast";
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import { useTranslation } from "react-i18next";

const RoomManagementPage = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmData, setConfirmData] = useState({ open: false, id: null });

  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const propRes = await api.get(`/property-details/${propertyId}`);
      setProperty(propRes.data.property);

      const roomsRes = await roomService.getRoomsByProperty(propertyId);
      const roomsData = roomsRes.data || [];

      const roomsWithCover = await Promise.all(
          roomsData.map(async (room) => {
              try {
                  const imgs = await roomService.getRoomImages(room.roomId);
                  const cover = imgs.find(i => i.cover);
                  const coverImageUrl = cover ? cover.imageUrl : (imgs[0]?.imageUrl || null);
                  return { ...room, coverImage: coverImageUrl };
              } catch (err) {
                  return { ...room, coverImage: room.images?.[0] || null };
              }
          })
      );
      setRooms(roomsWithCover); 
    } catch (error) {
      showToast(t('finance.fetch_error'), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) fetchData();
  }, [propertyId]);

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const requestDeleteRoom = (roomId) => {
      setConfirmData({ open: true, id: roomId });
  };

  const handleDeleteRoom = async () => {
      if (!confirmData.id) return;
      try {
          await roomService.deleteRoom(confirmData.id);
          showToast(isVi ? "Đã xóa phòng thành công" : "Room deleted successfully", "success");
          setConfirmData({ open: false, id: null });
          fetchData(); 
      } catch (error) {
          showToast(isVi ? "Xóa phòng thất bại" : "Failed to delete room", "error");
      }
  };

  const handleModalSuccess = () => {
      setIsModalOpen(false);
      fetchData();
      showToast(selectedRoom ? t('owner.update_success') : t('owner.create_success'), "success");
  };

  if (loading && !property) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      {toastData && <div className="fixed top-24 right-6 z-[9999]"><Toast message={toastData.message} type={toastData.type} /></div>}

      <ConfirmModal 
          open={confirmData.open}
          onClose={() => setConfirmData({ open: false, id: null })}
          onConfirm={handleDeleteRoom}
          title={isVi ? "Xác nhận xóa phòng" : "Confirm Delete"}
          description={isVi ? "Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể hoàn tác." : "Are you sure you want to delete this room? This action cannot be undone."}
          confirmText={isVi ? "Xóa ngay" : "Delete"}
          cancelText={t('common.cancel')}
          isDanger={true}
      />

      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" iconOnly onClick={() => navigate("/owner/rooms")} className="hover:bg-gray-200">
            <ArrowLeft size={20} />
        </Button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {t('owner.room_mgmt')} <span className="text-gray-400 font-light">|</span> <span className="text-blue-600">{property?.propertyName}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">{isVi ? "Thiết lập các loại phòng và giá cho cơ sở này" : "Set up room types and prices for this property"}</p>
        </div>
        <div className="ml-auto">
            <Button onClick={handleAddRoom} leftIcon={<Plus size={20} />} className="shadow-lg shadow-blue-500/20">
                {t('owner.add_room')}
            </Button>
        </div>
      </div>

      {rooms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
                {rooms.map(room => (
                    <RoomCard 
                        key={room.roomId} 
                        room={room} 
                        onEdit={() => handleEditRoom(room)}
                        onDelete={() => requestDeleteRoom(room.roomId)}
                    />
                ))}
            </AnimatePresence>
          </div>
      ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200"
          >
              <div className="bg-blue-50 p-6 rounded-full mb-4">
                  <BedDouble size={48} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{isVi ? "Chưa có phòng nào" : "No rooms yet"}</h3>
              <p className="text-gray-500 mb-6">{isVi ? "Hãy tạo các hạng phòng để khách hàng có thể đặt lịch." : "Please create room types so customers can book."}</p>
              <Button onClick={handleAddRoom} variant="outline">{isVi ? "Tạo phòng đầu tiên" : "Create first room"}</Button>
          </motion.div>
      )}

      <EditRoomModal 
         open={isModalOpen} 
         onClose={() => setIsModalOpen(false)}
         room={selectedRoom}
         propertyId={propertyId}
         onSuccess={handleModalSuccess}
         showToast={showToast}
      />
    </div>
  );
};

export default RoomManagementPage;
