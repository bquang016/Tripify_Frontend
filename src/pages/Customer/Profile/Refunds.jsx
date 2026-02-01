import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    RefreshCw, Loader2, Search, CheckCircle, XCircle, 
    CreditCard, Building2, AlertCircle, FileText, ArrowUpRight 
} from "lucide-react";
import { format } from "date-fns";        

// Components
import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import AccountMenu from "./AccountMenu";

// Services & Context
import { useAuth } from "@/context/AuthContext";
import paymentService from "@/services/payment.service";

export default function Refunds() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchRefunds = async () => {
            setLoading(true);
            try {
                const data = await paymentService.getMyTransactionHistory();
                
                // Lọc và map dữ liệu
                const refundList = Array.isArray(data) ? data
                    .filter(item => item.refundInfo != null)
                    .map(item => {
                        const info = item.refundInfo;
                        return {
                            id: info.id,
                            paymentId: item.paymentId,
                            bookingId: item.bookingId,
                            amount: info.amount,
                            reason: info.reason,
                            requestDate: info.requestDate,
                            resolveDate: info.resolveDate,
                            status: info.status,
                            adminNote: info.adminNote,
                            bankName: info.bankName,
                            accountNumber: info.accountNumber,
                            accountHolder: info.accountHolder
                        };
                    })
                    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                    : [];

                setRefunds(refundList);
            } catch (error) {
                console.error("❌ Lỗi khi tải refunds:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRefunds();
    }, []);

    // --- HELPER RENDERING ---
    
    // 1. Cấu hình màu sắc theo trạng thái
    const getStatusConfig = (status) => {
        switch (status) {
            case 'APPROVED':
                return {
                    color: 'emerald',
                    border: 'border-l-emerald-500',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    icon: <CheckCircle size={18} className="text-emerald-600" />,
                    label: 'Đã hoàn tiền'
                };
            case 'REJECTED':
                return {
                    color: 'rose',
                    border: 'border-l-rose-500',
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    icon: <XCircle size={18} className="text-rose-600" />,
                    label: 'Đã từ chối'
                };
            default: // PENDING
                return {
                    color: 'amber',
                    border: 'border-l-amber-400',
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    icon: <Loader2 size={18} className="animate-spin text-amber-600" />,
                    label: 'Đang xử lý'
                };
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    const formatDate = (dateString) => dateString ? format(new Date(dateString), "dd/MM/yyyy HH:mm") : "---";

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* MENU TRÁI */}
                <div className="lg:col-span-3">
                    <AccountMenu
                        activeSection="refunds"
                        userData={currentUser}
                    />
                </div>

                {/* NỘI DUNG PHẢI */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Header Page */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg text-blue-600"><RefreshCw size={24} /></span>
                                Yêu cầu hoàn tiền
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 ml-1">Quản lý các yêu cầu hoàn tiền của bạn.</p>
                        </div>
                    </div>

                    {/* DANH SÁCH */}
                    {loading ? (
                        <div className="flex justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                <span className="text-slate-400 text-sm">Đang tải dữ liệu...</span>
                            </div>
                        </div>
                    ) : refunds.length === 0 ? (
                        <div className="py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <EmptyState
                                title="Chưa có yêu cầu nào"
                                description="Bạn chưa gửi yêu cầu hoàn tiền nào gần đây."
                                icon={<RefreshCw size={48} className="text-slate-300 mb-4" />}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {refunds.map((item) => {
                                const statusConfig = getStatusConfig(item.status);
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 border-l-4 ${statusConfig.border}`}
                                    >
                                        
                                        {/* 1. HEADER CARD (Có màu nền nhẹ để tách biệt) */}
                                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm font-bold text-xs tracking-tighter">
                                                    #{item.bookingId}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Thời gian gửi yêu cầu</p>
                                                    <p className="text-sm font-semibold text-slate-800">{formatDate(item.requestDate)}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Badge trạng thái nổi bật */}
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} border ${statusConfig.border.replace('border-l-4', 'border')} ${statusConfig.text}`}>
                                                {statusConfig.icon}
                                                <span className="text-xs font-bold uppercase">{statusConfig.label}</span>
                                            </div>
                                        </div>

                                        {/* 2. BODY CARD */}
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            
                                            {/* Cột Trái: Chi tiết (Được highlight số tiền) */}
                                            <div className="space-y-5">
                                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                                                    <FileText size={16} className="text-blue-500"/> Chi tiết hoàn tiền
                                                </h4>
                                                
                                                {/* Khối số tiền nổi bật */}
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 flex justify-between items-center relative overflow-hidden">
                                                    <div className="relative z-10">
                                                        <p className="text-xs text-blue-600/80 font-semibold uppercase mb-1">Số tiền yêu cầu</p>
                                                        <p className="text-2xl font-extrabold text-blue-700 tracking-tight">
                                                            {formatCurrency(item.amount)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/60 p-2 rounded-full shadow-sm text-blue-500 relative z-10">
                                                        <ArrowUpRight size={24} />
                                                    </div>
                                                    {/* Decorative circle bg */}
                                                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Lý do của bạn:</p>
                                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 text-sm italic leading-relaxed">
                                                        "{item.reason}"
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cột Phải: Thông tin ngân hàng */}
                                            <div className="space-y-5">
                                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
                                                    <CreditCard size={16} className="text-orange-500"/> Tài khoản nhận tiền
                                                </h4>
                                                
                                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] space-y-4 relative">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500 flex gap-2 items-center"><Building2 size={14}/> Ngân hàng</span>
                                                        <span className="font-bold text-slate-800">{item.bankName}</span>
                                                    </div>
                                                    <div className="h-px bg-slate-100 w-full"></div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Số tài khoản</span>
                                                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-md tracking-wider">
                                                            {item.accountNumber}
                                                        </span>
                                                    </div>
                                                    <div className="h-px bg-slate-100 w-full"></div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Chủ tài khoản</span>
                                                        <span className="font-bold text-slate-800 uppercase">{item.accountHolder}</span>
                                                    </div>                                                 
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* 3. FOOTER: Admin Note (Khối cảnh báo) */}
                                        {item.adminNote && (
                                            <div className="mx-6 mb-6 px-5 py-4 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-3 shadow-sm">
                                                <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
                                                <div className="text-sm">
                                                    <span className="font-bold text-amber-800 block mb-1">Phản hồi từ Admin:</span>
                                                    <p className="text-slate-700 leading-relaxed">{item.adminNote}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}