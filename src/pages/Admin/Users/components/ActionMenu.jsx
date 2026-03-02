import React from "react";
import { Lock, Unlock } from "lucide-react";
import { useTranslation } from "react-i18next";

const ActionMenu = ({ onLock, isLocked }) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex justify-center">
            <button
                type="button" 
                onClick={onLock} 
                className={`p-2 rounded-lg transition-all duration-200 border ${
                    isLocked 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                        : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                }`}
                title={isLocked ? t('admin.users.unlock_account') : t('admin.users.lock_account')}
            >
                {isLocked ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
        </div>
    );
};

export default ActionMenu;
