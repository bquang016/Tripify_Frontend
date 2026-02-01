import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { format, addDays } from 'date-fns';
import { Check } from "lucide-react";

// Components Common
import Spinner from "@/components/common/Loading/Spinner";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";

// Sub-components
import HotelHeader from "./components/HotelHeader";
import HotelStickyNav from "./components/HotelStickyNav";
import HotelOverview from "./components/HotelOverview";
import HotelPolicies from "./components/HotelPolicies";
import HotelSidebar from "./components/HotelSidebar";
import RoomListSection from "./components/RoomListSection";
import RoomDetailModal from "./components/RoomDetailModal";
import BookingDateModal from "./components/BookingDateModal";
import HotelReviewSidebar from "./components/HotelReviewSidebar";
import FeaturedReviews from "./components/FeaturedReviews";

// Auth Context
import { useAuth } from "@/context/AuthContext";

// Service
import propertyService from "@/services/property.service";
import bookingService from "@/services/booking.service";
import { getRatingsByProperty, pinRating } from "@/services/rating.service";

// --- HELPERS ---
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!cleanPath.startsWith('/uploads')) cleanPath = `/uploads${cleanPath}`;
    return `${BASE_URL}${cleanPath}`;
};

const getAmenityIcon = (amenityName) => {
    return <Check size={18} />;
};

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Auth
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "ADMIN" || currentUser?.roles?.includes("ADMIN");

    // Data States
    const [hotel, setHotel] = useState(null);
    const [policies, setPolicies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Review States
    const [allReviews, setAllReviews] = useState([]);
    const [pinnedReviews, setPinnedReviews] = useState([]);

    const [dateRange, setDateRange] = useState({
        startDate: searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")) : new Date(),
        endDate: searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")) : addDays(new Date(), 1)
    });

    // UI States
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
    const [activeSection, setActiveSection] = useState("overview");
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
    const [occupiedDates, setOccupiedDates] = useState([]);
    const [isReviewSidebarOpen, setIsReviewSidebarOpen] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchAllData = async () => {
            if (!hotelId) return;
            setLoading(true);
            try {
                const checkInStr = format(dateRange.startDate, "yyyy-MM-dd");
                const checkOutStr = format(dateRange.endDate, "yyyy-MM-dd");

                const [hotelData, policyData] = await Promise.all([
                    propertyService.getPropertyDetail(hotelId, checkInStr, checkOutStr),
                    propertyService.getPropertyPolicies(hotelId)
                ]);

                // Map hotel data
                const mappedHotel = {
                    id: hotelData.propertyId,
                    ownerId: hotelData.ownerId,
                    // ✅ [FIX] Lấy thêm propertyType để truyền sang trang Booking
                    type: hotelData.propertyType,
                    name: hotelData.propertyName,
                    description: hotelData.description,
                    rating: hotelData.rating,
                    reviewsCount: hotelData.reviewCount,
                    location: `${hotelData.address}, ${hotelData.city}`,
                    latitude: hotelData.latitude,
                    longitude: hotelData.longitude,
                    images: (hotelData.images && hotelData.images.length > 0) ? hotelData.images.map(getFullImageUrl) : [getFullImageUrl(hotelData.coverImage)],
                    amenities: hotelData.amenities ? hotelData.amenities.map(a => ({ name: a.amenityName, icon: getAmenityIcon(a.amenityName) })) : [],
                    rooms: hotelData.rooms ? hotelData.rooms.map(r => ({
                        id: r.roomId,
                        roomId: r.roomId, // Map thêm field roomId cho chắc chắn
                        name: r.roomName,
                        roomName: r.roomName,
                        price: r.pricePerNight,
                        weekendPrice: r.weekendPrice, // ✅ Map giá cuối tuần từ API
                        guests: r.capacity,
                        size: r.area || 30,
                        description: r.description,
                        images: (r.images && r.images.length > 0) ? r.images.map(img => getFullImageUrl(img)) : ["https://via.placeholder.com/400x300?text=Room+Image"],
                        amenities: r.amenities ? r.amenities.reduce((acc, curr) => ({...acc, [curr]: true}), {}) : {}
                    })) : []
                };

                setHotel(mappedHotel);
                setPolicies(policyData);

                // Lấy Reviews
                const reviewsRes = await getRatingsByProperty(hotelId, 0);
                const reviews = reviewsRes.content || [];

                setAllReviews(reviews);
                setPinnedReviews(reviews.filter(r => r.isPinned === true));

            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Không thể tải thông tin. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [hotelId, dateRange]);

    const isOwner = currentUser && hotel && String(currentUser.userId) === String(hotel.ownerId);

    // Handlers
    const openHotelGallery = (index) => {
        if (!hotel || !hotel.images) return;
        const images = hotel.images.map((imgUrl, i) => ({ url: imgUrl, caption: `${hotel.name} - Ảnh ${i + 1}` }));
        setViewerImages(images); setSelectedImageIndex(index); setViewerOpen(true);
    };

    const openReviewGallery = (index, rawImages) => {
        if (!rawImages || rawImages.length === 0) return;
        const images = rawImages.map((imgUrl, i) => ({ url: getFullImageUrl(imgUrl), caption: `Ảnh đánh giá ${i + 1}` }));
        setViewerImages(images); setSelectedImageIndex(index); setViewerOpen(true);
    };

    const handleUnpinReview = async (reviewId) => {
        if (!isOwner && !isAdmin) return;
        if (!window.confirm("Bỏ ghim bình luận này?")) return;
        try {
            await pinRating(reviewId, false);
            setPinnedReviews(prev => prev.filter(r => r.ratingId !== reviewId));
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCloseRoomDetail = () => setSelectedRoomDetail(null);

    // Xử lý khi bấm nút "Đặt ngay"
    const handleBookNowClick = async (room) => {
        setSelectedRoomForBooking(room);
        try {
            // Lấy lịch đã đặt
            const rId = room.roomId || room.id;
            const res = await bookingService.getRoomAvailability(rId);
            if (res && res.data) { setOccupiedDates(res.data); } else { setOccupiedDates([]); }
        } catch (error) { console.error(error); setOccupiedDates([]); }
        setIsDateModalOpen(true);
    };

    // ✅ [FIX] HÀM QUAN TRỌNG: Chuyển sang trang Booking với đầy đủ dữ liệu
    const handleDateConfirm = (range, calculationData) => {
        setIsDateModalOpen(false);
        if (selectedRoomForBooking) {
            const validRoomId = selectedRoomForBooking.roomId || selectedRoomForBooking.id;

            navigate(`/booking/${hotelId}`, {
                state: {
                    // ✅ Truyền Property ID & Type để BookingPage xử lý logic Homestay
                    propertyId: hotel.id,
                    propertyType: hotel.type,

                    roomId: validRoomId,
                    selectedRoomId: validRoomId,
                    roomName: selectedRoomForBooking.name || selectedRoomForBooking.roomName,
                    price: selectedRoomForBooking.price,
                    image: selectedRoomForBooking.images?.[0],

                    // Format ngày tháng chuẩn JS Date object
                    startDate: range[0],
                    endDate: range[1],

                    // Thông tin hotel để hiển thị summary
                    hotelName: hotel.name,
                    address: hotel.location,

                    // Dữ liệu tính toán từ Modal (Tổng tiền, số đêm...)
                    calculationData: calculationData
                }
            });
        }
    };

    // Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            const sections = ["overview", "rooms", "policies", "reviews"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) { setActiveSection(section); break; }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[80vh] bg-gray-50"><Spinner size="lg" /></div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!hotel) return null;

    return (
        <div className="bg-gray-100 min-h-screen pb-20 relative">

            <HotelHeader hotel={hotel} onOpenGallery={openHotelGallery} />
            <HotelStickyNav activeSection={activeSection} onReviewClick={() => setIsReviewSidebarOpen(true)} />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8 space-y-8">
                        <HotelOverview description={hotel.description} amenities={hotel.amenities} />

                        <section id="rooms" className="scroll-mt-32">
                            <RoomListSection rooms={hotel.rooms} onRoomInfoClick={setSelectedRoomDetail} onBookNow={handleBookNowClick} />
                        </section>

                        <HotelPolicies policies={policies} />

                        <section id="reviews" className="scroll-mt-32">
                            <FeaturedReviews
                                hotel={hotel}
                                reviews={allReviews}
                                pinnedReviews={pinnedReviews}
                                onViewAll={() => setIsReviewSidebarOpen(true)}
                                isAdmin={isAdmin}
                                isOwner={isOwner}
                                onOpenGallery={openReviewGallery}
                                onUnpin={handleUnpinReview}
                            />
                        </section>

                    </div>

                    <div className="lg:col-span-4">
                        <HotelSidebar location={hotel.location} rating={hotel.rating} minPrice={hotel.rooms[0]?.price} lat={hotel.latitude} lng={hotel.longitude} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <RoomDetailModal room={selectedRoomDetail} open={!!selectedRoomDetail} onClose={handleCloseRoomDetail} />
            <ImageViewerModal open={isViewerOpen} onClose={() => setViewerOpen(false)} images={viewerImages} startIndex={selectedImageIndex} />

            {selectedRoomForBooking && (
                <BookingDateModal
                    open={isDateModalOpen}
                    onClose={() => setIsDateModalOpen(false)}
                    onConfirm={handleDateConfirm}
                    occupiedDates={occupiedDates}
                    // ✅ Truyền đúng props để Modal tính toán
                    roomPrice={selectedRoomForBooking.price}
                    weekendPrice={selectedRoomForBooking.weekendPrice}
                    selectedRoomId={selectedRoomForBooking.roomId || selectedRoomForBooking.id}
                />
            )}

            <HotelReviewSidebar
                isOpen={isReviewSidebarOpen}
                onClose={() => setIsReviewSidebarOpen(false)}
                propertyId={hotelId}
                isAdmin={isAdmin}
                isOwner={isOwner}
                onOpenGallery={openReviewGallery}
            />
        </div>
    );
}