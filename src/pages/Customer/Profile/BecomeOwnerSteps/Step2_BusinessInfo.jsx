import React from "react";
import TextField from "@/components/common/Input/TextField";
import FileUpload from "@/components/common/Input/FileUpload";
import { Award } from "lucide-react";

export default function Step2_BusinessInfo({
                                               errors,
                                               watch,
                                               setValue,
                                           }) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700">
                Thông tin pháp lý và kinh doanh
            </h2>

            {/* Mã số đăng ký kinh doanh */}
            <TextField
                label="Mã số đăng ký kinh doanh"
                icon={<Award size={18} />}
                value={watch("businessLicenseNumber")}
                name="businessLicenseNumber"
                onChange={(e) =>
                    setValue("businessLicenseNumber", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                    })
                }
                error={errors.businessLicenseNumber?.message}
            />

            {/* Upload file kinh doanh */}
            <FileUpload
                label="Tải lên Giấy phép kinh doanh"
                name="businessLicenseImage"       // ✅ SỬA TÊN FIELD CHUẨN THEO BE
                watch={watch}
                setValue={setValue}
                error={errors.businessLicenseImage?.message}
            />

            <p className="text-xs text-gray-500">
                Chấp nhận file PDF, PNG, JPG.
            </p>
        </div>
    );
}
