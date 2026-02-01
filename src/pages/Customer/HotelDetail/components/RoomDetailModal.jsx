import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import {
    Tv, Wind, Droplet, Coffee, Wifi, Bath, Bed, Ban,
    CheckCircle, Loader2, Users
} from "lucide-react";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";
import roomService from "@/services/room.service";

// ============================
// CLOUDLFLARE PUBLIC DOMAIN
// ============================
const R2_PUBLIC_URL =
    "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

// ============================
// FIXED getFullImageUrl()
// ============================
const getFullImageUrl = (path) => {
    if (!path)
        return "https://via.placeholder.com/800x600?text=No+Image";

    if (typeof path !== "string")
        return "https://via.placeholder.com/800x600?text=No+Image";

    if (path.startsWith("http"))
        return path;

    const clean = path.startsWith("/") ? path.slice(1) : path;

    return `${R2_PUBLIC_URL}/${clean}`;
};

// ============================
const RoomDetailModal = ({ room: initialRoom, open, onClose }) => {
    const roomId = initialRoom?.id || initialRoom?.roomId;

    const [roomDetail, setRoomDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // ============================
    // FETCH ROOM DETAILS
    // ============================
    useEffect(() => {
        if (!open || !roomId) {
            setRoomDetail(null);
            return;
        }

        let alive = true;

        const load = async () => {
            setLoading(true);
            try {
                const data = await roomService.getRoomDetail(roomId);

                if (alive) setRoomDetail(data);
            } catch (e) {
                console.error("Room detail failed:", e);
            } finally {
                if (alive) setLoading(false);
            }
        };

        load();
        return () => (alive = false);
    }, [open, roomId]);

    if (!open) return null;

    // =============================
    // LOADING
    // =============================
    if (loading) {
        return (
            <Modal open={open} onClose={onClose} title="Đang tải thông tin..." maxWidth="max-w-5xl">
                <div className="flex flex-col justify-center items-center h-80">
                    <Loader2 className="animate-spin text-sky-500 mb-3" size={38} />
                    <p className="text-gray-400">Vui lòng đợi giây lát...</p>
                </div>
            </Modal>
        );
    }

    if (!roomDetail) return null;

    // =============================
    // FIX HÌNH ẢNH — LOGIC ĐÚNG
    // =============================
    let rawImgs = [];

    // CASE 1: BE trả list ảnh phòng
    if (Array.isArray(roomDetail.images) && roomDetail.images.length > 0) {
        rawImgs = roomDetail.images.map(img =>
            typeof img === "string" ? img : img?.imageUrl
        ).filter(Boolean);
    }

    // CASE 2: BE trả coverImage của phòng
    if (rawImgs.length === 0 && roomDetail.coverImage) {
        rawImgs = [roomDetail.coverImage];
    }

    // CASE 3: Lấy ảnh phòng FE, nếu có
    if (rawImgs.length === 0 && Array.isArray(initialRoom?.images)) {
        rawImgs = initialRoom.images.map(i =>
            typeof i === "string" ? i : i?.imageUrl
        ).filter(Boolean);
    }

    // CASE 4: fallback bằng cover của property
    if (rawImgs.length === 0 && initialRoom?.propertyCover) {
        rawImgs = [initialRoom.propertyCover];
    }

    // CASE 5: fallback cuối cùng
    if (rawImgs.length === 0) {
        rawImgs = ["https://via.placeholder.com/800x600?text=No+Image"];
    }

    // Convert sang full URL
    const roomImages = rawImgs.map(getFullImageUrl);

    // thumbs
    const thumbs = roomImages.slice(1, 4);
    const remain = Math.max(0, roomImages.length - 4);

    const handleImageClick = (idx) => {
        setSelectedImageIndex(idx);
        setViewerOpen(true);
    };

    const viewerImages = roomImages.map((url, idx) => ({
        url,
        caption: `${roomDetail.roomName} - Ảnh ${idx + 1}`
    }));

    const fmt = (p) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

    return (
        <>
            <Modal open={open} onClose={onClose} title="Chi tiết phòng nghỉ" maxWidth="max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-3">

                    {/* LEFT IMAGES */}
                    <div className="lg:col-span-7 space-y-3">
                        <div
                            className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border"
                            onClick={() => handleImageClick(0)}
                        >
                            <img src={roomImages[0]} className="w-full h-full object-cover" alt="main" />
                        </div>

                        {roomImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-3">
                                {thumbs.map((url, idx) => (
                                    <div key={idx}
                                         className="relative aspect-[4/3] rounded-lg overflow-hidden border cursor-pointer"
                                         onClick={() => handleImageClick(idx + 1)}
                                    >
                                        <img src={url} className="w-full h-full object-cover" alt="" />

                                        {idx === 2 && remain > 0 && (
                                            <div className="absolute inset-0 bg-black/60 text-white flex justify-center items-center text-lg font-bold">
                                                +{remain}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="lg:col-span-5 flex flex-col">

                        <h2 className="text-2xl font-bold mb-2">{roomDetail.roomName}</h2>

                        <p className="text-sm bg-gray-50 p-3 border rounded mb-4">
                            {roomDetail.description || "Đang cập nhật mô tả..."}
                        </p>

                        <div className="mb-4 bg-orange-50 border p-4 rounded-xl flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full shadow">
                                <Users size={22} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs text-orange-600 uppercase font-bold">Sức chứa chuẩn</p>
                                <p className="text-lg font-bold">{roomDetail.capacity} người lớn</p>
                            </div>
                        </div>

                        {/* amenities */}
                        <h4 className="font-bold mb-2">Tiện nghi phòng</h4>
                        <ul className="max-h-40 overflow-y-auto pr-2 space-y-1">
                            {(roomDetail.amenities || []).length === 0
                                ? <li className="text-gray-400 italic text-sm">Đang cập nhật...</li>
                                : roomDetail.amenities.map((am, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle size={14} className="text-green-500" />
                                        {am}
                                    </li>
                                ))}
                        </ul>

                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-xs text-gray-500">Giá mỗi đêm từ</p>
                                    <p className="line-through text-gray-400 text-sm">{fmt(roomDetail.pricePerNight * 1.2)}</p>
                                </div>
                                <p className="text-3xl font-bold text-sky-500">{fmt(roomDetail.pricePerNight)}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={onClose}>Đóng</Button>
                                <Button className="flex-1 py-3">Chọn phòng này</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {isViewerOpen && (
                <ImageViewerModal
                    open={isViewerOpen}
                    onClose={() => setViewerOpen(false)}
                    images={viewerImages}
                    startIndex={selectedImageIndex}
                />
            )}
        </>
    );
};

export default RoomDetailModal;
