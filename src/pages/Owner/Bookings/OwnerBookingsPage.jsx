import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import {
    Users, Clock, AlertCircle, BedDouble, RefreshCw, Search, 
    ChevronLeft, ChevronRight, Building2, CalendarCheck
} from "lucide-react";

import Button from "./components/common/Button";
import OccupiedRoomsTable from "./components/bookings/OccupiedRoomsTable";
import BookingDetailModal from "./BookingDetailModal"; 
import CheckInModal from "./CheckInModal";   // ✅ Import Modal Check-in
import CheckOutModal from "./CheckOutModal"; // ✅ Import Modal Check-out

// Services
import bookingService from "../../../services/booking.service"; 
import propertyService from "../../../services/property.service"; 

const ITEMS_PER_PAGE = 10;
const COLOR_MAP = {
    blue: { text: "text-blue-600", bg: "bg-blue-50", gradient: "from-blue-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50", gradient: "from-amber-50" },
    rose: { text: "text-rose-600", bg: "bg-rose-50", gradient: "from-rose-50" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50", gradient: "from-emerald-50" }
};

const OwnerBookingsPage = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ ---
    const [myProperties, setMyProperties] = useState([]);
    const [selectedPropId, setSelectedPropId] = useState(propertyId || "");
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    
    // UI State
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("upcoming"); // Default: Sắp đến
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");

    // Modal State - Detail
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // Modal State - Check In
    const [checkInRoom, setCheckInRoom] = useState(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

    // Modal State - Check Out
    const [checkOutRoom, setCheckOutRoom] = useState(null);
    const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

    // --- 1. LOAD DANH SÁCH KHÁCH SẠN ---
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await propertyService.getOwnerActiveProperties();
                // Lấy data an toàn từ response
                const props = Array.isArray(res) ? res : (res.data || []); 
                setMyProperties(props);

                // Tự động chọn khách sạn đầu tiên nếu chưa chọn
                if (!selectedPropId && props.length > 0) {
                    setSelectedPropId(props[0].propertyId);
                } else if (propertyId && propertyId !== selectedPropId) {
                    setSelectedPropId(propertyId);
                }
            } catch (error) {
                console.error("Lỗi tải danh sách khách sạn:", error);
            }
        };
        fetchProperties();
    }, [propertyId]);

    // --- 2. LOAD BOOKINGS KHI ID KHÁCH SẠN THAY ĐỔI ---
    useEffect(() => {
        if (selectedPropId) {
            fetchOccupiedRooms(selectedPropId);
        }
    }, [selectedPropId]);

    const fetchOccupiedRooms = async (propId) => {
        setLoading(true);
        try {
            const data = await bookingService.getBookingsByPropertyId(propId);
            
            // Map dữ liệu từ Backend DTO sang format Frontend cần
            const mappedData = data.map((b) => ({
                // ID & Mã
                bookingId: b.bookingId, 
                id: b.bookingId,       
                bookingCode: `BK-${b.bookingId}`,
                
                // Thông tin phòng & Khách sạn
                roomName: b.roomName || "Chưa xếp phòng",
                roomId: b.roomId,
                
                // Thông tin khách hàng (Lấy từ object user lồng bên trong)
                customerName: b.user ? b.user.fullName : "Khách vãng lai",
                phone: b.user ? b.user.phoneNumber : "",
                email: b.user ? b.user.email : "",
                
                // Thời gian
                checkIn: b.checkInDate,
                checkOut: b.checkOutDate,
                // Alias cho một số component dùng tên khác
                checkInDate: b.checkInDate,   
                checkOutDate: b.checkOutDate, 
                
                // Tài chính
                totalPrice: b.totalPrice,
                guestCount: `${b.guestCount} người`,
                
                // Trạng thái
                status: b.status, // CONFIRMED, CHECKED_IN, ...
                originalStatus: b.status, // Lưu status gốc để logic check
                
                // Thanh toán
                paymentStatus: b.paymentStatus, // APPROVED, PENDING...
                paymentMethod: b.paymentMethod || "Chưa xác định",
                
                specialRequest: "Không" // Backend chưa có field này
            }));

            // Sắp xếp mới nhất lên đầu
            setRooms(mappedData.reverse());
        } catch (error) {
            console.error("Lỗi tải booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (e) => {
        const newId = e.target.value;
        setSelectedPropId(newId);
        // navigate(`/owner/bookings/${newId}`); // (Tuỳ chọn) Cập nhật URL
    };

    // --- 3. ACTIONS (HANDLERS) ---
    
    // --- XỬ LÝ CHECK-IN ---
    // Mở Modal Check-in
    const handleOpenCheckInModal = (bookingId) => {
        const room = rooms.find((r) => r.id === bookingId);
        if (room) {
            setCheckInRoom(room);
            setIsCheckInModalOpen(true);
        }
    };

    // Logic gọi API Check-in (Truyền vào Modal)
    const processCheckIn = async () => {
        if (!checkInRoom) return;
        // Gọi API
        await bookingService.checkInBooking(checkInRoom.id);
        // Reload dữ liệu ngầm
        await fetchOccupiedRooms(selectedPropId);
    };

    // --- XỬ LÝ CHECK-OUT ---
    // Mở Modal Check-out
    const handleOpenCheckOutModal = (bookingId) => {
        const room = rooms.find((r) => r.id === bookingId);
        if (room) {
            setCheckOutRoom(room);
            setIsCheckOutModalOpen(true);
            setIsDetailModalOpen(false); // Đóng modal chi tiết nếu đang mở
        }
    };

    // Logic gọi API Check-out (Truyền vào Modal)
    const processCheckOut = async () => {
        if (!checkOutRoom) return;
        // Gọi API
        await bookingService.checkOutBooking(checkOutRoom.id);
        // Reload dữ liệu ngầm
        await fetchOccupiedRooms(selectedPropId);
    };

    // Mở Modal Chi tiết
    const handleViewDetail = (room) => {
        setSelectedBooking(room);
        setIsDetailModalOpen(true);
    };

    // --- 4. FILTER LOGIC (TABS & SEARCH) ---
    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            // Filter by Tab Status
            let matchStatus = false;
            switch (statusFilter) {
                case "upcoming": // Sắp đến (Đã chốt đơn CONFIRMED)
                    matchStatus = room.status === 'CONFIRMED';
                    break;
                case "in-house": // Đang ở (CHECKED_IN)
                    matchStatus = room.status === 'CHECKED_IN';
                    break;
                case "pending": // Chờ thanh toán (PENDING_PAYMENT)
                    matchStatus = room.status === 'PENDING_PAYMENT';
                    break;
                case "history": // Lịch sử (Đã xong COMPLETED hoặc Đã hủy CANCELLED)
                    matchStatus = room.status === 'COMPLETED' || room.status === 'CANCELLED';
                    break;
                default: // All
                    matchStatus = true;
            }

            if (!matchStatus) return false;

            // Filter by Search Keyword
            if (searchKeyword.trim()) {
                const k = searchKeyword.toLowerCase();
                return (
                    (room.roomName && room.roomName.toLowerCase().includes(k)) ||
                    (room.customerName && room.customerName.toLowerCase().includes(k)) ||
                    (room.bookingCode && room.bookingCode.toLowerCase().includes(k))
                );
            }
            return true;
        });
    }, [rooms, searchKeyword, statusFilter]);

    // Tính toán Stats
    const stats = useMemo(() => ({
        upcoming: rooms.filter(r => r.status === 'CONFIRMED').length,
        inHouse: rooms.filter(r => r.status === 'CHECKED_IN').length,
        pending: rooms.filter(r => r.status === 'PENDING_PAYMENT').length,
    }), [rooms]);

    // --- 5. PAGINATION ---
    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRooms, currentPage]);

    const getPaginationGroup = () => {
        const delta = 1;
        const range = [];
        const rangeDots = [];
        let last = null;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }
        range.forEach((i) => {
            if (last) {
                if (i - last === 2) rangeDots.push(last + 1);
                else if (i - last > 2) rangeDots.push("...");
            }
            rangeDots.push(i);
            last = i;
        });
        return rangeDots;
    };

    const handleJumpPage = (e) => {
        if (e.key === "Enter") {
            const p = Number(jumpPage);
            if (p >= 1 && p <= totalPages) {
                setCurrentPage(p);
                setJumpPage("");
            }
        }
    };

    // --- UI RENDER ---
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-800">
            
            {/* --- MODALS --- */}
            
            <BookingDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                booking={selectedBooking}
                onCheckOut={handleOpenCheckOutModal} 
            />

            <CheckInModal
                isOpen={isCheckInModalOpen}
                onClose={() => setIsCheckInModalOpen(false)}
                onConfirm={processCheckIn}
                room={checkInRoom}
            />

            <CheckOutModal
                isOpen={isCheckOutModalOpen}
                onClose={() => setIsCheckOutModalOpen(false)}
                onConfirm={processCheckOut}
                room={checkOutRoom}
            />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Property Selector */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-[#28A9E0] rounded-lg text-white shadow-lg shadow-blue-200">
                                <BedDouble size={20} />
                            </span>
                            Quản Lý Lưu Trú
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 ml-1">
                            Theo dõi khách hàng check-in, check-out và thanh toán
                        </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-[#28A9E0] outline-none min-w-[220px] shadow-sm cursor-pointer"
                                value={selectedPropId}
                                onChange={handlePropertyChange}
                            >
                                {myProperties.length === 0 && <option value="" disabled>Đang tải danh sách...</option>}
                                {myProperties.map(p => (
                                    <option key={p.propertyId} value={p.propertyId}>{p.propertyName}</option>
                                ))}
                            </select>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => fetchOccupiedRooms(selectedPropId)}
                            icon={RefreshCw}
                            className={loading ? "opacity-70" : ""}
                        >
                            Làm mới
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Khách sắp đến", val: stats.upcoming, icon: CalendarCheck, color: "blue" },
                        { label: "Đang lưu trú", val: stats.inHouse, icon: Users, color: "emerald" },
                        { label: "Chờ thanh toán", val: stats.pending, icon: AlertCircle, color: "amber" },
                    ].map((s, i) => {
                        const C = COLOR_MAP[s.color];
                        return (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all"
                            >
                                <div className={`absolute right-0 top-0 w-16 h-full bg-gradient-to-l ${C.gradient} to-transparent opacity-50`} />
                                <div>
                                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">
                                        {s.label}
                                    </p>
                                    <p className={`text-3xl font-bold ${C.text}`}>{s.val}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${C.bg} ${C.text} group-hover:scale-110 transition-transform`}>
                                    <s.icon size={20} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content: Tabs & Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row gap-4 justify-between items-center">
                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm phòng, mã booking hoặc tên khách..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50
                                           focus:bg-white focus:ring-2 focus:ring-[#28A9E0] text-sm transition-all outline-none"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                            {[
                                { id: "upcoming", label: "Sắp đến" },
                                { id: "in-house", label: "Đang ở" },
                                { id: "pending", label: "Chờ TT" },
                                { id: "history", label: "Lịch sử" },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setStatusFilter(f.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                                        ${
                                            statusFilter === f.id
                                                ? "bg-[#28A9E0] text-white shadow-md"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <OccupiedRoomsTable
                        data={paginatedRooms}
                        loading={loading}
                        onCheckIn={handleOpenCheckInModal} // Mở Modal Check-in
                        onCheckOut={handleOpenCheckOutModal} // Mở Modal Check-out
                        onViewDetail={handleViewDetail}
                    />

                    {/* Pagination */}
                    <div className="mt-auto border-t border-slate-100">
                        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                            <span className="text-sm text-slate-500">
                                Hiển thị <span className="font-semibold text-slate-700">{paginatedRooms.length}</span> / <span className="font-semibold text-slate-700">{filteredRooms.length}</span> đơn
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex gap-1">
                                    {getPaginationGroup().map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => typeof item === "number" && setCurrentPage(item)}
                                            disabled={item === "..."}
                                            className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-colors
                                                ${item === currentPage
                                                    ? "bg-[#28A9E0] text-white shadow-sm"
                                                    : item === "..."
                                                    ? "text-slate-400 cursor-default"
                                                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                
                                {/* Jump Page */}
                                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                                    <span className="text-sm text-slate-500 whitespace-nowrap">Đi đến:</span>
                                    <input
                                        type="text"
                                        className="w-12 h-8 text-center rounded-lg border bg-white border-slate-200 text-sm focus:border-[#28A9E0] focus:ring-1 focus:ring-[#28A9E0] outline-none"
                                        placeholder={currentPage}
                                        value={jumpPage}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === "" || /^[0-9]+$/.test(v)) setJumpPage(v);
                                        }}
                                        onKeyDown={handleJumpPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerBookingsPage;