import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/common/Modal/Modal";
import ConfirmModal from "@/components/common/Modal/ConfirmModal"; 
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import AmenityOption from "../AddPropertySteps/components/AmenityOption";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import propertyService from "@/services/property.service";
import api from "@/services/axios.config"; 
import PropertyPoliciesForm from "./PropertyPoliciesForm";
import { useTranslation } from "react-i18next";

import {
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, Plane, PawPrint,
  Dumbbell, Wind, ConciergeBell, Cigarette, Image as ImageIcon, MapPin,
  ClipboardList, Package, XCircle, Star, RefreshCw, Trash2
} from "lucide-react";

const AMENITIES_LIST = (t) => [
    { id: "pool", label: t('add_property_flow.amenities_list.pool'), icon: <Waves size={20} /> },
    { id: "parking", label: t('add_property_flow.amenities_list.parking'), icon: <ParkingCircle size={20} /> },
    { id: "sauna", label: t('add_property_flow.amenities_list.sauna'), icon: <Droplet size={20} /> },
    { id: "spa", label: t('add_property_flow.amenities_list.spa'), icon: <Sparkles size={20} /> },
    { id: "non_smoking", label: t('add_property_flow.amenities_list.non_smoking'), icon: <Ban size={20} /> },
    { id: "wifi", label: t('add_property_flow.amenities_list.wifi'), icon: <Wifi size={20} /> },
    { id: "airport_transfer", label: t('add_property_flow.amenities_list.airport_transfer'), icon: <Plane size={20} /> },
    { id: "pets", label: t('add_property_flow.amenities_list.pets'), icon: <PawPrint size={20} /> },
    { id: "gym", label: t('add_property_flow.amenities_list.gym'), icon: <Dumbbell size={20} /> },
    { id: "smoking_area", label: t('add_property_flow.amenities_list.smoking_area'), icon: <Cigarette size={20} /> },
    { id: "reception_24h", label: t('add_property_flow.amenities_list.reception_24h'), icon: <ConciergeBell size={20} /> },
    { id: "ac", label: t('add_property_flow.amenities_list.ac'), icon: <Wind size={20} /> },
];

const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
};

export default function EditPropertyModal({ open, onClose, property, onSuccess, showToast }) {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  
  const editSchema = yup.object({
    province: yup.string().required(t('owner.province_req')),
    city: yup.string().required(t('owner.city_req')),
    address: yup.string().required(t('owner.address_req')),
    amenities: yup.object().nullable(),
    propertyName: yup.string().required(t('owner.property_name_req')),
    description: yup.string().min(50, t('owner.description_min')).required(t('owner.description_req')),
    area: yup.number().min(1, t('owner.area_pos')).required(t('owner.area_req')).typeError(t('owner.area_num')),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]); 
  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [hasExistingPolicy, setHasExistingPolicy] = useState(false);

  const [confirmData, setConfirmData] = useState({
      open: false,
      title: "",
      message: "",
      onConfirm: null
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(editSchema),
    mode: "onChange",
    defaultValues: {
        policies: {} 
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (open && property?.propertyId) {
        try {
          setIsLoading(true);
          const [detailRes, imagesRes, policyRes] = await Promise.all([
              api.get(`/property-details/${property.propertyId}`),
              propertyService.getPropertyImages(property.propertyId),
              propertyService.getPropertyPolicies(property.propertyId)
          ]);

          const data = detailRes.data;
          setCurrentImages(imagesRes?.data || []);
          setHasExistingPolicy(!!policyRes);

          const amenitiesMap = {};
          const fullList = AMENITIES_LIST(t);
          data.amenities.forEach(a => {
             const key = fullList.find(item => item.label === a.amenityName || item.id === a.amenityName.toLowerCase())?.id;
             if(key) amenitiesMap[key] = true;
          });

          let formattedPolicies = {};
          if (policyRes) {
              formattedPolicies = {
                  ...policyRes,
                  checkInTime: formatTimeForInput(policyRes.checkInTime),
                  checkOutTime: formatTimeForInput(policyRes.checkOutTime),
                  checkInFrom: formatTimeForInput(policyRes.checkInFrom),
                  checkInTo: formatTimeForInput(policyRes.checkInTo),
                  checkOutFrom: formatTimeForInput(policyRes.checkOutFrom),
                  checkOutTo: formatTimeForInput(policyRes.checkOutTo),
              };
          }

          reset({
            propertyName: data.property.propertyName,
            description: data.property.description,
            area: data.property.area || 0,
            province: data.property.province || "",
            city: data.property.city,
            address: data.property.address,
            amenities: amenitiesMap,
            policies: formattedPolicies 
          });
          
          setUploadedFiles([]); 
        } catch (error) {
          console.error("Failed to load data", error);
          if (showToast) showToast(t('finance.fetch_error'), "error");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [open, property, reset, t]);

  const handleSetCover = async (imageId) => {
      try {
          setIsLoading(true);
          await propertyService.setCoverImage(property.propertyId, imageId);
          const updated = currentImages.map(img => ({
              ...img,
              isCover: img.propertyImageId === imageId
          }));
          setCurrentImages(updated);
          if (showToast) showToast(t('owner.set_cover_success'), "success"); 
      } catch (error) {
          if (showToast) showToast(t('owner.set_cover_failed'), "error");
      } finally {
          setIsLoading(false);
      }
  };

  const handleRequestDelete = (imageId) => {
      setConfirmData({
          open: true,
          title: t('owner.delete_photo_confirm_title'),
          message: t('owner.delete_photo_confirm_msg'),
          onConfirm: () => processDeleteImage(imageId)
      });
  };

  const processDeleteImage = async (imageId) => {
      try {
          setIsLoading(true);
          setConfirmData({ ...confirmData, open: false }); 
          await propertyService.deletePropertyImage(property.propertyId, imageId);
          setCurrentImages(prev => prev.filter(img => img.propertyImageId !== imageId));
          if (showToast) showToast(t('owner.delete_photo_success'), "success");
      } catch (e) {
          if (showToast) showToast(t('owner.delete_photo_failed'), "error");
      } finally {
          setIsLoading(false);
      }
  };

  const handleFinalSubmit = async (data) => {
    try {
      setIsLoading(true);
      const updateData = {
          propertyName: data.propertyName,
          description: data.description,
          area: data.area,
          province: data.province,
          city: data.city,
          address: data.address,
      };
      await propertyService.updateProperty(property.propertyId, updateData);

      if (uploadedFiles && uploadedFiles.length > 0) {
          const formData = new FormData();
          Array.from(uploadedFiles).forEach((file) => {
              formData.append("file", file); 
          });
          await propertyService.uploadPropertyImages(property.propertyId, formData);
      }

      if (data.policies) {
          if (hasExistingPolicy) {
              await propertyService.updatePropertyPolicies(property.propertyId, data.policies);
          } else {
              await propertyService.addPropertyPolicies(property.propertyId, data.policies);
          }
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      if (showToast) showToast(error.message || t('common.error_occurred'), "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) return null;

  return (
    <>
      {isLoading && <LoadingOverlay message={t('owner.processing')} />}
      
      <ConfirmModal
          open={confirmData.open}
          onClose={() => setConfirmData({ ...confirmData, open: false })}
          onConfirm={confirmData.onConfirm}
          title={confirmData.title}
          description={confirmData.message}
          confirmText={isVi ? "Xóa ảnh" : "Delete photo"}
          cancelText={t('common.cancel')}
          isDanger={true}
      />

      <Modal open={open} onClose={onClose} title={`${t('owner.edit_property')}: ${property.propertyName}`} maxWidth="max-w-5xl">
        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          <div className="max-h-[75vh] overflow-y-auto p-1 pr-4 space-y-8 custom-scrollbar">
            
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <ClipboardList size={20} /> {t('owner.basic_info')}
              </h3>
              <div className="space-y-3">
                <FloatingTextField
                  label={t('add_property_flow.property_name_label')}
                  {...register("propertyName")}
                  value={watch("propertyName")}
                  error={errors.propertyName?.message}
                />
                <TextArea
                  label={t('add_property_flow.description_label')}
                  rows={5}
                  {...register("description")}
                  value={watch("description")}
                  error={errors.description?.message}
                />
                <FloatingTextField
                  label={t('add_property_flow.area_label')}
                  type="number"
                  {...register("area")}
                  value={watch("area")}
                  error={errors.area?.message}
                />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <MapPin size={20} /> {t('owner.location')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingTextField
                  label={t('add_property_flow.province_label')}
                  {...register("province")}
                  value={watch("province")}
                  error={errors.province?.message}
                />
                <FloatingTextField
                  label={t('add_property_flow.city_label')}
                  {...register("city")}
                  value={watch("city")}
                  error={errors.city?.message}
                />
                <div className="md:col-span-2">
                    <FloatingTextField
                    label={t('add_property_flow.address_label')}
                    {...register("address")}
                    value={watch("address")}
                    error={errors.address?.message}
                    />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <Package size={20} /> {t('owner.amenities')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {AMENITIES_LIST(t).map((item) => (
                  <AmenityOption
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    register={register}
                  />
                ))}
              </div>
            </section>

            <section>
                <PropertyPoliciesForm 
                    register={register} 
                    watch={watch} 
                    setValue={setValue} 
                />
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2">
                    <ImageIcon size={20} /> {t('owner.manage_images')}
                 </h3>
                 <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                        propertyService
                            .getPropertyImages(property.propertyId)
                            .then(res => setCurrentImages(res?.data || []));
                    }}
                 >
                    <RefreshCw size={16} />
                 </Button>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                    {t('owner.current_album', { count: currentImages.length })}
                </h4>
                
                {currentImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {currentImages.map((img) => (
                        <div key={img.propertyImageId} 
                             className={`relative aspect-square w-full overflow-hidden rounded-xl shadow-sm group border-2 transition-all duration-200
                             ${img.isCover ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200 hover:border-blue-300'}`}>
                             
                            <img src={img.imageUrl} alt="Property" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            
                            {img.isCover && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-md z-10">
                                    <Star size={14} fill="currentColor" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                {!img.isCover && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-white text-yellow-500 hover:bg-yellow-400 hover:text-white border-none p-2 h-auto rounded-full shadow-lg transform hover:scale-110 transition-all"
                                        onClick={() => handleSetCover(img.propertyImageId)}
                                        title={isVi ? "Đặt làm ảnh bìa" : "Set as cover"}
                                    >
                                        <Star size={20} />
                                    </Button>
                                )}
                                
                                <Button
                                    type="button"
                                    size="sm"
                                    className="bg-white text-red-500 hover:bg-red-500 hover:text-white border-none p-2 h-auto rounded-full shadow-lg transform hover:scale-110 transition-all"
                                    onClick={() => handleRequestDelete(img.propertyImageId)}
                                    title={isVi ? "Xóa ảnh" : "Delete photo"}
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <ImageIcon className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-gray-400 italic text-sm">{t('owner.no_photos_album')}</p>
                    </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">{t('owner.upload_new_photos')}:</h4>
                <ImageUploadGrid
                  multiple={true}
                  accept="image/png, image/jpeg, image/webp"
                  value={uploadedFiles}
                  onChange={(files) => setUploadedFiles(files)}
                />
              </div>
            </section>

          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('owner.save_all_changes')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
