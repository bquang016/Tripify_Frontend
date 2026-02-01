import React, { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import Button from "@/components/common/Button/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5; // Hiển thị 5 đơn mỗi trang

const BookingList = ({ bookings, onViewDetails, onReview }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán items cho trang hiện tại
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  // Reset về trang 1 khi danh sách bookings thay đổi (ví dụ khi đổi Tab)
  useEffect(() => {
    setCurrentPage(1);
  }, [bookings]);

  if (bookings.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Danh sách Bookings */}
      <div className="space-y-4">
        {currentBookings.map((b) => (
          <BookingCard
            key={b.bookingId}
            booking={b}
            onClick={() => onViewDetails(b)}
            onReviewClick={() => onReview(b)}
          />
        ))}
      </div>

      {/* Điều khiển Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 p-0 rounded-full"
          >
            <ChevronLeft size={16} />
          </Button>

          <span className="text-sm font-medium text-slate-600 px-2">
            Trang {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 p-0 rounded-full"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingList;