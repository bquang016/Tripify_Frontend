import React, { useState, useEffect } from "react";
import { Building2, Search, Loader2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";
import Button from "@/components/common/Button/Button";

// Helper xử lý ảnh
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) path = `/uploads${path}`;
  return `${API_BASE_URL}${path}`;
};

const RoomListPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchActiveProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyService.getOwnerActiveProperties();
        setProperties(res.data || []);
      } catch (error) {
        console.error("❌ [RoomListPage] Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveProperties();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Lọc & phân trang
  const filteredProperties = properties.filter(p =>
    p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            currentPage === i
              ? "bg-[rgb(40,169,224)] text-white shadow-md shadow-blue-200"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleJumpPage = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(jumpPage);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        setJumpPage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Phòng nghỉ</h1>
        <p className="text-gray-500 mt-1">
          Chọn một cơ sở lưu trú để thiết lập và quản lý danh sách phòng
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm cơ sở lưu trú..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 text-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : filteredProperties.length > 0 ? (
        <>
          {/* GRID HIỂN THỊ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map((property) => (
              <div
                key={property.propertyId}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => navigate(`/owner/rooms/${property.propertyId}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getFullImageUrl(property.coverImage)}
                    alt={property.propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold line-clamp-1">{property.propertyName}</h3>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Building2 size={14} /> {property.propertyType}
                    </p>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center bg-white flex-grow">
                  <div className="text-sm text-gray-600">
                    <span className="block text-gray-400 text-xs uppercase font-semibold">
                      Địa chỉ
                    </span>
                    {property.city}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200"
                  >
                    Quản lý phòng <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-xl p-4 shadow-sm border relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Hiển thị{" "}
                  <span className="font-semibold text-gray-900">
                    {startItem}-{endItem}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-semibold text-gray-900">{totalItems}</span> cơ sở
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
  onClick={() => handlePageChange(currentPage - 1)}
  disabled={currentPage === 1}
  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
>
  <ChevronLeft size={18} className="text-gray-600" />
</button>

                  <div className="flex gap-2">{renderPageNumbers()}</div>

                  {/* Next */}
                  <button
  onClick={() => handlePageChange(currentPage + 1)}
  disabled={currentPage === totalPages}
  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
>
  <ChevronRight size={18} className="text-gray-600" />
</button>

                  {/* Jump */}
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Đi đến:</span>
                    <input
                      type="text"
                      className="w-12 h-8 pl-2 pr-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[rgb(40,169,224)] focus:ring-1 focus:ring-[rgb(40,169,224)] transition-all"
                      placeholder={currentPage}
                      value={jumpPage}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^[0-9]+$/.test(val)) setJumpPage(val);
                      }}
                      onKeyDown={handleJumpPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-3xl border border-dashed border-gray-200">
          <Building2 size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-500">Không tìm thấy cơ sở nào đang hoạt động.</p>
          <Button
            variant="link"
            onClick={() => navigate("/owner/properties")}
            className="mt-2 text-blue-600"
          >
            Kiểm tra lại danh sách tài sản
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoomListPage;
