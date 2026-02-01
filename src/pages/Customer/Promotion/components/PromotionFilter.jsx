import React from "react";
import { Search, Sparkles, X } from "lucide-react";

const PromotionFilter = ({ searchTerm, onSearchChange, totalCount }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            {/* 1. Phần tiêu đề và số lượng */}
            <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-500" size={20} />
                <h2 className="text-xl font-bold text-gray-800">
                    Tất cả khuyến mãi ({totalCount})
                </h2>
            </div>

            {/* 2. Phần Input tìm kiếm */}
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mã code..."
                    value={searchTerm}
                    // Gọi callback để cập nhật state ở component cha
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                {/* Nút xóa text (chỉ hiện khi có nội dung) */}
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default PromotionFilter;