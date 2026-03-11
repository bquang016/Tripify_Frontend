import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Controller } from 'react-hook-form';

const API_BASE_URL = "https://provinces.open-api.vn/api/v1";

// Thuật toán nén TỐI ƯU TUYỆT ĐỐI (Đã fix lỗi chữ "đ")
const superNormalize = (str) => {
    if (!str) return "";
    let s = String(str).toLowerCase();
    
    // 1. Phải xử lý chữ "đ" thủ công trước vì normalize không đổi "đ" thành "d" được
    s = s.replace(/đ/g, "d"); 
    
    // 2. Chuyển chữ thường và bỏ dấu tiếng Việt 
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    // 3. Cắt tiền tố/hậu tố phân loại
    s = s.replace(/^(thanh pho|tinh|quan|huyen|phuong|xa|thi xa|thi tran|tp\.?|tt\.?)\s+/, "");
    s = s.replace(/^(city|district|ward)\s+/, "");
    s = s.replace(/\s+(city|district|ward)$/, "");
    
    // 4. Ép thành 1 cục ko có dấu cách
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

const AdminSelectorsWithApi = ({ control, setValue, errors, watch, mapboxData, prefix = "" }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const getFieldName = (name) => prefix ? `${prefix}.${name}` : name;
    
    const currentProvince = typeof watch === 'function' ? watch(getFieldName("provinceCode")) : undefined;
    const currentDistrict = typeof watch === 'function' ? watch(getFieldName("districtCode")) : undefined;

    const autoSyncRef = useRef(false); 

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/p/`);
                setProvinces(response.data);
            } catch (error) { console.error(error); }
        };
        fetchProvinces();
    }, []);

    // AUTO-SYNC TỪ MAPBOX
    useEffect(() => {
        if (!mapboxData || !provinces.length) return;

        const executeAutoSync = async () => {
            console.log("🟢 [AUTO-SYNC START]", mapboxData);
            autoSyncRef.current = true;

            try {
                // 1. TÌM TỈNH
                let provinceMatch = provinces.find(p => isMatch(p.name, mapboxData.province));
                if (!provinceMatch) {
                    console.log("❌ Lỗi: Không khớp Tỉnh");
                    return;
                }

                setValue(getFieldName("provinceCode"), String(provinceMatch.code), { shouldValidate: true });
                setValue(getFieldName("propertyCity"), provinceMatch.name);

                // 2. FETCH TOÀN BỘ QUẬN + PHƯỜNG CỦA TỈNH
                console.log(`⏳ Đang tải toàn bộ Quận và Phường của ${provinceMatch.name}...`);
                const pRes = await axios.get(`${API_BASE_URL}/p/${provinceMatch.code}?depth=3`);
                const districtsList = pRes.data.districts || [];
                setDistricts(districtsList);

                let allWards = [];
                districtsList.forEach(d => {
                    if (d.wards) {
                        d.wards.forEach(w => {
                            allWards.push({ ...w, parent_district: d });
                        });
                    }
                });

                let districtMatch = null;
                let wardMatch = null;

                // 🚀 THUẬT TOÁN "XÁC THỰC KÉP"
                console.log("🔎 Đang quét Phường với Xác Thực Kép...");
                
                if (mapboxData.ward) {
                    const potentialWards = allWards.filter(w => isMatch(w.name, mapboxData.ward));
                    
                    if (potentialWards.length > 0) {
                        console.log(`📍 Tìm thấy ${potentialWards.length} kết quả có tên giống '${mapboxData.ward}':`);
                        potentialWards.forEach(w => {
                            console.log(`   👉 ${w.name} (Cha: ${w.parent_district.name}) | Nén Cha: '${superNormalize(w.parent_district.name)}' vs Mapbox District: '${superNormalize(mapboxData.district)}'`);
                        });

                        if (mapboxData.district) {
                            wardMatch = potentialWards.find(w => isMatch(w.parent_district.name, mapboxData.district));
                        }
                        
                        if (!wardMatch) {
                            wardMatch = potentialWards[0];
                            console.log("⚠️ Không qua được vòng Xác thực Quận, lấy tạm kết quả đầu tiên.");
                        }
                    }
                }
                
                // Fallback quét chuỗi nếu Mapbox không trả Ward
                if (!wardMatch && mapboxData.fullAddress) {
                    const normFullAddr = superNormalize(mapboxData.fullAddress);
                    const sortedWards = [...allWards].sort((a, b) => b.name.length - a.name.length);
                    wardMatch = sortedWards.find(w => {
                        const wNorm = superNormalize(w.name);
                        return wNorm.length > 3 && normFullAddr.includes(wNorm);
                    });
                }

                if (wardMatch) {
                    districtMatch = wardMatch.parent_district;
                    console.log(`✅ [DÒ NGƯỢC THÀNH CÔNG] '${wardMatch.name}' -> '${districtMatch.name}'`);
                } else {
                    console.log("⚠️ Không tìm thấy Phường, chuyển sang tìm Quận trực tiếp.");
                    if (mapboxData.district) {
                        districtMatch = districtsList.find(d => isMatch(d.name, mapboxData.district));
                    }
                    if (!districtMatch && mapboxData.fullAddress) {
                        const normFullAddr = superNormalize(mapboxData.fullAddress);
                        const sortedDistricts = [...districtsList].sort((a, b) => b.name.length - a.name.length);
                        districtMatch = sortedDistricts.find(d => {
                            const dNorm = superNormalize(d.name);
                            return dNorm.length > 3 && normFullAddr.includes(dNorm);
                        });
                    }
                }

                // 3. ĐIỀN DỮ LIỆU LÊN GIAO DIỆN
                if (districtMatch) {
                    setValue(getFieldName("districtCode"), String(districtMatch.code), { shouldValidate: true });
                    setValue(getFieldName("propertyDistrict"), districtMatch.name);
                    setWards(districtMatch.wards || []);

                    if (wardMatch) {
                        setValue(getFieldName("propertyWard"), String(wardMatch.code), { shouldValidate: true });
                        setValue(getFieldName("wardName"), wardMatch.name); 
                    } else {
                        setValue(getFieldName("propertyWard"), "");
                        setValue(getFieldName("wardName"), ""); 
                    }
                } else {
                    console.log("❌ Lỗi: Không tìm thấy Quận/Huyện.");
                    setValue(getFieldName("districtCode"), "");
                    setValue(getFieldName("propertyDistrict"), "");
                    setWards([]);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setTimeout(() => { autoSyncRef.current = false; }, 1000);
            }
        };

        executeAutoSync();
    }, [mapboxData, provinces]); 

    // MANUAL-SYNC
    useEffect(() => {
        if (!currentProvince) { setDistricts([]); setWards([]); return; }
        if (autoSyncRef.current) return;

        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/p/${currentProvince}?depth=2`);
                setDistricts(response.data.districts);
            } catch (error) { console.error(error); }
        };
        fetchDistricts();
    }, [currentProvince]);

    useEffect(() => {
        if (!currentDistrict) { setWards([]); return; }
        if (autoSyncRef.current) return;

        const fetchWards = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/d/${currentDistrict}?depth=2`);
                setWards(response.data.wards);
            } catch (error) { console.error(error); }
        };
        fetchWards();
    }, [currentDistrict]);

    const handleSelectChange = (e, field, nameField, options) => {
        const selectedValue = String(e.target.value);
        const selectedOption = options.find(option => String(option.code) === selectedValue);
        
        field.onChange(selectedValue); 

        if (nameField && selectedOption) {
            setValue(getFieldName(nameField), selectedOption.name, { shouldValidate: true });
        }

        const fieldName = field.name.split('.').pop();
        if (fieldName === 'provinceCode') {
            setValue(getFieldName('districtCode'), '');
            setValue(getFieldName('propertyWard'), '');
            setValue(getFieldName('propertyDistrict'), '');
            setValue(getFieldName('wardName'), ''); 
            setDistricts([]);
            setWards([]);
        } else if (fieldName === 'districtCode') {
            setValue(getFieldName('propertyWard'), '');
            setValue(getFieldName('wardName'), '');
            setWards([]);
        }
    };

    const renderSelect = (field, nameField, options, placeholder) => (
        <div className="relative w-full">
            <select
                {...field}
                value={field.value || ""}
                onChange={(e) => handleSelectChange(e, field, nameField, options)}
                className="w-full rounded-2xl py-3.5 pl-4 pr-10 bg-white border border-slate-200 text-slate-700 font-medium outline-none focus:border-[#28A9E0] focus:ring-4 focus:ring-[#28A9E0]/10 transition-all shadow-sm appearance-none cursor-pointer hover:border-[#28A9E0]"
            >
                <option value="">{placeholder}</option>
                {options.map(option => (
                    <option key={option.code} value={option.code}>{option.name}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
    );
    
    return (
        <>
            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tỉnh / Thành phố *</label>
                <Controller
                    name={getFieldName("provinceCode")}
                    control={control}
                    rules={{ required: 'Vui lòng chọn Tỉnh/Thành phố' }}
                    render={({ field }) => renderSelect(field, 'propertyCity', provinces, 'Chọn Tỉnh/Thành phố')}
                />
                {errors?.provinceCode && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.provinceCode.message}</p>}
            </div>

            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Quận / Huyện *</label>
                <Controller
                    name={getFieldName("districtCode")}
                    control={control}
                    rules={{ required: 'Vui lòng chọn Quận/Huyện' }}
                    render={({ field }) => renderSelect(field, 'propertyDistrict', districts, 'Chọn Quận/Huyện')}
                />
                 {errors?.districtCode && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.districtCode.message}</p>}
            </div>

            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phường / Xã *</label>
                <Controller
                    name={getFieldName("propertyWard")}
                    control={control}
                    rules={{ required: 'Vui lòng chọn Phường/Xã' }}
                    render={({ field }) => renderSelect(field, 'wardName', wards, 'Chọn Phường/Xã')}
                />
                 {errors?.propertyWard && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.propertyWard.message}</p>}
            </div>
        </>
    );
};

export default AdminSelectorsWithApi;