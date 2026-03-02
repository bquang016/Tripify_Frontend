import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import systemLogService from "@/services/systemLog.service";
import { formatAuditValue } from "@/utils/auditValueMapper";
import { useTranslation } from "react-i18next";

export default function AuditDetailModal({ open, logId, onClose }) {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const [logDetail, setLogDetail] = useState(null);
    const [loading, setLoading] = useState(false);

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
            title={t('logs.detail_title')}
            maxWidth="max-w-4xl"
        >
            {loading && (
                <div className="text-center text-gray-500 py-10">
                    {t('logs.loading_details')}
                </div>
            )}

            {!loading && logDetail && (
                <div className="space-y-6">
                    {/* BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Info label={t('logs.table_id')} value={logDetail.logId} />
                        <Info label={t('logs.table_action')} value={formatAuditValue(logDetail.action, t)} />
                        <Info label={t('logs.object_type')} value={formatAuditValue(logDetail.entityType, t)} />
                        <Info label={t('logs.object_id')} value={logDetail.entityId} />
                        <Info label={t('logs.actor_id')} value={logDetail.actorId} />
                        <Info label={t('logs.actor_name')} value={logDetail.actorName} />
                        <Info label={t('logs.email')} value={logDetail.actorEmail} />
                        <Info
                            label={t('logs.time')}
                            value={new Date(logDetail.createdAt).toLocaleString(isVi ? "vi-VN" : "en-US")}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                            {t('logs.description')}
                        </p>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700">
                            {logDetail.description || t('logs.no_desc')}
                        </div>
                    </div>

                    {/* OLD / NEW VALUE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <JsonBox
                            title={t('logs.old_value')}
                            value={formatAuditValue(logDetail.oldValue)}
                            noDataText={t('common.no_data')}
                        />
                        <JsonBox
                            title={t('logs.new_value')}
                            value={formatAuditValue(logDetail.newValue)}
                            noDataText={t('common.no_data')}
                        />
                    </div>
                </div>
            )}

            {!loading && !logDetail && (
                <div className="text-center text-gray-400 py-10">
                    {t('common.no_data')}
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

const JsonBox = ({ title, value, noDataText = "No data" }) => {
    const isEmpty = value === null || value === undefined || value === "";

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">
                {title}
            </p>

            {isEmpty ? (
                <div className="px-4 py-3 rounded-xl text-sm text-gray-400 bg-gray-100 border border-dashed border-gray-300 text-center">
                    {noDataText}
                </div>
            ) : (
                <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-gray-800 whitespace-pre-wrap break-all">
                    {value}
                </div>
            )}
        </div>
    );
};
