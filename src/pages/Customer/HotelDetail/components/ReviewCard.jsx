import React, { useState } from "react";
import { Star, Eye, EyeOff, Trash2, Pin } from "lucide-react";

/* ================== CHỈ SỬA PHẦN NÀY ================== */

// Public URL của Cloudflare R2
const R2_PUBLIC_BASE_URL =
    "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

// Helper lấy đường dẫn ảnh
const getImageUrl = (path) => {
    if (!path) {
        return "https://via.placeholder.com/150?text=No+Image";
    }

    // Nếu BE trả full URL (R2 / Cloudinary / S3...)
    if (path.startsWith("http")) {
        return path;
    }

    // Nếu BE chỉ trả path → gắn prefix R2
    return `${R2_PUBLIC_BASE_URL}/${path}`;
};

/* ===================================================== */

const ReviewCard = ({
                        review,
                        isAdmin,
                        isOwner,
                        canDelete,
                        onHide,
                        onDelete,
                        onOpenGallery,
                        onPin,
                    }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Admin hoặc Owner được phép ghim
    const canPin = isAdmin || isOwner;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div
            className={`border-b border-slate-100 py-6 last:border-0 ${
                review.hidden ? "opacity-60 bg-slate-50 p-4 rounded-lg" : ""
            } ${
                review.isPinned
                    ? "bg-yellow-50/50 -mx-4 px-4 rounded-xl border border-yellow-100"
                    : ""
            }`}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm">
                    <img
                        src={
                            review.userAvatar ||
                            `https://ui-avatars.com/api/?background=random&name=${
                                review.userName || "User"
                            }`
                        }
                        alt={review.userName}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Nội dung */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-800">
                                    {review.userName || "Người dùng ẩn danh"}
                                </h4>

                                {review.isPinned && (
                                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200 shadow-sm">
                    Đánh giá nổi bật
                  </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span>{formatDate(review.createdAt)}</span>
                                {review.roomName && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{review.roomName}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                            {canPin && (
                                <button
                                    onClick={onPin}
                                    className={`p-1.5 rounded-full transition-all duration-200 ${
                                        review.isPinned
                                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                            : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                                    }`}
                                    title={
                                        review.isPinned
                                            ? "Bỏ ghim đánh giá này"
                                            : "Ghim đánh giá này lên đầu (Max 3)"
                                    }
                                >
                                    <Pin
                                        size={16}
                                        className={review.isPinned ? "fill-yellow-500" : ""}
                                    />
                                </button>
                            )}

                            {isAdmin && (
                                <button
                                    onClick={onHide}
                                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                    title={review.hidden ? "Hiện đánh giá" : "Ẩn đánh giá"}
                                >
                                    {review.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                    title="Xóa đánh giá vĩnh viễn"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="mt-2.5 flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={
                                    i < review.stars
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-slate-200 text-slate-200"
                                }
                            />
                        ))}
                    </div>

                    {review.hidden && isAdmin && (
                        <p className="mt-1 text-xs font-bold text-red-500 bg-red-50 inline-block px-2 py-0.5 rounded border border-red-100">
                            Đánh giá này đang bị ẩn với khách hàng
                        </p>
                    )}

                    {/* Comment */}
                    <div className="mt-3 text-sm text-slate-700 leading-relaxed">
                        <p className={!isExpanded ? "line-clamp-3" : ""}>
                            {review.comment}
                        </p>
                        {review.comment && review.comment.length > 200 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-1 text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                            >
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </button>
                        )}
                    </div>

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {review.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 cursor-zoom-in group relative"
                                    onClick={() =>
                                        onOpenGallery &&
                                        onOpenGallery(
                                            idx,
                                            review.images.map((img) => getImageUrl(img))
                                        )
                                    }
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt="review-img"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Owner Reply */}
                    {review.reply && (
                        <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <p className="font-bold text-slate-800 text-xs">
                                    Phản hồi từ chỗ nghỉ
                                </p>
                            </div>
                            <p className="text-slate-600 text-sm italic pl-3.5">
                                "{review.reply}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;