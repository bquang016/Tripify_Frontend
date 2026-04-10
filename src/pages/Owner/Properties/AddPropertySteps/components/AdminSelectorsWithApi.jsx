import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://provinces.open-api.vn/api/v1";

// Thuật toán nén TỐI ƯU TUYỆT ĐỐI
const superNormalize = (str) => {
    if (!str) return "";
    let s = String(str).toLowerCase();
    s = s.replace(/đ/g, "d"); 
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    s = s.replace(/^(thanh pho|tinh|quan|huyen|phuong|xa|thi xa|thi tran|tp\.?|tt\.?)\s+/g, "");
    s = s.replace(/^(city|district|ward)\s+/g, "");
    s = s.replace(/\s+(city|district|ward)$/g, "");
    return s.replace(/[^a-z0-9]/g, ""); 
};

// Hàm check khớp chuỗi thông minh
const isMatch = (apiStr, mapStr) => {
    const api = superNormalize(apiStr);
    const map = superNormalize(mapStr);
    if (!api || !map) return false;
    if (api === map) return true;
    if (map.length >= 4 && api.includes(map)) return true;
    if (api.length >= 4 && map.includes(api)) return true;
    return false;
};

const AdminSelectorsWithApi = ({ watch, setValue, errors, mapboxData }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const currentProvince = watch("provinceCode");
    const currentDistrict = watch("districtCode");
    const currentWard = watch("ward");

    // Khóa chống lặp khi kéo thả ghim liên tục
    const autoSyncRef = useRef(false); 

    // 1. Tải danh sách Tỉnh lần đầu
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/p/`);
                setProvinces(response.data);
            } catch (error) { console.error(error); }
        };
        fetchProvinces();
    }, []);

    // 2. AUTO-SYNC TỪ MAPBOX BẰNG THUẬT TOÁN "DÒ NGƯỢC"
    useEffect(() => {
        if (!mapboxData || !provinces.length) return;

        const executeAutoSync = async () => {
            console.log("🟢 [AUTO-SYNC START]", mapboxData);
            autoSyncRef.current = true;

            try {
                // --- BƯỚC 1: CHỐT TỈNH ---
                let provinceMatch = provinces.find(p => isMatch(p.name, mapboxData.province));
                if (!provinceMatch) return;

                setValue("provinceCode", String(provinceMatch.code), { shouldValidate: true });
                setValue("province", provinceMatch.name, { shouldValidate: true });

                // Tải trước TẤT CẢ Quận & Phường của Tỉnh này
                const pRes = await axios.get(`${API_BASE_URL}/p/${provinceMatch.code}?depth=3`);
                const districtsList = pRes.data.districts || [];
                setDistricts(districtsList);

                let allWards = [];
                districtsList.forEach(d => {
                    if (d.wards) {
                        d.wards.forEach(w => allWards.push({ ...w, parent_district: d }));
                    }
                });

                // Gom nhặt dữ liệu Mapbox
                const mapWard = mapboxData.ward || "";
                const mapDistrict = mapboxData.district || "";
                const fullAddr = mapboxData.fullAddress || "";

                let districtMatch = null;
                let wardMatch = null;

                // --- BƯỚC 2: QUÉT PHƯỜNG TRƯỚC (Vì Phường mang tính định danh cao nhất) ---
                let potentialWards = [];
                
                // Thử quét bằng biến Ward (Bỏ qua nếu Mapbox trả về mã bưu điện dạng số)
                if (mapWard && isNaN(Number(mapWard))) {
                    potentialWards = allWards.filter(w => isMatch(w.name, mapWard));
                }
                
                // Nếu không ra, Mapbox chắc chắn đã nhét tên Phường vào biến District!
                if (potentialWards.length === 0 && mapDistrict) {
                    potentialWards = allWards.filter(w => isMatch(w.name, mapDistrict));
                }

                // Nếu ra nhiều kết quả trùng tên (vd: Nguyễn Trãi), dùng District hoặc FullAddress để phân xử
                if (potentialWards.length > 0) {
                    if (potentialWards.length === 1) {
                        wardMatch = potentialWards[0];
                    } else {
                        wardMatch = potentialWards.find(w => isMatch(w.parent_district.name, mapDistrict))
                                 || potentialWards.find(w => fullAddr.includes(superNormalize(w.parent_district.name)))
                                 || potentialWards[0];
                    }
                }

                // Chốt hạ: Nếu vẫn không ra, dò tìm ép buộc bằng chuỗi Full Address
                if (!wardMatch && fullAddr) {
                    const normFull = superNormalize(fullAddr);
                    const sortedWards = [...allWards].sort((a,b) => b.name.length - a.name.length);
                    wardMatch = sortedWards.find(w => {
                        const wNorm = superNormalize(w.name);
                        return wNorm.length > 3 && normFull.includes(wNorm);
                    });
                }

                // --- BƯỚC 3: SUY RA QUẬN TỪ PHƯỜNG ---
                if (wardMatch) {
                    districtMatch = wardMatch.parent_district;
                    console.log(`✅ [TÌM THẤY] Dò ra Phường: ${wardMatch.name} -> Suy ra Quận: ${districtMatch.name}`);
                } else {
                    // Nếu thất bại hoàn toàn việc tìm Phường, ta đành tìm Quận trực tiếp
                    if (mapDistrict) {
                        districtMatch = districtsList.find(d => isMatch(d.name, mapDistrict));
                    }
                    if (!districtMatch && fullAddr) {
                        const normFull = superNormalize(fullAddr);
                        const sortedDistricts = [...districtsList].sort((a,b) => b.name.length - a.name.length);
                        districtMatch = sortedDistricts.find(d => {
                            const dNorm = superNormalize(d.name);
                            return dNorm.length > 3 && normFull.includes(dNorm);
                        });
                    }
                }

                // --- BƯỚC 4: GHI DỮ LIỆU LÊN GIAO DIỆN ---
                if (districtMatch) {
                    setValue("districtCode", String(districtMatch.code), { shouldValidate: true });
                    setValue("city", districtMatch.name, { shouldValidate: true });
                    setWards(districtMatch.wards || []);

                    if (wardMatch) {
                        setValue("ward", wardMatch.name, { shouldValidate: true });
                    } else {
                        setValue("ward", "");
                    }
                } else {
                    setValue("districtCode", "");
                    setValue("city", "");
                    setValue("ward", "");
                    setWards([]);
                }

            } catch (error) {
                console.error("Lỗi đồng bộ API Việt Nam:", error);
            } finally {
                // Chỉ khóa 1 giây để form có độ trễ an toàn khi kéo thả map
                setTimeout(() => { autoSyncRef.current = false; }, 1000);
            }
        };

        executeAutoSync();
    }, [mapboxData, provinces]); 

    // 3. MANUAL-SYNC (Khi người dùng tự tay chọn dropdown)
    useEffect(() => {
        if (!currentProvince || autoSyncRef.current) return;
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/p/${currentProvince}?depth=2`);
                setDistricts(response.data.districts);
            } catch (error) { console.error(error); }
        };
        fetchDistricts();
    }, [currentProvince]);

    useEffect(() => {
        if (!currentDistrict || autoSyncRef.current) return;
        const fetchWards = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/d/${currentDistrict}?depth=2`);
                setWards(response.data.wards);
            } catch (error) { console.error(error); }
        };
        fetchWards();
    }, [currentDistrict]);

    // Xử lý sự kiện Dropdown
    const handleProvinceChange = (e) => {
        const code = e.target.value;
        const pName = provinces.find(p => String(p.code) === code)?.name || "";
        setValue("provinceCode", code, { shouldValidate: true });
        setValue("province", pName, { shouldValidate: true });
        setValue("districtCode", ""); setValue("city", ""); setValue("ward", "");
        setDistricts([]); setWards([]);
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value;
        const dName = districts.find(d => String(d.code) === code)?.name || "";
        setValue("districtCode", code, { shouldValidate: true });
        setValue("city", dName, { shouldValidate: true });
        setValue("ward", "");
        setWards([]);
    };

    const handleWardChange = (e) => {
        setValue("ward", e.target.value, { shouldValidate: true });
    };

    return (
        <div className="space-y-4">
            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tỉnh / Thành phố *</label>
                <div className="relative w-full">
                    <select value={currentProvince || ""} onChange={handleProvinceChange} className="w-full rounded-2xl py-3.5 pl-4 pr-10 bg-white border border-slate-200 text-slate-700 font-medium outline-none focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 transition-all shadow-sm appearance-none cursor-pointer hover:border-[#28A9E0]">
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {provinces.map(p => <option key={p.code} value={String(p.code)}>{p.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
                </div>
                {errors?.provinceCode && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.provinceCode.message}</p>}
            </div>

            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Quận / Huyện *</label>
                <div className="relative w-full">
                    <select value={currentDistrict || ""} onChange={handleDistrictChange} className="w-full rounded-2xl py-3.5 pl-4 pr-10 bg-white border border-slate-200 text-slate-700 font-medium outline-none focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 transition-all shadow-sm appearance-none cursor-pointer hover:border-[#28A9E0]">
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map(d => <option key={d.code} value={String(d.code)}>{d.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
                </div>
                {errors?.districtCode && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.districtCode.message}</p>}
            </div>

            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phường / Xã *</label>
                <div className="relative w-full">
                    <select value={currentWard || ""} onChange={handleWardChange} className="w-full rounded-2xl py-3.5 pl-4 pr-10 bg-white border border-slate-200 text-slate-700 font-medium outline-none focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 transition-all shadow-sm appearance-none cursor-pointer hover:border-[#28A9E0]">
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
                </div>
                {errors?.ward && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.ward.message}</p>}
            </div>
        </div>
    );
};

export default AdminSelectorsWithApi;
