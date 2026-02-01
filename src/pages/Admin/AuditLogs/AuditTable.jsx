// src/pages/Admin/AuditLogs/AuditTable.jsx

import React from "react";

export default function AuditTable({ logs = [], onViewDetail }) {
    return (
        <table className="w-full border-collapse">
            {/* HEADER */}
            <thead className="bg-gray-50">
            <tr className="text-left text-sm font-semibold text-blue-600">
                <th className="px-6 py-4">Mã Log</th>
                <th className="px-6 py-4">Hành Động</th>
                <th className="px-6 py-4">Đối Tượng</th>
                <th className="px-6 py-4">Mô Tả</th>
                <th className="px-6 py-4">Người Thực Hiện</th>
                <th className="px-6 py-4 text-right"></th>
            </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">
            {logs.length === 0 && (
                <tr>
                    <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400"
                    >
                        Không có dữ liệu
                    </td>
                </tr>
            )}


            {logs.map((log) => (
                <tr
                    key={log.logId}
                    className="hover:bg-gray-50 transition"
                >
                    <td className="px-6 py-4 text-sm text-gray-700">
                        {log.logId}
                    </td>

                    <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
                                {log.action}
                            </span>
                    </td>

                    <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                                {log.entityType}
                            </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                        {log.description}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                        {log.actorEmail}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                        <button
                            onClick={() => onViewDetail(log.logId)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Xem chi tiết
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
