import React, { useState, useEffect } from "react";
import { Hotel, MapPin, User, Building, Ban, Eye, CheckCircle, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

// Components
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import adminService from "@/services/admin.service";
import SuspendModal from "@/components/common/Modal/SuspendModal";
import ActionConfirmModal from "./components/ActionConfirmModal";
import HotelRoomsModal from "./components/HotelRoomsModal";
import PropertyDetailModal from "./components/PropertyDetailModal";

const ActiveHotelsPage = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState("APPROVE"); 

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [roomsModalOpen, setRoomsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const [selectedHotel, setSelectedHotel] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPropertiesList(0, 100, filterStatus);
      if (res.success) {
        setHotels(res.data.content || res.data);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error(error);
      setToast({ message: isVi ? "Lỗi tải danh sách khách sạn" : "Error loading properties", type: "error" });
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [filterStatus]);

  const handleConfirmSuspend = async (reason) => {
    if (!selectedHotel) return;
    try {
      await adminService.suspendProperty(selectedHotel.propertyId, reason);
      setToast({ message: t('hotels.suspend_success'), type: "success" });
      fetchHotels();
    } catch (error) {
      setToast({ message: error.response?.data?.message || (isVi ? "Lỗi khi dừng hoạt động" : "Error suspending"), type: "error" });
      throw error;
    }
  };

  const handleConfirmActivate = async () => {
    if (!selectedHotel) return;
    try {
      await adminService.activateProperty(selectedHotel.propertyId);
      setToast({ message: t('hotels.reactivate_success'), type: "success" });
      setActivateModalOpen(false);
      fetchHotels();
    } catch (error) {
      setToast({ message: error.response?.data?.message || (isVi ? "Lỗi khi mở lại" : "Error reactivating"), type: "error" });
    }
  };

  return (
    <div className="space-y-6 p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Card className="min-h-screen bg-gray-50 border-none shadow-none">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardHeader 
              title={t('hotels.status_management')} 
              subtitle={t('hotels.status_mgmt_subtitle')}
              icon={<Hotel className="text-blue-600" />}
              className="p-0"
            />
            <Button onClick={fetchHotels} variant="outline" size="sm">
              {t('hotels.refresh')}
            </Button>
          </div>

          <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 w-fit shadow-sm">
            <button
              onClick={() => setFilterStatus("APPROVE")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filterStatus === "APPROVE"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <CheckCircle size={16} /> {t('hotels.active_hotels')}
            </button>
            <button
              onClick={() => setFilterStatus("SUSPENDED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filterStatus === "SUSPENDED"
                  ? "bg-red-50 text-red-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Ban size={16} /> {t('hotels.suspended_hotels')}
            </button>
          </div>
        </div>

        {loading ? (
           <div className="h-64 flex items-center justify-center">
             <LoadingOverlay message={t('common.loading')} />
           </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div 
                key={hotel.propertyId}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
                    filterStatus === "SUSPENDED" ? "border-red-100" : "border-gray-200"
                }`}
              >
                <div className="h-48 w-full relative bg-gray-100 group">
                  <img 
                    src={hotel.coverImage || "/assets/images/placeholder.png"} 
                    alt={hotel.propertyName}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        filterStatus === "SUSPENDED" ? "grayscale" : ""
                    }`}
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-md ${
                      filterStatus === "SUSPENDED" ? "bg-red-500/90" : "bg-green-500/90"
                  }`}>
                    {filterStatus === "SUSPENDED" ? t('hotels.suspended_status') : t('hotels.active_hotels')}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 flex-1" title={hotel.propertyName}>
                      {hotel.propertyName}
                    </h3>
                  </div>
                  
                  <div className="space-y-2.5 mb-5 flex-1">
                    <div className="flex items-start gap-2.5 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 text-blue-500 shrink-0" />
                      <span className="line-clamp-2">{hotel.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <User size={16} className="text-purple-500 shrink-0" />
                      <span className="font-medium text-gray-700">{hotel.ownerName || (isVi ? "Chủ sở hữu" : "Owner")}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                    <Button variant="ghost" className="justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200" onClick={() => { setSelectedHotel(hotel); setDetailModalOpen(true); }} title={t('hotels.details')}>
                      <Eye size={18} />
                    </Button>

                    <Button variant="outline" className="justify-center border-blue-200 text-blue-600 hover:bg-blue-50 bg-white" onClick={() => { setSelectedHotel(hotel); setRoomsModalOpen(true); }}>
                      <Building size={16} className="mr-1.5" />
                      {t('hotels.rooms')}
                    </Button>

                    {filterStatus === "APPROVE" ? (
                      <Button className="justify-center bg-red-600 text-white hover:bg-red-700 border-none shadow-sm" onClick={() => { setSelectedHotel(hotel); setSuspendModalOpen(true); }}>
                        <Ban size={16} className="mr-1.5" />
                        {t('hotels.suspend')}
                      </Button>
                    ) : (
                      <Button className="justify-center bg-green-600 text-white hover:bg-green-700 border-none shadow-sm" onClick={() => { setSelectedHotel(hotel); setActivateModalOpen(true); }}>
                        <RotateCcw size={16} className="mr-1.5" />
                        {t('hotels.reactivate')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-dashed border-gray-300">
            <EmptyState title={t('hotels.no_data')} description={t('hotels.no_data_desc')} />
          </div>
        )}
      </Card>

      <SuspendModal isOpen={suspendModalOpen} onClose={() => setSuspendModalOpen(false)} onConfirm={handleConfirmSuspend} title={t('hotels.status_management')} itemName={selectedHotel?.propertyName} />

      <ActionConfirmModal
        open={activateModalOpen}
        onClose={() => setActivateModalOpen(false)}
        onConfirm={handleConfirmActivate}
        title={t('hotels.confirm_reactivate_title')}
        message={t('hotels.confirm_reactivate_msg', { name: selectedHotel?.propertyName })}
        confirmText={t('hotels.confirm_reactivate_btn')}
      />

      <PropertyDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} property={selectedHotel} />

      {selectedHotel && (
        <HotelRoomsModal isOpen={roomsModalOpen} onClose={() => setRoomsModalOpen(false)} hotel={selectedHotel} />
      )}
    </div>
  );
};

export default ActiveHotelsPage;
