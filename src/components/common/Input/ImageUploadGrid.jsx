// src/components/common/Input/ImageUploadGrid.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X, Image as ImageIcon } from "lucide-react";

// --- 1. COMPONENT ẢNH ĐỂ SẮP XẾP (SORTABLE ITEM) ---
const SortablePhoto = ({ file, id, index, onRemove, isOverlay = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Tạo Sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Style cho hiệu ứng di chuyển
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Làm mờ ảnh gốc khi đang bị kéo đi
    zIndex: isDragging ? 1 : "auto",
  };

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isCover = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative aspect-square w-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all 
        ${isCover ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"}
        ${isOverlay ? "cursor-grabbing ring-2 ring-blue-500 scale-105 shadow-xl z-50 rotate-2" : "cursor-grab hover:border-blue-300"}
      `}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="preview"
          className="h-full w-full object-cover pointer-events-none" // Chặn drag mặc định của browser
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
        </div>
      )}

      {/* Overlay tối khi hover */}
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

      {/* Badge Ảnh bìa */}
      {isCover && (
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold text-white shadow-md">
          <ImageIcon size={10} /> ẢNH BÌA
        </div>
      )}

      {/* Nút Xóa (Chặn sự kiện kéo thả lan truyền) */}
      {!isOverlay && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()} // Quan trọng: Ngăn bắt đầu drag khi bấm xóa
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-1.5 text-gray-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

// --- 2. COMPONENT NÚT THÊM ẢNH ---
const AddImageButton = ({ onChange, multiple, accept }) => (
  <label className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-500">
    <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-200 group-hover:ring-blue-500">
      <Plus size={24} />
    </div>
    <span className="text-xs font-medium">Thêm ảnh</span>
    <input
      type="file"
      multiple={multiple}
      accept={accept}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      onChange={onChange}
    />
  </label>
);

// --- 3. COMPONENT CHÍNH ---
export default function ImageUploadGrid({
  value,
  onChange,
  multiple = true,
  accept = "image/png, image/jpeg, image/webp",
  error = "",
}) {
  // Chuyển FileList sang Array để xử lý
  const files = value ? Array.from(value) : [];
  const [activeId, setActiveId] = useState(null); // ID của ảnh đang được kéo

  // Tạo ID duy nhất cho mỗi file để dnd-kit theo dõi
  // Sử dụng useMemo để giữ ID ổn định, tránh re-render mất vị trí
  const items = useMemo(() => files.map((file) => ({
    id: file.name + file.size + file.lastModified, // ID unique
    file: file
  })), [files]);

  // Cấu hình cảm biến (Sensor) để phân biệt click và drag
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }), // Kéo 10px mới tính là drag
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // Xử lý Thêm ảnh
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;

    const dataTransfer = new DataTransfer();
    files.forEach((f) => dataTransfer.items.add(f));
    newFiles.forEach((f) => dataTransfer.items.add(f));
    onChange(dataTransfer.files);
  };

  // Xử lý Xóa ảnh
  const handleRemove = (indexToRemove) => {
    const dataTransfer = new DataTransfer();
    files.filter((_, i) => i !== indexToRemove).forEach((f) => dataTransfer.items.add(f));
    onChange(dataTransfer.files);
  };

  // Xử lý Kéo thả kết thúc
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      // Đổi chỗ mảng
      const newFilesArray = arrayMove(files, oldIndex, newIndex);

      // Convert lại sang FileList để trả về form
      const dataTransfer = new DataTransfer();
      newFilesArray.forEach((f) => dataTransfer.items.add(f));
      onChange(dataTransfer.files);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
            items={items.map(i => i.id)} 
            strategy={rectSortingStrategy} // Chiến thuật Grid (Lưới)
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            
            {/* Danh sách ảnh */}
            {items.map((item, index) => (
              <SortablePhoto
                key={item.id}
                id={item.id}
                file={item.file}
                index={index}
                onRemove={() => handleRemove(index)}
              />
            ))}

            {/* Nút Thêm ảnh */}
            <AddImageButton onChange={handleFileChange} multiple={multiple} accept={accept} />
          </div>
        </SortableContext>

        {/* Overlay (Cái ảnh đang bay lơ lửng khi kéo) */}
        <DragOverlay adjustScale={true}>
          {activeId ? (
            <SortablePhoto
              id={activeId}
              file={items.find((i) => i.id === activeId)?.file}
              index={items.findIndex((i) => i.id === activeId)}
              isOverlay={true} // Bật chế độ overlay để style đẹp hơn
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
