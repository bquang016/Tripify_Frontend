import React from "react";
import { motion } from "framer-motion";
import { 
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, 
  Plane, PawPrint, Dumbbell, Wind, ConciergeBell, Cigarette, 
  Sparkle 
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Import component con
import AmenityOption from "./components/AmenityOption";

const AMENITIES_LIST = (t) => [
  { id: "pool", label: t('add_property_flow.amenities_list.pool'), icon: <Waves size={24} /> },
  { id: "parking", label: t('add_property_flow.amenities_list.parking'), icon: <ParkingCircle size={24} /> },
  { id: "sauna", label: t('add_property_flow.amenities_list.sauna'), icon: <Droplet size={24} /> },
  { id: "spa", label: t('add_property_flow.amenities_list.spa'), icon: <Sparkles size={24} /> },
  { id: "non_smoking", label: t('add_property_flow.amenities_list.non_smoking'), icon: <Ban size={24} /> },
  { id: "wifi", label: t('add_property_flow.amenities_list.wifi'), icon: <Wifi size={24} /> },
  { id: "airport_transfer", label: t('add_property_flow.amenities_list.airport_transfer'), icon: <Plane size={24} /> },
  { id: "pets", label: t('add_property_flow.amenities_list.pets'), icon: <PawPrint size={24} /> },
  { id: "gym", label: t('add_property_flow.amenities_list.gym'), icon: <Dumbbell size={24} /> },
  { id: "smoking_area", label: t('add_property_flow.amenities_list.smoking_area'), icon: <Cigarette size={24} /> },
  { id: "reception_24h", label: t('add_property_flow.amenities_list.reception_24h'), icon: <ConciergeBell size={24} /> },
  { id: "ac", label: t('add_property_flow.amenities_list.ac'), icon: <Wind size={24} /> },
];

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
  const { t } = useTranslation();
  const selectedAmenities = watch("amenities") || {};
  const list = AMENITIES_LIST(t);

  return (
    <motion.div 
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl">
          <Sparkle size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('add_property_flow.amenities_title')}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {t('add_property_flow.amenities_subtitle')}
          </p>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {list.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <AmenityOption
              id={item.id}
              label={item.label}
              icon={item.icon}
              register={register}
              isSelected={!!selectedAmenities[item.id]} 
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
