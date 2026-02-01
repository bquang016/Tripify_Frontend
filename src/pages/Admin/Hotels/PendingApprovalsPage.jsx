import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

// Components
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay"; // ✅ Loading

import SubmissionSearchBar from "./components/SubmissionSearchBar";
import SubmissionStatusFilter from "./components/SubmissionStatusFilter";
import ApprovalCard from "./components/ApprovalCard";

// Modals
import ViewApplicationModal from "./components/ViewApplicationModal";
import ApproveOwnerModal from "./components/ApproveOwnerModal";
import RejectOwnerModal from "./components/RejectOwnerModal";

import adminService from "@/services/admin.service";

const PendingApprovalsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false); // ✅ Action Loading
  const [selectedApp, setSelectedApp] = useState(null);
  const [toastData, setToastData] = useState(null);

  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal visibility
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  // Fetch Data
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      let data = [];

      if (filterStatus === "ALL") {
        const [pending, approved, rejected] = await Promise.allSettled([
          adminService.getOwnerApplications("PENDING"),
          adminService.getOwnerApplications("APPROVED"),
          adminService.getOwnerApplications("REJECTED")
        ]);
        if (pending.status === "fulfilled") data = [...data, ...(pending.value.data || [])];
        if (approved.status === "fulfilled") data = [...data, ...(approved.value.data || [])];
        if (rejected.status === "fulfilled") data = [...data, ...(rejected.value.data || [])];
      } else {
        const res = await adminService.getOwnerApplications(filterStatus);
        data = res.data || [];
      }

      // Mapping
      const mappedData = data.map((app) => ({
        ...app,
        id: app.id, 
        fullName: app.applicantFullName || "Chưa rõ",
        email: app.applicantEmail,
        phoneNumber: app.applicantPhoneNumber || "Chưa cập nhật",
        avatar: app.applicantAvatar, 
        businessName: app.businessLicenseNumber ? `GPKD: ${app.businessLicenseNumber}` : "Cá nhân",
        status: app.status,
        submittedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString("vi-VN") : "N/A",
      }));

      mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(mappedData);

    } catch (error) {
      console.error(error);
      showToast("Lỗi tải dữ liệu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  // Filter
  const filteredList = useMemo(() => {
    if (!searchTerm) return applications;
    const q = searchTerm.toLowerCase();
    return applications.filter(
      (app) =>
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        (app.phoneNumber && app.phoneNumber.includes(q))
    );
  }, [applications, searchTerm]);

  // Handlers
  const handleViewDetails = (app) => { setSelectedApp(app); setIsViewOpen(true); };
  const handleApprove = (app) => { setSelectedApp(app); setIsApproveOpen(true); };
  const handleReject = (app) => { setSelectedApp(app); setIsRejectOpen(true); };

  const closeModals = () => {
    setIsViewOpen(false);
    setIsApproveOpen(false);
    setIsRejectOpen(false);
    setTimeout(() => setSelectedApp(null), 200);
  };

  // Actions (Với Loading Overlay)
  const onConfirmApprove = async () => {
    if (!selectedApp) return;
    setIsActionLoading(true);
    try {
      await adminService.reviewOwnerApplication(selectedApp.id, { status: "APPROVED" });
      showToast(`Đã duyệt chủ sở hữu ${selectedApp.fullName}`, "success");
      await fetchApplications();
      closeModals();
    } catch (error) {
      showToast(error.message || "Lỗi khi duyệt", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedApp) return;
    setIsActionLoading(true);
    try {
      await adminService.reviewOwnerApplication(selectedApp.id, { status: "REJECTED", reason });
      showToast(`Đã từ chối đơn của ${selectedApp.fullName}`, "success");
      await fetchApplications();
      closeModals();
    } catch (error) {
      showToast(error.message || "Lỗi khi từ chối", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      {toastData && <div className="fixed top-24 right-6 z-[9999]"><Toast message={toastData.message} type={toastData.type} /></div>}
      
      {isActionLoading && <LoadingOverlay message="Đang xử lý hồ sơ..." />}

      <Card className="overflow-hidden min-h-screen bg-gray-50/50 border-none shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <CardHeader title="Phê duyệt Đối tác" subtitle="Xác minh hồ sơ đăng ký chủ sở hữu" icon={<Users className="text-blue-600" />} className="p-0" />
          <Button variant="outline" size="sm" onClick={fetchApplications} leftIcon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}>Làm mới</Button>
        </div>

        <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <SubmissionStatusFilter currentStatus={filterStatus} onStatusChange={setFilterStatus} />
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="w-full md:w-1/2">
            <SubmissionSearchBar onSearch={setSearchTerm} initialValue={searchTerm} placeholder="Tìm theo tên, email, số điện thoại..." />
          </div>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={42} />
              <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredList.length > 0 ? (
                  filteredList.map((app) => (
                    <motion.div key={app.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <ApprovalCard application={app} onViewDetails={() => handleViewDetails(app)} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                        <EmptyState title="Không tìm thấy đơn đăng ký" description="Danh sách trống hoặc không khớp bộ lọc." icon={<ShieldCheck className="text-gray-300 w-16 h-16 mb-4" />} />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </Card>

      {selectedApp && (
        <>
          <ViewApplicationModal
            isOpen={isViewOpen}
            onClose={closeModals}
            application={selectedApp}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <ApproveOwnerModal open={isApproveOpen} onClose={closeModals} application={selectedApp} onConfirm={onConfirmApprove} />
          <RejectOwnerModal open={isRejectOpen} onClose={closeModals} application={selectedApp} onConfirm={onConfirmReject} />
        </>
      )}
    </>
  );
};

export default PendingApprovalsPage;