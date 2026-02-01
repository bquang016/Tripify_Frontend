import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import SearchResultsList from "./SearchResultsList";
import propertyService from "@/services/property.service";
import SearchBox from "@/components/search/SearchBox"; 

const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State dữ liệu
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // --- STATE BỘ LỌC TỔNG HỢP ---
  // Lưu giữ tất cả giá trị filter hiện tại
  const [activeFilters, setActiveFilters] = useState({
    minPrice: null,
    maxPrice: null,
    cities: null,
    ratings: null,
    sort: "id,desc"
  });

  // Params khởi tạo cho SearchBox header
  const initialSearchValues = {
    destination: searchParams.get("keyword") || "",
    guests: parseInt(searchParams.get("guests")) || 2,
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  };

  // --- HÀM GỌI API ---
  const fetchHotels = async (pageIndex) => {
    setLoading(true);
    try {
      // 1. Gom tham số từ URL
      const urlParams = {
        keyword: searchParams.get("keyword") || "",
        guests: searchParams.get("guests") || 1,
        checkIn: searchParams.get("checkIn"),
        checkOut: searchParams.get("checkOut"),
      };

      // 2. Gom tham số từ Bộ lọc Sidebar (activeFilters)
      const filterParams = {
        minPrice: activeFilters.minPrice,
        maxPrice: activeFilters.maxPrice,
        cities: activeFilters.cities,     // Array hoặc null
        ratings: activeFilters.ratings,   // Array hoặc null
        sort: activeFilters.sort,
      };

      // 3. Gom tham số phân trang
      const paginationParams = {
        page: pageIndex,
        size: 10
      };

      // Merge tất cả lại
      const finalParams = { ...urlParams, ...filterParams, ...paginationParams };

      // console.log("Fetching with params:", finalParams); // Debug

      // 4. Gọi Service
      const res = await propertyService.searchProperties(finalParams);
      
      // Xử lý kết quả trả về (Logic fix ở bước trước)
      let newHotels = [];
      let totalPages = 0;
      let totalItems = 0;

      if (res.data && res.data.content) {
          newHotels = res.data.content || [];
          totalPages = res.data.totalPages || 0;
          totalItems = res.data.totalElements || 0;
      } 
      else if (res.content) {
          newHotels = res.content || [];
          totalPages = res.totalPages || 0;
          totalItems = res.totalElements || 0;
      }
      
      if (pageIndex === 0) {
        setHotels(newHotels);
        if (newHotels.length > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setHotels(prev => [...prev, ...newHotels]);
      }

      setTotalElements(totalItems);
      setHasMore(pageIndex < totalPages - 1);

    } catch (error) {
      console.error("Failed to search hotels:", error);
      if (pageIndex === 0) setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ SỰ KIỆN ---

  const handleSearch = (newParams) => {
      setSearchParams(newParams); // Đổi URL -> Trigger useEffect 1
  };

  // Callback nhận data từ FilterSidebar
  const handleFilterChange = (newFilterValues) => {
    // newFilterValues có thể là { minPrice, maxPrice } HOẶC { cities, ratings }
    // Merge vào state chung
    setActiveFilters(prev => ({ ...prev, ...newFilterValues }));
    // Reset về trang 0 mỗi khi đổi bộ lọc
    setPage(0); 
  };

  // --- EFFECT ---

  // 1. Khi URL thay đổi (Keyword, Date, Guest) -> Reset Filters & Fetch
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    // Lưu ý: Có thể bạn muốn giữ lại filters khi đổi keyword, 
    // hoặc reset filters. Ở đây tôi giữ lại filters hiện tại.
    fetchHotels(0);
  }, [searchParams]); 

  // 2. Khi ActiveFilters thay đổi (Do người dùng click Sidebar) -> Fetch lại trang 0
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchHotels(0);
  }, [activeFilters]);

  // 3. Khi Page tăng (Lazy load) -> Fetch trang tiếp theo
  // Cần dùng activeFilters hiện tại
  useEffect(() => {
    if (page > 0) {
      fetchHotels(page);
    }
  }, [page]);


  // --- INFINITE SCROLL OBSERVER ---
  const observer = useRef();
  const lastHotelElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);


  return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header Search Box */}
        <div className="bg-white border-b border-gray-200 sticky top-[64px] z-30 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
             <SearchBox 
                initialValues={initialSearchValues}
                onSearch={handleSearch}
                className="shadow-none border-0 p-0 !gap-2" 
             />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-48"> 
                {/* Truyền callback handleFilterChange */}
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </div>

            <div className="lg:col-span-3">
               {/* Header kết quả & Sort */}
               <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {loading && page === 0 ? "Đang tìm kiếm..." : `Tìm thấy ${totalElements} chỗ nghỉ`}
                </h2>
                <select 
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white outline-none cursor-pointer"
                  value={activeFilters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                >
                  <option value="id,desc">Mới nhất</option>
                  <option value="price,asc">Giá thấp đến cao</option>
                  <option value="price,desc">Giá cao đến thấp</option>
                </select>
              </div>

              <SearchResultsList 
                hotels={hotels} 
                loading={loading} 
                searchInfo={{ total: totalElements, location: initialSearchValues.destination }} 
                lastElementRef={lastHotelElementRef}
              />

              {loading && page > 0 && (
                 <div className="py-6 text-center">
                   <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-gray-500 text-xs mt-2 font-medium">Đang tải thêm...</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HotelSearchPage;
