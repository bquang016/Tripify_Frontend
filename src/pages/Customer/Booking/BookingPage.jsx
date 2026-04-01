import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ArrowLeft, ShieldCheck, Headset, Wallet } from 'lucide-react';

// Components
import Button from '@/components/common/Button/Button';
import Spinner from "@/components/common/Loading/Spinner";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Sub-components
import BookingSummary from './components/BookingSummary';
import ContactInfoForm from './components/ContactInfoForm';

// Services & Context
import propertyService from "@/services/property.service";
import bookingService from "@/services/booking.service";
import { useAuth } from "@/context/AuthContext";
import { IMAGE_BASE_URL } from "../../../services/axios.config";

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE_URL}${path}`;
};

// Component con: Khối An Tâm Đặt Phòng
const TrustBadges = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm"><ShieldCheck size={20}/></div>
            <div>
                <p className="font-bold text-sm text-gray-800">Thanh toán an toàn</p>
                <p className="text-xs text-gray-500">Bảo mật chuẩn quốc tế</p>
            </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="bg-white p-2 rounded-full text-green-600 shadow-sm"><Wallet size={20}/></div>
            <div>
                <p className="font-bold text-sm text-gray-800">Không phí ẩn</p>
                <p className="text-xs text-gray-500">Minh bạch giá cả</p>
            </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="bg-white p-2 rounded-full text-purple-600 shadow-sm"><Headset size={20}/></div>
            <div>
                <p className="font-bold text-sm text-gray-800">Hỗ trợ 24/7</p>
                <p className="text-xs text-gray-500">Luôn sẵn sàng giúp đỡ</p>
            </div>
        </div>
    </div>
);

export default function BookingPage() {
    const { propertyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // 1. LẤY DỮ LIỆU TỪ STATE (Xử lý an toàn)
    const stateData = location.state || {};

    const {
        propertyType,
        selectedRoomId,
        roomId: stateRoomId,
        calculationData,
        // Lấy các trường hiển thị thông tin để đỡ phải gọi API lại
        roomName,
        price,
        image,
        hotelName,
        address
    } = stateData;

    // ✅ [FIX QUAN TRỌNG] Hỗ trợ nhận cả 2 kiểu tên biến ngày tháng
    // Để tránh việc bên kia gửi 'startDate' mà bên này lại tìm 'checkInDate' thì bị null
    const incomingCheckIn = stateData.checkInDate || stateData.startDate;
    const incomingCheckOut = stateData.checkOutDate || stateData.endDate;

    // Ưu tiên lấy roomId chuẩn
    const finalRoomId = selectedRoomId || stateRoomId;

    // Data State
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State (Khởi tạo giá trị ngày từ biến đã xử lý ở trên)
    const [dateRange] = useState({
        startDate: incomingCheckIn ? new Date(incomingCheckIn) : new Date(),
        endDate: incomingCheckOut ? new Date(incomingCheckOut) : addDays(new Date(), 1)
    });

    const [contactData, setContactData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // 2. Fetch Hotel & Room Info
    useEffect(() => {
        const fetchData = async () => {
            // Logic cũ: lấy pid từ URL hoặc hotel state
            const pid = propertyId || (hotel && hotel.id);

            // Nếu không có propertyId và cũng không có hotel data sẵn -> dừng
            if (!pid && !hotelName) return;

            // TRƯỜNG HỢP 1: Đã có đủ thông tin từ trang trước (Tối ưu, không gọi API lại)
            if (hotelName && roomName) {
                setHotel({
                    id: propertyId,
                    name: hotelName,
                    type: propertyType, // Quan trọng cho logic Homestay
                    location: address,
                    image: null
                });
                setRoom({
                    id: finalRoomId,
                    name: roomName,
                    price: price,
                    guests: 2,
                    image: image
                });
                setLoading(false);
                return;
            }

            // TRƯỜNG HỢP 2: Reload trang hoặc thiếu dữ liệu -> Gọi API lấy chi tiết
            setLoading(true);
            try {
                const data = await propertyService.getPropertyDetail(propertyId);
                setHotel({
                    id: data.propertyId,
                    name: data.propertyName,
                    type: data.propertyType,
                    location: `${data.address}, ${data.city}`,
                    image: getFullImageUrl(data.coverImage)
                });

                let targetRoom = null;
                if (data.rooms && finalRoomId) {
                    targetRoom = data.rooms.find(r => r.roomId === finalRoomId);
                } else if (data.rooms?.length > 0) {
                    targetRoom = data.rooms[0];
                }

                if (targetRoom) {
                    setRoom({
                        id: targetRoom.roomId,
                        name: targetRoom.roomName,
                        price: targetRoom.pricePerNight,
                        guests: targetRoom.capacity,
                        image: (targetRoom.images && targetRoom.images.length > 0)
                            ? getFullImageUrl(targetRoom.images[0])
                            : null
                    });
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [propertyId, finalRoomId, hotelName, roomName]);

    // Validate Form
    const isFormValid =
        // contactData.fullName?.trim() &&
        // contactData.phone?.trim() &&
        // contactData.email?.trim();
        !!contactData.isValid;

    // 3. Submit Booking
    const handleFinalSubmit = async () => {
        if (!currentUser) {
            alert("Vui lòng đăng nhập để tiếp tục đặt phòng!");
            navigate("/login", { state: { from: location.pathname + location.search } });
            return;
        }
        if (!contactData.isValid) {
            alert("Vui lòng kiểm tra lại thông tin liên hệ.");
            return;
        }

        setSubmitting(true);
        try {
            // Logic kiểm tra loại hình
            const isWholeUnit = ["VILLA", "HOMESTAY"].includes(hotel?.type);

            const payload = {
                userId: currentUser.userId,
                propertyId: parseInt(propertyId || hotel.id),

                // Nếu là Villa/Homestay -> Gửi roomId = null
                roomId: isWholeUnit ? null : (room?.id || finalRoomId),

                // Format ngày tháng chuẩn gửi lên BE
                checkInDate: format(dateRange.startDate, "yyyy-MM-dd"),
                checkOutDate: format(dateRange.endDate, "yyyy-MM-dd"),
                guestCount: room?.guests || 1,

                bookingForSelf: contactData.isSelfBooking,

                contactName: contactData.fullName,
                contactPhone: contactData.phone,
                guestPhone: contactData.phone,
                contactEmail: contactData.email,
                guestEmail: contactData.email,

                specialRequest: contactData.specialRequest,
                note: contactData.specialRequest,

                // Gửi tổng tiền chính xác (đã tính cuối tuần) lên server
                totalPrice: calculationData ? calculationData.total : undefined
            };

            console.log("Submitting Payload:", payload); // Debug payload

            const response = await bookingService.createBooking(payload);
            const newBookingId = response.bookingId || response.data?.bookingId;

            if (newBookingId) {
                // Chuyển sang trang thanh toán
                navigate(`/booking/payment/${newBookingId}`, {
                    state: {
                        finalTotalPrice: calculationData ? calculationData.total : undefined
                    }
                });
            } else {
                throw new Error("Không nhận được Mã đặt phòng.");
            }

        } catch (error) {
            console.error("Booking Error:", error);
            alert("Lỗi: " + (error.response?.data?.message || "Đặt phòng thất bại. Vui lòng thử lại."));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;

    if (!hotel || !room) return (
        <div className="text-center py-20 max-w-7xl mx-auto px-6">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Không tìm thấy thông tin</h1>
            <Button onClick={() => navigate('/hotels')}>Quay lại tìm kiếm</Button>
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen">
            {submitting && <LoadingOverlay message="Đang xử lý đơn đặt phòng..." />}

            <Button
                variant="ghost"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
                leftIcon={<ArrowLeft size={18} />}
                className="mb-6 text-slate-500 hover:text-blue-600 pl-0 hover:bg-transparent"
            >
                Quay lại chi tiết
            </Button>

            <h1 className="text-3xl font-bold mb-8 text-slate-900">Xác nhận & Đặt phòng</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CỘT TRÁI: FORM & TIỆN ÍCH */}
                <div className="lg:col-span-2 space-y-6">
                    <ContactInfoForm
                        user={currentUser}
                        onChange={setContactData}
                    />
                    <TrustBadges />
                </div>

                {/* CỘT PHẢI: SUMMARY */}
                <div className="lg:col-span-1">
                    <BookingSummary
                        hotel={hotel}
                        room={room}
                        dateRange={dateRange}
                        onSubmit={handleFinalSubmit}
                        disabled={!isFormValid}
                        submitting={submitting}
                        // Truyền calculationData xuống để hiển thị giá đúng
                        calculationData={calculationData}
                    />
                </div>
            </div>
        </main>
    );
};