import React, { useState, useEffect, useCallback, useRef } from "react";
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import Pagination from "@/pages/Owner/Bookings/components/common/Pagination";
import UserStats from "./components/UserStats";
import UserFilterBar from "./components/UserFilterBar";
import UserTable from "./components/UserTable";
import adminService from "@/services/admin.service";
import { useTranslation } from "react-i18next";

export default function UserManagementPage() {
    const { t, i18n } = useTranslation();
    const toastRef = useRef();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [rankFilter, setRankFilter] = useState("ALL");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [stats, setStats] = useState({ total: 0, active: 0, banned: 0 });

    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [selectedUserForLock, setSelectedUserForLock] = useState(null);
    const [lockReason, setLockReason] = useState("");

    const [confirmModal, setConfirmModal] = useState({
        open: false, title: "", message: "", type: "info", confirmText: t('common.confirm'), onConfirm: null,
    });

    const addToast = (message, mode = "info") => {
        if (toastRef.current) toastRef.current.addMessage({ mode, message });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            if (searchTerm !== "") setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllUsers(
                currentPage - 1,
                pageSize,
                debouncedSearchTerm,
                roleFilter,
                "ALL",
                rankFilter
            );

            const data = response.data || response;
            if(data) {
                setUsers(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
                setStats({
                    total: data.totalElements || 0,
                    active: data.content?.filter(u => u.status === 'ACTIVE').length || 0,
                    banned: data.content?.filter(u => u.status === 'BANNED').length || 0
                });
            }
        } catch (error) {
            console.error("Failed:", error);
            addToast(i18n.language === 'vi' ? "Không thể tải danh sách người dùng" : "Failed to load user list", "error");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearchTerm, roleFilter, rankFilter, i18n.language]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchChange = (value) => setSearchTerm(value);
    const handleRoleChange = (role) => { setRoleFilter(role); setCurrentPage(1); };
    const handleRankChange = (rank) => { setRankFilter(rank); setCurrentPage(1); };
    const handlePageChange = (page) => setCurrentPage(page);

    const handleStatusClick = (userId, currentStatus) => {
        const user = users.find(u => u.userId === userId);

        if (currentStatus === "ACTIVE") {
            setSelectedUserForLock(user);
            setLockReason("");
            setIsLockModalOpen(true);
        } else {
            setConfirmModal({
                open: true,
                title: t('admin.users.unlock_account'),
                message: t('admin.users.unlock_message', { name: user?.fullName }),
                type: "success",
                confirmText: i18n.language === 'vi' ? 'Mở khóa' : 'Unlock',
                onConfirm: () => executeStatusChange(userId, "ACTIVE", "")
            });
        }
    };

    const handleConfirmLock = () => {
        if (!lockReason.trim()) {
            addToast(i18n.language === 'vi' ? "Vui lòng nhập lý do khóa tài khoản" : "Please enter a reason for locking", "warning");
            return;
        }
        if (selectedUserForLock) {
            executeStatusChange(selectedUserForLock.userId, "BANNED", lockReason);
        }
    };

    const executeStatusChange = async (userId, newStatus, reason) => {
        setIsLoading(true);
        try {
            await adminService.updateUserStatus(userId, newStatus, reason);
            const successMsg = newStatus === "BANNED" ? t('admin.users.lock_success') : t('admin.users.unlock_success');
            addToast(successMsg, "success");
            setIsLockModalOpen(false);
            setConfirmModal(prev => ({ ...prev, open: false }));
            fetchUsers();
        } catch (error) {
            const errorMessage = error.response?.data?.message || (i18n.language === 'vi' ? "Lỗi cập nhật trạng thái" : "Status update error");
            addToast(errorMessage, "error");
            setIsLoading(false);
            if(newStatus !== "BANNED") {
                setConfirmModal(prev => ({ ...prev, open: false }));
            }
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50 space-y-6 relative">
            {isLoading && <LoadingOverlay />}
            <ToastPortal ref={toastRef} autoClose={true} />

            <Modal
                open={isLockModalOpen}
                onClose={() => !isLoading && setIsLockModalOpen(false)}
                title={t('admin.users.lock_account')}
            >
                <div className="p-1 space-y-4">
                    <p className="text-gray-600 text-sm">
                        {i18n.language === 'vi' ? `Bạn đang khóa tài khoản ${selectedUserForLock?.fullName}.` : `You are locking account ${selectedUserForLock?.fullName}.`}
                        <br/>
                        {i18n.language === 'vi' ? 'Vui lòng nhập lý do để thông báo cho người dùng.' : 'Please enter a reason to notify the user.'}
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.users.lock_reason_label')} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={lockReason}
                            onChange={(e) => setLockReason(e.target.value)}
                            placeholder={t('admin.users.lock_reason_placeholder')}
                            disabled={isLoading}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm min-h-[100px] disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="text" onClick={() => setIsLockModalOpen(false)} disabled={isLoading}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant="danger" onClick={handleConfirmLock} disabled={isLoading}>
                            {t('admin.users.confirm_lock')}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
            />

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">{t('admin.users.title')}</h1>
            </div>

            <UserStats stats={stats} />

            <UserFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                roleFilter={roleFilter}
                onRoleFilterChange={handleRoleChange}
                rankFilter={rankFilter}
                onRankFilterChange={handleRankChange}
            />

            <UserTable
                users={users}
                onStatusChange={handleStatusClick}
            />

            {totalPages > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
