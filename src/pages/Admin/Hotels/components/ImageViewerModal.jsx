import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function ImageViewerModal({
  open,
  onClose,
  images = [],
  startIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Sync state khi mở
  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
      resetView();
      document.body.style.overflow = "hidden"; // Khóa cuộn trang chính
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open, startIndex]);

  // Reset khi đổi ảnh
  useEffect(() => {
    resetView();
  }, [currentIndex]);

  const resetView = () => {
    setTransform({ scale: 1, x: 0, y: 0 });
    isDragging.current = false;
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // --- LOGIC ZOOM & PAN ---
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const scaleSensitivity = 0.001;
    const delta = -e.deltaY * scaleSensitivity;
    setTransform((prev) => {
        const newScale = Math.min(Math.max(0.5, prev.scale + delta), 5);
        return { ...prev, scale: newScale };
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging.current = true;
    startPos.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const newX = e.clientX - startPos.current.x;
    const newY = e.clientY - startPos.current.y;
    setTransform((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (containerRef.current) containerRef.current.style.cursor = transform.scale > 1 ? 'grab' : 'default';
    }
  };

  // --- RENDER ---
  return (
    // ⭐ z-[200] ĐỂ ĐẢM BẢO NẰM TRÊN SIDEBAR (z-100)
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      
      {/* HEADER CONTROLS */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 text-white bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-sm font-medium opacity-80">
          {currentIndex + 1} / {images.length} • {currentImage.caption || 'Hình ảnh'}
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setTransform(p => ({...p, scale: p.scale + 0.5}))} className="p-2 hover:bg-white/20 rounded-full transition"><ZoomIn size={20}/></button>
            <button onClick={() => setTransform(p => ({...p, scale: Math.max(0.5, p.scale - 0.5)}))} className="p-2 hover:bg-white/20 rounded-full transition"><ZoomOut size={20}/></button>
            <button onClick={resetView} className="p-2 hover:bg-white/20 rounded-full transition"><RotateCcw size={20}/></button>
            <div className="w-[1px] h-6 bg-white/20 mx-2"></div>
            <button onClick={onClose} className="p-2 hover:bg-red-500/80 rounded-full transition"><X size={24}/></button>
        </div>
      </div>

      {/* MAIN IMAGE CONTAINER */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => { e.preventDefault(); resetView(); }}
      >
        <img
            src={currentImage.url}
            alt={currentImage.caption}
            style={{ 
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
                maxWidth: '90%',
                maxHeight: '85%'
            }}
            className="object-contain pointer-events-none shadow-2xl"
            draggable={false}
        />
      </div>

      {/* NAVIGATION BUTTONS */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

      {/* FOOTER THUMBNAILS (Optional - Hiển thị ảnh nhỏ bên dưới) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 z-50 no-scrollbar">
         {images.map((img, idx) => (
            <div 
                key={idx}
                onClick={() => { setCurrentIndex(idx); resetView(); }}
                className={`h-12 w-12 shrink-0 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${idx === currentIndex ? 'border-blue-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
                <img src={img.url} className="h-full w-full object-cover" />
            </div>
         ))}
      </div>
    </div>
  );
}