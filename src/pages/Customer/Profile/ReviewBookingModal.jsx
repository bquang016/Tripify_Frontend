import React, { useState, useEffect, useRef } from "react";
import {
  X,
  MessageCircle,
  Hotel,
  MapPin,
  Star,
  Image as ImageIcon,
  Film,
  Trash2,
  AlertCircle,
  Loader2,
  Pencil,
  Info, // Thêm icon Info
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import RatingStars from "@/pages/Customer/MyBookings/components/RatingStars";

// --- HELPER XỬ LÝ ẢNH ---
const API_BASE_URL = "http://localhost:8386";
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};

const ReviewBookingModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onSubmit, 
  onUpdate,
  mode = "create", 
  initialData 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // State lưu file MỚI (File object)
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);

  // ⭐ State lưu ảnh CŨ từ Server (URL string)
  const [existingImages, setExistingImages] = useState([]);

  const commentBlockRef = useRef(null);

  const scrollToComment = () => {
    if (commentBlockRef.current) {
      commentBlockRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSubmitting(false);
      setNewImages([]); 
      setNewVideos([]);

      if (mode === "view" && initialData) {
        // --- LOAD DỮ LIỆU CŨ ---
        setRating(initialData.stars || initialData.rating || 0); 
        setComment(initialData.comment || "");
        // Load danh sách ảnh cũ (nếu có)
        setExistingImages(initialData.images || []); 
        
        setIsEditing(false); 
      } else {
        // --- TẠO MỚI ---
        setRating(0);
        setComment("");
        setExistingImages([]);
        setIsEditing(true); 
      }
    }
  }, [isOpen, mode, initialData]);

  const isReadOnly = mode === "view" && !isEditing;

  if (!isOpen || !booking) return null;

  const trimmedComment = comment.trim();
  const currentLength = trimmedComment.length;
  const isValid = rating > 0 && currentLength >= 10;

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const videoFiles = files.filter((f) => f.type.startsWith("video/"));

    setNewImages((prev) => {
      const updated = [...prev, ...imageFiles];
      return updated.slice(0, 5);
    });

    setNewVideos((prev) => {
      const updated = [...prev, ...videoFiles];
      return updated.slice(0, 1);
    });

    e.target.value = "";
  };

  const removeNewImage = (index) => setNewImages((prev) => prev.filter((_, i) => i !== index));
  const removeNewVideo = (index) => setNewVideos((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Vui lòng chọn số sao đánh giá.");
      scrollToComment();
      return;
    }

    if (currentLength < 10) {
      setError("Nội dung đánh giá quá ngắn (tối thiểu 10 ký tự).");
      scrollToComment();
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const allFiles = [...newImages, ...newVideos];

      if (mode === "view" && isEditing) {
        await onUpdate?.(initialData.ratingId, {
          rating,
          comment: trimmedComment,
          files: allFiles,
        });
      } else {
        await onSubmit?.({
          rating,
          comment: trimmedComment,
          files: allFiles,
        });
      }
    } catch (err) {
      console.error("Modal catch submit error:", err);
      setSubmitting(false);
      setError(err?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      scrollToComment();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all"
      >
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-[rgb(40,169,224)] via-[rgb(33,150,201)] to-[rgb(18,120,170)] px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-100/90">
                {mode === "create" ? "ĐÁNH GIÁ TRẢI NGHIỆM" : "ĐÁNH GIÁ CỦA BẠN"}
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <Hotel size={18} className="text-yellow-300" />
                <span className="line-clamp-1">{booking.propertyName}</span>
              </h3>
              {booking.propertyAddress && (
                <p className="mt-1 flex items-center gap-1 text-xs text-sky-50">
                  <MapPin size={14} />
                  <span className="line-clamp-1">{booking.propertyAddress}</span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-1 rounded-full border border-white/30 bg-white/10 p-1.5 text-slate-100 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-[11px]">
              Mã đơn: BK-{booking.bookingId}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-medium text-sky-50 border border-white/30">
              <Star size={12} className="text-yellow-300" />
              {isReadOnly ? "Bạn đã đánh giá đơn này" : "Hãy chia sẻ cảm nhận chân thật"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 px-5 py-5">
          
          {/* Stars */}
          <div className={`rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ${isReadOnly ? 'pointer-events-none opacity-90' : ''}`}>
            <p className="mb-1 text-sm font-medium text-slate-700">
              Mức độ hài lòng tổng thể
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <RatingStars value={rating} onChange={setRating} />
              <span className="text-xs font-medium text-blue-600">
                {rating === 0 && "Nhấn để chọn số sao"}
                {rating === 1 && "1 sao – Rất tệ 😡"}
                {rating === 2 && "2 sao – Chưa hài lòng 😞"}
                {rating === 3 && "3 sao – Bình thường 😐"}
                {rating === 4 && "4 sao – Hài lòng 🙂"}
                {rating === 5 && "5 sao – Tuyệt vời 😍"}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div ref={commentBlockRef} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageCircle size={16} className="text-[rgb(40,169,224)]" />
              Trải nghiệm của bạn tại chỗ nghỉ
            </label>
            <textarea
              className={`w-full rounded-xl border p-3 text-sm outline-none transition
                ${isReadOnly 
                  ? "bg-slate-100 text-slate-600 border-transparent cursor-not-allowed resize-none" 
                  : "bg-slate-50 text-slate-800 border-slate-300 focus:border-[rgb(40,169,224)] focus:bg-white focus:ring-1 focus:ring-[rgb(40,169,224)]"}
                ${error ? "border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500" : ""}`}
              rows={5}
              placeholder="Ví dụ: Phòng sạch sẽ, nhân viên thân thiện, vị trí thuận tiện..."
              value={comment}
              disabled={isReadOnly}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError("");
              }}
            />
            {error && (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
                <AlertCircle size={14} /> {error}
              </p>
            )}
            {!isReadOnly && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={currentLength < 10 ? "text-amber-600" : "text-emerald-600"}>
                  {currentLength === 0 ? "Vui lòng nhập nội dung." : currentLength < 10 ? "Còn quá ngắn (min 10)." : "Nội dung hợp lệ."}
                </span>
                <span className="text-slate-400">{currentLength} ký tự</span>
              </div>
            )}
          </div>

          {/* --- KHU VỰC HIỂN THỊ ẢNH (QUAN TRỌNG) --- */}
          
          {/* 1. Hiển thị ảnh CŨ (nếu có) */}
          {existingImages.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Ảnh đã tải lên
              </p>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((imgUrl, index) => (
                  <div key={`exist-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    <img 
                      src={getImageUrl(imgUrl)} 
                      alt="review-old" 
                      className="h-full w-full object-cover" 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
                    />
                    {/* Ở chế độ Edit, nếu bạn muốn cho xoá ảnh cũ thì thêm logic ở đây. 
                        Hiện tại chỉ hiển thị để user biết đã có ảnh. */}
                  </div>
                ))}
              </div>
              {/* Cảnh báo khi đang edit */}
              {!isReadOnly && newImages.length > 0 && (
                 <div className="mt-2 flex items-start gap-2 rounded bg-amber-50 p-2 text-xs text-amber-700">
                    <Info size={14} className="mt-0.5 shrink-0"/>
                    <p>Lưu ý: Nếu bạn tải lên ảnh mới, các ảnh cũ ở trên sẽ bị thay thế hoàn toàn.</p>
                 </div>
              )}
            </div>
          )}

          {/* 2. Upload ảnh MỚI (Chỉ hiện khi không phải ReadOnly) */}
          {!isReadOnly && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ImageIcon size={16} className="text-[rgb(40,169,224)]" />
                  {existingImages.length > 0 ? "Thay đổi ảnh / video" : "Thêm ảnh / video"}
                </p>
                <span className="text-xs text-slate-400">
                  {newImages.length}/5 ảnh • {newVideos.length}/1 video
                </span>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-[rgb(40,169,224)] bg-blue-50/50 px-4 py-2 text-xs font-medium text-[rgb(40,169,224)] hover:bg-slate-100">
                <ImageIcon size={16} />
                <span>Chọn file mới</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                />
              </label>

              {(newImages.length > 0 || newVideos.length > 0) && (
                <div className="mt-4 space-y-4">
                  {newImages.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Ảnh mới chọn</p>
                      <div className="grid grid-cols-4 gap-2">
                        {newImages.map((file, index) => {
                          const url = URL.createObjectURL(file);
                          return (
                            <div key={`new-img-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                              <img src={url} alt="preview" className="h-full w-full object-cover" />
                              <button type="button" onClick={() => removeNewImage(index)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-500">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {newVideos.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Video mới chọn</p>
                      <div className="grid grid-cols-1 gap-2">
                        {newVideos.map((file, index) => {
                          const url = URL.createObjectURL(file);
                          return (
                            <div key={`new-vid-${index}`} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-black">
                              <video src={url} className="h-32 w-full object-cover opacity-80" controls />
                              <button type="button" onClick={() => removeNewVideo(index)} className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-500">
                                <Trash2 size={14} />
                              </button>
                              <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-slate-50"><Film size={10} /> Video</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            {isReadOnly ? "Đóng" : "Hủy bỏ"}
          </Button>

          {mode === "view" && !isEditing ? (
            // ⭐ NÚT CHỈNH SỬA: ĐÃ SỬA LỖI & ĐỔI MÀU CAM
            <Button
              type="button" // Quan trọng: type="button" để không submit form
              onClick={(e) => {
                e.preventDefault(); 
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-amber-500 text-white hover:bg-amber-600 border-none shadow-sm"
            >
              <Pencil size={14} /> Chỉnh sửa
            </Button>
          ) : (
            // Nút Gửi / Lưu
            <Button
              type="submit"
              disabled={!isValid || submitting}
              className="flex min-w-[140px] items-center justify-center gap-2 rounded-full bg-[rgb(40,169,224)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(30,145,198)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Star size={16} className="fill-yellow-400 text-yellow-300" />
                  {mode === "view" ? "Lưu thay đổi" : "Gửi đánh giá"}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewBookingModal;