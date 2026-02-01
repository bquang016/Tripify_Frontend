import React from "react";
import { Search } from "lucide-react";
import DateRangePicker from "@/components/common/Input/DateRangePicker";

export default function TransactionFilter({ searchTerm, onSearchChange, dateRange, onDateChange }) {
    return (
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm mã GD, nội dung..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[rgb(40,169,224)] outline-none text-sm bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="md:col-span-2">
                <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onStartChange={(e) => onDateChange({ ...dateRange, start: e.target.value })}
                    onEndChange={(e) => onDateChange({ ...dateRange, end: e.target.value })}
                />
            </div>
        </div>
    );
}