import React from "react";
import UserInfoCell from "./UserInfoCell";
import UserStatusBadge from "./UserStatusBadge";
import UserRoleBadge from "./UserRoleBadge";
import UserRankBadge from "./UserRankBadge";
import ActionMenu from "./ActionMenu";

export default function UserTable({ users, onStatusChange }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {/* ✅ ĐÃ SỬA: Chuyển nền sang xanh dương nhạt (bg-blue-50) và viền xanh (border-blue-100) */}
                        <tr className="bg-blue-50 border-b border-blue-100">
                            <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                                Người dùng
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                                Hạng TV
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                                Liên hệ
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider text-center">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {(!users || !Array.isArray(users) || users.length === 0) ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                                    Không có dữ liệu người dùng
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const primaryRole = (user.roles && user.roles.length > 0) ? user.roles[0] : "CUSTOMER";
                                const rank = user.membershipRank || "BRONZE";

                                return (
                                    <tr key={user.userId} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <UserInfoCell
                                                avatar={user.avatarUrl}
                                                fullName={user.fullName}
                                                email={user.email}
                                            />
                                        </td>

                                        <td className="px-6 py-4">
                                            <UserRoleBadge role={primaryRole} />
                                        </td>

                                        <td className="px-6 py-4">
                                            <UserRankBadge rank={rank} />
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {user.phoneNumber ? user.phoneNumber : ""}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <UserStatusBadge status={user.status} />
                                        </td>

                                        <td className="px-6 py-4">
                                            <ActionMenu
                                                onLock={() => onStatusChange(user.userId, user.status)}
                                                isLocked={user.status === 'BANNED'}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}