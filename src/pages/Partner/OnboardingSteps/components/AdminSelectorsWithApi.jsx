import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Controller } from 'react-hook-form';

const API_BASE_URL = "https://provinces.open-api.vn/api/v1";

const AdminSelectorsWithApi = ({ control, setValue, errors, watch, mapboxData, prefix = "" }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const getFieldName = (name) => prefix ? `${prefix}.${name}` : name;
    
    // Watch current values to sync with internal state (for fetching)
    const currentProvince = typeof watch === 'function' ? watch(getFieldName("provinceCode")) : undefined;
    const currentDistrict = typeof watch === 'function' ? watch(getFieldName("districtCode")) : undefined;

    useEffect(() => {
        if (currentProvince) setSelectedProvince(currentProvince);
    }, [currentProvince]);

    useEffect(() => {
        if (currentDistrict) setSelectedDistrict(currentDistrict);
    }, [currentDistrict]);

    // Handle mapboxData auto-selection
    useEffect(() => {
        if (!mapboxData || !provinces.length) return;

        const syncLocation = async () => {
            // Find province
            const provinceMatch = provinces.find(p => 
                p.name.includes(mapboxData.province) || mapboxData.province?.includes(p.name)
            );

            if (provinceMatch) {
                setValue(getFieldName("provinceCode"), provinceMatch.code);
                setValue(getFieldName("propertyCity"), provinceMatch.name);
                setSelectedProvince(provinceMatch.code);

                // Fetch districts for this province
                try {
                    const dRes = await axios.get(`${API_BASE_URL}/p/${provinceMatch.code}?depth=2`);
                    const districtsList = dRes.data.districts;
                    setDistricts(districtsList);

                    if (mapboxData.district) {
                        const districtMatch = districtsList.find(d => 
                            d.name.includes(mapboxData.district) || mapboxData.district?.includes(d.name)
                        );

                        if (districtMatch) {
                            setValue(getFieldName("districtCode"), districtMatch.code);
                            setValue(getFieldName("propertyDistrict"), districtMatch.name);
                            setSelectedDistrict(districtMatch.code);

                            // Fetch wards
                            const wRes = await axios.get(`${API_BASE_URL}/d/${districtMatch.code}?depth=2`);
                            const wardsList = wRes.data.wards;
                            setWards(wardsList);

                            if (mapboxData.ward) {
                                const wardMatch = wardsList.find(w => 
                                    w.name.includes(mapboxData.ward) || mapboxData.ward?.includes(w.name)
                                );
                                if (wardMatch) {
                                    setValue(getFieldName("propertyWard"), wardMatch.name);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error syncing with mapboxData:", error);
                }
            }
        };

        syncLocation();
    }, [mapboxData, provinces]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/p/`);
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([]);
            setWards([]);
            return;
        }
        const fetchDistricts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/p/${selectedProvince}?depth=2`);
                setDistricts(response.data.districts);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedDistrict) {
            setWards([]);
            return;
        }
        const fetchWards = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/d/${selectedDistrict}?depth=2`);
                setWards(response.data.wards);
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    const handleSelectChange = (e, field, nameField, options, setter) => {
        const selectedValue = e.target.value;
        const selectedOption = options.find(option => option.code == selectedValue);
        
        if (setter) setter(selectedValue);
        
        // Update code field
        field.onChange(selectedValue); 

        // Update name field if provided
        if (nameField && selectedOption) {
            setValue(getFieldName(nameField), selectedOption.name, { shouldValidate: true });
        }

        // Reset child fields
        const fieldName = field.name.split('.').pop(); // get base name
        if (fieldName === 'provinceCode') {
            setValue(getFieldName('districtCode'), '');
            setValue(getFieldName('propertyWard'), '');
            setValue(getFieldName('propertyDistrict'), '');
            setValue(getFieldName('wardName'), ''); // keeping this just in case, though schema uses propertyWard
            setDistricts([]);
            setWards([]);
        } else if (fieldName === 'districtCode') {
            setValue(getFieldName('propertyWard'), '');
            setValue(getFieldName('wardName'), '');
            setWards([]);
        }
    };

    const renderSelect = (field, nameField, options, placeholder, setter) => (
        <div className="relative w-full">
            <select
                {...field}
                onChange={(e) => handleSelectChange(e, field, nameField, options, setter)}
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
            {/* Province Selector */}
            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tỉnh / Thành phố *</label>
                <Controller
                    name={getFieldName("provinceCode")}
                    control={control}
                    rules={{ required: 'Vui lòng chọn Tỉnh/Thành phố' }}
                    render={({ field }) => renderSelect(field, 'propertyCity', provinces, 'Chọn Tỉnh/Thành phố', setSelectedProvince)}
                />
                {errors?.provinceCode && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.provinceCode.message}</p>}
            </div>

            {/* District Selector */}
            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Quận / Huyện *</label>
                <Controller
                    name={getFieldName("districtCode")}
                    control={control}
                    rules={{ required: 'Vui lòng chọn Quận/Huyện' }}
                    render={({ field }) => renderSelect(field, 'propertyDistrict', districts, 'Chọn Quận/Huyện', setSelectedDistrict)}
                />
                 {errors?.districtCode && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.districtCode.message}</p>}
            </div>

            {/* Ward Selector */}
            <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phường / Xã *</label>
                <Controller
                    name={getFieldName("propertyWard")}
                    control={control}
                    rules={{ required: 'Vui lòng chọn Phường/Xã' }}
                    render={({ field }) => renderSelect(field, '', wards, 'Chọn Phường/Xã')}
                />
                 {errors?.propertyWard && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{errors.propertyWard.message}</p>}
            </div>
        </>
    );
};

export default AdminSelectorsWithApi;