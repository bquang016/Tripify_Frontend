import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import PromotionFormModal from "./components/PromotionFormModal";
import promotionService from "@/services/promotion.service";
import toast, { Toaster } from "react-hot-toast";
import Toast from "@/components/common/Notification/Toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
    Plus, Edit, Trash2, Tag, Search,
    Copy, CheckCircle2, AlertCircle, Ticket,
    ChevronLeft, ChevronRight, MoreVertical, PauseCircle, PlayCircle, XCircle,
    AlertTriangle, Clock, RotateCw, Image as ImageIcon, ShieldAlert
} from "lucide-react";

// ✅ R2 public base URL
const R2_PUBLIC_BASE_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
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

const parseDate = (dateInput) => {
    if (!dateInput) return new Date();
    if (Array.isArray(dateInput)) {
        return new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3] || 0, dateInput[4] || 0, dateInput[5] || 0);
    }
    return new Date(dateInput);
};

// --- MODALS ---
const StatusConfirmModal = ({ isOpen, onClose, onConfirm, promo }) => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    if (!isOpen || !promo) return null;
    const willPause = promo.isActive;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-slideUp">
                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${willPause ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {willPause ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{willPause ? (isVi ? "Tạm dừng khuyến mãi?" : "Pause Promotion?") : (isVi ? "Kích hoạt khuyến mãi?" : "Activate Promotion?")}</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        {isVi ? `Bạn có chắc muốn ${willPause ? 'tạm dừng' : 'kích hoạt'} mã` : `Are you sure you want to ${willPause ? 'pause' : 'activate'} code`}
                        <span className="font-bold text-gray-800 mx-1">{promo.code}</span>?
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors w-1/2">{t('common.cancel')}</button>
                        <button onClick={onConfirm} className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-transform active:scale-95 w-1/2 flex items-center justify-center gap-2 ${willPause ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}>
                            {willPause ? <PauseCircle size={18}/> : <PlayCircle size={18}/>}
                            {willPause ? (isVi ? "Tạm dừng" : "Pause") : (isVi ? "Kích hoạt" : "Activate")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, promoCode }) => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-slideUp">
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600"><Trash2 size={32} /></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{isVi ? "Xóa khuyến mãi?" : "Delete Promotion?"}</h3>
                    <p className="text-gray-500 text-sm mb-6">{isVi ? "Bạn có chắc chắn muốn xóa mã" : "Are you sure you want to delete code"} <span className="font-bold text-gray-800 mx-1">{promoCode}</span>?<br/><span className="text-red-500 font-medium italic mt-1 block">{isVi ? "Mã sẽ bị vô hiệu hóa và chuyển vào thùng rác." : "Code will be disabled and moved to trash."}</span></p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors w-1/2">{t('common.cancel')}</button>
                        <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg shadow-red-200 bg-red-500 hover:bg-red-600 transition-transform active:scale-95 w-1/2 flex items-center justify-center gap-2"><Trash2 size={18}/> {isVi ? "Xóa ngay" : "Delete now"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionMenu = ({ promo, onEdit, onDelete, onRequestToggle, canManage }) => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
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
            let style = { position: 'fixed', zIndex: 9999, minWidth: '192px' };
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
            if (isOpen && buttonRef.current && !buttonRef.current.contains(event.target) && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const handleScroll = () => { if (isOpen) setIsOpen(false); };
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
        <div ref={menuRef} style={menuStyle} className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden animate-fadeIn">
            <div className="py-1">
                {canManage && (
                    <>
                        <button onClick={() => { onEdit(promo); setIsOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2">
                            <Edit size={16} className="text-blue-500"/> {t('owner.edit')}
                        </button>
                        {!isExpired && (
                            <button onClick={() => { onRequestToggle(promo); setIsOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors flex items-center gap-2 ${isPaused ? 'hover:bg-green-50 hover:text-green-600' : 'hover:bg-orange-50 hover:text-orange-600'}`}>
                                {isPaused ? <><PlayCircle size={16} className="text-green-500"/> {isVi ? "Kích hoạt" : "Activate"}</> : <><PauseCircle size={16} className="text-orange-500"/> {isVi ? "Tạm dừng" : "Pause"}</>}
                            </button>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={() => { onDelete(promo); setIsOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"><Trash2 size={16} /> {t('owner.delete')}</button>
                    </>
                )}
                {!canManage && (
                   <div className="px-4 py-2.5 text-sm text-gray-400 italic">
                       {isVi ? "Không có quyền thao tác" : "No permission to edit"}
                   </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <button ref={buttonRef} onClick={toggleMenu} className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}>
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
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const { hasRole } = useAuth();

    // Phân quyền
    const canView = hasRole('PROMOTION_VIEW');
    const canManage = hasRole('PROMOTION_MANAGE');

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

    const showMessage = (type, message) => {
        toast.custom((tk) => (
            <Toast type={type} message={message} onClose={() => toast.dismiss(tk.id)} />
        ), { duration: 3000, position: 'bottom-center' });
    };

    const fetchPromotions = async () => {
        if (!canView) return;
        setIsLoading(true);
        try {
            const response = await promotionService.getAllPromotions();
            const rawData = response.data || [];
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
        } catch (error) { showMessage("error", isVi ? "Lỗi tải dữ liệu!" : "Failed to load data!"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchPromotions(); }, [canView]);

    const handleReload = async () => {
        await fetchPromotions();
        showMessage("success", isVi ? "Dữ liệu đã được làm mới!" : "Data refreshed!");
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

    useEffect(() => setCurrentPage(1), [searchTerm, filterStatus, filterType]);

    const getPaginationGroup = () => {
        const range = []; const delta = 1;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
        }
        return range;
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
        { key: "codeDisplay", label: t('admin_promotions.table_code') },
        { key: "bannerDisplay", label: t('admin_promotions.table_banner') },
        { key: "name", label: t('admin_promotions.table_name') },
        { key: "details", label: t('admin_promotions.table_details') },
        { key: "usageProgress", label: t('admin_promotions.table_usage') },
        { key: "endDateDisplay", label: t('admin_promotions.table_expiry') },
        { key: "statusLabel", label: t('owner.status') },
        { key: "actions", label: "" },
    ];

    const handleCopy = (text) => showMessage("success", `${t('admin_promotions.copy_success')}: ${text}`);
    const handleRequestToggleStatus = (promo) => {
        if (!canManage) return;
        setStatusConfirm({ isOpen: true, promo });
    };

    const handleConfirmToggleStatus = async () => {
        if (statusConfirm.promo && canManage) {
            try {
                await promotionService.togglePromotion(statusConfirm.promo.id);
                await fetchPromotions();
                showMessage("success", t('admin_promotions.status_success'));
            } catch (error) {
                showMessage("error", error.response?.data?.message || error.message);
            }
            setStatusConfirm({ isOpen: false, promo: null });
        }
    };

    const handleRequestDelete = (promo) => {
        if (!canManage) return;
        setDeleteConfirm({ isOpen: true, promo });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm.promo && canManage) {
            try {
                await promotionService.deletePromotion(deleteConfirm.promo.id);
                await fetchPromotions();
                showMessage("success", t('admin_promotions.delete_success'));
            } catch (error) { showMessage("error", error.response?.data?.message || "Error"); }
            setDeleteConfirm({ isOpen: false, promo: null });
        }
    };

    const formatDateTimeDisplay = (dateInput) => {
        if (!dateInput) return "";
        const date = parseDate(dateInput);
        return date.toLocaleString(isVi ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getDaysRemaining = (dateInput) => {
        const now = new Date();
        const end = parseDate(dateInput);
        return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    };

    const getDisplayData = (data) => {
        return data.map((item) => {
            const status = getPromoStatus(item);
            const daysRemaining = getDaysRemaining(item.endDate);
            const usagePercent = item.quantity > 0 ? Math.round((item.usedCount / item.quantity) * 100) : 0;
            const isNearFull = usagePercent >= 90;

            return {
                ...item,
                codeDisplay: (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCopy(item.code)} title={t('admin_promotions.copy_click')}>
                        <span className={`font-mono font-bold px-2 py-1 rounded border transition-colors ${status === 'ACTIVE' ? 'text-[rgb(40,169,224)] bg-blue-50 border-blue-100 group-hover:bg-blue-100' : (status === 'PAUSED' ? 'text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100' : 'text-gray-500 bg-gray-100 border-gray-200')}`}>{item.code}</span>
                        <Copy size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                ),
                bannerDisplay: (
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm group relative">
                        <BannerImage url={item.bannerUrl} />
                    </div>
                ),
                details: item.type === 'PERCENT' ? `${item.value}%${item.maxDiscount > 0 ? ` (Max ${item.maxDiscount.toLocaleString()}đ)` : ''}` : `${Number(item.value).toLocaleString()}đ`,
                usageProgress: (
                    <div className="w-32">
                        <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100 group">
                            <div className={`absolute top-0 left-0 h-full z-10 overflow-hidden transition-all duration-700 ease-out ${isNearFull ? 'bg-red-500' : (usagePercent > 50 ? 'bg-orange-400' : 'bg-[rgb(40,169,224)]')}`} style={{ width: `${usagePercent}%` }}>
                                <div className="w-32 h-full flex items-center justify-center"><span className="text-[10px] font-bold text-white drop-shadow-sm select-none">{item.usedCount} / {item.quantity}</span></div>
                            </div>
                            {!isNearFull && <div className="absolute inset-0 flex items-center justify-center z-0"><span className="text-[10px] font-bold text-gray-500 select-none">{item.usedCount} / {item.quantity}</span></div>}
                        </div>
                    </div>
                ),
                endDateDisplay: (
                    <div className="flex flex-col">
                        <span className="text-gray-600 whitespace-nowrap font-medium text-sm">{formatDateTimeDisplay(item.endDate)}</span>
                        {status === 'ACTIVE' && daysRemaining > 0 && daysRemaining <= 7 && <span className="text-[10px] text-orange-500 flex items-center gap-1 font-medium mt-0.5"><Clock size={10} /> {t('admin_promotions.days_left', { count: daysRemaining })}</span>}
                        {status === 'EXPIRED' && <span className="text-[10px] text-red-400 flex items-center gap-1 font-medium mt-0.5">{t('admin_promotions.ended')}</span>}
                    </div>
                ),
                statusLabel: (
                    <>
                        {status === 'ACTIVE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {t('admin_promotions.active')}</span>}
                        {status === 'PAUSED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> {t('admin_promotions.paused')}</span>}
                        {status === 'EXPIRED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap"><XCircle size={12} /> {t('admin_promotions.expired')}</span>}
                    </>
                ),
                actions: <div className="flex justify-center"><ActionMenu promo={item} onEdit={(p) => { setEditingPromo(p); setIsModalOpen(true); }} onDelete={handleRequestDelete} onRequestToggle={handleRequestToggleStatus} canManage={canManage} /></div>
            };
        });
    };

    const selectClassName = "px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

    if (!canView) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-6 bg-red-50 rounded-full text-red-500">
                    <ShieldAlert size={64} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{isVi ? "Truy cập bị từ chối" : "Access Denied"}</h2>
                <p className="text-gray-500 max-w-md text-center">
                    {isVi ? "Bạn không có quyền xem danh sách khuyến mãi. Vui lòng liên hệ quản trị viên để được cấp quyền PROMOTION_VIEW." : "You do not have permission to view the promotions list. Please contact the administrator for PROMOTION_VIEW permission."}
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <Toaster containerStyle={{ zIndex: 100000 }} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Tag className="text-[rgb(40,169,224)]" /> {t('admin_promotions.title')}</h1><p className="text-gray-500 mt-1 text-sm">{t('admin_promotions.subtitle')}</p></div>
                <div className="flex gap-3">
                    <button onClick={handleReload} disabled={isLoading} className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:text-[rgb(40,169,224)] transition-all group" title={isVi ? "Làm mới" : "Refresh"}><RotateCw size={20} className={isLoading ? 'animate-spin' : 'group-hover:rotate-180'} /></button>
                    {canManage && (
                        <Button onClick={() => { setEditingPromo(null); setIsModalOpen(true); }} leftIcon={<Plus size={18} />}>{t('admin_promotions.add_new')}</Button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title={t('admin_promotions.total_codes')} value={stats.total} icon={Ticket} bgClass="bg-blue-50" colorClass="text-blue-600" />
                <StatCard title={t('admin_promotions.active_codes')} value={stats.active} icon={CheckCircle2} bgClass="bg-green-50" colorClass="text-green-600" />
                <StatCard title={t('admin_promotions.paused_codes')} value={stats.inactive} icon={AlertCircle} bgClass="bg-orange-50" colorClass="text-orange-600" />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder={t('admin_promotions.search_placeholder')} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-2 md:pb-0">
                    <select className={selectClassName} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="ALL">{t('admin_promotions.filter_status')}</option><option value="ACTIVE">{t('admin_promotions.active')}</option><option value="PAUSED">{t('admin_promotions.paused')}</option><option value="EXPIRED">{t('admin_promotions.expired')}</option></select>
                    <select className={selectClassName} value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="ALL">{t('admin_promotions.filter_type')}</option><option value="PERCENT">%</option><option value="FIXED">$</option></select>
                    {(searchTerm || filterStatus !== 'ALL' || filterType !== 'ALL') && <button onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); setFilterType("ALL"); }} className="px-4 py-2.5 text-red-500 bg-red-50 rounded-xl text-sm font-medium">{t('admin_promotions.clear_filters')}</button>}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden [&_th:last-child]:!hidden [&_td:last-child:not(:only-child)]:!hidden">
                {isLoading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>}
                {filteredPromotions.length > 0 ? (
                    <>
                        <Table columns={columns} data={getDisplayData(paginatedData)} />
                        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-sm text-gray-500">{isVi ? `Hiển thị ${paginatedData.length} / ${filteredPromotions.length}` : `Showing ${paginatedData.length} / ${filteredPromotions.length}`}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white disabled:opacity-50"><ChevronLeft size={18} /></button>
                                <div className="flex gap-1">{getPaginationGroup().map((item, idx) => (<button key={idx} onClick={() => typeof item === 'number' && setCurrentPage(item)} className={`w-8 h-8 rounded-lg text-sm ${item === currentPage ? "bg-blue-500 text-white" : "bg-white border"}`}>{item}</button>))}</div>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white disabled:opacity-50"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </>
                ) : !isLoading && <div className="py-20 text-center"><Search size={40} className="text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold">{t('admin_promotions.no_results')}</h3></div>}
            </div>
            <PromotionFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchPromotions} initialData={editingPromo} />
            <StatusConfirmModal isOpen={statusConfirm.isOpen} onClose={() => setStatusConfirm({ isOpen: false, promo: null })} onConfirm={handleConfirmToggleStatus} promo={statusConfirm.promo} />
            <DeleteConfirmModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, promo: null })} onConfirm={handleConfirmDelete} promoCode={deleteConfirm.promo?.code} />
        </div>
    );
};

export default PromotionManager;
