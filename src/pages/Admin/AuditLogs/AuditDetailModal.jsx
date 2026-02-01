import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import systemLogService from "@/services/systemLog.service";
import { formatAuditValue } from "@/utils/auditValueMapper";

export default function AuditDetailModal({ open, logId, onClose }) {
    const [logDetail, setLogDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    // =========================
    // FETCH DETAIL
    // =========================
    useEffect(() => {
        if (!open || !logId) return;

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await systemLogService.getLogDetail(logId);
                setLogDetail(res);
            } catch (error) {
                console.error("Failed to fetch log detail", error);
                setLogDetail(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [open, logId]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Chi tiết Audit Log"
            maxWidth="max-w-4xl"
        >
            {loading && (
                <div className="text-center text-gray-500 py-10">
                    Đang tải dữ liệu...
                </div>
            )}

            {!loading && logDetail && (
                <div className="space-y-6">
                    {/* BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Info label="Log ID" value={logDetail.logId} />
                        <Info label="Hành động" value={formatAuditValue(logDetail.action)} />
                        <Info label="Loại đối tượng" value={formatAuditValue(logDetail.entityType)} />
                        <Info label="ID đối tượng" value={logDetail.entityId} />
                        <Info label="Actor ID" value={logDetail.actorId} />
                        <Info label="Tên người thao tác" value={logDetail.actorName} />
                        <Info label="Email" value={logDetail.actorEmail} />
                        <Info
                            label="Thời gian"
                            value={new Date(logDetail.createdAt).toLocaleString("vi-VN")}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                            Mô tả
                        </p>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700">
                            {logDetail.description || "Không có mô tả"}
                        </div>
                    </div>

                    {/* OLD / NEW VALUE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <JsonBox
                            title="Giá trị cũ"
                            value={formatAuditValue(logDetail.oldValue)}
                        />
                        <JsonBox
                            title="Giá trị mới"
                            value={formatAuditValue(logDetail.newValue)}
                        />
                    </div>
                </div>
            )}

            {!loading && !logDetail && (
                <div className="text-center text-gray-400 py-10">
                    Không có dữ liệu
                </div>
            )}
        </Modal>
    );
}

// =========================
// SUB COMPONENTS
// =========================
const Info = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 break-all">
            {value ?? "-"}
        </div>
    </div>
);

const JsonBox = ({ title, value }) => {
    const isEmpty = value === null || value === undefined || value === "";

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">
                {title}
            </p>

            {isEmpty ? (
                <div className="px-4 py-3 rounded-xl text-sm text-gray-400 bg-gray-100 border border-dashed border-gray-300 text-center">
                    Không có dữ liệu
                </div>
            ) : (
                <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-gray-800 whitespace-pre-wrap break-all">
                    {value}
                </div>
            )}
        </div>
    );
};

