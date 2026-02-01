import React, { useEffect, useState, useMemo } from "react";
import { 
  Star, MessageSquare, Loader2, Image as ImageIcon, 
  Search, ArrowUpDown, Filter 
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import ReviewCard from "./ReviewCard";
// ✅ Import thêm pinRating
import { getRatingsByProperty, hideRating, deleteRating, pinRating } from "@/services/rating.service";
import { useAuth } from "@/context/AuthContext";

// ✅ Nhận thêm prop isOwner
const HotelReviews = ({ propertyId, isAdmin, onOpenGallery, isOwner }) => {
  const { currentUser } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // --- CÁC STATE BỘ LỌC ---
  const [activeFilter, setActiveFilter] = useState("ALL"); 
  const [sortOption, setSortOption] = useState("NEWEST"); 
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (propertyId) {
      fetchReviews(0);
    }
  }, [propertyId]);

  const fetchReviews = async (pageNumber) => {
    try {
      if (pageNumber === 0) setLoading(true);
      const data = await getRatingsByProperty(propertyId, pageNumber);
      
      if (pageNumber === 0) {
        setReviews(data.content || []);
      } else {
        setReviews((prev) => [...prev, ...(data.content || [])]);
      }
      
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages - 1) fetchReviews(page + 1);
  };

  // --- LOGIC THỐNG KÊ ---
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    
    reviews.forEach(r => {
      const s = Math.round(r.stars); 
      if (counts[s] !== undefined) counts[s]++;
      sum += r.stars;
    });

    return {
      avg: (sum / total).toFixed(1),
      counts
    };
  }, [reviews]);

  // --- LOGIC LỌC & SẮP XẾP ---
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    // A. Lọc theo Tab
    if (activeFilter === "HAS_IMAGE") {
      result = result.filter(r => r.images && r.images.length > 0);
    } else if (activeFilter !== "ALL") {
      result = result.filter(r => Math.round(r.stars) === parseInt(activeFilter));
    }

    // B. Lọc theo từ khóa
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(r => 
        (r.comment && r.comment.toLowerCase().includes(lowerQuery)) ||
        (r.userName && r.userName.toLowerCase().includes(lowerQuery))
      );
    }

    // C. Sắp xếp (Ưu tiên bài ghim lên đầu nếu đang sort mặc định, hoặc custom logic)
    // Ở đây ta sort theo tiêu chí người dùng chọn, nhưng vẫn ưu tiên Pinned nếu muốn
    result.sort((a, b) => {
        // Logic ưu tiên bài ghim (nếu muốn nó luôn nằm trên cùng bất kể sort)
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        switch (sortOption) {
            case "NEWEST": return dateB - dateA;
            case "OLDEST": return dateA - dateB;
            case "HIGHEST": return b.stars - a.stars;
            case "LOWEST": return a.stars - b.stars;
            default: return 0;
        }
    });

    return result;
  }, [reviews, activeFilter, sortOption, searchQuery]);

  // --- HANDLERS (Xóa/Ẩn/Ghim) ---
  const handleHideReview = async (reviewId, isHidden) => {
      try {
          await hideRating(reviewId, !isHidden);
          setReviews(prev => prev.map(r => r.ratingId === reviewId ? { ...r, hidden: !isHidden } : r));
      } catch (err) { alert(err.message); }
  };

  const handleDeleteReview = async (reviewId) => {
      if(!window.confirm("Xóa đánh giá này?")) return;
      try {
          await deleteRating(reviewId);
          setReviews(prev => prev.filter(r => r.ratingId !== reviewId));
      } catch (err) { alert(err.message); }
  };

  // ✅ Hàm xử lý Ghim
  const handlePinReview = async (reviewId, isPinned) => {
      try {
          // Gọi API đảo ngược trạng thái ghim hiện tại
          await pinRating(reviewId, !isPinned);
          
          // Cập nhật State
          setReviews(prev => {
              const updatedList = prev.map(r => r.ratingId === reviewId ? { ...r, isPinned: !isPinned } : r);
              // Tự động sort lại để đưa bài vừa ghim lên đầu (UX tốt hơn)
              return updatedList.sort((a, b) => {
                  if (a.isPinned === b.isPinned) {
                      return new Date(b.createdAt) - new Date(a.createdAt); // Nếu cùng trạng thái ghim thì sort theo ngày
                  }
                  return a.isPinned ? -1 : 1; // Bài ghim lên trước
              });
          });
          
      } catch (err) {
          alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
  };

  return (
    <div className="space-y-8 pb-10" id="reviews-container">
      
      {/* 1. OVERVIEW SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        {/* Điểm số */}
        <div className="col-span-1 flex flex-col items-center justify-center border-r border-slate-100 pr-4 md:border-r md:border-b-0 border-b pb-4 md:pb-0">
          <div className="text-5xl font-extrabold text-slate-800">{stats.avg}</div>
          <div className="flex items-center gap-1 my-2">
             {[1,2,3,4,5].map(s => (
               <Star key={s} size={16} className={`${s <= Math.round(stats.avg) ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} />
             ))}
          </div>
          <p className="text-sm text-slate-500">Dựa trên {totalElements} nhận xét</p>
        </div>

        {/* Progress Bars */}
        <div className="col-span-2 flex flex-col justify-center gap-2 pl-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts[star] || 0;
            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm cursor-pointer group" onClick={() => setActiveFilter(String(star))}>
                <span className="flex items-center gap-1 w-12 font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                  {star} <Star size={12} className="text-slate-400 group-hover:text-blue-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }} 
                  />
                </div>
                <span className="w-8 text-right text-slate-400 text-xs">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl">
        {/* Search */}
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm trong đánh giá..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown size={16} className="text-slate-500" />
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="NEWEST">Mới nhất</option>
            <option value="OLDEST">Cũ nhất</option>
            <option value="HIGHEST">Điểm cao nhất</option>
            <option value="LOWEST">Điểm thấp nhất</option>
          </select>
        </div>
      </div>

      {/* 3. FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        <FilterButton label="Tất cả" active={activeFilter === "ALL"} onClick={() => setActiveFilter("ALL")} />
        <FilterButton label="Có hình ảnh" icon={<ImageIcon size={14}/>} active={activeFilter === "HAS_IMAGE"} onClick={() => setActiveFilter("HAS_IMAGE")} />
        <div className="w-[1px] h-8 bg-slate-200 mx-2 hidden sm:block"></div>
        {[5, 4, 3, 2, 1].map(star => (
           <FilterButton 
             key={star} 
             label={`${star} sao`} 
             active={activeFilter === String(star)} 
             onClick={() => setActiveFilter(String(star))} 
           />
        ))}
      </div>

      {/* 4. REVIEW LIST */}
      {loading && page === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : processedReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
          <MessageSquare size={48} className="mb-3 text-slate-300" />
          <p>Không tìm thấy đánh giá nào phù hợp.</p>
          {(activeFilter !== "ALL" || searchQuery) && (
             <button 
                onClick={() => { setActiveFilter("ALL"); setSearchQuery(""); }} 
                className="mt-2 text-blue-600 hover:underline text-sm font-medium"
             >
                Xóa bộ lọc & tìm kiếm
             </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {processedReviews.map((review) => (
            <div key={review.ratingId} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md animate-fade-in">
                <ReviewCard 
                    review={review}
                    isAdmin={isAdmin}
                    isOwner={isOwner} // ✅ Truyền isOwner xuống Card
                    canDelete={isAdmin || (currentUser && String(currentUser.userId) === String(review.userId))}
                    onHide={() => handleHideReview(review.ratingId, review.hidden)}
                    onDelete={() => handleDeleteReview(review.ratingId)}
                    onOpenGallery={onOpenGallery} 
                    onPin={() => handlePinReview(review.ratingId, review.isPinned)} // ✅ Truyền hàm Pin
                />
            </div>
          ))}

          {/* Load More Button */}
          {page < totalPages - 1 && activeFilter === "ALL" && !searchQuery && (
            <div className="mt-8 text-center pt-4">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                className="min-w-[200px] border-slate-300 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all rounded-full"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={16}/> : "Xem thêm đánh giá cũ hơn"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component con: Nút Filter nhỏ
const FilterButton = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${active 
        ? "bg-slate-900 text-white shadow-md transform scale-105" 
        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50"}
    `}
  >
    {icon}
    {label}
  </button>
);

export default HotelReviews;