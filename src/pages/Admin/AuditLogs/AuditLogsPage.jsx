// src/pages/Admin/AuditLogs/AuditLogsPage.jsx

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AuditTable from "./AuditTable";
import AuditDetailModal from "./AuditDetailModal";
import systemLogService from "@/services/systemLog.service";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1); // UI dùng 1-based
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedLogId, setSelectedLogId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [jumpPage, setJumpPage] = useState("");

    // =========================
    // FETCH LOGS
    // =========================
    const fetchLogs = async (pageIndex = 1) => {
        try {
            const res = await systemLogService.getLogs(pageIndex - 1); // BE 0-based
            setLogs(res.content || []);
            setTotalPages(res.totalPages || 0);
            setTotalElements(res.totalElements || 0);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    // =========================
    // PAGINATION GROUP (giống PromotionManager)
    // =========================
    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= page - delta && i <= page + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) rangeWithDots.push(l + 1);
                else if (i - l !== 1) rangeWithDots.push("...");
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const p = parseInt(jumpPage);
            if (!isNaN(p) && p >= 1 && p <= totalPages) {
                setPage(p);
                setJumpPage("");
            }
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Lich sử hoạt động
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Lịch sử hoạt động hệ thống (tạo / sửa / xóa)
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <AuditTable
                    logs={logs}
                    onViewDetail={(id) => {
                        setSelectedLogId(id);
                        setIsDetailOpen(true);
                    }}
                />

                {/* ===== PAGINATION (COPY TỪ PROMOTION MANAGER) ===== */}
                <div className="mt-auto border-t border-gray-100">
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 gap-4">
                        <span className="text-sm text-gray-500">
                            Hiển thị{" "}
                            <span className="font-semibold text-gray-700">
                                {logs.length}
                            </span>{" "}
                            /{" "}
                            <span className="font-semibold text-gray-700">
                                {totalElements}
                            </span>{" "}
                            kết quả
                        </span>

                        <div className="flex items-center gap-2">
                            {/* PREV */}
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* PAGE NUMBERS */}
                            <div className="flex gap-1">
                                {getPaginationGroup().map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            typeof item === "number" && setPage(item)
                                        }
                                        disabled={item === "..."}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                                            item === page
                                                ? "bg-[rgb(40,169,224)] text-white shadow-sm"
                                                : item === "..."
                                                    ? "text-gray-400 cursor-default"
                                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            {/* NEXT */}
                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={18} />
                            </button>

                            {/* JUMP */}
                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                                <span className="text-sm text-gray-500">
                                    Đi đến:
                                </span>
                                <input
                                    type="text"
                                    className="w-12 h-8 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)]"
                                    placeholder={page}
                                    value={jumpPage}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "" || /^[0-9]+$/.test(val)) {
                                            setJumpPage(val);
                                        }
                                    }}
                                    onKeyDown={handleJumpPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AuditDetailModal
                open={isDetailOpen}
                logId={selectedLogId}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedLogId(null);
                }}
            />
        </div>
    );
}
