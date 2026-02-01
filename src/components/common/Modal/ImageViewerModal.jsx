import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import ModalPortal from "./ModalPortal"; // Sử dụng trực tiếp Portal

export default function ImageViewerModal({
  open,
  onClose,
  images = [],
  startIndex = 0,
}) {
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      resetTransform();
      // Khóa scroll body khi mở full screen
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open, startIndex]);

  if (!open || images.length === 0) return null;

  const current = images[index];

  const resetTransform = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
    setRotation(0);
  };

  const next = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
    resetTransform();
  };

  const prev = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
    resetTransform();
  };

  const handleZoom = (delta) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 4));
  };

  // Pan logic
  const startPanImage = (e) => {
    e.preventDefault(); // Ngăn drag mặc định của ảnh
    setIsPanning(true);
    setStartPan({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const panImage = (e) => {
    if (!isPanning) return;
    setPos({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const endPanImage = () => setIsPanning(false);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0 ? 0.2 : -0.2);
  };

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
        onMouseMove={panImage}
        onMouseUp={endPanImage}
        onMouseLeave={endPanImage}
      >
        {/* --- Toolbar trên cùng --- */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
          <div className="text-white font-medium text-lg drop-shadow-md">
            {index + 1} / {images.length}
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setRotation(r => r + 90)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
              <RotateCw size={20} />
            </button>
            <button onClick={() => handleZoom(0.5)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
              <ZoomIn size={20} />
            </button>
            <button onClick={() => handleZoom(-0.5)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition">
              <ZoomOut size={20} />
            </button>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition ml-4">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* --- Vùng hiển thị ảnh --- */}
        <div 
          className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
          onWheel={handleWheel}
          onMouseDown={startPanImage}
        >
          <img
            src={current.url}
            alt={current.caption}
            draggable={false}
            className="max-w-none max-h-none select-none transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: scale === 1 ? "90vw" : "none", // Giới hạn khi chưa zoom
              maxHeight: scale === 1 ? "90vh" : "none",
            }}
          />
        </div>

        {/* --- Nút điều hướng --- */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition z-50 backdrop-blur-md"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition z-50 backdrop-blur-md"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* --- Caption dưới cùng --- */}
        {current.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-center z-40">
            <p className="text-white text-lg font-medium drop-shadow-md">{current.caption}</p>
          </div>
        )}
      </div>
    </ModalPortal>
  );
}