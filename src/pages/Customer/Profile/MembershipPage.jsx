import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { 
    Shield, Star, Award, Gem, CheckCircle, 
    Gift, ArrowRight, Info, Crown
} from "lucide-react";
import Avatar from "@/components/common/Avatar/Avatar";
import AccountMenu from "@/pages/Customer/Profile/AccountMenu";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";

// --- CẤU HÌNH HỆ THỐNG RANK ---
const RANK_SYSTEM = {
    BRONZE: {
        label: "Hạng Đồng",
        minPoints: 0, // 1. Đồng là mặc định, 0 điểm
        color: "text-orange-600",
        bg: "bg-orange-100",
        gradient: "from-orange-600 to-orange-400",
        icon: <Shield size={32} className="text-white" />,
        benefits: [
            "Tích điểm 1.000đ = 1 điểm",
            "Nhận thông báo ưu đãi sớm",
            "Nhận các ưu đãi, mã giảm giá đặc biệt dựa trên hạng" // 2. Đổi text quyền lợi
        ]
    },
    SILVER: {
        label: "Hạng Bạc",
        minPoints: 1000,
        color: "text-slate-500",
        bg: "bg-slate-100",
        gradient: "from-slate-500 to-slate-400",
        icon: <Star size={32} className="text-white" />,
        benefits: ["Quyền lợi hạng Đồng", "Ưu tiên check-in sớm", "Quà sinh nhật", "Voucher 5%"]
    },
    GOLD: {
        label: "Hạng Vàng",
        minPoints: 5000,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        gradient: "from-yellow-600 to-yellow-400",
        icon: <Award size={32} className="text-white" />,
        benefits: ["Quyền lợi hạng Bạc", "Nâng hạng phòng miễn phí", "Miễn phí ăn sáng", "Hủy phòng miễn phí"]
    },
    DIAMOND: {
        label: "Hạng Kim Cương",
        minPoints: 10000,
        color: "text-cyan-600",
        bg: "bg-cyan-100",
        gradient: "from-blue-600 to-cyan-400",
        icon: <Gem size={32} className="text-white" />,
        benefits: ["Quyền lợi hạng Vàng", "Quản gia riêng 24/7", "Xe đưa đón sân bay", "Giảm 10% tổng bill"]
    }
};

const MembershipPage = () => {
    const { currentUser, updateUser } = useAuth();
    const [userInfo, setUserInfo] = useState(currentUser);
    const [loading, setLoading] = useState(true);
    
    // 5. State để xem quyền lợi các hạng khác (Mặc định là hạng của user)
    const [viewRank, setViewRank] = useState("BRONZE");

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    const showToastAndDismiss = (msg, type = "info", duration = 3000) => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), duration);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.getUserDetail();
                if(data) {
                    setUserInfo(data);
                    // Cập nhật viewRank theo hạng thực tế của user khi load xong
                    setViewRank(data.membershipRank || "BRONZE");
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleAvatarUpload = async (file) => {
        setIsUploadingAvatar(true);
        try {
            const res = await userService.uploadAvatar(file);
            if (res.success && res.data) {
                const newUrl = res.data.profilePhotoUrl;
                setUserInfo(prev => ({ ...prev, profilePhotoUrl: newUrl }));
                updateUser({ profilePhotoUrl: newUrl });
                showToastAndDismiss("Cập nhật ảnh đại diện thành công!", "success");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            const msg = err.response?.data?.message || "Lỗi khi tải ảnh lên.";
            showToastAndDismiss(msg, "error");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // --- LOGIC TÍNH TOÁN ---
    const currentPoints = userInfo?.points || 0;
    const currentRankKey = userInfo?.membershipRank || "BRONZE";
    const currentRankConfig = RANK_SYSTEM[currentRankKey];

    // Config của hạng đang được chọn để xem
    const viewRankConfig = RANK_SYSTEM[viewRank];

    // Logic Next Rank (Dựa trên hạng thực tế của user để hiển thị progress)
    let nextRankKey = null;
    let nextRankConfig = null;
    let progressPercent = 100;

    const ranksOrder = ["BRONZE", "SILVER", "GOLD", "DIAMOND"];
    const currentIndex = ranksOrder.indexOf(currentRankKey);

    if (currentIndex < ranksOrder.length - 1) {
        nextRankKey = ranksOrder[currentIndex + 1];
        nextRankConfig = RANK_SYSTEM[nextRankKey];
        
        // Tính % Progress
        const targetPoints = nextRankConfig.minPoints;
        const prevRankPoints = RANK_SYSTEM[currentRankKey].minPoints;
        
        // Công thức tương đối để thanh chạy mượt hơn
        // Nếu target = 0 (trường hợp lạ) thì max là 100
        if (targetPoints > 0) {
             progressPercent = Math.min((currentPoints / targetPoints) * 100, 100);
        }
    }

    return (
        <main className="w-full bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-8">
                    
                    <div className="col-span-12 lg:col-span-3">
                        <AccountMenu 
                            userData={userInfo} 
                            onAvatarUpload={handleAvatarUpload}
                            isUploadingAvatar={isUploadingAvatar}
                        />
                    </div>

                    <div className="col-span-12 lg:col-span-9">
                        
                        {loading ? (
                            <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <>
                                {/* --- THẺ THÀNH VIÊN (HEADER) --- */}
                                <div className={`relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-r ${currentRankConfig.gradient} text-white p-8 mb-8 transition-all duration-500`}>
                                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10 scale-150">
                                        {currentRankConfig.icon}
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-white/30 blur-md animate-pulse"></div>
                                            <div className="border-4 border-white/40 rounded-full p-1 relative">
                                                <Avatar src={userInfo?.profilePhotoUrl} name={userInfo?.fullName} size={100} />
                                                <div className="absolute bottom-0 right-0 bg-white text-gray-800 p-2 rounded-full shadow-lg">
                                                    {React.cloneElement(currentRankConfig.icon, { size: 20, className: currentRankConfig.color })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left flex-1">
                                            <h1 className="text-3xl font-bold mb-1">Xin chào, {userInfo?.fullName}</h1>
                                            
                                            {/* 6. Thay text "... Member" thành "Hạng ..." */}
                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-4 opacity-90">
                                                <span className="text-sm font-bold uppercase tracking-widest border border-white/40 px-4 py-1 rounded-full bg-black/20 backdrop-blur-sm shadow-sm flex items-center gap-2">
                                                    <Crown size={14} />
                                                    {RANK_SYSTEM[currentRankKey].label}
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <span className="text-5xl font-extrabold tracking-tight">{currentPoints.toLocaleString()}</span>
                                                <span className="text-lg ml-2 opacity-90 font-medium">điểm tích lũy</span>
                                            </div>

                                            {/* Thanh tiến độ lên hạng */}
                                            {nextRankKey ? (
                                                <div className="max-w-md">
                                                    <div className="flex justify-between text-xs font-semibold mb-1.5 opacity-90">
                                                        <span>Tiến độ thăng hạng</span>
                                                        <span>Mục tiêu: {nextRankConfig.minPoints.toLocaleString()}</span>
                                                    </div>
                                                    <div className="h-3.5 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                                        <div 
                                                            className="h-full bg-white/90 rounded-full shadow-sm transition-all duration-1000 ease-out relative"
                                                            style={{ width: `${progressPercent}%` }}
                                                        >
                                                            {/* Hiệu ứng bóng lóa trên thanh */}
                                                            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs mt-2 opacity-90 font-medium">
                                                        Cần tích thêm <strong>{(nextRankConfig.minPoints - currentPoints).toLocaleString()}</strong> điểm để lên <strong>{nextRankConfig.label}</strong>
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md font-bold text-sm border border-white/20">
                                                    <Gem size={16} /> Bạn đang ở đỉnh cao danh vọng!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* --- DANH SÁCH & QUYỀN LỢI --- */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    
                                    {/* CỘT TRÁI: DANH SÁCH CÁC HẠNG (Có thể click) */}
                                    <div className="xl:col-span-1 space-y-3">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 px-1">Các hạng thành viên</h3>
                                        {Object.entries(RANK_SYSTEM).map(([key, config]) => {
                                            const isMyRank = key === currentRankKey;
                                            const isViewing = key === viewRank; // Đang xem hạng này

                                            return (
                                                <div 
                                                    key={key} 
                                                    onClick={() => setViewRank(key)} // 5. Click để xem quyền lợi
                                                    className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer relative overflow-hidden group ${
                                                        isViewing 
                                                            ? `border-${config.color.split('-')[1]}-400 bg-${config.color.split('-')[1]}-50 ring-1 ring-${config.color.split('-')[1]}-200 shadow-md` 
                                                            : "border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm"
                                                    }`}
                                                >
                                                    {/* Thanh chỉ thị bên trái khi đang xem */}
                                                    {isViewing && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${config.color.split('-')[1]}-500`}></div>}

                                                    <div className="flex items-center gap-3 pl-2">
                                                        <div className={`p-2 rounded-lg transition-colors ${isViewing ? "bg-white shadow-sm" : "bg-gray-100 group-hover:bg-white"}`}>
                                                            {React.cloneElement(config.icon, { size: 18, className: config.color })}
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-sm font-bold ${isViewing ? "text-gray-900" : "text-gray-600"}`}>
                                                                {config.label}
                                                            </h4>
                                                            <p className="text-[11px] text-gray-500 font-medium">
                                                                {config.minPoints > 0 ? `>= ${config.minPoints} điểm` : "Mặc định"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Badge: Hạng của tôi */}
                                                    {isMyRank && (
                                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
                                                            <CheckCircle size={10} /> Của bạn
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* CỘT PHẢI: CHI TIẾT QUYỀN LỢI (Dựa theo viewRank) */}
                                    <div className="xl:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                <Gift size={20} className="text-pink-500"/> 
                                                Quyền lợi: <span className={viewRankConfig.color}>{viewRankConfig.label}</span>
                                            </h3>
                                            {/* Nút nhỏ nếu đang xem hạng không phải của mình */}
                                            {viewRank !== currentRankKey && (
                                                <button 
                                                    onClick={() => setViewRank(currentRankKey)}
                                                    className="text-xs text-blue-600 hover:underline font-medium"
                                                >
                                                    Xem hạng của tôi
                                                </button>
                                            )}
                                        </div>

                                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                            {/* Background Icon mờ */}
                                            <div className="absolute -bottom-4 -right-4 opacity-[0.03] transform rotate-12 pointer-events-none">
                                                {React.cloneElement(viewRankConfig.icon, { size: 200, className: "text-black" })}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 relative z-10">
                                                {viewRankConfig.benefits.map((benefit, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                        <div className={`mt-0.5 p-1 rounded-full ${viewRankConfig.bg} shrink-0`}>
                                                            <CheckCircle size={14} className={viewRankConfig.color} />
                                                        </div>
                                                        <span className="text-gray-700 text-sm font-medium leading-relaxed">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 3. Badge "Tiếp theo" đậm hơn, rõ hơn */}
                                        {/* Chỉ hiện gợi ý thăng hạng nếu đang xem hạng hiện tại và chưa max cấp */}
                                        {(viewRank === currentRankKey && nextRankKey) && (
                                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-extrabold text-blue-900 mb-1 text-base flex items-center gap-2">
                                                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow-sm">Mục tiêu</span>
                                                            Tiếp theo: {nextRankConfig.label} 
                                                        </h4>
                                                        <p className="text-sm text-blue-700 font-medium">
                                                            Mở khóa thêm {nextRankConfig.benefits.length - currentRankConfig.benefits.length} quyền lợi đặc quyền!
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Nút xem trước */}
                                                    <button 
                                                        onClick={() => setViewRank(nextRankKey)}
                                                        className="group flex items-center gap-2 text-sm font-bold text-blue-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100 hover:bg-blue-50 transition-all whitespace-nowrap"
                                                    >
                                                        Xem quyền lợi <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* 4. Cập nhật text lưu ý */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-3 text-xs text-blue-800 border border-blue-100">
                                    <Info size={16} className="shrink-0 mt-0.5" />
                                    <p>
                                        Điểm tích lũy được cập nhật tự động sau khi đơn đặt phòng hoàn tất.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>
        </main>
    );
};

export default MembershipPage;