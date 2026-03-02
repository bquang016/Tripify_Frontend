import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Building2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";
import PropertyCard from "./components/PropertyCard";
import ViewPropertyModal from "./components/ViewPropertyModal";
import EditPropertyModal from "./components/EditPropertyModal";
import DeactivateConfirmModal from "./components/DeactivateConfirmModal"; 
import Toast from "@/components/common/Notification/Toast"; 
import { useTranslation } from "react-i18next";

const PropertyListPage = () => {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; 

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [propertyToDeactivate, setPropertyToDeactivate] = useState(null);
  const [toastData, setToastData] = useState(null);

  const showToast = (message, type = "info") => {
      setToastData({ message, type });
      setTimeout(() => setToastData(null), 3000);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getOwnerProperties();
      setProperties(res.data || []); 
    } catch (error) {
      showToast(t('owner.fetch_properties_failed'), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleClick = (property) => {
      if ((property.propertyStatus === 'APPROVED' || property.propertyStatus === 'APPROVE') && property.active) {
          setPropertyToDeactivate(property);
          setIsDeactivateModalOpen(true);
      } else {
          executeToggleStatus(property);
      }
  };

  const executeToggleStatus = async (property) => {
    try {
        await propertyService.togglePropertyStatus(property.propertyId);
        fetchProperties();
        const isTurningOff = property.active; 
        showToast(
            isTurningOff 
                ? t('owner.deactivate_success', { name: property.propertyName })
                : t('owner.activate_success', { name: property.propertyName }), 
            "success"
        );
    } catch (error) {
        showToast(isVi ? "Không thể cập nhật trạng thái. Vui lòng thử lại!" : "Update failed. Please try again.", "error");
    }
  };

  const handleConfirmDeactivate = () => {
      if (propertyToDeactivate) {
          executeToggleStatus(propertyToDeactivate);
          setIsDeactivateModalOpen(false);
          setPropertyToDeactivate(null);
      }
  };

  const filteredProperties = useMemo(() => {
      return properties.filter(p => {
          const matchSearch = 
            p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.city?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchStatus = 
            filterStatus === "ALL" ? true :
            filterStatus === "ACTIVE" ? (p.propertyStatus === "APPROVE" || p.propertyStatus === "APPROVED") :
            p.propertyStatus === filterStatus;
          return matchSearch && matchStatus;
      });
  }, [properties, searchTerm, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const getPaginationGroup = () => {
      const range = []; const delta = 1;
      for (let i = 1; i <= totalPages; i++) {
          if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
      }
      return range;
  };

  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleEditSuccess = () => {
      setIsEditModalOpen(false);
      fetchProperties(); 
      showToast(t('owner.update_success'), "success");
  };

  const stats = {
      total: properties.length,
      active: properties.filter(p => p.propertyStatus === 'APPROVE' || p.propertyStatus === 'APPROVED').length,
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/30">
      {toastData && <div className="fixed top-24 right-6 z-[9999]"><Toast message={toastData.message} type={toastData.type} /></div>}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('owner.my_properties')}</h1>
          <p className="text-gray-500 mt-1">{t('owner.manage_track_status')}</p>
        </div>
        <Button onClick={() => navigate("/owner/properties/new")} leftIcon={<Plus size={20} />}>
          {t('owner.add_property')}
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
         <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
             <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder={t('owner.search_properties_placeholder')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden w-full lg:w-auto">
                {[
                    { id: "ALL", label: t('owner.all') },
                    { id: "ACTIVE", label: t('owner.active') },
                    { id: "PENDING", label: t('owner.pending') }
                ].map(tab => (
                    <button key={tab.id} onClick={() => setFilterStatus(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex-1 lg:flex-none ${filterStatus === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-200/50"}`}>{tab.label}</button>
                ))}
             </div>
             <div className="hidden xl:flex gap-4 text-sm text-gray-500">
                 <span>{t('owner.total')}: <b>{stats.total}</b></span>
                 <span className="text-gray-300">|</span>
                 <span className="text-green-600">{t('owner.active')}: <b>{stats.active}</b></span>
             </div>
         </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /><p className="text-gray-500 font-medium">{t('common.loading')}</p></div>
      ) : filteredProperties.length > 0 ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProperties.map((property) => (
                <PropertyCard key={property.propertyId} property={property} onView={() => { setSelectedProperty(property); setIsViewModalOpen(true); }} onEdit={() => { setSelectedProperty(property); setIsEditModalOpen(true); }} onToggleStatus={() => handleToggleClick(property)} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-xl p-4 shadow-sm border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">{isVi ? "Hiển thị" : "Showing"} <span className="font-semibold text-gray-700">{paginatedProperties.length}</span> / <span className="font-semibold text-gray-700">{filteredProperties.length}</span> {isVi ? "kết quả" : "results"}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border bg-white disabled:opacity-50"><ChevronLeft size={18} /></button>
                        <div className="flex gap-1">{getPaginationGroup().map((item, index) => (<button key={index} onClick={() => typeof item === 'number' && handlePageChange(item)} className={`w-8 h-8 rounded-lg text-sm ${item === currentPage ? "bg-blue-500 text-white" : "bg-white border text-gray-600"}`}>{item}</button>))}</div>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border bg-white disabled:opacity-50"><ChevronRight size={18} /></button>
                    </div>
                </div>
            )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <Building2 size={64} className="text-blue-400 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{searchTerm ? t('owner.no_results_found') : t('owner.no_properties_yet')}</h3>
            {!searchTerm && <Button onClick={() => navigate("/owner/properties/new")}>{t('owner.register_now')}</Button>}
        </div>
      )}

      <ViewPropertyModal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} property={selectedProperty} />
      <EditPropertyModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} property={selectedProperty} onSuccess={handleEditSuccess} showToast={showToast} />
      <DeactivateConfirmModal isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} onConfirm={handleConfirmDeactivate} propertyName={propertyToDeactivate?.propertyName} isLoading={loading} />
    </div>
  );
};
export default PropertyListPage;
