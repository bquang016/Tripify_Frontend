// src/pages/Owner/Properties/AddPropertySteps/components/AdminSelectorsWithApi.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomSelect from "@/components/common/Select/CustomSelect";

const VN_API_BASE = "https://provinces.open-api.vn/api/v1/";
const getMapboxAccessToken = () => import.meta.env.VITE_MAPBOX_TOKEN;

const superNormalize = (str) => {
    if (!str) return "";
    let s = String(str).toLowerCase();
    s = s.replace(/đ/g, "d"); 
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    s = s.replace(/^(thanh pho|tinh|quan|huyen|phuong|xa|thi xa|thi tran|tp\.?|tt\.?)\s+/, "");
    s = s.replace(/^(city|district|ward)\s+/, "");
    s = s.replace(/\s+(city|district|ward)$/, "");
    return s.replace(/[^a-z0-9]/g, ""); 
};

const isMatch = (apiStr, mapStr) => {
    const api = superNormalize(apiStr);
    const map = superNormalize(mapStr);
    if (!api || !map) return false;
    if (api === map) return true;
    if (map.length >= 5 && api.includes(map)) return true;
    if (api.length >= 5 && map.includes(api)) return true;
    return false;
};

export default function AdminSelectorsWithApi({ watch, setValue, errors, mapRef, markerRef, mapboxData }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const provinceCode = watch("provinceCode");
  const districtCode = watch("districtCode");
  const wardName = watch("ward");

  useEffect(() => {
    axios.get(`${VN_API_BASE}p/`)
      .then(res => setProvinces(res.data.map(p => ({ value: String(p.code), label: p.name }))))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!mapboxData || provinces.length === 0) return;
    const { province: mProvince, district: mDistrict, ward: mWard, fullAddress } = mapboxData;
    
    if (!mProvince) return;

    const syncLogic = async () => {
      setIsSyncing(true);
      
      try {
        // 1. TÌM TỈNH
        const foundProvince = provinces.find(p => isMatch(p.label, mProvince));
        if (!foundProvince) {
             console.log(`❌ Lỗi: Không khớp Tỉnh "${mProvince}"`);
             setIsSyncing(false);
             return;
        }

        setValue("provinceCode", foundProvince.value);
        setValue("province", foundProvince.label, { shouldValidate: true });

        // 2. TẢI TẤT CẢ QUẬN & PHƯỜNG
        const pRes = await axios.get(`${VN_API_BASE}p/${foundProvince.value}?depth=3`);
        const districtsList = pRes.data.districts || [];
        setDistricts(districtsList.map(d => ({ value: String(d.code), label: d.name })));

        let allWards = [];
        districtsList.forEach(d => {
            if (d.wards) {
                d.wards.forEach(w => allWards.push({ ...w, parent_district: d }));
            }
        });

        let districtMatch = null;
        let wardMatch = null;

        // 3. LỌC MAPBOX WARD (Bỏ qua nếu nó trả về mã bưu điện bằng số như '12100')
        if (mWard && isNaN(Number(mWard))) {
            const potentialWards = allWards.filter(w => isMatch(w.name, mWard));
            if (potentialWards.length > 0) {
                if (mDistrict) wardMatch = potentialWards.find(w => isMatch(w.parent_district.name, mDistrict));
                if (!wardMatch) wardMatch = potentialWards[0];
            }
        }

        // 4. THUẬT TOÁN "DÒ CHÉO CẤP BẬC" CỨU CÁNH MAPBOX LỆCH (Giải quyết lỗi Kien Hung)
        if (!wardMatch && mDistrict) {
            // Bước 4.1: Thử tìm xem nó có đúng là Quận/Huyện không?
            districtMatch = districtsList.find(d => isMatch(d.name, mDistrict));

            // Bước 4.2: Nếu không phải Quận, có thể Mapbox đã ném tên Phường vào biến mDistrict!
            if (!districtMatch) {
                console.log(`⚠️ Mapbox nhầm cấp bậc: Đang quét thử '${mDistrict}' trong danh sách Phường/Xã...`);
                const shiftedWards = allWards.filter(w => isMatch(w.name, mDistrict));
                
                if (shiftedWards.length > 0) {
                    wardMatch = shiftedWards[0];
                    districtMatch = wardMatch.parent_district;
                    console.log(`✅ CỨU CÁNH THÀNH CÔNG: '${mDistrict}' thực ra là Phường thuộc '${districtMatch.name}'`);
                }
            }
        }
        
        // 5. Fallback chuỗi FullAddress cuối cùng (nếu có)
        if (!wardMatch && !districtMatch && fullAddress) {
            const normFullAddr = superNormalize(fullAddress);
            const sortedWards = [...allWards].sort((a, b) => b.name.length - a.name.length);
            wardMatch = sortedWards.find(w => superNormalize(w.name).length > 3 && normFullAddr.includes(superNormalize(w.name)));
            
            if (wardMatch) {
                districtMatch = wardMatch.parent_district;
            } else {
                const sortedDistricts = [...districtsList].sort((a, b) => b.name.length - a.name.length);
                districtMatch = sortedDistricts.find(d => superNormalize(d.name).length > 3 && normFullAddr.includes(superNormalize(d.name)));
            }
        }

        // 6. GHI DỮ LIỆU LÊN GIAO DIỆN FORM
        if (districtMatch) {
            setValue("districtCode", String(districtMatch.code));
            setValue("city", districtMatch.name, { shouldValidate: true });
            setWards((districtMatch.wards || []).map(w => ({ value: w.name, label: w.name })));

            if (wardMatch) {
                setValue("ward", wardMatch.name, { shouldValidate: true });
            } else {
                setValue("ward", ""); // Để user tự chọn nếu bó tay
            }
        } else {
            setValue("districtCode", "");
            setValue("city", "");
            setWards([]);
        }

      } catch (err) { 
        console.error("🔥 Lỗi đồng bộ:", err); 
      } finally { 
        setTimeout(() => setIsSyncing(false), 500); 
      }
    };

    syncLogic();
  }, [mapboxData, provinces, setValue]);

  // --- MANUAL HANDLERS ---
  const geocodeManual = async (addr) => {
      if(isSyncing || !addr) return;
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json?access_token=${getMapboxAccessToken()}&country=VN&limit=1`;
        const res = await fetch(url); const data = await res.json();
        if(data.features?.[0]?.center) {
            const [lng, lat] = data.features[0].center;
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 13 });
            markerRef.current?.setLngLat([lng, lat]);
            setValue("latitude", lat); setValue("longitude", lng);
        }
      } catch(e){}
  };
  
  const handleProvinceChange = async (code) => {
      if(isSyncing) return;
      const p = provinces.find(i=>i.value === code);
      setValue("provinceCode", code); setValue("province", p?.label, {shouldValidate:true});
      setValue("districtCode", ""); setValue("city", ""); setValue("ward", ""); setWards([]);
      try {
         const res = await axios.get(`${VN_API_BASE}p/${code}?depth=2`);
         setDistricts(res.data.districts.map(d=>({value: String(d.code), label:d.name})));
      } catch(e){}
      if(p) geocodeManual(`${p.label}, Việt Nam`);
  };

  const handleDistrictChange = async (code) => {
      if(isSyncing) return;
      const d = districts.find(i=>i.value === code);
      setValue("districtCode", code); setValue("city", d?.label, {shouldValidate:true}); setValue("ward", "");
      try {
         const res = await axios.get(`${VN_API_BASE}d/${code}?depth=2`);
         setWards(res.data.wards.map(w=>({value:w.name, label:w.name})));
      } catch(e){}
      if(d) geocodeManual(`${d.label}, ${watch("province")}, Việt Nam`);
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
      <CustomSelect label="Tỉnh / Thành phố" options={provinces} value={provinceCode || ""} onChange={handleProvinceChange} error={errors?.province?.message} disabled={isSyncing} placeholder="Chọn Tỉnh/Thành phố" />
      <CustomSelect label="Quận / Huyện" options={districts} value={districtCode || ""} onChange={handleDistrictChange} error={errors?.city?.message} disabled={!provinceCode || isSyncing} placeholder="Chọn Quận/Huyện" />
      <CustomSelect label="Phường / Xã" options={wards} value={wardName || ""} onChange={(val)=>setValue("ward", val, {shouldValidate:true})} error={errors?.ward?.message} disabled={!districtCode || isSyncing} placeholder="Chọn Phường/Xã" />
    </div>
  );
}