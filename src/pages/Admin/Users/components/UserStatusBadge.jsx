import React from "react";
import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";
import { useTranslation } from "react-i18next";

export default function UserStatusBadge({ status }) {
    const { t } = useTranslation();
    
    const getConfig = (s) => {
        const normalizedStatus = s ? s.toUpperCase() : "";

        switch (normalizedStatus) {
            case "ACTIVE":
                return { color: "success", label: t('users.active_accounts') };
            case "BANNED":
                return { color: "danger", label: t('users.banned_accounts') };
            case "PENDING":
                return { color: "warning", label: t('hotels.pending') };
            case "INACTIVE":
                return { color: "gray", label: t('owner.inactive') };
            default:
                return { color: "primary", label: s || t('common.no_data') };
        }
    };

    const config = getConfig(status);

    return <Badge color={config.color}>{config.label}</Badge>;
}

UserStatusBadge.propTypes = {
    status: PropTypes.string,
};
