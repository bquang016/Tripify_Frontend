import React from "react";
import Button from "@/components/common/Button/Button";
import { Images } from "lucide-react";

const HotelGallery = ({ images, onOpenViewer }) => {
    // Tạo mảng ảnh chuẩn hóa để hiển thị
    const displayImages = images.slice(0, 5);

    return (
        <div className="relative mt-6 group">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
                {/* Ảnh chính (Lớn) */}
                {displayImages[0] && (
                    <button
                        type="button"
                        className="col-span-2 row-span-2 relative block overflow-hidden"
                        onClick={() => onOpenViewer(0)}
                    >
                        <img src={displayImages[0]} alt="Main View" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                )}

                {/* Các ảnh nhỏ bên cạnh */}
                {displayImages.slice(1).map((img, index) => (
                    <button
                        type="button"
                        key={index}
                        className="col-span-1 row-span-1 relative block overflow-hidden"
                        onClick={() => onOpenViewer(index + 1)}
                    >
                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                ))}
            </div>
            
            <Button
                variant="outline"
                size="sm"
                className="absolute bottom-4 right-4 z-10 bg-white/90 border-gray-200 text-gray-800 hover:bg-white"
                leftIcon={<Images size={16} />}
                onClick={() => onOpenViewer(0)}
            >
                Xem tất cả {images.length} ảnh
            </Button>
        </div>
    );
};

export default HotelGallery;