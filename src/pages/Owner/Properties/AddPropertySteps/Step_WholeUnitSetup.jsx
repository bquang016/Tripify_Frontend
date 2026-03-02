import React from "react";
import {
    Home, Info, BedDouble, DollarSign, Users, Package, Image as ImageIcon,
    Tv, Snowflake, Wine, Coffee, Wifi, Bath, Wind, Ban, TrendingUp 
} from "lucide-react";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import AmenityOption from "./components/AmenityOption";
import { useTranslation } from "react-i18next";

const ROOM_AMENITIES = (t) => [
    { id: "tv", label: "TV", icon: <Tv size={20} /> },
    { id: "ac", label: t('add_property_flow.amenities_list.ac'), icon: <Snowflake size={20} /> },
    { id: "minibar", label: "Minibar", icon: <Wine size={20} /> },
    { id: "tea_coffee", label: t('add_property_flow.amenities_list.tea_coffee', 'Tea/Coffee'), icon: <Coffee size={20} /> },
    { id: "wifi", label: t('add_property_flow.amenities_list.wifi'), icon: <Wifi size={20} /> },
    { id: "bathtub", label: t('add_property_flow.amenities_list.bathtub', 'Bathtub'), icon: <Bath size={20} /> },
    { id: "balcony", label: t('add_property_flow.amenities_list.balcony', 'Balcony'), icon: <Wind size={20} /> },
    { id: "non_smoking", label: t('add_property_flow.amenities_list.non_smoking'), icon: <Ban size={20} /> },
];

const Step_WholeUnitSetup = ({ register, errors, watch, setValue }) => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const currentImages = watch("unitData.images") || [];
    const amenities = ROOM_AMENITIES(t);

    return (
        <div className="animate-fadeIn space-y-6 max-w-5xl mx-auto">

            <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-4 rounded-r-lg mb-6 flex gap-3 items-start">
                <Info size={20} className="text-[rgb(40,169,224)] shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 leading-relaxed">
                    <h4 className="font-bold text-gray-900">{t('add_property_flow.whole_unit_setup_title')}</h4>
                    <p dangerouslySetInnerHTML={{ __html: t('add_property_flow.whole_unit_setup_desc') }} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

                <section className="mb-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
                    <h4 className="text-[rgb(40,169,224)] font-bold mb-4 flex items-center gap-2 text-lg">
                        <BedDouble size={24}/> {t('add_property_flow.unit_details_section')}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="md:col-span-2">
                            <FloatingTextField
                                label={t('add_property_flow.unit_display_name')}
                                placeholder=" "
                                {...register("unitData.name")}
                            />
                        </div>

                        <div className="relative">
                            <FloatingTextField
                                label={t('add_property_flow.weekday_price')}
                                type="number"
                                placeholder="0"
                                {...register("unitData.price", { valueAsNumber: true })}
                                error={errors?.unitData?.price?.message}
                            />
                            <DollarSign className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={18}/>
                        </div>

                        <div className="relative">
                            <FloatingTextField
                                label={t('add_property_flow.weekend_price')}
                                type="number"
                                placeholder="0"
                                {...register("unitData.weekendPrice", { valueAsNumber: true })}
                                error={errors?.unitData?.weekendPrice?.message}
                            />
                            <TrendingUp className="absolute right-3 top-4 text-orange-400 pointer-events-none" size={18}/>
                            <p className="text-xs text-gray-500 mt-1 ml-1">{t('add_property_flow.weekend_price_note')}</p>
                        </div>

                        <div className="relative md:col-span-2">
                            <FloatingTextField
                                label={t('add_property_flow.standard_capacity')}
                                type="number"
                                placeholder="2"
                                {...register("unitData.capacity", { valueAsNumber: true })}
                                error={errors?.unitData?.capacity?.message}
                            />
                            <Users className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={18}/>
                        </div>

                        <div className="md:col-span-2">
                            <TextArea
                                label={t('add_property_flow.unit_description_label')}
                                placeholder={t('add_property_flow.unit_description_placeholder')}
                                rows={4}
                                {...register("unitData.description")}
                                error={errors?.unitData?.description?.message}
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h4 className="text-[rgb(40,169,224)] font-bold mb-4 flex items-center gap-2 text-lg">
                        <Package size={24}/> {t('add_property_flow.unit_amenities')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {amenities.map(item => (
                            <AmenityOption
                                key={item.id}
                                id={item.id}
                                label={item.label}
                                icon={item.icon}
                                register={(name) => register(`unitData.amenities.${item.id}`)}
                                isSelected={!!watch(`unitData.amenities.${item.id}`)}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h4 className="text-[rgb(40,169,224)] font-bold flex items-center gap-2 text-lg">
                            <ImageIcon size={24}/> {t('add_property_flow.unit_images')}
                        </h4>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            {t('add_property_flow.unit_images_desc')}
                        </p>
                        <ImageUploadGrid
                            multiple={true}
                            value={currentImages}
                            onChange={(files) => setValue("unitData.images", files, { shouldValidate: true })}
                            placeholder={t('add_property_flow.unit_images_placeholder')}
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Step_WholeUnitSetup;
