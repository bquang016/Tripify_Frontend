import React from "react";
import { MapPin, Star, Edit, Eye, Clock, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const PropertyCard = ({ property, onView, onEdit, onToggleStatus }) => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  const isPending = property.propertyStatus === "PENDING";
  const isApproved = property.propertyStatus === "APPROVED" || property.propertyStatus === "APPROVE";
  const isRejected = property.propertyStatus === "REJECTED";
  
  const isSwitchOn = isApproved && property.active;

  const handleEditClick = () => {
    if ((isApproved || isPending) && onEdit) {
      onEdit();
    }
  };

  const handleSwitchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending || isRejected) return;
    if (onToggleStatus) onToggleStatus();
  };

  const imageUrl = getFullImageUrl(property.coverImage);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.propertyName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${imageUrl ? 'hidden' : 'flex'}`}>
            <ImageIcon size={40} className="mb-2 opacity-40" />
            <span className="text-xs font-medium">{t('owner.no_cover_image')}</span>
        </div>
        
        <div className="absolute top-3 right-3 z-10">
            {isPending && (
                <span className="bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <Clock size={14} className="mr-1.5" /> {t('owner.pending')}
                </span>
            )}
            
            {isApproved && property.active && (
                <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <CheckCircle2 size={14} className="mr-1.5" /> {t('owner.status_active')}
                </span>
            )}

            {isApproved && !property.active && (
                 <span className="bg-gray-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <AlertCircle size={14} className="mr-1.5" /> {t('owner.status_closed')}
                </span>
            )}

             {isRejected && (
                <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <AlertCircle size={14} className="mr-1.5" /> {t('owner.status_rejected')}
                </span>
            )}
        </div>
        
        <div className="absolute bottom-3 left-3 z-10">
             <div className="flex items-center bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                {property.rating || t('owner.new')}
            </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors" title={property.propertyName}>
                {property.propertyName}
            </h3>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city}</span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-lg overflow-hidden mb-5 border border-gray-100">
             <div className="bg-gray-50 p-2.5 flex flex-col justify-center items-center group-hover:bg-blue-50/30 transition-colors">
                <p className="text-xs text-gray-500 mb-0.5">{t('owner.property_type_label')}</p>
                <p className="font-semibold text-gray-800 text-sm line-clamp-1 text-center px-1">
                  {property.propertyType}
                </p>
             </div>

             <div 
                className={`relative z-50 bg-gray-50 p-2.5 flex flex-col justify-center items-center transition-colors 
                  ${(!isPending && !isRejected) ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                onClick={handleSwitchClick}
             >
                <p className="text-xs text-gray-500 mb-1.5 select-none">{t('owner.hotel_status')}</p>
                
                {isPending || isRejected ? (
                   <span className="text-xs font-semibold text-gray-400 italic">
                      {isPending ? t('owner.pending') : t('owner.status_rejected')}
                   </span>
                ) : (
                  <div className="relative inline-flex items-center pointer-events-none">
                    <div className={`w-9 h-5 rounded-full transition-colors duration-200 ease-in-out border border-transparent
                        ${isSwitchOn ? 'bg-[rgb(40,169,224)]' : 'bg-gray-300'}`} 
                    />
                    <div className={`absolute left-[2px] top-[2px] bg-white h-4 w-4 rounded-full shadow-sm ring-0 transition-transform duration-200 ease-in-out
                        ${isSwitchOn ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </div>
                )}
             </div>
        </div>

        <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
          <Button
            variant={isApproved ? "outline" : "secondary"}
            className={`flex-1 ${!isApproved && !isPending ? "opacity-70 cursor-not-allowed" : "hover:border-blue-500 hover:text-blue-600"}`}
            size="sm"
            onClick={handleEditClick} 
            disabled={isRejected}
            leftIcon={<Edit size={16}/>}
          >
            {t('owner.edit')}
          </Button>
          
          <Button
             variant="secondary"
             size="sm"
             iconOnly
             className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
             onClick={onView} 
             title={t('owner.view_detail')}
          >
              <Eye size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
