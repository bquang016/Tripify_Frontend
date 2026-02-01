import React from "react";
import PropTypes from "prop-types";
import { Search, Filter, Crown } from "lucide-react";

export default function UserFilterBar({
                                          searchTerm,
                                          onSearchChange,
                                          roleFilter,
                                          onRoleFilterChange,
                                          rankFilter,
                                          onRankFilterChange
                                      }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Thanh tìm kiếm */}
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 sm:text-sm"
                    placeholder="Tìm kiếm user..."
                    value={searchTerm} // Liên kết với state UI để hiển thị mượt mà
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Khu vực bộ lọc */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

                {/* Bộ lọc Rank */}
                <div className="relative min-w-[160px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Crown className="h-4 w-4 text-yellow-500" />
                    </div>
                    <select
                        value={rankFilter}
                        onChange={(e) => onRankFilterChange(e.target.value)}
                        className="block w-full pl-9 pr-8 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 sm:text-sm rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <option value="ALL">Tất cả hạng</option>
                        <option value="BRONZE">Bronze</option>
                        <option value="SILVER">Silver</option>
                        <option value="GOLD">Gold</option>
                        <option value="DIAMOND">Diamond</option>
                    </select>
                </div>

                {/* Bộ lọc Vai trò - (Đã ẩn ADMIN) */}
                <div className="relative min-w-[160px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value)}
                        className="block w-full pl-9 pr-8 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 sm:text-sm rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="CUSTOMER">Khách hàng</option>
                        <option value="OWNER">Chủ khách sạn</option>
                        {/* Đã xóa ADMIN ở đây để không cho lọc */}
                    </select>
                </div>
            </div>
        </div>
    );
}

UserFilterBar.propTypes = {
    searchTerm: PropTypes.string,
    onSearchChange: PropTypes.func,
    roleFilter: PropTypes.string,
    onRoleFilterChange: PropTypes.func,
    rankFilter: PropTypes.string,
    onRankFilterChange: PropTypes.func
};