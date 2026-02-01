// src/pages/Admin/Hotels/components/SubmissionStatusFilter.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Layers } from "lucide-react";

const STATUS_OPTIONS = [
  { id: "ALL", label: "Tất cả", icon: Layers, color: "text-gray-600", bg: "bg-gray-100" },
  { id: "PENDING", label: "Chờ duyệt", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "APPROVED", label: "Đã duyệt", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { id: "REJECTED", label: "Từ chối", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
];

const SubmissionStatusFilter = ({ currentStatus, onStatusChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto no-scrollbar">
      {STATUS_OPTIONS.map((status) => {
        const isActive = currentStatus === status.id;
        const Icon = status.icon;

        return (
          <button
            key={status.id}
            onClick={() => onStatusChange(status.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${isActive ? "text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeStatusBg"
                className="absolute inset-0 bg-white rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className={`relative z-10 flex items-center gap-2 ${isActive ? status.color : ""}`}>
              <Icon size={16} />
              {status.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SubmissionStatusFilter;