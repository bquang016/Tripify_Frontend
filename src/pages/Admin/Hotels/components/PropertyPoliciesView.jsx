import React from "react";
import { 
  Clock, Ban, Baby, Dog, CreditCard, AlertTriangle, 
  ShieldCheck, DollarSign, Check, X 
} from "lucide-react";

// Helper format tiền
const formatMoney = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper format giờ
const formatTime = (time) => time ? time.slice(0, 5) : "---";

// Component hiển thị một mục chính sách (Card nhỏ)
const PolicyItem = ({ icon, label, status, children, isAllowed }) => (
  <div className={`p-4 rounded-xl border ${isAllowed ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'} h-full flex flex-col`}>
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-full ${isAllowed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="flex items-center gap-1.5">
          {isAllowed ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-gray-400" />}
          <span className={`font-bold text-sm ${isAllowed ? 'text-green-700' : 'text-gray-600'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
    {/* Phần mô tả chi tiết */}
    {children && (
      <div className="mt-auto pt-3 border-t border-gray-200/50 text-xs text-gray-700 space-y-1 italic">
        {children}
      </div>
    )}
  </div>
);

const PropertyPoliciesView = ({ policies }) => {
  if (!policies) return (
    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 italic">
      Chưa có thông tin chính sách.
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <ShieldCheck size={20} className="text-orange-500" />
        <h3 className="text-base font-bold text-gray-800">Chính sách & Quy định chi tiết</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Thời gian (Check-in/out) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" /> Thời gian Nhận/Trả phòng
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="text-xs text-gray-500 block mb-1 font-medium">Nhận phòng từ</span>
              <span className="text-xl font-extrabold text-gray-900">
                {formatTime(policies.checkInTime)}
              </span>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <span className="text-xs text-gray-500 block mb-1 font-medium">Trả phòng trước</span>
              <span className="text-xl font-extrabold text-gray-900">
                {formatTime(policies.checkOutTime)}
              </span>
            </div>
          </div>

          {policies.quietHours && policies.quietHours !== "không có" && (
            <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100">
               <span className="shrink-0">🤫</span>
               <span><strong>Giờ yên lặng:</strong> {policies.quietHours}</span>
            </div>
          )}
        </div>

        {/* 2. Hủy phòng (Cancellation) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> Chính sách Hủy phòng
          </h4>
          
          <div className={`p-4 rounded-xl border ${policies.allowFreeCancellation ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Cho phép hủy miễn phí?</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${policies.allowFreeCancellation ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {policies.allowFreeCancellation ? "CÓ" : "KHÔNG"}
                </span>
             </div>
             
             {policies.allowFreeCancellation ? (
                <p className="text-sm text-gray-800 mb-2">
                   Hủy trước <strong className="text-green-700 text-lg">{policies.freeCancellationDays} ngày</strong> sẽ không mất phí.
                </p>
             ) : (
                <p className="text-sm text-red-600 font-medium">Khách hàng sẽ không được hoàn tiền nếu hủy.</p>
             )}

             {policies.cancellationPolicyDescription && (
                <div className="text-xs text-gray-600 italic border-t border-gray-200/50 pt-2 mt-2">
                   "{policies.cancellationPolicyDescription}"
                </div>
             )}
          </div>
        </div>
      </div>

      {/* 3. Các quy định chi tiết (Grid 3 cột) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Hút thuốc */}
        <PolicyItem 
          icon={<Ban size={18}/>} 
          label="Hút thuốc" 
          status={policies.smokingAllowed ? "Cho phép" : "Cấm hút thuốc"}
          isAllowed={policies.smokingAllowed}
        >
           {policies.smokingPolicyDescription && (
              <p>"{policies.smokingPolicyDescription}"</p>
           )}
        </PolicyItem>

        {/* Thú cưng */}
        <PolicyItem 
          icon={<Dog size={18}/>} 
          label="Thú cưng" 
          status={policies.petsAllowed ? "Cho phép" : "Không cho phép"}
          isAllowed={policies.petsAllowed}
        >
           {policies.petPolicyDescription && (
              <p>"{policies.petPolicyDescription}"</p>
           )}
        </PolicyItem>

        {/* Trẻ em */}
        <PolicyItem 
          icon={<Baby size={18}/>} 
          label="Trẻ em" 
          status={policies.childrenAllowed ? "Phù hợp" : "Hạn chế"}
          isAllowed={policies.childrenAllowed}
        >
           {policies.minimumAge > 0 && (
              <p className="font-bold text-gray-800 not-italic">Tuổi tối thiểu: {policies.minimumAge}+</p>
           )}
           {policies.childrenPolicyDescription && (
              <p>"{policies.childrenPolicyDescription}"</p>
           )}
        </PolicyItem>

      </div>

      {/* 4. Thanh toán & Đặt cọc (Full Width) */}
      {(policies.requiresPrepayment || policies.securityDepositRequired) && (
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-4">
             <CreditCard size={18} /> Thanh toán & Đặt cọc
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Prepayment */}
             <div className="flex gap-3">
                 <div className={`w-1 h-full rounded-full ${policies.requiresPrepayment ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                 <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">Thanh toán trước</p>
                    <p className="text-sm text-gray-600">
                       {policies.requiresPrepayment ? (policies.prepaymentPolicy || "Theo quy định chung") : "Không yêu cầu"}
                    </p>
                 </div>
             </div>

             {/* Deposit */}
             <div className="flex gap-3">
                 <div className={`w-1 h-full rounded-full ${policies.securityDepositRequired ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                 <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">Đặt cọc hư hại</p>
                    {policies.securityDepositRequired ? (
                       <div className="space-y-1">
                          <p className="text-lg font-bold text-green-600">
                             {formatMoney(policies.securityDepositAmount)}
                          </p>
                          <p className="text-xs text-gray-500 italic">
                             "{policies.securityDepositDescription || "Hoàn lại khi trả phòng"}"
                          </p>
                       </div>
                    ) : (
                       <p className="text-sm text-gray-600">Không yêu cầu</p>
                    )}
                 </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyPoliciesView;