
import React from 'react';
import { Building, Home, Sun, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

const propertyTypes = [
  { id: 'HOTEL', name: 'Khách sạn', icon: <Building size={32} /> },
  { id: 'RESORT', name: 'Khu nghỉ dưỡng', icon: <Sun size={32} /> },
  { id: 'HOMESTAY', name: 'Homestay', icon: <Home size={32} /> },
  { id: 'VILLA', name: 'Biệt thự (Villa)', icon: <Mountain size={32} /> },
];

const TypeCard = ({ type, selectedType, onSelect }) => (
  <motion.div
    onClick={() => onSelect(type.id)}
    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 text-center
      ${selectedType === type.id 
        ? 'border-[rgb(40,169,224)] bg-blue-50 shadow-lg' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`mx-auto w-fit p-4 rounded-full mb-4 transition-colors ${selectedType === type.id ? 'bg-[rgb(40,169,224)] text-white' : 'bg-gray-100 text-gray-600'}`}>
      {type.icon}
    </div>
    <h3 className={`font-bold ${selectedType === type.id ? 'text-[rgb(40,169,224)]' : 'text-gray-800'}`}>
      {type.name}
    </h3>
  </motion.div>
);

const Step0_PropertyType = ({ setValue, watch }) => {
  const selectedType = watch('propertyInfo.propertyType');

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Chào mừng đến với Tripify!</h1>
      <p className="text-slate-500 mt-3 text-lg mb-10">Để bắt đầu, vui lòng chọn loại hình cơ sở kinh doanh của bạn.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {propertyTypes.map(type => (
          <TypeCard 
            key={type.id}
            type={type}
            selectedType={selectedType}
            onSelect={(id) => setValue('propertyInfo.propertyType', id, { shouldValidate: true })}
          />
        ))}
      </div>
    </div>
  );
};

export default Step0_PropertyType;
