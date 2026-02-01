import React from "react";
import HotelListCard from "@/components/common/Card/HotelListCard";
import { Map } from "lucide-react";
import Button from "@/components/common/Button/Button";

const SearchResultsList = ({ hotels, loading, searchInfo, lastElementRef }) => {
  
  // --- SKELETON LOADING COMPONENT ---
  const HotelSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 animate-pulse h-auto md:h-[260px]">
      <div className="w-full md:w-[35%] bg-gray-200 rounded-xl h-48 md:h-full"></div>
      <div className="flex-1 flex flex-col justify-between py-2">
         <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-2 mt-4">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
         </div>
         <div className="flex justify-between items-end mt-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
         </div>
      </div>
    </div>
  );

  // --- RENDER LOADING STATE (KHI MỚI VÀO TRANG) ---
  // Chỉ hiện skeleton khi loading mà chưa có dữ liệu (lần đầu)
  if (loading && hotels.length === 0) {
    return (
      <div className="space-y-6">
         {[1, 2, 3, 4].map((i) => <HotelSkeleton key={i} />)}
      </div>
    );
  }

  // --- RENDER EMPTY STATE ---
  if (!loading && (!hotels || hotels.length === 0)) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
            <Map size={48} className="text-[rgb(40,169,224)]" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Không tìm thấy chỗ nghỉ nào
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Chúng tôi không tìm thấy chỗ nghỉ nào phù hợp với từ khóa "{searchInfo?.location}" của bạn. Hãy thử thay đổi ngày hoặc tìm kiếm địa điểm khác.
        </p>
        <Button 
            className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6]"
            onClick={() => window.location.reload()} // Hoặc reset filter
        >
           Tải lại trang
        </Button>
      </div>
    );
  }

  // --- RENDER SUCCESS LIST ---
  return (
    <div className="grid grid-cols-1 gap-6">
      {hotels.map((hotel, index) => {
        // Kiểm tra nếu là phần tử cuối cùng thì gắn Ref để kích hoạt lazy load
        if (hotels.length === index + 1) {
            return (
                <div ref={lastElementRef} key={hotel.propertyId}>
                    <HotelListCard hotel={hotel} />
                </div>
            );
        } else {
            return <HotelListCard key={hotel.propertyId} hotel={hotel} />;
        }
      })}
    </div>
  );
};

export default SearchResultsList;