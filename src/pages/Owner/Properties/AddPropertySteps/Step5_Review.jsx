import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Info, MapPin, Sparkles, Image, ClipboardList, 
  Home, Banknote, Users, ShieldCheck // Thêm icon ShieldCheck
} from "lucide-react";
import ReviewImagePreview from "./components/ReviewImagePreview";

// --- SUB-COMPONENTS ---

const ReviewItem = ({ label, value, highlight = false }) => (
  <div className="py-3 border-b border-gray-50 last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className={`text-sm font-medium text-right max-w-[70%] ${highlight ? 'text-[rgb(40,169,224)] font-bold' : 'text-gray-900'}`}>
      {value || "(Chưa nhập)"}
    </p>
  </div>
);

const ReviewHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50/80 border-b border-gray-100">
    <div className="p-2 bg-white rounded-lg shadow-sm text-[rgb(40,169,224)]">
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{title}</h3>
  </div>
);

const ImageGrid = ({ fileList }) => {
  if (!fileList || fileList.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-400 italic">Chưa tải lên ảnh nào</p>
      </div>
    );
  }
  const files = Array.from(fileList);
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
      {files.map((file, index) => (
        <ReviewImagePreview key={index} file={file} />
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function Step5_Review({ watch, register, errors }) {
  const data = watch();
  const policies = data.policies || {}; // Lấy dữ liệu policies
  
  // 1. Logic kiểm tra loại hình
  const isWholeUnit = ["VILLA", "HOMESTAY"].includes(data.propertyType);
  const unitData = data.unitData || {};

  // 2. Helper format tiền
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  // 3. Logic hiển thị địa chỉ thông minh
  const getDisplayAddress = () => {
    let addr = data.address || "";
    const province = data.province || "";
    const city = data.city || "";
    const ward = data.ward || "";

    const addrLower = addr.toLowerCase();
    const provinceLower = province.toLowerCase().replace("thành phố", "").replace("tỉnh", "").trim();
    
    if (provinceLower && addrLower.includes(provinceLower)) return addr;

    const parts = [];
    if (ward && !addrLower.includes(ward.toLowerCase())) parts.push(ward);
    if (city && !addrLower.includes(city.toLowerCase())) parts.push(city);
    parts.push(province);
    parts.push(data.country || "Việt Nam");

    const suffix = parts.filter(p => p && p.trim() !== "").join(", ");
    return suffix ? `${addr}, ${suffix}` : addr;
  };

  const displayAddress = getDisplayAddress();
  
  // Lọc danh sách tiện nghi chung của Property
  const amenities = data.amenities ? Object.keys(data.amenities).filter(k => data.amenities[k]) : [];

  return (
    <motion.div 
      className="space-y-8 animate-fadeIn max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl">
          <ClipboardList size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kiểm tra lại thông tin</h2>
          <p className="text-gray-500 text-sm mt-1">
            Vui lòng rà soát kỹ trước khi gửi đơn đăng ký.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMN 1 */}
        <div className="space-y-6">
          
          {/* BLOCK 1: THÔNG TIN CƠ BẢN */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<MapPin size={18} />} title="Thông tin chung & Vị trí" />
            <div className="p-5 space-y-1">
              <ReviewItem label="Tên cơ sở" value={data.propertyName} highlight />
              <ReviewItem label="Loại hình" value={data.propertyType} />
              <ReviewItem label="Diện tích" value={data.area ? `${data.area} m²` : ""} />
              <ReviewItem label="Địa chỉ" value={displayAddress} />
              <div className="pt-3 mt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1 block">Mô tả</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic line-clamp-4">
                  {data.description || "(Chưa nhập mô tả)"}
                </p>
              </div>
            </div>
          </div>

          {/* BLOCK 2: THÔNG TIN CĂN (CHỈ HIỆN KHI LÀ VILLA/HOMESTAY) */}
          {isWholeUnit && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white border border-[rgb(40,169,224)]/30 rounded-2xl shadow-sm overflow-hidden ring-1 ring-[rgb(40,169,224)]/10"
            >
              <ReviewHeader icon={<Home size={18} />} title="Chi tiết cho thuê (Nguyên căn)" />
              <div className="p-5 space-y-1 bg-[rgb(40,169,224)]/5">
                <ReviewItem label="Giá thuê / đêm" value={formatCurrency(unitData.price)} highlight />
                <ReviewItem label="Sức chứa tiêu chuẩn" value={`${unitData.capacity || 0} người`} />
                
                {/* Mô tả chi tiết về căn */}
                <div className="pt-3 mt-2 border-t border-[rgb(40,169,224)]/10">
                   <span className="text-xs font-bold text-[rgb(40,169,224)] uppercase mb-1 block">Mô tả căn / Giường ngủ</span>
                   <p className="text-sm text-gray-700 bg-white p-3 rounded-lg italic border border-[rgb(40,169,224)]/10">
                      {unitData.description || "(Chưa nhập mô tả)"}
                   </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* COLUMN 2 */}
        <div className="space-y-6">
          
          {/* ✅ BLOCK MỚI: CHÍNH SÁCH & QUY ĐỊNH */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<ShieldCheck size={18} />} title="Chính sách & Quy định" />
            <div className="p-5 space-y-1">
               {/* Thời gian */}
               <ReviewItem label="Nhận phòng" value={`Từ ${policies.checkInTime || '14:00'} đến ${policies.checkInTo || '23:00'}`} />
               <ReviewItem label="Trả phòng" value={`Từ ${policies.checkOutFrom || '06:00'} đến ${policies.checkOutTime || '12:00'}`} />
               
               {/* Hủy phòng */}
               <ReviewItem 
                  label="Hủy miễn phí" 
                  value={policies.allowFreeCancellation 
                          ? `Có (trước ${policies.freeCancellationDays} ngày)` 
                          : "Không cho phép"} 
                  highlight={policies.allowFreeCancellation}
               />

               {/* Quy định khác */}
               <ReviewItem label="Hút thuốc" value={policies.smokingAllowed ? "Cho phép" : "Cấm hút thuốc"} />
               <ReviewItem label="Thú cưng" value={policies.petsAllowed ? "Cho phép" : "Không cho phép"} />
               <ReviewItem label="Trẻ em" value={policies.childrenAllowed ? "Phù hợp" : "Không phù hợp"} />
            </div>
          </div>

          {/* BLOCK 3: TIỆN NGHI */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<Sparkles size={18} />} title="Tiện nghi & Dịch vụ" />
            <div className="p-5">
              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
                      {amenity} 
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic text-center py-2">Chưa chọn tiện nghi nào</p>
              )}
            </div>
          </div>

          {/* BLOCK 4: HÌNH ẢNH */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<Image size={18} />} title={`Hình ảnh (${data.propertyImages?.length || 0})`} />
            <div className="p-5">
              <ImageGrid fileList={data.propertyImages} />
            </div>
          </div>

        </div>
      </div>

      {/* Điều khoản */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
        <input
          type="checkbox"
          id="terms"
          {...register("terms")}
          className="w-5 h-5 mt-0.5 accent-[rgb(40,169,224)] cursor-pointer shrink-0"
        />
        <div>
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none leading-relaxed">
            Tôi cam kết rằng các thông tin và hình ảnh cung cấp ở trên là chính xác và thuộc quyền sở hữu hợp pháp. Tôi đồng ý với{" "}
            <Link to="/owner/terms-of-service" target="_blank" className="text-[rgb(40,169,224)] font-bold hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link to="/owner/partner-policy" target="_blank" className="text-[rgb(40,169,224)] font-bold hover:underline">
              Chính sách đối tác
            </Link>{" "}
            của TravelMate.
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1 animate-pulse">
              <Info size={14}/> {errors.terms.message}
            </p>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-4">
        Đơn đăng ký sẽ được xét duyệt trong vòng 24-48h.
      </div>
    </motion.div>
  );
}