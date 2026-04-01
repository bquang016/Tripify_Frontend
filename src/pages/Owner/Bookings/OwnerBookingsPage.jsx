import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import {
    Users, Clock, AlertCircle, BedDouble, RefreshCw, Search, 
    ChevronLeft, ChevronRight, Building2, CalendarCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "./components/common/Button";
import OccupiedRoomsTable from "./components/bookings/OccupiedRoomsTable";
import BookingDetailModal from "./BookingDetailModal"; 
import CheckInModal from "./CheckInModal";   
import CheckOutModal from "./CheckOutModal"; 

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
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const { propertyId } = useParams();
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ ---
    const [myProperties, setMyProperties] = useState([]);
    const [selectedPropId, setSelectedPropId] = useState(propertyId || "");
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    
    // UI State
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("upcoming"); 
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");

    // Modal State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [checkInRoom, setCheckInRoom] = useState(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [checkOutRoom, setCheckOutRoom] = useState(null);
    const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

    // --- 1. LOAD DANH SÁCH KHÁCH SẠN ---
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await propertyService.getOwnerActiveProperties();
                const props = Array.isArray(res) ? res : (res.data || []); 
                setMyProperties(props);

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

    // --- 2. LOAD BOOKINGS ---
    useEffect(() => {
        if (selectedPropId) {
            fetchOccupiedRooms(selectedPropId);
        }
    }, [selectedPropId]);

    const fetchOccupiedRooms = async (propId) => {
        setLoading(true);
        try {
            const data = await bookingService.getBookingsByPropertyId(propId);
            const mappedData = data.map((b) => ({
                bookingId: b.bookingId, 
                id: b.bookingId,       
                bookingCode: `BK-${b.bookingId}`,
                roomName: b.roomName || (isVi ? "Chưa xếp phòng" : "Not assigned"),
                roomId: b.roomId,
                customerName: b.user ? b.user.fullName : (isVi ? "Khách vãng lai" : "Guest"),
                phone: b.user ? b.user.phoneNumber : "",
                email: b.user ? b.user.email : "",
                checkIn: b.checkInDate,
                checkOut: b.checkOutDate,
                checkInDate: b.checkInDate,   
                checkOutDate: b.checkOutDate, 
                totalPrice: b.totalPrice,
                guestCount: `${b.guestCount} ${t('search.guests')}`,
                status: b.status, 
                originalStatus: b.status,
                paymentStatus: b.paymentStatus, 
                paymentMethod: b.paymentMethod || "N/A",
                specialRequest: isVi ? "Không" : "None"
            }));
            setRooms(mappedData.reverse());
        } catch (error) {
            console.error("Lỗi tải booking:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (e) => {
        setSelectedPropId(e.target.value);
    };

    const handleOpenCheckInModal = (bookingId) => {
        const room = rooms.find((r) => r.id === bookingId);
        if (room) {
            setCheckInRoom(room);
            setIsCheckInModalOpen(true);
        }
    };

    const processCheckIn = async () => {
        if (!checkInRoom) return;
        await bookingService.checkInBooking(checkInRoom.id);
        await fetchOccupiedRooms(selectedPropId);
    };

    const handleOpenCheckOutModal = (bookingId) => {
        const room = rooms.find((r) => r.id === bookingId);
        if (room) {
            setCheckOutRoom(room);
            setIsCheckOutModalOpen(true);
            setIsDetailModalOpen(false);
        }
    };

    const processCheckOut = async () => {
        if (!checkOutRoom) return;
        await bookingService.checkOutBooking(checkOutRoom.id);
        await fetchOccupiedRooms(selectedPropId);
    };

    const handleViewDetail = (room) => {
        setSelectedBooking(room);
        setIsDetailModalOpen(true);
    };

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            let matchStatus = false;
            switch (statusFilter) {
                case "upcoming": matchStatus = room.status === 'CONFIRMED'; break;
                case "in-house": matchStatus = room.status === 'CHECKED_IN'; break;
                case "pending": matchStatus = room.status === 'PENDING_PAYMENT'; break;
                case "history": matchStatus = room.status === 'COMPLETED' || room.status === 'CANCELLED'; break;
                default: matchStatus = true;
            }
            if (!matchStatus) return false;
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

    const statsData = useMemo(() => ({
        upcoming: rooms.filter(r => r.status === 'CONFIRMED').length,
        inHouse: rooms.filter(r => r.status === 'CHECKED_IN').length,
        pending: rooms.filter(r => r.status === 'PENDING_PAYMENT').length,
    }), [rooms]);

    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRooms, currentPage]);

    const getPaginationGroup = () => {
        const range = []; const delta = 1;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
        }
        return range;
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-800">
            <BookingDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} booking={selectedBooking} onCheckOut={handleOpenCheckOutModal} />
            <CheckInModal isOpen={isCheckInModalOpen} onClose={() => setIsCheckInModalOpen(false)} onConfirm={processCheckIn} room={checkInRoom} />
            <CheckOutModal isOpen={isCheckOutModalOpen} onClose={() => setIsCheckOutModalOpen(false)} onConfirm={processCheckOut} room={checkOutRoom} />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-[#28A9E0] rounded-lg text-white shadow-lg shadow-blue-200"><BedDouble size={20} /></span>
                            {isVi ? "Quản Lý Lưu Trú" : "Stay Management"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 ml-1">
                            {isVi ? "Theo dõi khách hàng check-in, check-out và thanh toán" : "Monitor guest check-ins, check-outs, and payments"}
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
                                {myProperties.length === 0 && <option value="" disabled>{t('common.loading')}</option>}
                                {myProperties.map(p => (
                                    <option key={p.propertyId} value={p.propertyId}>{p.propertyName}</option>
                                ))}
                            </select>
                        </div>
                        <Button variant="outline" onClick={() => fetchOccupiedRooms(selectedPropId)} icon={RefreshCw} className={loading ? "opacity-70" : ""}>
                            {isVi ? "Làm mới" : "Refresh"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: isVi ? "Khách sắp đến" : "Upcoming Guests", val: statsData.upcoming, icon: CalendarCheck, color: "blue" },
                        { label: isVi ? "Đang lưu trú" : "In-house Guests", val: statsData.inHouse, icon: Users, color: "emerald" },
                        { label: isVi ? "Chờ thanh toán" : "Pending Payment", val: statsData.pending, icon: AlertCircle, color: "amber" },
                    ].map((s, i) => {
                        const C = COLOR_MAP[s.color];
                        return (
                            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
                                <div className={`absolute right-0 top-0 w-16 h-full bg-gradient-to-l ${C.gradient} to-transparent opacity-50`} />
                                <div><p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">{s.label}</p><p className={`text-3xl font-bold ${C.text}`}>{s.val}</p></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${C.bg} ${C.text} group-hover:scale-110 transition-transform`}><s.icon size={20} /></div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder={isVi ? "Tìm phòng, mã booking hoặc tên khách..." : "Search room, booking code or guest name..."}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#28A9E0] text-sm transition-all outline-none"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                            {[
                                { id: "upcoming", label: isVi ? "Sắp đến" : "Upcoming" },
                                { id: "in-house", label: isVi ? "Đang ở" : "In-house" },
                                { id: "pending", label: isVi ? "Chờ TT" : "Pending" },
                                { id: "history", label: isVi ? "Lịch sử" : "History" },
                            ].map((f) => (
                                <button key={f.id} onClick={() => setStatusFilter(f.id)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${statusFilter === f.id ? "bg-[#28A9E0] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{f.label}</button>
                            ))}
                        </div>
                    </div>

                    <OccupiedRoomsTable data={paginatedRooms} loading={loading} onCheckIn={handleOpenCheckInModal} onCheckOut={handleOpenCheckOutModal} onViewDetail={handleViewDetail} />

                    <div className="mt-auto border-t border-slate-100">
                        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                            <span className="text-sm text-slate-500">
                                {isVi ? `Hiển thị ${paginatedRooms.length} / ${filteredRooms.length} đơn` : `Showing ${paginatedRooms.length} / ${filteredRooms.length} bookings`}
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"><ChevronLeft size={18} /></button>
                                <div className="flex gap-1">
                                    {getPaginationGroup().map((item, idx) => (<button key={idx} onClick={() => typeof item === "number" && setCurrentPage(item)} disabled={item === "..."} className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-colors ${item === currentPage ? "bg-[#28A9E0] text-white shadow-sm" : item === "..." ? "text-slate-400 cursor-default" : "bg-white border border-gray-200 hover:bg-slate-50 text-slate-600"}`}>{item}</button>))}
                                </div>
                                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerBookingsPage;
