import React from "react";
import { Edit, Trash2, Users, Image as ImageIcon, Crown, Sparkles, CheckCircle2 } from "lucide-react"; // ❌ Đã bỏ DollarSign
import Button from "@/components/common/Button/Button";
import { motion } from "framer-motion";

// Helper ảnh
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) path = `/uploads${path}`;
  return `${API_BASE_URL}${path}`;
};

// Component Nhãn loại phòng
const CategoryBadge = ({ category }) => {
    const type = category?.toUpperCase() || "STANDARD";
    switch (type) {
        case "SUITE":
            return (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30 border border-white/20 backdrop-blur-md animate-pulse-slow">
                    <Crown size={14} fill="currentColor" />
                    <span>Suite</span>
                </div>
            );
        case "DELUXE":
            return (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md shadow-indigo-500/20 border border-white/20">
                    <Sparkles size={14} />
                    <span>Deluxe</span>
                </div>
            );
        case "STANDARD":
        default:
            return (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                    <CheckCircle2 size={14} className="text-blue-500"/>
                    <span>Standard</span>
                </div>
            );
    }
};

const RoomCard = ({ room, onEdit, onDelete }) => {
  const coverImage = room.coverImage 
    ? getFullImageUrl(room.coverImage) 
    : null;

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-row h-44"
    >
      {/* Image Left */}
      <div className="w-1/3 relative bg-gray-100 overflow-hidden">
         {coverImage ? (
             <img src={coverImage} alt={room.roomName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
         ) : (
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col bg-gray-50">
                 <ImageIcon size={24} className="opacity-40 mb-1" />
                 <span className="text-[10px] font-medium opacity-60">Chưa có ảnh</span>
             </div>
         )}
         <CategoryBadge category={room.roomCategory} />
      </div>

      {/* Content Right */}
      <div className="w-2/3 p-4 flex flex-col justify-between relative">
         <div>
             <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {room.roomName}
             </h3>
             
             {/* ✅ SỬA ĐỔI Ở ĐÂY: Định dạng tiền tệ VND */}
             <p className="text-blue-600 font-bold text-lg flex items-baseline">
                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.pricePerNight)}
                 <span className="text-sm text-gray-400 font-normal ml-1">/ đêm</span>
             </p>
         </div>

         <div className="flex items-center gap-4 text-sm text-gray-500 my-2">
             <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100" title="Sức chứa">
                <Users size={14} className="mr-1.5 text-blue-500"/> 
                <span className="font-medium text-gray-700">{room.capacity} người</span>
             </div>
         </div>

         <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
             <Button size="sm" variant="outline" className="flex-1 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={onEdit}>
                 <Edit size={14} className="mr-1.5" /> Sửa
             </Button>
             <Button size="sm" variant="outline" className="text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-500 px-3" onClick={onDelete}>
                 <Trash2 size={16} />
             </Button>
         </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;