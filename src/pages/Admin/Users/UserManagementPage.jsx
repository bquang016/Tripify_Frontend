import React, { useState, useEffect, useCallback, useRef } from "react";

// ✅ Import các component Common
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";

import ToastPortal from "@/components/common/Notification/ToastPortal";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay"; // ✅ Component này sẽ hiện khi isLoading = true
import Pagination from "@/pages/Owner/Bookings/components/common/Pagination";

// Import các component con
import UserStats from "./components/UserStats";
import UserFilterBar from "./components/UserFilterBar";
import UserTable from "./components/UserTable";

// Import Service
import adminService from "@/services/admin.service";

export default function UserManagementPage() {
    const toastRef = useRef();

    // State dữ liệu
    const [users, setUsers] = useState([]);

    // ✅ Biến này sẽ điều khiển Loading toàn trang (cả lúc lấy data và lúc bấm nút Khóa)
    const [isLoading, setIsLoading] = useState(false);

    // State tìm kiếm & Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [rankFilter, setRankFilter] = useState("ALL");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Stats
    const [stats, setStats] = useState({ total: 0, active: 0, banned: 0 });

    // State cho Modal Khóa (Có nhập lý do)
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [selectedUserForLock, setSelectedUserForLock] = useState(null);
    const [lockReason, setLockReason] = useState("");

    // State cho Modal Mở khóa
    const [confirmModal, setConfirmModal] = useState({
        open: false, title: "", message: "", type: "info", confirmText: "Xác nhận", onConfirm: null,
    });

    const addToast = (message, mode = "info") => {
        if (toastRef.current) toastRef.current.addMessage({ mode, message });
    };

    // Debounce tìm kiếm
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            if (searchTerm !== "") setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Gọi API lấy danh sách
    const fetchUsers = useCallback(async () => {
        setIsLoading(true); // ✅ Bật loading toàn trang
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
            addToast("Không thể tải danh sách người dùng", "error");
        } finally {
            setIsLoading(false); // ✅ Tắt loading
        }
    }, [currentPage, pageSize, debouncedSearchTerm, roleFilter, rankFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handlers
    const handleSearchChange = (value) => setSearchTerm(value);
    const handleRoleChange = (role) => { setRoleFilter(role); setCurrentPage(1); };
    const handleRankChange = (rank) => { setRankFilter(rank); setCurrentPage(1); };
    const handlePageChange = (page) => setCurrentPage(page);

    // Xử lý click nút trạng thái
    const handleStatusClick = (userId, currentStatus) => {
        const user = users.find(u => u.userId === userId);

        if (currentStatus === "ACTIVE") {
            // Mở Modal Khóa
            setSelectedUserForLock(user);
            setLockReason("");
            setIsLockModalOpen(true);
        } else {
            // Mở Modal Mở khóa
            setConfirmModal({
                open: true,
                title: "Mở khóa tài khoản",
                message: `Bạn có chắc chắn muốn mở khóa cho tài khoản ${user?.fullName}?`,
                type: "success",
                confirmText: "Mở khóa",
                onConfirm: () => executeStatusChange(userId, "ACTIVE", "")
            });
        }
    };

    // Handler xác nhận khóa từ Modal
    const handleConfirmLock = () => {
        if (!lockReason.trim()) {
            addToast("Vui lòng nhập lý do khóa tài khoản", "warning");
            return;
        }
        if (selectedUserForLock) {
            executeStatusChange(selectedUserForLock.userId, "BANNED", lockReason);
        }
    };

    // Hàm gọi API thực thi
    const executeStatusChange = async (userId, newStatus, reason) => {
        // ✅ BẬT LOADING TOÀN TRANG (LoadingOverlay sẽ hiện lên)
        setIsLoading(true);

        try {
            await adminService.updateUserStatus(userId, newStatus, reason);

            const actionText = newStatus === "BANNED" ? "Đã khóa" : "Đã mở khóa";
            addToast(`${actionText} tài khoản thành công`, "success");

            // Đóng modal & reload
            setIsLockModalOpen(false);
            setConfirmModal(prev => ({ ...prev, open: false }));
            fetchUsers(); // fetchUsers cũng sẽ set isLoading=true/false lại nhưng không sao, nó sẽ nối tiếp nhau
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi cập nhật trạng thái";
            addToast(errorMessage, "error");
            // Tắt Loading nếu lỗi để người dùng còn thao tác tiếp
            setIsLoading(false);

            // Nếu lỗi không phải do khóa (ví dụ mở khóa lỗi), thì đóng modal confirm
            if(newStatus !== "BANNED") {
                setConfirmModal(prev => ({ ...prev, open: false }));
            }
        }
        // Lưu ý: Không để setIsLoading(false) ở finally ở đây vì fetchUsers() sẽ được gọi ngay sau đó
        // và fetchUsers() sẽ tự quản lý việc tắt loading khi tải xong dữ liệu mới.
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50 space-y-6 relative">

            {/* ✅ LoadingOverlay sẽ hiện ra khi isLoading = true */}
            {isLoading && <LoadingOverlay />}

            <ToastPortal ref={toastRef} autoClose={true} />

            {/* ✅ Modal Khóa Tài Khoản */}
            <Modal
                open={isLockModalOpen}
                onClose={() => !isLoading && setIsLockModalOpen(false)} // Chặn đóng khi đang load
                title="Khóa tài khoản"
            >
                <div className="p-1 space-y-4">
                    <p className="text-gray-600 text-sm">
                        Bạn đang khóa tài khoản <strong>{selectedUserForLock?.fullName}</strong>.
                        <br/>
                        Vui lòng nhập lý do để thông báo cho người dùng.
                    </p>

                    {/* Ô nhập lý do */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lý do khóa <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={lockReason}
                            onChange={(e) => setLockReason(e.target.value)}
                            placeholder="Ví dụ: Vi phạm chính sách cộng đồng..."
                            disabled={isLoading} // Disable khi đang loading
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm min-h-[100px] disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="text"
                            onClick={() => setIsLockModalOpen(false)}
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleConfirmLock}
                            disabled={isLoading} // Disable nút khi đang chạy
                        >
                            Xác nhận khóa
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal Mở khóa */}
            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                onConfirm={confirmModal.onConfirm}
                // ConfirmModal thường không cần prop loading nếu dùng LoadingOverlay phủ lên trên
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
            />

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
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