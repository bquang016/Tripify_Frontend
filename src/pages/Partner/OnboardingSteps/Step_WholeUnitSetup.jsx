import React from "react";
import { Controller } from 'react-hook-form';
import {
    Home, Info, BedDouble, DollarSign, Users, Package, Image as ImageIcon,
    Tv, Snowflake, Wine, Coffee, Wifi, Bath, Wind, Ban, TrendingUp
} from "lucide-react";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import AmenityOption from "./components/AmenityOption";
import CurrencyInput from "@/components/common/Input/CurrencyInput";

const ROOM_AMENITIES = [
    { id: "tv", label: "TV", icon: <Tv size={20} /> },
    { id: "ac", label: "Điều hòa", icon: <Snowflake size={20} /> },
    { id: "minibar", label: "Minibar", icon: <Wine size={20} /> },
    { id: "tea_coffee", label: "Trà/Cà phê", icon: <Coffee size={20} /> },
    { id: "wifi", label: "Wifi", icon: <Wifi size={20} /> },
    { id: "bathtub", label: "Bồn tắm", icon: <Bath size={20} /> },
    { id: "balcony", label: "Ban công", icon: <Wind size={20} /> },
    { id: "non_smoking", label: "Không hút thuốc", icon: <Ban size={20} /> },
];

const Step_WholeUnitSetup = ({ register, errors, watch, setValue, control }) => {
    const currentImages = watch("propertyInfo.unitData.images") || [];
    const unitDataErrors = errors.propertyInfo?.unitData || {};

    return (
        <div className="animate-fadeIn space-y-6 max-w-5xl mx-auto">

            <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-4 rounded-r-lg mb-6 flex gap-3 items-start">
                <Info size={20} className="text-[rgb(40,169,224)] shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 leading-relaxed">
                    <h4 className="font-bold text-gray-900">Thiết lập Nguyên căn (Villa / Homestay)</h4>
                    <p>
                        Vì bạn chọn mô hình cho thuê nguyên căn, hãy thiết lập thông tin chi tiết cho <strong> toàn bộ căn nhà</strong> tại đây.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <section className="mb-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
                    <h4 className="text-[rgb(40,169,224)] font-bold mb-4 flex items-center gap-2 text-lg">
                        <BedDouble size={24}/> Thông tin chi tiết căn
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <FloatingTextField
                                label="Tên hiển thị của Căn (VD: Nguyên căn Villa 3PN)"
                                placeholder=" "
                                {...register("propertyInfo.unitData.name")}
                                error={unitDataErrors.name?.message}
                            />
                        </div>

                        <Controller
                            name="propertyInfo.unitData.price"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    {...field}
                                    label="Giá thuê ngày thường / đêm"
                                    placeholder="1.000.000"
                                    error={unitDataErrors.price?.message}
                                />
                            )}
                        />

                        <Controller
                            name="propertyInfo.unitData.weekendPrice"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    {...field}
                                    label="Giá thuê cuối tuần / đêm"
                                    placeholder="1.200.000"
                                    error={unitDataErrors.weekendPrice?.message}
                                />
                            )}
                        />
                        
                        <div className="relative">
                           <FloatingTextField
                                label="Diện tích (m²)"
                                type="number"
                                placeholder="50"
                                {...register("propertyInfo.unitData.area", { valueAsNumber: true })}
                                error={unitDataErrors.area?.message}
                            />
                        </div>

                        <div className="relative">
                            <FloatingTextField
                                label="Sức chứa tiêu chuẩn (Người)"
                                type="number"
                                placeholder="2"
                                {...register("propertyInfo.unitData.capacity", { valueAsNumber: true })}
                                error={unitDataErrors.capacity?.message}
                            />
                            <Users className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={18}/>
                        </div>

                        <div className="md:col-span-2">
                            <TextArea
                                label="Mô tả về căn (Diện tích, hướng nhìn, số phòng ngủ...)"
                                placeholder="Mô tả chi tiết về không gian, số lượng phòng ngủ, giường..."
                                rows={4}
                                {...register("propertyInfo.unitData.description")}
                                error={unitDataErrors.description?.message}
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h4 className="text-[rgb(40,169,224)] font-bold mb-4 flex items-center gap-2 text-lg">
                        <Package size={24}/> Tiện nghi bên trong căn
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {ROOM_AMENITIES.map(item => (
                            <AmenityOption
                                key={item.id}
                                id={`unit_${item.id}`}
                                label={item.label}
                                icon={item.icon}
                                register={() => register(`propertyInfo.unitData.amenities.${item.id}`)}
                                isSelected={!!watch(`propertyInfo.unitData.amenities.${item.id}`)}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h4 className="text-[rgb(40,169,224)] font-bold flex items-center gap-2 text-lg">
                            <ImageIcon size={24}/> Hình ảnh chi tiết căn
                        </h4>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                        <ImageUploadGrid
                            multiple={true}
                            value={currentImages}
                            onChange={(files) => setValue("propertyInfo.unitData.images", files, { shouldValidate: true })}
                            error={unitDataErrors.images?.message}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Step_WholeUnitSetup;
