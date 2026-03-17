import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, DollarSign, RefreshCcw, CheckCircle2, AlertCircle, Plus, Search, Loader2 } from 'lucide-react';
import adminService from '@/services/admin.service';
import Button from '@/components/common/Button/Button';
import { formatCurrency } from '@/utils/priceUtils';
import Modal from '@/components/common/Modal/Modal';
// 1. Đổi cách import ToastPortal (Import default)
import ToastPortal from '@/components/common/Notification/ToastPortal';

export default function AdminPayoutsPage() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    
    // 2. Khởi tạo ref để gọi Toast
    const toastRef = useRef(null);

    // Modal tính doanh thu
    const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
    const [ownerIdInput, setOwnerIdInput] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllPayouts();
            setPayouts(res.data?.data || []);
        } catch (error) {
            // 3. Sửa cách gọi hàm thông báo (Dùng mode thay cho type)
            toastRef.current?.addMessage({ mode: 'error', message: 'Lỗi tải danh sách Payout: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    // TEST API 1: TÍNH TOÁN DOANH THU
    const handleCalculate = async () => {
        if (!ownerIdInput.trim()) {
            toastRef.current?.addMessage({ mode: 'warning', message: 'Vui lòng nhập ID của Chủ khách sạn' });
            return;
        }
        setIsCalculating(true);
        try {
            const res = await adminService.calculatePayout(ownerIdInput.trim());
            toastRef.current?.addMessage({ mode: 'success', message: res.data?.message || 'Tính toán thành công!' });
            setIsCalcModalOpen(false);
            setOwnerIdInput('');
            fetchPayouts(); // Reload bảng
        } catch (error) {
            toastRef.current?.addMessage({ mode: 'error', message: error.response?.data?.message || error.message });
        } finally {
            setIsCalculating(false);
        }
    };

    // TEST API 2: BẮN TIỀN QUA STRIPE
    const handleProcessPayout = async (payoutId) => {
        if (!window.confirm("Xác nhận chuyển tiền cho đối tác này qua Stripe?")) return;
        
        setProcessingId(payoutId);
        try {
            const res = await adminService.processPayout(payoutId);
            toastRef.current?.addMessage({ mode: 'success', message: 'Chuyển tiền thành công! Mã giao dịch: ' + res.data?.data?.stripeTransferId });
            fetchPayouts(); // Reload bảng
        } catch (error) {
            toastRef.current?.addMessage({ mode: 'error', message: error.response?.data?.message || 'Lỗi chuyển tiền' });
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Đã thanh toán</span>;
            case 'PENDING': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold flex items-center gap-1"><RefreshCcw size={12}/> Chờ chuyển khoản</span>;
            case 'FAILED': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1"><AlertCircle size={12}/> Lỗi giao dịch</span>;
            case 'MANUAL_REQUIRED': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1"><CreditCard size={12}/> Chuyển khoản tay</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Đối soát & Thanh toán (Payouts)</h2>
                    <p className="text-sm text-slate-500 mt-1">Quản lý dòng tiền và thanh toán doanh thu cho Đối tác</p>
                </div>
                <Button onClick={() => setIsCalcModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                    <Plus size={18} /> Chốt doanh thu mới
                </Button>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">Mã Phiếu</th>
                                <th className="p-4 font-bold">Đối tác (Owner ID)</th>
                                <th className="p-4 font-bold">Kỳ đối soát</th>
                                <th className="p-4 font-bold text-right">Tổng doanh thu</th>
                                <th className="p-4 font-bold text-right">Thực nhận (85%)</th>
                                <th className="p-4 font-bold text-center">Trạng thái</th>
                                <th className="p-4 font-bold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
                            ) : payouts.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Chưa có bản kê doanh thu nào</td></tr>
                            ) : (
                                payouts.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-slate-600">PO-{p.id}</td>
                                        <td className="p-4 text-sm font-medium text-slate-800">{p.owner?.fullName || p.owner?.userId}</td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {new Date(p.periodStart).toLocaleDateString('vi-VN')} - {new Date(p.periodEnd).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="p-4 text-right text-sm font-medium text-slate-600">{formatCurrency(p.totalRevenue)}</td>
                                        <td className="p-4 text-right font-bold text-indigo-600">{formatCurrency(p.payoutAmount)}</td>
                                        <td className="p-4 text-center">{getStatusBadge(p.status)}</td>
                                        <td className="p-4 text-center">
                                            {p.status === 'PENDING' && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleProcessPayout(p.id)}
                                                    disabled={processingId === p.id}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5"
                                                >
                                                    {processingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                                                    Bắn tiền
                                                </Button>
                                            )}
                                            {p.status === 'COMPLETED' && (
                                                <span className="text-xs text-slate-400 font-mono">{p.stripeTransferId}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL NHẬP ID OWNER ĐỂ TEST TÍNH DOANH THU */}
            <Modal open={isCalcModalOpen} onClose={() => setIsCalcModalOpen(false)} title="Chốt doanh thu tháng trước">
                <div className="p-2 space-y-4">
                    <p className="text-sm text-slate-600">Hệ thống sẽ quét các đơn hàng đã hoàn thành của Đối tác này trong tháng trước và tạo bản kê.</p>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nhập User ID của Owner</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={ownerIdInput} 
                                onChange={(e) => setOwnerIdInput(e.target.value)}
                                placeholder="VD: USR-123456"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsCalcModalOpen(false)}>Hủy</Button>
                        <Button onClick={handleCalculate} isLoading={isCalculating} className="bg-indigo-600 text-white">Tính toán</Button>
                    </div>
                </div>
            </Modal>

            {/* 4. Nhúng component ToastPortal vào cuối trang */}
            <ToastPortal ref={toastRef} autoClose={true} autoCloseTime={3000} />
        </div>
    );
}