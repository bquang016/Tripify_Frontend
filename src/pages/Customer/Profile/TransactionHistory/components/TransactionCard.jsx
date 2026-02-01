import React from "react";
import Badge from "@/components/common/Badge/Badge";
import { ArrowUpRight, ArrowDownLeft, Calendar, CreditCard, FileText } from "lucide-react";

const getStatusBadge = (status) => {
    switch (status) {
        case "SUCCESS": return <Badge color="success">Thành công</Badge>;
        case "PENDING": return <Badge color="warning">Đang xử lý</Badge>;
        case "FAILED": return <Badge color="danger">Thất bại</Badge>;

        case "REFUNDED": return <Badge color="primary">Đã hoàn tiền</Badge>;
        // Trường hợp mặc định sẽ hiển thị nguyên văn text (ví dụ "REFUNDED") nếu không khớp các case trên
        default: return <Badge color="gray">{status}</Badge>;
    }
};

const TransactionCard = ({ transaction, onClick }) => {
    // Logic xác định là tiền vào hay tiền ra
    const isIncoming = transaction.type === 'REFUND' || transaction.type === 'DEPOSIT';

    const dateObj = new Date(transaction.date);
    const dateStr = dateObj.toLocaleDateString('vi-VN');
    const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full transition-colors ${isIncoming ? 'bg-green-50 text-green-600 group-hover:bg-green-100' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                        {isIncoming ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Mã Giao Dịch</p>
                        <p className="font-bold text-gray-800 text-sm group-hover:text-[rgb(40,169,224)] transition-colors">{transaction.id}</p>
                    </div>
                </div>
                {/* Hiển thị Badge trạng thái tiếng Việt */}
                <div>{getStatusBadge(transaction.status)}</div>
            </div>

            <div className="flex-1 space-y-3 border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-start gap-2">
                    <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-700 line-clamp-2" title={transaction.description}>
                        {transaction.description}
                    </p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{timeStr}, {dateStr}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CreditCard size={16} />
                    <span>{transaction.method}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
                <span className="text-sm text-gray-500 font-medium">Tổng tiền</span>
                <span className={`text-lg font-bold ${isIncoming ? 'text-green-600' : 'text-gray-900'}`}>
                    {isIncoming ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}₫
                </span>
            </div>
        </div>
    );
};

export default TransactionCard;