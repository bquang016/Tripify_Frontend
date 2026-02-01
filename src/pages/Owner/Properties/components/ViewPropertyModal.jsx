import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import {
  MapPin,
  List,
  Info,
  Globe,
  Image as ImageIcon,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import api from "@/services/axios.config";

// Helper xử lý ảnh
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const ViewPropertyModal = ({ open, onClose, property }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && property?.propertyId) {
      fetchPropertyDetails(property.propertyId);
    } else {
      setDetails(null);
    }
  }, [open, property]);

  const fetchPropertyDetails = async (id) => {
    setLoading(true);
    try {
      // Gọi API public/common để lấy chi tiết đầy đủ (Amenities, Images...)
      const res = await api.get(`/property-details/${id}`);
      setDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  const tabs = [
    { id: "info", name: "Thông tin chung" },
    { id: "amenities", name: "Tiện nghi" },
    { id: "images", name: "Hình ảnh" },
    { id: "location", name: "Vị trí" },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={property.propertyName}
      maxWidth="max-w-4xl"
    >
      {/* Tabs */}
      <div className="mb-6">
        <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <>
            {/* TAB 1: INFO */}
            {activeTab === "info" && (
              <div className="space-y-6 animate-fadeIn">
                <Section title="Tổng quan" icon={<Info />}>
                  <InfoRow label="Tên cơ sở" value={property.propertyName} />
                  <InfoRow label="Loại hình" value={property.propertyType} />
                  <InfoRow label="Địa chỉ" value={`${property.address}, ${property.city}`} />
                  {details?.property?.area && <InfoRow label="Diện tích" value={`${details.property.area} m²`} />}
                  <InfoRow label="Trạng thái" value={
                      property.propertyStatus === "PENDING" ? "Chờ duyệt" :
                      property.propertyStatus === "APPROVED" || property.propertyStatus === "APPROVE" ? "Đang hoạt động" : "Bị từ chối"
                  } />
                </Section>

                <Section title="Mô tả" icon={<List />}>
                  <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed">
                    {property.description || "Chưa có mô tả."}
                  </p>
                </Section>
              </div>
            )}

            {/* TAB 2: AMENITIES */}
            {activeTab === "amenities" && (
              <div className="animate-fadeIn">
                 <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                  <CheckCircle2 className="mr-3 text-blue-600" size={20} />
                  Tiện nghi & Dịch vụ
                </h4>
                {details?.amenities && details.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {details.amenities.map((item) => (
                      <div key={item.propertyAmenityId} className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700 font-medium text-sm">{item.amenityName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-8">Chưa cập nhật tiện nghi.</p>
                )}
              </div>
            )}

            {/* TAB 3: IMAGES */}
            {activeTab === "images" && (
              <div className="animate-fadeIn">
                 <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                  <ImageIcon className="mr-3 text-blue-600" size={20} />
                  Thư viện ảnh
                </h4>
                {details?.images && details.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {details.images.map((img) => (
                      <div key={img.propertyImageId} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img 
                          src={getFullImageUrl(img.imageUrl)} 
                          alt="Property" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {img.isCover && (
                           <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                              Ảnh bìa
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-8">Chưa có hình ảnh nào.</p>
                )}
              </div>
            )}

            {/* TAB 4: LOCATION */}
            {activeTab === "location" && (
              <div className="space-y-6 animate-fadeIn">
                <Section title="Vị trí bản đồ" icon={<Globe />}>
                  <InfoRow label="Tỉnh/Thành" value={property.province || property.city} />
                  <InfoRow label="Quận/Huyện" value={property.city} />
                  <InfoRow label="Địa chỉ cụ thể" value={property.address} />
                </Section>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </div>
    </Modal>
  );
};

// Components con
const Section = ({ title, icon, children }) => (
  <div>
    <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
      {React.cloneElement(icon, { size: 20, className: "mr-3 text-blue-600" })}
      {title}
    </h4>
    <div className="text-sm text-gray-700 space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 py-1.5 border-b border-gray-50 last:border-0">
    <span className="font-medium text-gray-500 col-span-1">{label}:</span>
    <span className="text-gray-900 font-medium col-span-2 break-words">{value || "---"}</span>
  </div>
);

export default ViewPropertyModal;