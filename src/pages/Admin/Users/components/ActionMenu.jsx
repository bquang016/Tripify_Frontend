import React from "react";
import PropTypes from "prop-types";
import { Lock, Unlock } from "lucide-react";

export default function ActionMenu({ onLock, isLocked }) {
    return (
        <div className="flex justify-center w-full">
            <button
                type="button" // ✅ QUAN TRỌNG: Ngăn chặn reload
                onClick={onLock} // ✅ Tính năng vẫn chạy bình thường
                className={`p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isLocked
                        ? "text-orange-500 hover:bg-orange-50 bg-orange-50/50"
                        : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                }`}
                title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            >
                {isLocked ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
        </div>
    );
}

ActionMenu.propTypes = {
    onLock: PropTypes.func,
    isLocked: PropTypes.bool
};