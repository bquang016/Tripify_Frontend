import React from "react";
import { ShieldCheck, Clock, AlertCircle, Check, Ban, Baby } from "lucide-react";

const formatTime = (time) => time ? time.slice(0, 5) : "---";

const HotelPolicies = ({ policies }) => {
  return (
    <section id="policies" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 scroll-mt-32">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-[rgb(40,169,224)]" /> Chính sách lưu trú
        </h3>
        
        {policies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Thời gian */}
                <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Thời gian</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700 font-medium"><Clock size={16}/> Nhận phòng</div>
                            <span className="font-bold text-blue-600">{formatTime(policies.checkInTime)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700 font-medium"><Clock size={16}/> Trả phòng</div>
                            <span className="font-bold text-orange-600">{formatTime(policies.checkOutTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Quy định khác */}
                <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Quy định khác</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <div className={`mt-0.5 ${policies.allowFreeCancellation ? 'text-green-500' : 'text-red-500'}`}><AlertCircle size={16}/></div>
                            <div>
                                <span className="font-bold text-gray-700">Hủy phòng: </span>
                                <span className="text-gray-600">
                                    {policies.allowFreeCancellation ? `Miễn phí trước ${policies.freeCancellationDays} ngày` : "Không hoàn tiền"}
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center gap-2">
                            {policies.smokingAllowed ? <Check size={16} className="text-green-500"/> : <Ban size={16} className="text-red-500"/>}
                            <span className="text-gray-700">Hút thuốc: <strong>{policies.smokingAllowed ? "Cho phép" : "Cấm"}</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            {policies.petsAllowed ? <Check size={16} className="text-green-500"/> : <Ban size={16} className="text-red-500"/>}
                            <span className="text-gray-700">Thú cưng: <strong>{policies.petsAllowed ? "Cho phép" : "Không"}</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Baby size={16} className="text-blue-500"/>
                            <span className="text-gray-700">Trẻ em: <strong>{policies.childrenAllowed ? "Phù hợp" : "Không phù hợp"}</strong></span>
                        </li>
                    </ul>
                </div>
                
                {/* Full width note */}
                {(policies.cancellationPolicyDescription || policies.securityDepositRequired) && (
                    <div className="md:col-span-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800 mt-2">
                        <strong>Lưu ý thêm: </strong>
                        {policies.cancellationPolicyDescription}
                        {policies.securityDepositRequired && ` • Yêu cầu đặt cọc: ${new Intl.NumberFormat('vi-VN').format(policies.securityDepositAmount)}đ`}
                    </div>
                )}
            </div>
        ) : (
            <p className="text-gray-500 italic">Đang cập nhật chính sách...</p>
        )}
    </section>
  );
};

export default HotelPolicies;