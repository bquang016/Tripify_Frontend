import React from 'react';
import { Check, Info } from 'lucide-react';

const ImagePreview = ({ file }) => {
    const src = React.useMemo(() => {
        if (!file) return null;
        
        // 1. Nếu file đã là một chuỗi string (VD: URL ảnh từ backend hoặc link blob có sẵn)
        if (typeof file === 'string') return file;
        
        // 2. Nếu file là object dạng { preview: '...', ... } (do một số thư viện drag & drop upload tạo ra)
        if (file.preview && typeof file.preview === 'string') return file.preview;
        
        // 3. Nếu là đối tượng File / Blob thuần túy
        try {
            return URL.createObjectURL(file);
        } catch (error) {
            console.error("Không thể tạo URL hiển thị cho file:", file);
            return null; // Trả về null thay vì crash nguyên trang web
        }
    }, [file]);

    // Nếu không có src hợp lệ, hiển thị 1 ô trống thông báo lỗi nhẹ nhàng
    if (!src) {
        return (
            <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs text-center p-2">
                Không thể tải ảnh
            </div>
        );
    }

    return <img src={src} alt={file?.name || 'Preview'} className="w-24 h-24 object-cover rounded-lg shadow-md border border-slate-100" />;
};

const InfoItem = ({ label, value, className }) => (
    <div className={`py-3 border-b border-slate-100 last:border-b-0 ${className}`}>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="font-semibold text-slate-800 break-words">{value || 'Chưa cung cấp'}</p>
    </div>
);

const InfoSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className='font-bold text-lg text-slate-800 mb-4 pb-3 border-b border-gray-100'>{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const Step6_Review = ({ data }) => {
    if (!data) return null;
    
    // TÁCH personalInfo RA KHỎI data (bao gồm fullName, email, address từ Step 1)
    const { 
        propertyInfo = {}, 
        paymentInfo = {},
        ...personalInfo 
    } = data;

    const {
        propertyName,
        propertyType,
        propertyAddress,
        wardName,
        propertyDistrict, // Hoặc propertyDistrict tùy thuộc vào cách bạn lưu Text ở Step 2
        propertyCity, // Hoặc propertyCity tùy thuộc vào cách bạn lưu Text ở Step 2
        policies = {},
        unitData = {},
        propertyImages,
        businessLicenseImage,
        businessLicenseNumber
    } = propertyInfo;

    const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyType);

    // Xử lý chuỗi địa chỉ chỗ nghỉ
    const fullPropertyAddress = [
        propertyAddress,
        wardName,
        propertyDistrict,
        propertyCity
    ].filter(Boolean).join(', ');

    return (
        <div className="space-y-8">
            {/* THÊM MỚI: SECTION THÔNG TIN CÁ NHÂN (TỪ STEP 1) */}
            <InfoSection title="Thông tin cá nhân (Chủ sở hữu)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <InfoItem label="Họ và tên" value={personalInfo.fullName} />
                    <InfoItem label="Email" value={personalInfo.email} />
                    <InfoItem label="Số điện thoại" value={personalInfo.phoneNumber} />
                    <InfoItem label="CCCD/CMND" value={personalInfo.identityCardNumber} />
                </div>
                <InfoItem label="Địa chỉ cá nhân" value={personalInfo.address} /> 
            </InfoSection>

            {/* SECTION THÔNG TIN CHỖ NGHỈ */}
            <InfoSection title="Thông tin chung & Địa chỉ chỗ nghỉ">
                <InfoItem label="Tên chỗ nghỉ" value={propertyName} />
                <InfoItem label="Loại hình" value={propertyType} />
                <InfoItem label="Địa chỉ" value={fullPropertyAddress} />
            </InfoSection>

            {isWholeUnit && unitData && (
                <InfoSection title="Chi tiết căn (Villa/Homestay)">
                    <InfoItem label="Tên căn" value={unitData.name} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <InfoItem 
                            label="Giá ngày thường" 
                            value={unitData.price ? `${Number(String(unitData.price).replace(/[^0-9]/g, '')).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'} 
                        />
                        <InfoItem 
                            label="Giá cuối tuần" 
                            value={unitData.weekendPrice ? `${Number(String(unitData.weekendPrice).replace(/[^0-9]/g, '')).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'} 
                        />
                        <InfoItem label="Sức chứa" value={`${unitData.capacity || 0} người`} />
                        <InfoItem label="Diện tích" value={`${unitData.area || 0} m²`} />
                    </div>
                </InfoSection>
            )}

            <InfoSection title="Hình ảnh & Giấy phép">
                <InfoItem label="Số giấy phép kinh doanh" value={businessLicenseNumber} />
                 {businessLicenseImage && (
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-2">Ảnh minh chứng:</p>
                        <div className="flex gap-3">
                             {businessLicenseImage instanceof FileList || Array.isArray(businessLicenseImage) 
                                ? Array.from(businessLicenseImage).map((file, i) => <ImagePreview key={i} file={file} />)
                                : <ImagePreview file={businessLicenseImage} />
                             }
                        </div>
                    </div>
                )}
                 {propertyImages && (
                    <div className="mt-4">
                        <p className="text-sm text-slate-500 font-medium mb-2">Ảnh chỗ nghỉ:</p>
                        <div className="flex flex-wrap gap-3">
                            {Array.from(propertyImages).map((file, i) => <ImagePreview key={i} file={file} />)}
                        </div>
                    </div>
                )}
            </InfoSection>

            <InfoSection title="Chính sách">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <InfoItem label="Giờ nhận phòng" value={`Từ ${policies.checkInTime || '14:00'}`} />
                    <InfoItem label="Giờ trả phòng" value={`Trước ${policies.checkOutTime || '12:00'}`} />
                    <InfoItem label="Hủy miễn phí" value={policies.allowFreeCancellation ? `Có (trước ${policies.freeCancellationDays} ngày)`: 'Không'} />
                    <InfoItem label="Tuổi tối thiểu" value={`${policies.minimumAge || 18} tuổi`} />
                    <InfoItem label="Cho phép thú cưng" value={policies.petsAllowed ? 'Có' : 'Không'} />
                    <InfoItem label="Yêu cầu đặt cọc" value={policies.securityDepositRequired ? `${Number(policies.securityDepositAmount).toLocaleString()} VNĐ` : 'Không'} />
                </div>
            </InfoSection>

            <InfoSection title="Thanh toán">
                <InfoItem label="Phương thức" value={paymentInfo.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : paymentInfo.paymentMethod} />
                {paymentInfo.paymentMethod === 'bank' && (
                    <>
                        <InfoItem label="Ngân hàng" value={paymentInfo.bankName} />
                        <InfoItem label="Chủ tài khoản" value={paymentInfo.accountHolderName} />
                        <InfoItem label="Số tài khoản" value={paymentInfo.accountNumber} />
                    </>
                )}
            </InfoSection>
        </div>
    );
};

export default Step6_Review;