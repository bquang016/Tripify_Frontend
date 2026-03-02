import React from "react";
import PropTypes from "prop-types";
import Avatar from "@/components/common/Avatar/Avatar";
import { useTranslation } from "react-i18next";

const UserInfoCell = ({ avatar, fullName, email }) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex items-center gap-3 min-w-0">
            <Avatar
                src={avatar}
                name={fullName}
                size={40}
                className="shrink-0 border border-gray-100 shadow-sm"
            />
            <div className="flex flex-col min-w-0">
                <div 
                    className="font-bold text-gray-900 text-sm truncate"
                    title={fullName}
                >
                    {fullName || t('common.no_data')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium truncate">
                    <span className="truncate">{email}</span>
                </div>
            </div>
        </div>
    );
};

UserInfoCell.propTypes = {
    avatar: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
};

export default UserInfoCell;
