
import React from 'react';
import { Controller } from 'react-hook-form';
import AmenitySelector from '../components/AmenitySelector';

const Step3_Amenities = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span className="w-1 h-6 bg-[rgb(40,169,224)] rounded-full"></span>
        Tiện ích nổi bật
      </h3>
      <Controller
        name="propertyInfo.amenityIds"
        control={control}
        render={({ field }) => (
          <AmenitySelector 
            selectedIds={field.value} 
            onChange={field.onChange} 
          />
        )}
      />
      {errors.propertyInfo?.amenityIds && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.propertyInfo?.amenityIds.message}</p>}
    </div>
  );
};

export default Step3_Amenities;
