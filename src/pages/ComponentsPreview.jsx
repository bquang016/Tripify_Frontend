// src/pages/ComponentsPreview.jsx
import React, { useState } from "react";
import { Search, Plane, ArrowRight } from "lucide-react";

// ===== Common Components =====
import Button from "../components/common/Button/Button";
import Badge from "../components/common/Badge/Badge";
import Toast from "../components/common/Notification/Toast";
import Tooltip from "../components/common/Tooltip/Tooltip";
import Modal from "../components/common/Modal/Modal";
import ConfirmModal from "../components/common/Modal/ConfirmModal";
import EmptyState from "../components/common/EmptyState/EmptyState";
import Divider from "../components/common/Divider/Divider";
import Card from "../components/common/Card/Card";
import Breadcrumb from "../components/common/Breadcrumb/Breadcrumb";
import Dropdown from "../components/common/Dropdown/Dropdown";

// ===== Form Components =====
import TextField from "../components/common/Input/TextField";
import TextArea from "../components/common/Input/TextArea";
import SearchInput from "../components/common/Input/SearchInput";
import DatePicker from "../components/common/Input/DatePicker";
import DateRangePicker from "../components/common/Input/DateRangePicker";
import TimePicker from "../components/common/Input/TimePicker";
import Select from "../components/common/Select/Select";
import Table from "../components/common/Table/Table";

// ===== Loading Components =====
import Spinner from "../components/common/Loading/Spinner";
import Skeleton from "../components/common/Loading/Skeleton";
import LoadingOverlay from "../components/common/Loading/LoadingOverlay";

export default function ComponentsPreview() {
  // state
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [selected, setSelected] = useState("");

  // table data
  const columns = [
    { key: "name", label: "Họ tên" },
    { key: "email", label: "Email" },
    { key: "role", label: "Vai trò" },
    { key: "status", label: "Trạng thái" },
  ];
  const data = [
    { name: "Nguyễn Văn A", email: "a..example.com", role: "Khách hàng", status: "Đã duyệt" },
    { name: "Trần Thị B", email: "b..example.com", role: "Chủ khách sạn", status: "Đang chờ" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10 font-[Poppins] text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-[rgb(40,169,224)]">
        🎨 Smart Booking System — Components Preview
      </h1>

      {/* ============ BUTTONS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="lg" leftIcon={<Plane size={18} />}>
            Đặt phòng
          </Button>
          <Button size="md" rightIcon={<ArrowRight size={16} />}>
            Tiếp tục
          </Button>
          <Button size="sm" isLoading>
            Đang xử lý
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      <Divider />

      {/* ============ FORM COMPONENTS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Form Components</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            label="Họ tên"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <TextArea
            label="Mô tả"
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
          <SearchInput placeholder="Tìm kiếm khách sạn, địa điểm..." icon={<Search size={18} />} />
          <DatePicker label="Ngày đến" value={date} onChange={(e) => setDate(e.target.value)} />
          <TimePicker label="Giờ nhận phòng" value={time} onChange={(e) => setTime(e.target.value)} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={(e) => setStartDate(e.target.value)}
            onEndChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            label="Loại phòng"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            options={[
              { label: "Phòng đơn", value: "single" },
              { label: "Phòng đôi", value: "double" },
              { label: "Suite", value: "suite" },
            ]}
          />
        </div>
      </Card>

      <Divider />

      {/* ============ TABLE ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Table Component</h2>
        <Table columns={columns} data={data} />
      </Card>

      <Divider />

      {/* ============ BADGES & TOASTS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Badges & Notifications</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge>Primary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="danger">Danger</Badge>
          <Badge color="gray" icon={false}>Không icon</Badge>
        </div>

        <div className="flex flex-col gap-3">
          <Toast message="Thông tin hệ thống đang cập nhật..." type="info" />
          <Toast message="Thao tác thành công!" type="success" />
          <Toast message="Có lỗi xảy ra, vui lòng thử lại!" type="error" />
          <Toast message="Thiếu thông tin bắt buộc!" type="warning" />
        </div>
      </Card>

      <Divider />

      {/* ============ TOOLTIP & MODAL ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Tooltip & Modal</h2>
        <div className="flex gap-6 items-center flex-wrap">
          <Tooltip text="Mở modal thông tin" position="top">
            <Button onClick={() => setOpen(true)}>Mở Modal Chính</Button>
          </Tooltip>

          <Tooltip text="Xác nhận hành động" position="top">
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
              Mở ConfirmModal
            </Button>
          </Tooltip>
        </div>

        {/* Modal chính */}
        <Modal open={open} onClose={() => setOpen(false)} />

        {/* Confirm modal */}
        <ConfirmModal
          open={confirmOpen}
          type="warning"
          title="Xóa khách sạn?"
          message="Bạn có chắc chắn muốn xóa Sunrise Resort khỏi danh sách?"
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={() => alert("Đã xóa thành công!")}
          onClose={() => setConfirmOpen(false)}
        />
      </Card>

      <Divider />

      {/* ============ EMPTY STATE ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Empty State</h2>
        <EmptyState
          title="Không có dữ liệu"
          description="Vui lòng thử lại sau hoặc chọn bộ lọc khác."
        />
      </Card>

      <Divider />

      {/* ============ LOADING COMPONENTS ============ */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Loading Components</h2>
        <div className="flex items-center justify-around gap-6 flex-wrap">
          <Spinner />
          <div className="flex flex-col gap-3 w-40">
            <Skeleton width="100%" height="20px" />
            <Skeleton width="80%" height="20px" />
            <Skeleton width="60%" height="20px" />
          </div>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            Hiện LoadingOverlay
          </Button>
        </div>
        {loading && <LoadingOverlay message="Đang xử lý đặt phòng..." />}
      </Card>
      {/* ===== Breadcrumb & Dropdown Demo ===== */}
<Card>
  <h2 className="text-xl font-semibold mb-4">Breadcrumb & Dropdown</h2>

  <div className="mb-4">
    <Breadcrumb
      items={[
        { label: "Khách sạn", href: "/hotels" },
        { label: "Sunrise Resort", href: "/hotels/sunrise" },
        { label: "Đặt phòng" },
      ]}
    />
  </div>

  <Dropdown
    label="Thao tác"
    items={[
      { label: "Xem chi tiết", onClick: () => console.log("detail") },
      { label: "Sao chép mã", onClick: () => console.log("copy") },
      { label: "Xóa", danger: true, onClick: () => console.log("delete") },
    ]}
  />
</Card>


      <Divider />

      <div className="text-center text-gray-400 text-sm mt-8">
        Ⓒ Smart Booking System UI — designed with 💙 rgb(40,169,224)
      </div>
    </div>
  );
}




