// ✅ SỬA 1: Import useState và useEffect
import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card/Card';
import Divider from '@/components/common/Divider/Divider';
import { format } from 'date-fns';

// ===============================
// Component hiển thị ảnh preview
// ===============================
const ImagePreview = ({ fileList, title }) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const file = fileList && fileList[0] ? fileList[0] : null;

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [fileList]);

    if (!preview) {
        return (
            <div className="text-gray-500 italic">
                {title}: Chưa tải lên
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600">{title}</h4>
            <img
                src={preview}
                alt={title}
                className="rounded-lg border border-gray-200 w-full max-w-xs"
            />
        </div>
    );
};

const Step3_Review = ({ watch }) => {
    const data = watch();

    // Format ngày sinh
    const dobFormatted = data.personalDob
        ? format(new Date(data.personalDob), 'dd/MM/yyyy')
        : 'Chưa cung cấp';

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">
                3. Kiểm tra và Xác nhận
            </h2>

            {/* Thông tin cá nhân */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Thông tin cá nhân
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <InfoItem label="Họ và tên" value={data.personalFullName} />
                        <InfoItem label="Email" value={data.personalEmail} />
                        <InfoItem label="Số điện thoại" value={data.personalPhone} />
                        <InfoItem label="Số CCCD/Passport" value={data.personalIdCard} />
                        <InfoItem label="Ngày sinh" value={dobFormatted} />
                        <InfoItem label="Quê quán" value={data.personalHometown} />
                        <InfoItem
                            label="Địa chỉ thường trú"
                            value={data.personalAddress}
                            className="md:col-span-2"
                        />
                    </div>
                </div>
            </Card>

            {/* Thông tin kinh doanh */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Thông tin kinh doanh
                    </h3>
                    <InfoItem
                        label="Mã số ĐKKD"
                        value={data.businessLicenseNumber}
                    />
                </div>
            </Card>

            {/* =============================== */}
            {/* Ảnh upload — SỬA ĐÚNG FIELD NAME */}
            {/* =============================== */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Tài liệu đính kèm
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ImagePreview
                            fileList={data.cardFrontImage}  // 🔥 ĐÚNG FIELD Step1
                            title="Ảnh mặt trước CCCD"
                        />

                        <ImagePreview
                            fileList={data.cardBackImage}   // 🔥 ĐÚNG FIELD Step1
                            title="Ảnh mặt sau CCCD"
                        />

                        <ImagePreview
                            fileList={data.businessLicenseImage} // 🔥 ĐÚNG FIELD Step1
                            title="Giấy phép kinh doanh"
                        />
                    </div>
                </div>
            </Card>

            <p className="text-sm text-gray-600 italic mt-6">
                Bằng việc nhấn "Gửi đơn đăng ký", bạn xác nhận mọi thông tin trên là chính xác
                và đồng ý với các điều khoản của chúng tôi.
            </p>
        </div>
    );
};

// ===============================
const InfoItem = ({ label, value, className = "" }) => (
    <div className={`break-words ${className}`}>
        <span className="block text-xs font-medium text-gray-500">{label}</span>
        <span className="block text-gray-800 font-medium">
      {value || 'N/A'}
    </span>
    </div>
);

export default Step3_Review;