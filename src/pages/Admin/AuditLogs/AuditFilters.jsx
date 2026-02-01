// src/pages/Admin/AuditLogs/AuditFilters.jsx

import React from "react";
import { Search, X } from "lucide-react";
import { LogAction, LogEntityType } from "@/constants/auditLog";
// 👉 nếu bạn chưa có constants thì có thể truyền options từ parent, file này vẫn dùng được

export default function AuditFilters({
                                         keyword,
                                         setKeyword,
                                         action,
                                         setAction,
                                         entityType,
                                         setEntityType,
                                         onClear,
                                     }) {
    const selectClass =
        "px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer outline-none focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224)]/20 transition-all";

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* SEARCH */}
            <div className="relative w-full md:w-80">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Tìm theo mô tả hoặc email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224)]/20 focus:border-[rgb(40,169,224)] transition-all"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* FILTERS */}
            <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-2 md:pb-0">
                <select
                    className={selectClass}
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                >
                    <option value="ALL">Tất cả hành động</option>
                    <option value="CREATE">CREATE</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                </select>

                <select
                    className={selectClass}
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                >
                    <option value="ALL">Tất cả đối tượng</option>
                    <option value="PROPERTY">PROPERTY</option>
                    <option value="ROOM">ROOM</option>
                </select>

                {(keyword || action !== "ALL" || entityType !== "ALL") && (
                    <button
                        onClick={onClear}
                        className="px-4 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1"
                    >
                        <X size={14} />
                        Xóa lọc
                    </button>
                )}
            </div>
        </div>
    );
}
