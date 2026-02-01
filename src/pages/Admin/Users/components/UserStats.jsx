import React from "react";
import PropTypes from "prop-types";
import { Users, UserCheck, UserX } from "lucide-react";

export default function UserStats({ stats }) {
    const statItems = [
        {
            label: "Tổng tài khoản",
            value: stats.total || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            label: "Đang hoạt động",
            value: stats.active || 0,
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100"
        },
        {
            label: "Đã khóa",
            value: stats.banned || 0,
            icon: UserX,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-100"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                            <Icon size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

UserStats.propTypes = {
    stats: PropTypes.shape({
        total: PropTypes.number,
        active: PropTypes.number,
        banned: PropTypes.number
    })
};