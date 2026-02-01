
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";

export default function Table({ columns = [], data = [] }) {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm bg-white relative">
            <table className="w-full text-left border-collapse">
                {/* ==== Header ==== */}
                <thead className="bg-[rgb(40,169,224,0.08)] text-[rgb(40,169,224)]">
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            className="px-5 py-3 font-semibold text-sm uppercase tracking-wide"
                        >
                            {col.label}
                        </th>
                    ))}
                    <th className="w-12"></th>
                </tr>
                </thead>

                {/* ==== Body ==== */}
                <tbody>
                <AnimatePresence>
                    {data.length > 0 ? (
                        data.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="border-t border-gray-100 hover:bg-[rgb(40,169,224,0.05)] transition-all duration-200"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-5 py-3 text-gray-700">
                                        {row[col.key]}
                                    </td>
                                ))}

                                {/* optional actions column */}
                                <td className="px-3 py-3 text-right text-gray-400 cursor-pointer hover:text-[rgb(40,169,224)] transition-colors">
                                    <MoreVertical size={18} />
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="py-8 text-center text-gray-400"
                            >
                                Không có dữ liệu để hiển thị
                            </td>
                        </tr>
                    )}
                </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
