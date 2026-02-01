// src/layouts/CustomerLayout/ChatBot/HotelResultCard.jsx
import React from "react";
// ✅ Đã thêm Calendar vào danh sách import
import { MapPin, Star, Users, Banknote, Search, ExternalLink, Building2, ArrowRight, Calendar } from "lucide-react";

const HotelResultCard = ({ data }) => {
    // Kiểm tra dữ liệu an toàn
    if (!data || !data.properties || data.properties.length === 0) return null;

    return (
        <div className="w-full space-y-3">
            {/* 1. Header: Hiển thị thông tin tìm kiếm chung */}
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                    <Search size={16} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800">
                        Tìm thấy {data.properties.length} chỗ nghỉ tại {data.city}
                    </h3>
                    {/* ✅ Đã thay Emoji bằng Icon và căn chỉnh lại layout */}
                    <div className="text-xs text-gray-500 flex flex-wrap gap-3 mt-1">
                        <div className="flex items-center gap-1.5">
                            <Users size={12} className="text-gray-400" />
                            <span>{data.capacity} khách</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Danh sách khách sạn */}
            <div className="space-y-4">
                {data.properties.map((hotel) => (
                    <div
                        key={hotel.propertyId}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                        {/* --- Phần Thông tin Khách sạn --- */}
                        <div className="p-3 pb-0 flex gap-3">
                            {/* Icon đại diện */}
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <Building2 size={24} className="text-gray-400" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800 text-sm truncate pr-2">
                                        {hotel.name}
                                    </h4>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-700 border border-yellow-200">
                                        <Star size={10} className="fill-yellow-500 text-yellow-500" />
                                        {hotel.rating}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                    <MapPin size={12} className="text-red-400 shrink-0" />
                                    <span className="truncate">{hotel.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* --- Phần Danh sách phòng --- */}
                        <div className="p-3 pt-2">
                            <div className="bg-gray-50 rounded-lg p-2 space-y-2 border border-gray-100">
                                {hotel.rooms.map((room, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700">{room.roomName}</span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Users size={10} /> {room.capacity} khách
                                            </span>
                                        </div>
                                        <div className="font-bold text-blue-600">
                                            {room.price.toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- 3. NÚT ĐẶT NGAY CHUNG CHO CẢ KHÁCH SẠN --- */}
                        <div className="p-3 pt-0 mt-auto pb-3">
                            <a
                                href={hotel.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full gap-2 bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                Xem chi tiết <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelResultCard;