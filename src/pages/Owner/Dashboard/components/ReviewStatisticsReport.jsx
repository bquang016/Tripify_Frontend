import React, { useState, useMemo } from 'react';
import { Star, MessageSquare, Filter, Send, User, CheckCircle2 } from 'lucide-react';
import ownerService from '@/services/owner.service';

const ReviewStatisticsReport = ({ reviews = [] }) => {
    const [filter, setFilter] = useState("ALL"); // ALL, POSITIVE (4-5), NEUTRAL (3), NEGATIVE (1-2)
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [localReviews, setLocalReviews] = useState(reviews);

    // Tính toán thống kê
    const stats = useMemo(() => {
        if (!localReviews.length) return { avg: 0, total: 0 };
        const total = localReviews.length;
        const sum = localReviews.reduce((acc, curr) => acc + curr.rating, 0);
        return { avg: (sum / total).toFixed(1), total };
    }, [localReviews]);

    // Lọc đánh giá
    const filteredReviews = useMemo(() => {
        if (filter === "POSITIVE") return localReviews.filter(r => r.rating >= 4);
        if (filter === "NEUTRAL") return localReviews.filter(r => r.rating === 3);
        if (filter === "NEGATIVE") return localReviews.filter(r => r.rating <= 2);
        return localReviews;
    }, [localReviews, filter]);

    // Xử lý gửi câu trả lời
    const handleSendReply = async (reviewId) => {
        if (!replyText.trim()) return;
        try {
            // Tạm thời update UI ngay lập tức để có độ trễ < 1.5s
            setLocalReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
            setReplyingTo(null);
            setReplyText("");
            
            // Gọi API lưu xuống DB (Bỏ comment khi BE đã có endpoint)
            // await ownerService.replyToReview(reviewId, replyText);
        } catch (error) {
            console.error("Lỗi khi gửi phản hồi", error);
        }
    };

    if (!localReviews || localReviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-6 flex flex-col items-center justify-center animate-fade-in">
                <MessageSquare className="text-slate-300 mb-3" size={48} />
                <h2 className="text-lg font-black text-slate-700">Thống kê đánh giá</h2>
                <p className="text-sm text-slate-500 mt-2">Cơ sở của bạn chưa nhận được đánh giá nào từ khách hàng.</p>
            </div>
        );
    }
    

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6 animate-fade-in">
            {/* HEADER & THỐNG KÊ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 pb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <MessageSquare className="text-blue-500" size={20} />
                        Báo cáo Thống kê đánh giá
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Giám sát mức độ hài lòng và phản hồi khách hàng.</p>
                </div>

                <div className="flex items-center gap-6 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                    <div className="text-center">
                        <div className="text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
                            {stats.avg} <Star size={24} fill="currentColor" />
                        </div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                            Trung bình
                        </div>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-slate-700">{stats.total}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                            Đánh giá
                        </div>
                    </div>
                </div>
            </div>

            {/* BỘ LỌC TƯƠNG TÁC */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setFilter("ALL")} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${filter === "ALL" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    Tất cả đánh giá
                </button>
                <button onClick={() => setFilter("POSITIVE")} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${filter === "POSITIVE" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                    Tích cực (4-5 Sao)
                </button>
                <button onClick={() => setFilter("NEUTRAL")} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${filter === "NEUTRAL" ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
                    Trung bình (3 Sao)
                </button>
                <button onClick={() => setFilter("NEGATIVE")} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${filter === "NEGATIVE" ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`}>
                    Tiêu cực (1-2 Sao)
                </button>
            </div>

            {/* DANH SÁCH ĐÁNH GIÁ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredReviews.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-slate-500 font-medium">Không có đánh giá nào phù hợp với bộ lọc.</div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{review.user}</p>
                                            <p className="text-xs text-slate-500">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed italic">"{review.text}"</p>
                            </div>

                            {/* KHU VỰC TRẢ LỜI TƯƠNG TÁC */}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                {review.reply ? (
                                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Phản hồi của bạn:
                                        </p>
                                        <p className="text-sm text-slate-700">{review.reply}</p>
                                    </div>
                                ) : (
                                    replyingTo === review.id ? (
                                        <div className="flex gap-2 animate-fade-in">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                placeholder="Nhập phản hồi của bạn..." 
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply(review.id)}
                                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                            />
                                            <button 
                                                onClick={() => handleSendReply(review.id)}
                                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => { setReplyingTo(review.id); setReplyText(""); }}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <MessageSquare size={14} /> Bấm để trả lời khách hàng
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewStatisticsReport;