import React from "react";
import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";
import { useTranslation } from "react-i18next";

export default function UserRoleBadge({ role }) {
    const { t } = useTranslation();
    
    const getConfig = (r) => {
        const normalizedRole = r ? r.toUpperCase() : "";

        switch (normalizedRole) {
            case "ADMIN":
                return { color: "primary", label: t('common.admin_dashboard') }; 
            case "OWNER":
                return { color: "primary", label: t('users.role_owner') }; 
            case "CUSTOMER":
                return { color: "success", label: t('users.role_customer') };   
            default:
                return { color: "gray", label: r || t('common.no_data') };
        }
    };

    const config = getConfig(role);

    return <Badge color={config.color}>{config.label}</Badge>;
}

UserRoleBadge.propTypes = {
    role: PropTypes.string,
};
