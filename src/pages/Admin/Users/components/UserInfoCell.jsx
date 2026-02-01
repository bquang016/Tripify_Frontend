import React from "react";
import PropTypes from "prop-types"; // ✅ 1. Import PropTypes

export default function UserInfoCell({ avatar, fullName, email, phoneNumber }) {
    // URL ảnh mặc định
    const defaultAvatar = "https://i.pravatar.cc/150?u=default";

    return (
        <div className="flex items-center gap-3">
            {/* Avatar với xử lý lỗi */}
            <img
                src={avatar || defaultAvatar}
                alt={fullName || "User"}
                className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
                // ✅ 2. Tự động chuyển về ảnh mặc định nếu link ảnh bị lỗi
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                }}
            />

            <div className="flex flex-col min-w-0"> {/* min-w-0 giúp truncate hoạt động trong flex */}
                {/* Tên người dùng */}
                <span
                    className="font-semibold text-gray-900 text-sm truncate max-w-[180px]"
                    title={fullName} // Hover để xem tên đầy đủ
                >
                    {fullName || "Chưa cập nhật tên"}
                </span>

                {/* Thông tin liên hệ */}
                <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                    {email && <span className="truncate max-w-[120px]" title={email}>{email}</span>}

                    {/* ✅ 3. Logic hiển thị dấu chấm: Chỉ hiện khi có CẢ email VÀ phone */}
                    {email && phoneNumber && (
                        <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></span>
                    )}

                    {phoneNumber && <span className="shrink-0">{phoneNumber}</span>}
                </div>
            </div>
        </div>
    );
}

// ✅ 4. Định nghĩa PropTypes
UserInfoCell.propTypes = {
    avatar: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
};