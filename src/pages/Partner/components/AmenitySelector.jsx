import React from 'react';
import { Wifi, Waves, Car, Wind, Coffee, Utensils, Dumbbell, Sparkles } from 'lucide-react';

const AMENITY_OPTIONS = [
  { id: 1, label: 'Wifi miễn phí', icon: Wifi },
  { id: 2, label: 'Hồ bơi', icon: Waves },
  { id: 3, label: 'Bãi đỗ xe', icon: Car },
  { id: 4, label: 'Điều hòa', icon: Wind },
  { id: 5, label: 'Nhà hàng', icon: Utensils },
  { id: 6, label: 'Quầy bar', icon: Coffee }, // Tạm dùng icon Coffee
  { id: 7, label: 'Phòng Gym', icon: Dumbbell },
  { id: 8, label: 'Spa & Wellness', icon: Sparkles },
];

const AmenitySelector = ({ selectedIds = [], onChange }) => {
  const toggleAmenity = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(item => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {AMENITY_OPTIONS.map((amenity) => {
        const isSelected = selectedIds.includes(amenity.id);
        const Icon = amenity.icon;
        
        return (
          <button
            key={amenity.id}
            type="button"
            onClick={() => toggleAmenity(amenity.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2
              ${isSelected 
                ? 'border-[rgb(40,169,224)] bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)]' 
                : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-white hover:border-slate-300'
              }
            `}
          >
            <Icon className={`w-6 h-6 ${isSelected ? 'stroke-2' : 'stroke-1.5'}`} />
            <span className="text-xs font-medium">{amenity.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AmenitySelector;