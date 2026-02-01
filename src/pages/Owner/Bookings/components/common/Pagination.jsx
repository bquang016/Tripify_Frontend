import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [jumpPage, setJumpPage] = useState("");

  // Tạo nhóm trang thông minh (1 ... 3 4 5 ... N)
  const getPaginationGroup = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Xử lý Enter để nhảy đến trang
  const handleJumpPage = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(jumpPage);
      // Kiểm tra xem số trang nhập vào có hợp lệ không
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        setJumpPage(""); // Xóa ô input sau khi nhảy trang (tuỳ chọn)
      }
    }
  };

  // --- PHẦN GIAO DIỆN PHẢI ĐƯỢC RETURN Ở ĐÂY ---
  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      {/* Nút Trước */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Nhóm trang */}
      <div className="flex gap-2">
        {getPaginationGroup().map((item, idx) => (
          <button
            key={idx}
            onClick={() => typeof item === "number" && onPageChange(item)}
            disabled={item === "..."}
            className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center ${
              item === currentPage
                ? "bg-[#28A9E0] text-white shadow"
                : item === "..."
                ? "bg-transparent text-gray-400 cursor-default"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Nút Sau */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Ô nhập đi đến trang */}
      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm text-gray-600">Đi đến:</span>
        <input
          type="text"
          value={jumpPage}
          onChange={(e) => {
            const val = e.target.value;
            // Chỉ cho nhập số
            if (val === "" || /^[0-9]+$/.test(val)) setJumpPage(val);
          }}
          onKeyDown={handleJumpPage}
          className="w-16 px-2 py-1 border rounded-lg text-center outline-none focus:border-[#28A9E0]"
        />
      </div>
    </div>
  );
};

export default Pagination;