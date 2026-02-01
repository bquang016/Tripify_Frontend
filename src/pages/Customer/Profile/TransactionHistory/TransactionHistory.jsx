import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../AccountMenu";
import { useAuth } from "@/context/AuthContext";
import paymentService from "@/services/payment.service";
import { format } from "date-fns";

// Components
import TransactionCard from "./components/TransactionCard";
import TransactionDetailModal from "./components/TransactionDetailModal";
import TransactionTabs from "./components/TransactionTabs";
import Spinner from "@/components/common/Loading/Spinner";

// ✅ 1. IMPORT MỚI
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Button from "@/components/common/Button/Button";
import { Receipt, Search } from "lucide-react"; 

export default function TransactionHistory() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [activeTab, setActiveTab] = useState("ALL");

    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                // Lưu ý: Đảm bảo currentUser.userId tồn tại (hoặc dùng currentUser.id)
                const userId = currentUser.userId || currentUser.id;
                const data = await paymentService.getHistoryByUser(userId);
                
                const mappedData = data.map(item => ({
                    id: `TRX-${item.paymentId}`,
                    bookingId: item.bookingId,
                    date: item.paymentDate,
                    description: `Thanh toán đặt phòng: ${item.propertyName}`,
                    amount: -item.amount,
                    refunded: item.refundedAmount,
                    method: item.paymentMethod || "Online Payment",
                    status: mapStatus(item.paymentStatus),
                    rawStatus: item.paymentStatus
                }));

                setTransactions(mappedData);
            } catch (error) {
                console.error("Failed to load transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    const mapStatus = (backendStatus) => {
        switch (backendStatus) {
            case 'APPROVED': return 'SUCCESS';
            case 'PENDING': return 'PENDING';
            case 'REJECTED': return 'FAILED';
            case 'REFUNDED': return 'REFUNDED';
            default: return 'PENDING';
        }
    };

    const filteredTransactions = transactions.filter(item => {
        if (activeTab === "ALL") return true;
        return item.status === activeTab;
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                    <AccountMenu
                        activeSection="transactions" // Highlight menu item
                        userData={currentUser}
                    />
                </div>

                <div className="lg:col-span-9 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch</h2>
                            <p className="text-gray-500 text-sm">Theo dõi dòng tiền và trạng thái thanh toán của bạn.</p>
                        </div>
                    </div>

                    <TransactionTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Danh sách Giao dịch */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Spinner /></div>
                    ) : (
                        <div className="flex flex-col gap-4 animate-fadeIn">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((item) => (
                                    <TransactionCard
                                        key={item.id}
                                        transaction={item}
                                        onClick={() => setSelectedTransaction(item)}
                                    />
                                ))
                            ) : (
                                // ✅ 2. TÍCH HỢP EMPTY STATE TẠI ĐÂY
                                <EmptyState
                                    title={activeTab === 'ALL' ? "Chưa có giao dịch nào" : "Không tìm thấy giao dịch"}
                                    description={activeTab === 'ALL' 
                                        ? "Bạn chưa thực hiện thanh toán nào trên hệ thống. Hãy đặt phòng ngay để trải nghiệm!"
                                        : "Không có giao dịch nào khớp với bộ lọc hiện tại."
                                    }
                                    // Icon thay đổi tùy ngữ cảnh
                                    icon={activeTab === 'ALL' 
                                        ? <Receipt size={48} className="text-gray-300" strokeWidth={1.5} />
                                        : <Search size={48} className="text-gray-300" strokeWidth={1.5} />
                                    }
                                    // Chỉ hiện nút Action khi ở tab Tất cả (khuyến khích đặt phòng)
                                    action={activeTab === 'ALL' && (
                                        <Button 
                                            onClick={() => navigate('/hotels')}
                                            className="px-6"
                                        >
                                            Khám phá khách sạn ngay
                                        </Button>
                                    )}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            

            {/* Modal Chi tiết */}
            <TransactionDetailModal
                open={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
            />
        </div>
    );
}