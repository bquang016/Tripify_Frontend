import React from 'react';
import { Check, Info } from 'lucide-react';

const ImagePreview = ({ file }) => {
    const src = React.useMemo(() => URL.createObjectURL(file), [file]);
    return <img src={src} alt={file.name} className="w-24 h-24 object-cover rounded-lg shadow-md" />;
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
    
    const { 
        propertyInfo = {}, 
        paymentInfo = {} 
    } = data;

    const {
        propertyName,
        propertyType,
        address,
        ward,
        district,
        city,
        province,
        policies = {},
        unitData = {},
        propertyImages,
        businessLicenseImage,
        businessLicenseNumber
    } = propertyInfo;

    const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyType);

    return (
        <div className="space-y-8">
            <InfoSection title="Thông tin chung & Địa chỉ">
                <InfoItem label="Tên chỗ nghỉ" value={propertyName} />
                <InfoItem label="Loại hình" value={propertyType} />
                <InfoItem label="Địa chỉ" value={`${address || ''}${ward ? `, ${ward}` : ''}${district ? `, ${district}` : ''}${city || province ? `, ${city || province}` : ''}`} />
            </InfoSection>

            {isWholeUnit && unitData && (
                <InfoSection title="Chi tiết căn (Villa/Homestay)">
                    <InfoItem label="Tên căn" value={unitData.name} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <InfoItem label="Giá ngày thường" value={unitData.price ? `${Number(unitData.price).toLocaleString()} VNĐ` : '0 VNĐ'} />
                        <InfoItem label="Giá cuối tuần" value={unitData.weekendPrice ? `${Number(unitData.weekendPrice).toLocaleString()} VNĐ` : '0 VNĐ'} />
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
