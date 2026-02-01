import React from "react";
import { Star, Quote } from "lucide-react";

const TestimonialCard = ({ data }) => {
  return (
    <div className="group relative bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      
      {/* Quote Icon (Background decoration) */}
      <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={64} className="text-blue-600 fill-current" />
      </div>

      {/* 1. User Info & Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-500">
            <img 
              src={data.avatar} 
              alt={data.name} 
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          {/* Verified Badge */}
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">{data.name}</h4>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{data.role}</p>
        </div>
      </div>

      {/* 2. Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${i < data.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} 
          />
        ))}
      </div>

      {/* 3. Comment Content */}
      <p className="text-gray-600 italic leading-relaxed flex-1">
        "{data.comment}"
      </p>
    </div>
  );
};

export default TestimonialCard;