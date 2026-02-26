// src/pages/Admin/AuditLogs/AuditLogsPage.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
    ChevronLeft, ChevronRight, Search, 
    History, RefreshCcw, Download
} from "lucide-react";
import AuditTable from "./AuditTable";
import AuditDetailModal from "./AuditDetailModal";
import systemLogService from "@/services/systemLog.service";
import toast from "react-hot-toast";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedLogId, setSelectedLogId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [jumpPage, setJumpPage] = useState("");
    
    // State giao diện
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', sortDir: 'desc' });

    // 1. FETCH LOGS (Chỉ lấy dữ liệu từ Server theo trang)
    const fetchLogs = useCallback(async (pageIndex = 1) => {
        try {
            const res = await systemLogService.getLogs(pageIndex - 1); 
            // Đảm bảo mapping đúng với cấu trúc BE cũ (res.content hoặc res.data.content)
            const content = res.content || (res.data && res.data.content) || [];
            setLogs(content);
            setTotalPages(res.totalPages || (res.data && res.data.totalPages) || 0);
            setTotalElements(res.totalElements || (res.data && res.data.totalElements) || 0);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        }
    }, []);

    useEffect(() => {
        fetchLogs(page);
    }, [fetchLogs, page]);

    // 2. LOGIC XỬ LÝ TẠI MÁY KHÁCH (Dành cho Search, Filter, Sort khi BE chưa có)
    const displayLogs = useMemo(() => {
        let result = [...logs];

        // Tìm kiếm (Local)
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(log => 
                (log.actorEmail && log.actorEmail.toLowerCase().includes(lowSearch)) ||
                (log.actorName && log.actorName.toLowerCase().includes(lowSearch)) ||
                (log.description && log.description.toLowerCase().includes(lowSearch)) ||
                (log.entityId && log.entityId.toString().includes(lowSearch))
            );
        }

        // Lọc theo Action (Local)
        if (activeFilter !== "ALL") {
            result = result.filter(log => log.action === activeFilter);
        }

        // Sắp xếp (Local)
        result.sort((a, b) => {
            let valA = a[sortConfig.sortBy];
            let valB = b[sortConfig.sortBy];
            
            // Xử lý ngày tháng
            if (sortConfig.sortBy === 'createdAt') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }

            if (valA < valB) return sortConfig.sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [logs, searchTerm, activeFilter, sortConfig]);

    const handleExport = async () => {
        const loadingToast = toast.loading("Đang chuẩn bị báo cáo...");
        try {
            await systemLogService.exportLogs({});
            toast.success("Tải báo cáo thành công!", { id: loadingToast });
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Lỗi khi xuất báo cáo.");
            toast.dismiss(loadingToast);
        }
    };

    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
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

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.sortBy === key && sortConfig.sortDir === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ sortBy: key, sortDir: direction });
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            const p = parseInt(jumpPage);
            if (!isNaN(p) && p >= 1 && p <= totalPages) {
                setPage(p);
                setJumpPage("");
            }
        }
    };

    const filterOptions = [
        { label: "Tất cả", value: "ALL" },
        { label: "Tạo mới", value: "CREATE" },
        { label: "Cập nhật", value: "UPDATE" },
        { label: "Xóa", value: "DELETE" },
        { label: "Phê duyệt", value: "APPROVE" },
        { label: "Đình chỉ", value: "SUSPEND" },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[rgb(40,169,224)] rounded-lg text-white shadow-sm">
                        <History size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Nhật ký hệ thống</h1>
                        <p className="text-xs text-gray-400 font-medium">Giám sát dữ liệu hoạt động</p>
                    </div>
                </div>
                <div className="flex gap-2">
                     <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={16} /> Xuất báo cáo
                     </button>
                     <button onClick={() => fetchLogs(page)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[rgb(40,169,224)] transition-all shadow-sm">
                        <RefreshCcw size={18} />
                     </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl w-fit border border-gray-100">
                    {filterOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setActiveFilter(opt.value)}
                            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 uppercase tracking-wider ${
                                activeFilter === opt.value
                                    ? "bg-[rgb(40,169,224)] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-[350px] group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[rgb(40,169,224)]">
                        <Search size={16} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm hành động, email, id..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:bg-white focus:border-[rgb(40,169,224)] transition-all duration-200 shadow-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <AuditTable
                    logs={displayLogs} // Sử dụng danh sách đã được lọc/sắp xếp local
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onViewDetail={(id) => {
                        setSelectedLogId(id);
                        setIsDetailOpen(true);
                    }}
                />

                {/* Pagination */}
                <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                            Hiển thị <span className="text-gray-700 font-bold">{displayLogs.length}</span> / <span className="text-gray-700 font-bold">{totalElements}</span> kết quả
                        </span>
                        <div className="flex items-center gap-3 justify-end flex-1">
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30">
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex gap-1.5">
                                    {getPaginationGroup().map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof item === "number" && setPage(item)}
                                            disabled={item === "..."}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                                                item === page ? "bg-[rgb(40,169,224)] text-white shadow-sm" : item === "..." ? "text-gray-300 border-transparent cursor-default" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                                <span className="text-[11px] font-bold text-gray-400 uppercase">Đi đến:</span>
                                <div className="flex items-center gap-1">
                                    <input type="text" className="w-10 h-8 rounded-lg border border-gray-200 text-xs font-bold text-center outline-none focus:border-[rgb(40,169,224)]" value={jumpPage} onChange={(e) => setJumpPage(e.target.value.replace(/\D/, ''))} onKeyDown={handleJumpPage} />
                                    <button onClick={handleJumpPage} className="h-8 px-3 bg-gray-800 rounded-lg text-[10px] font-bold text-white hover:bg-gray-700 uppercase">Go</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AuditDetailModal open={isDetailOpen} logId={selectedLogId} onClose={() => { setIsDetailOpen(false); setSelectedLogId(null); }} />
        </div>
    );
}
