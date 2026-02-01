import React from "react";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       paginatedCount,
                                       totalCount,
                                       onPageChange,
                                       paginationGroup,
                                       jumpPage,
                                       setJumpPage,
                                       onJumpPage
                                   }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-auto border-t border-gray-100">
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 gap-4">
        <span className="text-sm text-gray-500">
          Hiển thị{" "}
            <span className="font-semibold text-gray-700">
            {paginatedCount}
          </span>{" "}
            /{" "}
            <span className="font-semibold text-gray-700">
            {totalCount}
          </span>{" "}
            kết quả
        </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex gap-1">
                        {paginationGroup.map((item, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    typeof item === "number" && onPageChange(item)
                                }
                                disabled={item === "..."}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                                    item === currentPage
                                        ? "bg-[rgb(40,169,224)] text-white shadow-sm"
                                        : item === "..."
                                            ? "bg-transparent text-gray-400 cursor-default"
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        <ChevronRight size={18} />
                    </button>

                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Đi đến:
            </span>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-12 h-8 pl-2 pr-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)] focus:ring-1 focus:ring-[rgb(40,169,224)] transition-all"
                                placeholder={currentPage}
                                value={jumpPage}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^[0-9]+$/.test(val)) {
                                        setJumpPage(val);
                                    }
                                }}
                                onKeyDown={onJumpPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
