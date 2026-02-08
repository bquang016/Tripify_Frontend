
// src/pages/Partner/OnboardingSteps/components/AdminSelectorsWithApi.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomSelect from "@/components/common/Select/CustomSelect";

const VN_API_BASE = "https://provinces.open-api.vn/api/";
const getMapboxAccessToken = () => import.meta.env.VITE_MAPBOX_TOKEN;

// Hàm chuẩn hóa tên
const normalizeName = (str) => {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/(tỉnh|thành phố|quận|huyện|thị xã|phường|xã|thị trấn)/g, "").replace(/[^a-z0-9]/g, "").trim();
};

export default function AdminSelectorsWithApi({ watch, setValue, errors, mapRef, markerRef, mapboxData, prefix = "" }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to handle prefix
  const p = (name) => prefix ? `${prefix}.${name}` : name;

  const provinceCode = watch(p("provinceCode"));
  const districtCode = watch(p("districtCode"));
  const wardName = watch(p("propertyWard"));

  // Debug: Báo khi component được mount
  useEffect(() => { console.log("Component AdminSelectorsWithApi đã Mount"); }, []);

  // 1. Load Tỉnh
  useEffect(() => {
    console.log("🚀 Bắt đầu tải danh sách Tỉnh...");
    axios.get(`${VN_API_BASE}p/`)
      .then(res => {
        console.log(`✅ Đã tải ${res.data.length} tỉnh/thành.`);
        setProvinces(res.data.map(p => ({ value: p.code, label: p.name })));
      })
      .catch(err => console.error("🔥 Lỗi tải tỉnh:", err));
  }, []);

  // 2. LOGIC ĐỒNG BỘ TỪ MAPBOX
  useEffect(() => {
    // Log kiểm tra đầu vào
    if (!mapboxData) return; 
    console.log("📩 AdminSelectors nhận được MapboxData:", mapboxData);

    if (provinces.length === 0) {
        console.warn("⏳ Chờ danh sách Tỉnh tải xong...");
        return;
    }

    const { province: mProvince, district: mDistrict, ward: mWard } = mapboxData;
    
    if (!mProvince) {
        console.warn("⚠️ Mapbox không trả về tên Tỉnh (Region). Dữ liệu nhận được:", mapboxData);
        return;
    }

    const syncLogic = async () => {
      console.log("🔄 Bắt đầu đồng bộ vị trí...");
      setIsSyncing(true);
      try {
        // Match Tỉnh
        const normProvince = normalizeName(mProvince);
        const foundProvince = provinces.find(p => normalizeName(p.label).includes(normProvince) || normProvince.includes(normalizeName(p.label)));
        
        if (!foundProvince) {
             console.error(`❌ Không tìm thấy tỉnh nào khớp với "${mProvince}" (Norm: ${normProvince})`);
             setIsSyncing(false);
             return;
        }
        console.log("📍 Đã chọn Tỉnh:", foundProvince.label);
        setValue(p("provinceCode"), foundProvince.value);
        setValue(p("propertyCity"), foundProvince.label, { shouldValidate: true });

        // Load Huyện
        console.log(`⬇️ Đang tải huyện cho tỉnh ${foundProvince.label} (Code: ${foundProvince.value})...`);
        const resD = await axios.get(`${VN_API_BASE}p/${foundProvince.value}?depth=2`);
        const dOptions = resD.data.districts.map(d => ({ value: d.code, label: d.name }));
        setDistricts(dOptions);

        // Match Huyện
        if (mDistrict) {
            const normDistrict = normalizeName(mDistrict);
            const foundDistrict = dOptions.find(d => normalizeName(d.label).includes(normDistrict) || normDistrict.includes(normalizeName(d.label)));
            
            if (foundDistrict) {
                console.log("📍 Đã chọn Huyện:", foundDistrict.label);
                setValue(p("districtCode"), foundDistrict.value);
                setValue(p("propertyDistrict"), foundDistrict.label, { shouldValidate: true });

                // Load Xã
                console.log(`⬇️ Đang tải xã cho huyện ${foundDistrict.label}...`);
                const resW = await axios.get(`${VN_API_BASE}d/${foundDistrict.value}?depth=2`);
                const wOptions = resW.data.wards.map(w => ({ value: w.name, label: w.name }));
                setWards(wOptions);

                // Match Xã
                if (mWard) {
                    const normWard = normalizeName(mWard);
                    const foundWard = wOptions.find(w => normalizeName(w.label).includes(normWard) || normWard.includes(normalizeName(w.label)));
                    if (foundWard) {
                        console.log("📍 Đã chọn Xã:", foundWard.label);
                        setValue(p("propertyWard"), foundWard.label, { shouldValidate: true });
                    } else {
                        console.warn(`⚠️ Không khớp xã "${mWard}", điền tạm.`);
                        setValue(p("propertyWard"), mWard, { shouldValidate: true });
                    }
                }
            } else {
                console.warn(`❌ Không tìm thấy huyện nào khớp với "${mDistrict}"`);
            }
        }
      } catch (err) { 
        console.error("🔥 Lỗi trong quá trình đồng bộ:", err); 
      } finally { 
        setIsSyncing(false); 
        console.log("🏁 Kết thúc đồng bộ.");
      }
    };
    syncLogic();
  }, [mapboxData, provinces, setValue]);

  // Manual Handlers (Giữ nguyên logic cũ)
  const geocodeManual = async (addr) => {
      if(isSyncing || !addr) return;
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json?access_token=${getMapboxAccessToken()}&country=VN&limit=1`;
        const res = await fetch(url); const data = await res.json();
        if(data.features?.[0]?.center) {
            const [lng, lat] = data.features[0].center;
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 13 });
            markerRef.current?.setLngLat([lng, lat]);
            setValue(p("latitude"), lat); setValue(p("longitude"), lng);
        }
      } catch(e){}
  };
  
  const handleProvinceChange = async (code) => {
      if(isSyncing) return;
      const province = provinces.find(i=>i.value===code);
      setValue(p("provinceCode"), code); 
      setValue(p("propertyCity"), province?.label, {shouldValidate:true});
      setValue(p("districtCode"), ""); 
      setValue(p("propertyDistrict"), ""); 
      setValue(p("propertyWard"), ""); 
      setWards([]);
      try {
         const res = await axios.get(`${VN_API_BASE}p/${code}?depth=2`);
         setDistricts(res.data.districts.map(d=>({value:d.code, label:d.name})));
      } catch(e){}
      if(province) geocodeManual(`${province.label}, Việt Nam`);
  };

  const handleDistrictChange = async (code) => {
      if(isSyncing) return;
      const district = districts.find(i=>i.value===code);
      setValue(p("districtCode"), code); 
      setValue(p("propertyDistrict"), district?.label, {shouldValidate:true}); 
      setValue(p("propertyWard"), "");
      try {
         const res = await axios.get(`${VN_API_BASE}d/${code}?depth=2`);
         setWards(res.data.wards.map(w=>({value:w.name, label:w.name})));
      } catch(e){}
      if(district) geocodeManual(`${district.label}, ${watch(p("propertyCity"))}, Việt Nam`);
  };

  return (
    <div className="relative w-full">
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/80 flex items-center justify-center rounded-lg border border-blue-200 backdrop-blur-[2px]">
          <span className="text-sm font-medium text-blue-500 flex gap-2 items-center">
            <span className="animate-spin text-xl">⟳</span> Đang đồng bộ vị trí...
          </span>
        </div>
      )}
      <CustomSelect 
        label="Tỉnh / Thành phố" 
        options={provinces} 
        value={provinceCode || ""} 
        onChange={handleProvinceChange} 
        error={errors?.provinceCode?.message || errors?.propertyCity?.message} 
        disabled={isSyncing} 
        placeholder="Chọn Tỉnh/Thành phố" 
      />
      <CustomSelect 
        label="Quận / Huyện" 
        options={districts} 
        value={districtCode || ""} 
        onChange={handleDistrictChange} 
        error={errors?.districtCode?.message || errors?.propertyDistrict?.message} 
        disabled={!provinceCode || isSyncing} 
        placeholder="Chọn Quận/Huyện" 
      />
      <CustomSelect 
        label="Phường / Xã" 
        options={wards} 
        value={wardName || ""} 
        onChange={(val)=>setValue(p("propertyWard"), val, {shouldValidate:true})} 
        error={errors?.propertyWard?.message} 
        disabled={!districtCode || isSyncing} 
        placeholder="Chọn Phường/Xã" 
      />
    </div>
  );
}
