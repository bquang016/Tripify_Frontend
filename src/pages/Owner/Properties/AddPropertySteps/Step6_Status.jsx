// src/pages/Owner/Properties/AddPropertySteps/Step7_Status.jsx
import React from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"; 
import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";

// Nhận props error (lỗi) và onRetry (hàm thử lại)
export default function Step7_Status({ error, onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
      {error ? (
        // Giao diện khi THẤT BẠI
        <>
          <XCircle size={72} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Gửi đơn thất bại
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            Đã có lỗi xảy ra trong quá trình gửi đơn của bạn. Vui lòng thử lại.
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
            Lỗi: {error}
          </p>
          <Button
            onClick={onRetry} // Quay lại bước 6 (Review)
            leftIcon={<RotateCcw size={18} />}
            className="mt-8"
          >
            Thử lại
          </Button>
        </>
      ) : (
        // Giao diện khi THÀNH CÔNG
        <>
          <CheckCircle2 size={72} className="text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Đã gửi đơn thành công!
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            Cảm ơn bạn đã đăng ký cơ sở lưu trú. Đội ngũ TravelMate sẽ xem xét
            đơn của bạn và phản hồi qua email trong vòng 24-48 giờ tới.
          </p>
          <Button onClick={() => navigate("/owner/properties")}>
            Về trang Quản lý
          </Button>
        </>
      )}
    </div>
  );
}