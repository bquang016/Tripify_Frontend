import React from "react";
import Button from "@/components/common/Button/Button";
import { BedDouble, Maximize, Wifi, Users, ChevronRight, Sparkles, Check } from "lucide-react";

// ✅ Nhận prop onBookNow thay vì dùng navigate trực tiếp
const RoomRow = ({ room, onInfoClick, onBookNow }) => {

    return (
        <div className="group bg-white hover:bg-blue-50/30 transition-colors duration-200 p-5 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. CỘT TRÁI: ẢNH & THÔNG TIN (Chiếm 7/12) */}
                <div className="col-span-12 lg:col-span-7 flex flex-col sm:flex-row gap-5">
                    {/* Ảnh Thumbnail */}
                    <div 
                        className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden cursor-pointer shrink-0 border border-gray-100 shadow-sm group-hover:shadow-md transition-all"
                        onClick={() => onInfoClick(room)}
                    >
                        <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {room.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                +{room.images.length - 1} ảnh
                            </div>
                        )}
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h4 
                                className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:text-[rgb(40,169,224)] transition-colors"
                                onClick={() => onInfoClick(room)}
                            >
                                {room.name}
                            </h4>
                            
                            {/* Tags thông số */}
                            <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                    <Maximize size={12} /> {room.size} m²
                                </span>
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                    <BedDouble size={12} /> {room.beds || "Giường đôi"}
                                </span>
                            </div>

                            {/* List tiện ích dạng tick xanh */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                    <Wifi size={14} /> 
                                    <span className="font-medium">Miễn phí Wifi tốc độ cao</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                    <Check size={14} /> 
                                    <span>Hủy miễn phí (trước 3 ngày)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-600 mt-1">
                                    <Sparkles size={14} /> 
                                    <span className="font-medium">Bao gồm ăn sáng</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="text-sm text-[rgb(40,169,224)] font-semibold mt-3 flex items-center hover:underline w-fit"
                            onClick={() => onInfoClick(room)}
                        >
                            Xem chi tiết phòng <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* 2. CỘT GIỮA: SỨC CHỨA (Chiếm 2/12) */}
                <div className="col-span-6 lg:col-span-2 flex lg:flex-col items-center lg:justify-center gap-2 border-t lg:border-t-0 lg:border-l lg:border-r border-gray-100 pt-4 lg:pt-0">
                    <span className="lg:hidden text-sm text-gray-500">Sức chứa:</span>
                    <div className="flex items-center gap-1 text-gray-600" title={`${room.guests} người lớn`}>
                        <Users size={20} />
                        <span className="text-lg font-bold">x{room.guests}</span>
                    </div>
                    {/* Icon trẻ em giả lập nếu cần */}
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    </div>
                </div>

                {/* 3. CỘT PHẢI: GIÁ & ACTION (Chiếm 3/12) */}
                <div className="col-span-6 lg:col-span-3 flex flex-col justify-center items-end text-right border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0 pl-0 lg:pl-4">
                    <div className="mb-1">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-sm">
                            GIẢM 45%
                        </span>
                    </div>
                    <div className="text-xs text-gray-400 line-through mb-0.5">
                        {(room.price * 1.45).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-2xl font-bold text-gray-900 leading-none">
                        {room.price.toLocaleString('vi-VN')} ₫
                    </div>
                    <p className="text-[10px] text-gray-500 mb-4">đã bao gồm thuế & phí</p>

                    <Button 
                        className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white shadow-md shadow-blue-200 transition-all active:scale-95"
                        onClick={() => onBookNow(room)} // ✅ Gọi hàm callback mở modal
                    >
                        Đặt phòng ngay
                    </Button>
                    <p className="text-[10px] text-red-500 mt-2 font-medium">
                        Chỉ còn 2 phòng trống!
                    </p>
                </div>

            </div>
        </div>
    );
};

export default RoomRow; 