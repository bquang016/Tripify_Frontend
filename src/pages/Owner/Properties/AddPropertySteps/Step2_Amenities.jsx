import React from "react";
import { motion } from "framer-motion";
import { 
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, 
  Plane, PawPrint, Dumbbell, Wind, ConciergeBell, Cigarette, 
  Sparkle // Icon trang trí cho header
} from "lucide-react";

// Import component con
import AmenityOption from "./components/AmenityOption";

const AMENITIES_LIST = [
  { id: "pool", label: "Hồ bơi", icon: <Waves size={24} /> },
  { id: "parking", label: "Bãi đỗ xe", icon: <ParkingCircle size={24} /> },
  { id: "sauna", label: "Phòng xông hơi", icon: <Droplet size={24} /> },
  { id: "spa", label: "Spa & Massage", icon: <Sparkles size={24} /> },
  { id: "non_smoking", label: "Không hút thuốc", icon: <Ban size={24} /> },
  { id: "wifi", label: "Wi-Fi miễn phí", icon: <Wifi size={24} /> },
  { id: "airport_transfer", label: "Đưa đón sân bay", icon: <Plane size={24} /> },
  { id: "pets", label: "Cho phép thú cưng", icon: <PawPrint size={24} /> },
  { id: "gym", label: "Phòng Gym", icon: <Dumbbell size={24} /> },
  { id: "smoking_area", label: "Khu vực hút thuốc", icon: <Cigarette size={24} /> },
  { id: "reception_24h", label: "Lễ tân 24/7", icon: <ConciergeBell size={24} /> },
  { id: "ac", label: "Điều hòa", icon: <Wind size={24} /> },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Step2_Amenities({ register, watch }) {
  // Theo dõi toàn bộ object amenities để biết cái nào đang được chọn (true)
  const selectedAmenities = watch("amenities") || {};

  return (
    <motion.div 
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 1. Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl">
          <Sparkle size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tiện nghi & Dịch vụ</h2>
          <p className="text-gray-500 text-sm mt-1">
            Chọn những tiện ích nổi bật nhất để thu hút khách hàng.
          </p>
        </div>
      </div>

      {/* 2. Grid Tiện nghi */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {AMENITIES_LIST.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <AmenityOption
              id={item.id}
              label={item.label}
              icon={item.icon}
              register={register}
              // Kiểm tra xem checkbox này có đang được chọn không
              isSelected={!!selectedAmenities[item.id]} 
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}