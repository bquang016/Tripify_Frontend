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

const RoomManagementPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Confirm State
  const [confirmData, setConfirmData] = useState({ open: false, id: null });

  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  // Fetch Data với Log chi tiết
  const fetchData = async () => {
    console.log(`🚀 [RoomPage] Bắt đầu tải dữ liệu cho Property ID: ${propertyId}`);
    const totalStart = performance.now();

    try {
      setLoading(true);

      // 1. Đo thời gian lấy thông tin Property
      const propStart = performance.now();
      const propRes = await api.get(`/property-details/${propertyId}`);
      console.log(`   🔹 [API Property Info] Xong sau ${(performance.now() - propStart).toFixed(2)}ms`, propRes.data);
      setProperty(propRes.data.property);

      // 2. Đo thời gian lấy danh sách phòng
const roomStart = performance.now();
const roomsRes = await roomService.getRoomsByProperty(propertyId);
console.log(`   🔹 [API Get Rooms] Xong sau ${(performance.now() - roomStart).toFixed(2)}ms`, roomsRes.data);

// roomsRes.data = [{ roomId, roomName, images: [...] }, ...]

const roomsData = roomsRes.data || [];

const roomsWithCover = await Promise.all(
    roomsData.map(async (room) => {
        try {
            const imgs = await roomService.getRoomImages(room.roomId); // [{roomImageId, imageUrl, isCover}, ...]

            const cover = imgs.find(i => i.cover);

            const coverImageUrl = cover ? cover.imageUrl : (imgs[0]?.imageUrl || null);

            return {
                ...room,
                coverImage: coverImageUrl   // ★★ Quan trọng
            };

        } catch (err) {
            console.error("Lỗi load ảnh phòng:", err);
            return {
                ...room,
                coverImage: room.images?.[0] || null
            };
        }
    })
);

setRooms(roomsWithCover); 
      
    } catch (error) {
      console.error("❌ [RoomPage] Lỗi tải dữ liệu:", error);
      showToast("Không thể tải dữ liệu", "error");
    } finally {
      setLoading(false);
      console.log(`✅ [RoomPage] TỔNG THỜI GIAN: ${(performance.now() - totalStart).toFixed(2)}ms`);
    }
  };

  useEffect(() => {
    if (propertyId) fetchData();
  }, [propertyId]);

  // Handlers
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
          console.time("DeleteRoomAPI");
          await roomService.deleteRoom(confirmData.id);
          console.timeEnd("DeleteRoomAPI");
          
          showToast("Đã xóa phòng thành công", "success");
          setConfirmData({ open: false, id: null });
          fetchData(); 
      } catch (error) {
          console.error("Lỗi xóa phòng:", error);
          showToast("Xóa phòng thất bại", "error");
      }
  };

  const handleModalSuccess = () => {
      setIsModalOpen(false);
      fetchData();
      showToast(selectedRoom ? "Cập nhật phòng thành công" : "Thêm phòng mới thành công", "success");
  };

  if (loading && !property) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      {toastData && <div className="fixed top-24 right-6 z-[9999]"><Toast message={toastData.message} type={toastData.type} /></div>}

      <ConfirmModal 
          open={confirmData.open}
          onClose={() => setConfirmData({ open: false, id: null })}
          onConfirm={handleDeleteRoom}
          title="Xác nhận xóa phòng"
          description="Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể hoàn tác."
          confirmText="Xóa ngay"
          cancelText="Hủy"
          isDanger={true}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" iconOnly onClick={() => navigate("/owner/rooms")} className="hover:bg-gray-200">
            <ArrowLeft size={20} />
        </Button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Quản lý phòng <span className="text-gray-400 font-light">|</span> <span className="text-blue-600">{property?.propertyName}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Thiết lập các loại phòng và giá cho cơ sở này</p>
        </div>
        <div className="ml-auto">
            <Button onClick={handleAddRoom} leftIcon={<Plus size={20} />} className="shadow-lg shadow-blue-500/20">
                Thêm phòng mới
            </Button>
        </div>
      </div>

      {/* Room Grid */}
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
              <h3 className="text-lg font-bold text-gray-900">Chưa có phòng nào</h3>
              <p className="text-gray-500 mb-6">Hãy tạo các hạng phòng để khách hàng có thể đặt lịch.</p>
              <Button onClick={handleAddRoom} variant="outline">Tạo phòng đầu tiên</Button>
          </motion.div>
      )}

      {/* Edit/Add Modal */}
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
