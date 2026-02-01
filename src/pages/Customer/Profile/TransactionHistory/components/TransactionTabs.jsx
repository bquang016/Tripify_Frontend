import React from "react";
import TabsComponent from "@/components/common/Tabs/TabsComponent";

// Định nghĩa danh sách các Tab theo trạng thái
const TABS = [
    { id: "ALL", name: "Tất cả" },
    { id: "SUCCESS", name: "Thành công" },
    { id: "PENDING", name: "Đang xử lý" },
    { id: "REFUNDED", name: "Đã hoàn tiền" },
    { id: "FAILED", name: "Thất bại" },
];

export default function TransactionTabs({ activeTab, onTabChange }) {
    return (
        <div className="border-b border-gray-200 mb-4">
            <TabsComponent
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />
        </div>
    );
}