import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import PromotionFormModal from "./components/PromotionFormModal";
import promotionService from "@/services/promotion.service";
import toast, { Toaster } from "react-hot-toast";
import Toast from "@/components/common/Notification/Toast";
import {
    Plus, Edit, Trash2, Tag, Search,
    Copy, CheckCircle2, AlertCircle, Ticket,
    ChevronLeft, ChevronRight, MoreVertical, PauseCircle, PlayCircle, XCircle,
    AlertTriangle, Clock, RotateCw, Image as ImageIcon
} from "lucide-react";

// ✅ R2 public base URL (đúng theo ảnh mày gửi)
const R2_PUBLIC_BASE_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getFullImageUrl = (path) => {
    if (!path) return null;

    // Nếu BE đã trả full URL thì dùng luôn
    if (path.startsWith("http")) return path;

    // BE trả relative path: campaign-images/xxx.webp
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${R2_PUBLIC_BASE_URL}/${cleanPath}`;
};


const BannerImage = ({ url }) => {
    const [error, setError] = useState(false);
    if (!url || error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <ImageIcon size={18} />
            </div>
        );
    }
    return (
        <img
            src={getFullImageUrl(url)}
            alt="Banner"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={() => setError(true)}
        />
    );
};

// --- HELPER TOAST ---
const showToast = (type, message) => {
    toast.custom((t) => (
        <Toast type={type} message={message} onClose={() => toast.dismiss(t.id)} />
    ), {
        duration: 3000,
        position: 'bottom-center'
    });
};

const parseDate = (dateInput) => {
    if (!dateInput) return new Date();
    if (Array.isArray(dateInput)) {
        return new Date(
            dateInput[0],
            dateInput[1] - 1,
            dateInput[2],
            dateInput[3] || 0,
            dateInput[4] || 0,
            dateInput[5] || 0
        );
    }
    return new Date(dateInput);
};

// --- MODALS ---
const StatusConfirmModal = ({ isOpen, onClose, onConfirm, promo }) => {
    if (!isOpen || !promo) return null;
    const willPause = promo.isActive;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-slideUp">
                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${willPause ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {willPause ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{willPause ? "Tạm dừng khuyến mãi?" : "Kích hoạt khuyến mãi?"}</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Bạn có chắc muốn {willPause ? <span className="text-orange-600 font-bold">tạm dừng</span> : <span className="text-green-600 font-bold">kích hoạt</span>} mã
                        <span className="font-bold text-gray-800 mx-1">{promo.code}</span> không?
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors w-1/2">Hủy bỏ</button>
                        <button onClick={onConfirm} className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-transform active:scale-95 w-1/2 flex items-center justify-center gap-2 ${willPause ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}>
                            {willPause ? <PauseCircle size={18}/> : <PlayCircle size={18}/>}
                            {willPause ? "Tạm dừng" : "Kích hoạt"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, promoCode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-slideUp">
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600"><Trash2 size={32} /></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa khuyến mãi?</h3>
                    <p className="text-gray-500 text-sm mb-6">Bạn có chắc chắn muốn xóa mã <span className="font-bold text-gray-800 mx-1">{promoCode}</span> không?<br/><span className="text-red-500 font-medium italic mt-1 block">Mã sẽ bị vô hiệu hóa và chuyển vào thùng rác.</span></p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors w-1/2">Hủy bỏ</button>
                        <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg shadow-red-200 bg-red-500 hover:bg-red-600 transition-transform active:scale-95 w-1/2 flex items-center justify-center gap-2"><Trash2 size={18}/> Xóa ngay</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ACTION MENU (PORTAL) ---
const ActionMenu = ({ promo, onEdit, onDelete, onRequestToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const toggleMenu = (e) => {
        e.stopPropagation();

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const menuHeightEstimate = 160;
            const spaceBelow = viewportHeight - rect.bottom;

            let style = {
                position: 'fixed',
                zIndex: 9999,
                minWidth: '192px',
            };

            if (spaceBelow < menuHeightEstimate) {
                style.bottom = `${viewportHeight - rect.top + 5}px`;
                style.left = `${rect.right - 192}px`;
                style.transformOrigin = 'bottom right';
            } else {
                style.top = `${rect.bottom + 5}px`;
                style.left = `${rect.right - 192}px`;
                style.transformOrigin = 'top right';
            }
            setMenuStyle(style);
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                buttonRef.current && !buttonRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    const isExpired = parseDate(promo.endDate) < new Date();
    const isPaused = !promo.isActive;

    const menuContent = (
        <div
            ref={menuRef}
            style={menuStyle}
            className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden animate-fadeIn"
        >
            <div className="py-1">
                <button
                    onClick={() => { onEdit(promo); setIsOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                    <Edit size={16} className="text-blue-500"/> Sửa
                </button>

                {!isExpired && (
                    <button
                        onClick={() => { onRequestToggle(promo); setIsOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors flex items-center gap-2 ${
                            isPaused ? 'hover:bg-green-50 hover:text-green-600' : 'hover:bg-orange-50 hover:text-orange-600'
                        }`}
                    >
                        {isPaused ? <><PlayCircle size={16} className="text-green-500"/> Kích hoạt</> : <><PauseCircle size={16} className="text-orange-500"/> Tạm dừng</>}
                    </button>
                )}

                <div className="border-t border-gray-100 my-1"></div>

                <button onClick={() => { onDelete(promo); setIsOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"><Trash2 size={16} /> Xóa</button>
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
            >
                <MoreVertical size={18} />
            </button>
            {isOpen && createPortal(menuContent, document.body)}
        </>
    );
};

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:scale-105">
        <div><p className="text-gray-500 text-sm font-medium">{title}</p><h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4></div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}><Icon size={24} /></div>
    </div>
);

const PromotionManager = () => {
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterType, setFilterType] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    const itemsPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [statusConfirm, setStatusConfirm] = useState({ isOpen: false, promo: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, promo: null });

    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            const response = await promotionService.getAllPromotions();
            const rawData = response.data || [];

            // ✅ Lọc bỏ mã Owner và mã có trạng thái DELETED
            const adminPromotions = rawData.filter(item => !item.property && item.status !== 'DELETED');

            const mappedData = adminPromotions.map(item => ({
                id: item.promotionId,
                promotionId: item.promotionId,
                code: item.code,
                name: item.description,
                type: item.discountType === "PERCENTAGE" ? "PERCENT" : "FIXED",
                value: item.discountValue,
                quantity: item.usageLimit,
                usedCount: item.usageCount || 0,
                minOrder: item.minBookingAmount,
                maxDiscount: item.maxDiscountAmount,
                startDate: item.startDate,
                endDate: item.endDate,
                isActive: item.status === "ACTIVE",
                bannerUrl: item.bannerUrl,
                minMembershipRank: item.minMembershipRank
            }));
            mappedData.sort((a, b) => b.id - a.id);
            setPromotions(mappedData);
        } catch (error) {
            console.error("Failed to fetch promotions:", error);
            showToast("error", "Lỗi tải dữ liệu!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPromotions(); }, []);

    const handleReload = async () => {
        await fetchPromotions();
        showToast("success", "Dữ liệu đã được làm mới!");
    };

    const getPromoStatus = (promo) => {
        const now = new Date();
        const endDate = parseDate(promo.endDate);
        if (endDate < now) return "EXPIRED";
        if (!promo.isActive) return "PAUSED";
        return "ACTIVE";
    };

    const filteredPromotions = useMemo(() => {
        return promotions.filter(item => {
            const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const status = getPromoStatus(item);
            const matchesStatus = filterStatus === "ALL" || filterStatus === status;
            const matchesType = filterType === "ALL" || item.type === filterType;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [promotions, searchTerm, filterStatus, filterType]);

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPromotions.slice(start, start + itemsPerPage);
    }, [filteredPromotions, currentPage]);

    useMemo(() => setCurrentPage(1), [searchTerm, filterStatus, filterType]);

    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }
        range.forEach(i => {
            if (l) {
                if (i - l === 2) rangeWithDots.push(l + 1);
                else if (i - l !== 1) rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            l = i;
        });
        return rangeWithDots;
    };

    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(jumpPage);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                setCurrentPage(page);
                setJumpPage("");
            }
        }
    };

    const stats = {
        total: promotions.length,
        active: promotions.filter(p => getPromoStatus(p) === 'ACTIVE').length,
        inactive: promotions.filter(p => getPromoStatus(p) === 'PAUSED').length,
    };

    const columns = [
        { key: "codeDisplay", label: "Mã Code" },
        { key: "bannerDisplay", label: "Banner" },
        { key: "name", label: "Tên chương trình" },
        { key: "details", label: "Chi tiết giảm" },
        { key: "usageProgress", label: "Lượt sử dụng" },
        { key: "endDateDisplay", label: "Hết hạn" },
        {
            key: "statusLabel",
            label: "Trạng thái",
            sortable: false,
            isSortable: false,
            disableSorting: true,
            filterable: false,
            hideMenu: true,
            disableColumnMenu: true
        },
        // Action column defined by you
        {
            key: "actions",
            label: "",
            sortable: false,
            isSortable: false,
            disableSorting: true,
            filterable: false,
            hideMenu: true,
            disableColumnMenu: true
        },
    ];

    const handleCopy = (text) => showToast("success", `Đã copy mã: ${text}`);
    const handleRequestToggleStatus = (promo) => setStatusConfirm({ isOpen: true, promo });

    const handleConfirmToggleStatus = async () => {
        if (statusConfirm.promo) {
            const dataToSend = { ...statusConfirm.promo, isActive: !statusConfirm.promo.isActive };
            if (!dataToSend.startDate) dataToSend.startDate = dataToSend.endDate;
            try {
                await promotionService.updatePromotion(dataToSend.id, dataToSend);
                await fetchPromotions();
                showToast("success", "Cập nhật trạng thái thành công!");
            } catch (error) {
                console.error("Lỗi update:", error);
                showToast("error", error.response?.data?.message || error.message || "Lỗi cập nhật trạng thái");
            }
            setStatusConfirm({ isOpen: false, promo: null });
        }
    };

    const handleRequestDelete = (promo) => setDeleteConfirm({ isOpen: true, promo });

    const handleConfirmDelete = async () => {
        if (deleteConfirm.promo) {
            try {
                setPromotions(prev => prev.filter(p => p.id !== deleteConfirm.promo.id));
                await promotionService.deletePromotion(deleteConfirm.promo.id);
                await fetchPromotions();
                showToast("success", "Đã xóa mã khuyến mãi thành công!");
            } catch (error) {
                console.error(error);
                showToast("error", error.response?.data?.message || "Lỗi khi xóa mã khuyến mãi");
                await fetchPromotions();
            }
            setDeleteConfirm({ isOpen: false, promo: null });
        }
    };

    const formatDateTimeDisplay = (dateInput) => {
        if (!dateInput) return "";
        const date = parseDate(dateInput);
        return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getDaysRemaining = (dateInput) => {
        const now = new Date();
        const end = parseDate(dateInput);
        const diffTime = end - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDisplayData = (data) => {
        return data.map((item, index) => {
            const status = getPromoStatus(item);
            const daysRemaining = getDaysRemaining(item.endDate);
            const usagePercent = item.quantity > 0 ? Math.round((item.usedCount / item.quantity) * 100) : 0;
            const isNearFull = usagePercent >= 90;

            return {
                ...item,
                codeDisplay: (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy(item.code)} title="Click để copy">
                        <span className={`font-mono font-bold px-2 py-1 rounded border transition-colors ${status === 'ACTIVE' ? 'text-[rgb(40,169,224)] bg-blue-50 border-blue-100 group-hover:bg-blue-100' : (status === 'PAUSED' ? 'text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100' : 'text-gray-500 bg-gray-100 border-gray-200')}`}>{item.code}</span>
                        <Copy size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                ),
                bannerDisplay: (
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm group relative">
                        <BannerImage url={item.bannerUrl} />
                    </div>
                ),

                details: item.type === 'PERCENT'
                    ? (item.maxDiscount > 0
                        ? `${item.value}% (Tối đa ${Number(item.maxDiscount).toLocaleString()}đ)`
                        : `${item.value}%`)
                    : `${Number(item.value).toLocaleString()}đ`,

                usageProgress: (
                    <div className="w-32">
                        <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100 group" title={`${item.usedCount} đã dùng / ${item.quantity} tổng số`}>
                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                <span className="text-[10px] font-bold text-gray-500 select-none">{item.usedCount} / {item.quantity}</span>
                            </div>

                            <div
                                className={`absolute top-0 left-0 h-full z-10 overflow-hidden transition-all duration-700 ease-out ${
                                    isNearFull ? 'bg-red-500' : (usagePercent > 50 ? 'bg-orange-400' : 'bg-[rgb(40,169,224)]')
                                }`}
                                style={{ width: `${usagePercent}%` }}
                            >
                                <div className="w-32 h-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white drop-shadow-sm select-none">{item.usedCount} / {item.quantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ),
                endDateDisplay: (
                    <div className="flex flex-col">
                        <span className="text-gray-600 whitespace-nowrap font-medium text-sm">{formatDateTimeDisplay(item.endDate)}</span>
                        {status === 'ACTIVE' && daysRemaining > 0 && daysRemaining <= 7 && (
                            <span className="text-[10px] text-orange-500 flex items-center gap-1 font-medium mt-0.5"><Clock size={10} /> Còn {daysRemaining} ngày</span>
                        )}
                        {status === 'EXPIRED' && (
                            <span className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">Đã kết thúc</span>
                        )}
                    </div>
                ),
                statusLabel: (
                    <>
                        {status === 'ACTIVE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Hoạt động</span>}
                        {status === 'PAUSED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Tạm dừng</span>}
                        {status === 'EXPIRED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap"><XCircle size={12} /> Hết hạn</span>}
                    </>
                ),
                actions: (
                    <div className="flex justify-center">
                        <ActionMenu
                            promo={item}
                            onEdit={(p) => { setEditingPromo(p); setIsModalOpen(true); }}
                            onDelete={handleRequestDelete}
                            onRequestToggle={handleRequestToggleStatus}
                        />
                    </div>
                )
            };
        });
    };

    const selectClassName = "px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <Toaster
                containerStyle={{
                    zIndex: 100000,
                    top: 20,
                    left: 20,
                    bottom: 20,
                    right: 20,
                }}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Tag className="text-[rgb(40,169,224)]" /> Quản lý Khuyến mãi</h1><p className="text-gray-500 mt-1 text-sm">Tạo và quản lý các mã giảm giá, voucher cho khách hàng.</p></div>
                <div className="flex gap-3">
                    <button onClick={handleReload} disabled={isLoading} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-[rgb(40,169,224)] hover:border-[rgb(40,169,224)] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group" title="Làm mới dữ liệu"><RotateCw size={20} className={`transition-transform ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} /></button>
                    <Button onClick={() => { setEditingPromo(null); setIsModalOpen(true); }} leftIcon={<Plus size={18} />}>Thêm mã mới</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Tổng mã khuyến mãi" value={stats.total} icon={Ticket} bgClass="bg-blue-50" colorClass="text-blue-600" />
                <StatCard title="Đang hoạt động" value={stats.active} icon={CheckCircle2} bgClass="bg-green-50" colorClass="text-green-600" />
                <StatCard title="Đã tạm dừng" value={stats.inactive} icon={AlertCircle} bgClass="bg-orange-50" colorClass="text-orange-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Tìm kiếm theo mã code hoặc tên..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-2 md:pb-0">
                    <select className={selectClassName} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Đang hoạt động</option><option value="PAUSED">Tạm dừng</option><option value="EXPIRED">Đã hết hạn</option></select>
                    <select className={selectClassName} value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="ALL">Tất cả loại giảm</option><option value="PERCENT">Giảm theo %</option><option value="FIXED">Giảm tiền mặt</option></select>
                    {(searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL') && (<button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="px-4 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium whitespace-nowrap">Xóa lọc</button>)}
                </div>
            </div>

            {/* ✅ [FIX TRIỆT ĐỂ] Dùng CSS Selector để ẩn cột cuối (do Table.jsx sinh ra thừa) mà không sửa file gốc */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col relative [&_th:last-child]:!hidden [&_td:last-child:not(:only-child)]:!hidden">
                {isLoading && (<div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[rgb(40,169,224)]"></div></div>)}
                {filteredPromotions.length > 0 ? (
                    <>
                        <Table columns={columns} data={getDisplayData(paginatedData)} />
                        <div className="mt-auto border-t border-gray-100">
                            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 gap-4">
                                <span className="text-sm text-gray-500">Hiển thị <span className="font-semibold text-gray-700">{paginatedData.length}</span> / <span className="font-semibold text-gray-700">{filteredPromotions.length}</span> kết quả</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"><ChevronLeft size={18} /></button>
                                    <div className="flex gap-1">{getPaginationGroup().map((item, index) => (<button key={index} onClick={() => typeof item === 'number' && setCurrentPage(item)} disabled={item === '...'} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${item === currentPage ? 'bg-[rgb(40,169,224)] text-white shadow-sm' : item === '...' ? 'bg-transparent text-gray-400 cursor-default' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{item}</button>))}</div>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"><ChevronRight size={18} /></button>
                                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200"><span className="text-sm text-gray-500 whitespace-nowrap">Đi đến:</span><div className="relative"><input type="text" className="w-12 h-8 pl-2 pr-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)] focus:ring-1 focus:ring-[rgb(40,169,224)] transition-all" placeholder={currentPage} value={jumpPage} onChange={(e) => { const val = e.target.value; if (val === '' || /^[0-9]+$/.test(val)) setJumpPage(val); }} onKeyDown={handleJumpPage} /></div></div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    !isLoading && (<div className="flex flex-col items-center justify-center py-20 text-center min-h-[400px]"><div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Search size={40} className="text-gray-300" /></div><h3 className="text-lg font-semibold text-gray-800">Không tìm thấy kết quả</h3><button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="mt-4 text-blue-600 font-medium hover:underline">Xóa bộ lọc & tìm lại</button></div>)
                )}
            </div>
            <PromotionFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchPromotions} initialData={editingPromo} />
            <StatusConfirmModal isOpen={statusConfirm.isOpen} onClose={() => setStatusConfirm({ isOpen: false, promo: null })} onConfirm={handleConfirmToggleStatus} promo={statusConfirm.promo} />
            <DeleteConfirmModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, promo: null })} onConfirm={handleConfirmDelete} promoCode={deleteConfirm.promo?.code} />
        </div>
    );
};

export default PromotionManager;