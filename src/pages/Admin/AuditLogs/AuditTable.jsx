// src/pages/Admin/AuditLogs/AuditTable.jsx

import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { formatAuditValue, getActionColor } from "@/utils/auditValueMapper";
import { useTranslation } from "react-i18next";

export default function AuditTable({ logs, sortConfig, onSort, onViewDetail }) {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    
    // Helper để render icon sort
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all ml-1.5" />;
        return sortConfig.direction === 'asc' 
            ? <ArrowUp size={14} className="text-[rgb(40,169,224)] ml-1.5" /> 
            : <ArrowDown size={14} className="text-[rgb(40,169,224)] ml-1.5" />;
    };

    const headerClass = (key) => `
        px-6 py-4 text-sm font-semibold tracking-tight transition-all cursor-pointer group
        ${sortConfig.key === key ? 'text-[rgb(40,169,224)] bg-blue-50/30' : 'text-gray-700 hover:text-[rgb(40,169,224)]'}
    `;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <th className={headerClass('logId')} onClick={() => onSort('logId')}>
                            <div className="flex items-center">{t('logs.table_id')} {renderSortIcon('logId')}</div>
                        </th>
                        <th className={headerClass('createdAt')} onClick={() => onSort('createdAt')}>
                            <div className="flex items-center">{t('logs.table_time')} {renderSortIcon('createdAt')}</div>
                        </th>
                        <th className={headerClass('action')} onClick={() => onSort('action')}>
                            <div className="flex items-center">{t('logs.table_action')} {renderSortIcon('action')}</div>
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {t('logs.table_target')}
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {t('logs.table_desc')}
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {t('logs.table_actor')}
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                            {t('logs.table_actions')}
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-50">
                    {logs.length > 0 ? (
                        logs.map((log) => {
                            const actionStyle = getActionColor(log.action);
                            
                            return (
                                <tr 
                                    key={log.logId} 
                                    className="hover:bg-gray-50/50 transition-all duration-200"
                                >
                                    <td className="px-6 py-5 text-sm font-medium text-gray-400">
                                        #{log.logId}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                                        {new Date(log.createdAt).toLocaleString(isVi ? "vi-VN" : "en-US")}
                                    </td>
                                    
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${actionStyle.bg} ${actionStyle.text} ${actionStyle.border}`}>
                                            {formatAuditValue(log.action, t)}
                                        </span>
                                    </td>
                                    
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                            {formatAuditValue(log.entityType, t)}
                                        </span>
                                    </td>
                                    
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-gray-600 font-medium max-w-[200px] truncate">
                                            {log.description || "-"}
                                        </p>
                                    </td>
                                    
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-800">{log.actorName}</span>
                                            <span className="text-xs text-gray-400 font-medium">{log.actorEmail}</span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => onViewDetail(log.logId)}
                                            className="text-[rgb(40,169,224)] hover:text-blue-700 font-bold text-sm transition-all underline-offset-2 hover:underline"
                                        >
                                            {t('logs.view_detail')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-16 text-center text-gray-400 font-medium text-sm italic">
                                {t('logs.no_data')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
