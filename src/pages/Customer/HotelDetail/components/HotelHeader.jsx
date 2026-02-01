import React from "react";
import { MapPin, Heart, Share2, Star } from "lucide-react";
import Button from "@/components/common/Button/Button";
import HotelGallery from "./HotelGallery"; // Import lại component cũ của bạn

const HotelHeader = ({ hotel, onOpenGallery }) => {
  if (!hotel) return null;

  return (
    <div className="bg-white pt-6 pb-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* --- PHẦN 1: THÔNG TIN & ACTIONS --- */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          
          {/* Left: Tên, Sao, Địa chỉ */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                Khách sạn
              </span>
              <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={`${i < Math.floor(hotel.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} 
                    />
                  ))}
               </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {hotel.name}
            </h1>
            
            <div className="flex items-start gap-2 text-slate-600 group cursor-pointer w-fit">
              <MapPin size={18} className="text-[rgb(40,169,224)] mt-0.5 group-hover:animate-bounce" />
              <span className="text-sm font-medium group-hover:text-[rgb(40,169,224)] group-hover:underline decoration-dotted underline-offset-4 transition-all">
                {hotel.location}
              </span>
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3 self-start lg:self-auto mt-2 lg:mt-0">
             <button className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-rose-500 transition-colors shadow-sm" title="Lưu yêu thích">
                <Heart size={20} />
             </button>
             <button className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors shadow-sm" title="Chia sẻ">
                <Share2 size={20} />
             </button>
             
             {/* Nút Đặt phòng: Màu RGB yêu cầu */}
             <Button 
                className="bg-[rgb(40,169,224)] hover:bg-[rgb(30,145,198)] text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-blue-200 transition-transform active:scale-95 hidden md:block"
                onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
             >
                Đặt phòng ngay
             </Button>
          </div>
        </div>

        {/* --- PHẦN 2: GALLERY (Sử dụng component cũ) --- */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <HotelGallery images={hotel.images} onOpenViewer={onOpenGallery} />
        </div>

      </div>
    </div>
  );
};

export default HotelHeader;