import React from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"; 
import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Step6_Status({ error, onRetry }) {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
      {error ? (
        <>
          <XCircle size={72} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {isVi ? "Gửi đơn thất bại" : "Submission Failed"}
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            {isVi ? "Đã có lỗi xảy ra trong quá trình gửi đơn của bạn. Vui lòng thử lại." : "An error occurred while submitting your application. Please try again."}
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
            {isVi ? "Lỗi" : "Error"}: {error}
          </p>
          <Button onClick={onRetry} leftIcon={<RotateCcw size={18} />} className="mt-8">
            {isVi ? "Thử lại" : "Try Again"}
          </Button>
        </>
      ) : (
        <>
          <CheckCircle2 size={72} className="text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t('add_property_flow.success_title')}
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            {t('add_property_flow.success_desc')}
          </p>
          <Button onClick={() => navigate("/owner/properties")}>
            {isVi ? "Về trang Quản lý" : "Back to Dashboard"}
          </Button>
        </>
      )}
    </div>
  );
}
