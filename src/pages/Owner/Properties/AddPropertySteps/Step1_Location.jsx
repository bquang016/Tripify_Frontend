import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Search, Crosshair, Move, Map as MapIcon, MousePointerClick } from "lucide-react";
import AdminSelectorsWithApi from "./components/AdminSelectorsWithApi"; 
import TextField from "@/components/common/Input/TextField"; // Sử dụng TextField chuẩn

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 

// Màu chủ đạo (Theme Color)
const PRIMARY_COLOR = "rgb(40, 169, 224)";

const Step1_Location = ({ register, setValue, watch, errors }) => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // --- GIỮ NGUYÊN LOGIC TỪ ĐÂY ---
  const latWatch = watch("latitude");
  const lngWatch = watch("longitude");
  
  // Đăng ký các trường ẩn
  register("provinceCode"); 
  register("districtCode"); 
  register("ward"); 

  const [viewState, setViewState] = useState(() => ({
    lng: lngWatch ? Number(lngWatch) : 105.804817,
    lat: latWatch ? Number(latWatch) : 21.028511,
    zoom: 15,
  }));

  const [markerPosition, setMarkerPosition] = useState(() => ({
    lng: lngWatch ? Number(lngWatch) : 105.804817,
    lat: latWatch ? Number(latWatch) : 21.028511,
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapboxData, setMapboxData] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // --- LOGIC PARSER (GIỮ NGUYÊN) ---
  const extractLocationFromMapbox = (place) => {
    const context = place.context || [];
    const fullContext = [...context, { id: place.id, text: place.text }];
    const findByType = (type) => fullContext.find(c => c.id && c.id.startsWith(type))?.text;

    let country = findByType("country") || "Việt Nam";
    let province = findByType("region");
    let district = findByType("district");
    let ward = findByType("neighborhood") || findByType("locality");

    if (!province) {
         const placeText = findByType("place");
         const specialCities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
         if (placeText && specialCities.some(city => placeText.includes(city))) province = placeText;
    }

    if (place.place_name && province) {
        const parts = place.place_name.split(",").map(p => p.trim());
        const provinceIndex = parts.findIndex(p => p === province);
        
        if (provinceIndex > 0) {
            let potentialDistrict = parts[provinceIndex - 1];
            if (!isNaN(potentialDistrict)) {
                 if (provinceIndex > 1) potentialDistrict = parts[provinceIndex - 2];
            }
            
            if ((!district || district === province) && potentialDistrict) {
                district = potentialDistrict;
            }
            
            if (provinceIndex > 1) {
                 let potentialWardIndex = provinceIndex - 1;
                 if (!isNaN(parts[potentialWardIndex])) potentialWardIndex--; 
                 potentialWardIndex--; 
                 
                 if (potentialWardIndex >= 0) {
                     const potentialWard = parts[potentialWardIndex];
                     if (!ward && potentialWard && potentialWard !== district) {
                         ward = potentialWard;
                     }
                 }
            }
        }
    }
    
    if (district === province) district = undefined;
    if (ward === district) ward = undefined;

    return { country, province, district, ward };
  };

  const reverseGeocode = async (lng, lat) => {
    try {
      const formattedLng = Number(lng).toFixed(6);
      const formattedLat = Number(lat).toFixed(6);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLng},${formattedLat}.json?access_token=${mapboxgl.accessToken}&language=vi&limit=1`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.features || data.features.length === 0) return;
      const place = data.features[0];

      const { country, province, district, ward } = extractLocationFromMapbox(place);

      setValue("address", place.place_name, { shouldValidate: true });
      setValue("country", country, { shouldValidate: true });
      
      setMapboxData({ province, district, ward, timestamp: Date.now() });

    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", 
      center: [viewState.lng, viewState.lat],
      zoom: viewState.zoom,
      attributionControl: false,
    });

    mapRef.current.on('load', () => setIsMapLoading(false));

    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    
    markerRef.current = new mapboxgl.Marker({ draggable: true, color: PRIMARY_COLOR, scale: 1.2 })
      .setLngLat([viewState.lng, viewState.lat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", async () => {
      const { lng, lat } = markerRef.current.getLngLat();
      setMarkerPosition({ lng, lat });
      setValue("latitude", lat); setValue("longitude", lng);
      await reverseGeocode(lng, lat);
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      markerRef.current?.setLngLat([lng, lat]);
      setMarkerPosition({ lng, lat });
      setValue("latitude", lat); setValue("longitude", lng);
      await reverseGeocode(lng, lat);
    });
  }, [mapRef]);

  useEffect(() => {
    if (markerRef.current && latWatch && lngWatch) {
        const lat = Number(latWatch); const lng = Number(lngWatch);
        if(!isNaN(lat) && !isNaN(lng)) {
            markerRef.current.setLngLat([lng, lat]);
            setMarkerPosition({ lng, lat });
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
        }
    }
  }, [latWatch, lngWatch]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Trình duyệt không hỗ trợ định vị.");
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        markerRef.current?.setLngLat([longitude, latitude]);
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 15 });
        setMarkerPosition({ lng: longitude, lat: latitude });
        setValue("latitude", latitude); setValue("longitude", longitude);
        await reverseGeocode(longitude, latitude);
    }, () => alert("Không thể lấy vị trí."));
  };

  const handleSearchChange = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) { setSuggestions([]); return; }
    try {
      const { lng, lat } = viewState;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&country=VN&language=vi&limit=5&proximity=${lng},${lat}`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {}
  };

  const handleSelectSuggestion = async (place) => {
    const [lng, lat] = place.center;
    markerRef.current?.setLngLat([lng, lat]);
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
    setMarkerPosition({ lng, lat });
    setValue("latitude", lat); setValue("longitude", lng);
    
    const { country, province, district, ward } = extractLocationFromMapbox(place);
    setValue("address", place.place_name);
    setValue("country", country);
    setSearchQuery(place.place_name);
    setSuggestions([]);
    
    setMapboxData({ province, district, ward, timestamp: Date.now() });
  };
  // --- HẾT LOGIC GIỮ NGUYÊN ---

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 1. Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl">
          <MapIcon size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vị trí chỗ nghỉ</h2>
          <p className="text-gray-500 text-sm mt-1">
            Kéo thả ghim trên bản đồ để hệ thống tự động điền địa chỉ chính xác.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ===== CỘT TRÁI: FORM NHẬP LIỆU ===== */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg shadow-gray-50 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                    <Navigation size={20} className="text-[rgb(40,169,224)]" />
                    <h4 className="text-base font-bold text-gray-800">Khu vực hành chính</h4>
                </div>
                
                {/* Component Select Dropdowns */}
                <AdminSelectorsWithApi 
                    watch={watch} setValue={setValue} errors={errors} 
                    mapRef={mapRef} markerRef={markerRef} mapboxData={mapboxData} 
                />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg shadow-gray-50 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                    <MapPin size={20} className="text-[rgb(40,169,224)]" />
                    <h4 className="text-base font-bold text-gray-800">Địa chỉ chi tiết</h4>
                </div>
                
                <TextField 
                    label="Số nhà, tên đường" 
                    placeholder="VD: Số 123 Đường Nguyễn Huệ..."
                    {...register("address")} 
                    error={errors.address?.message} 
                    icon={<MapPin size={18} />}
                />
            </div>
        </div>

        {/* ===== CỘT PHẢI: BẢN ĐỒ ===== */}
        <div className="lg:col-span-7 order-1 lg:order-2 h-[600px] relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 group">
            
            {/* 1. SEARCH BAR (Floating Glassmorphism) */}
            <div className="absolute top-6 left-6 right-6 z-20 max-w-md">
                <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within/input:text-[rgb(40,169,224)] transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 text-gray-900 placeholder:text-gray-400 
                        bg-white/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-200 
                        focus:ring-2 focus:ring-[rgb(40,169,224)] focus:bg-white transition-all text-sm font-medium"
                        placeholder="Tìm kiếm địa điểm, khách sạn..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    
                    {/* Dropdown Results */}
                    {suggestions.length > 0 && (
                    <ul className="absolute w-full bg-white/95 backdrop-blur-xl mt-2 rounded-2xl shadow-2xl max-h-[320px] overflow-auto py-2 text-sm border border-gray-100 animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                        {suggestions.map((item) => (
                        <li key={item.id} className="px-5 py-3.5 hover:bg-[rgb(40,169,224)]/5 hover:text-[rgb(40,169,224)] cursor-pointer flex items-start gap-3 text-gray-700 transition-colors border-b border-gray-50 last:border-0" onClick={() => handleSelectSuggestion(item)}>
                            <MapPin size={18} className="mt-0.5 shrink-0 opacity-70" />
                            <div>
                                <span className="font-semibold block text-gray-900">{item.text}</span>
                                <span className="text-xs text-gray-500 block mt-0.5 truncate max-w-[250px]">{item.place_name}</span>
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>

            {/* 2. NÚT LẤY VỊ TRÍ */}
            <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="absolute top-[88px] left-6 z-10 bg-white/90 backdrop-blur p-2.5 pr-4 rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:text-[rgb(40,169,224)] hover:bg-white transition-all active:scale-95 flex items-center gap-2 text-xs font-bold group/btn"
            >
                <div className="bg-gray-100 p-1 rounded-full group-hover/btn:bg-[rgb(40,169,224)]/10 transition-colors">
                    <Crosshair size={16} className="text-gray-600 group-hover/btn:text-[rgb(40,169,224)]" />
                </div>
                Vị trí hiện tại
            </button>

            {/* 3. MAP CONTAINER */}
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {isMapLoading && (
                <div className="absolute inset-0 bg-gray-50 z-0 flex flex-col gap-3 items-center justify-center">
                     <div className="w-8 h-8 border-4 border-[rgb(40,169,224)] border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-xs font-bold text-gray-500 animate-pulse">Đang tải bản đồ...</span>
                </div>
            )}

            {/* 4. COORDINATES PILL (Floating Bottom) */}
            <div className="absolute bottom-8 left-6 right-12 z-10 pointer-events-none">
                 <div className="inline-flex bg-gray-900/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl border border-white/10 items-center gap-4 text-xs font-medium text-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse"></span>
                        <span className="text-white font-mono tracking-wide">{markerPosition.lat.toFixed(5)}, {markerPosition.lng.toFixed(5)}</span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex items-center gap-2 text-[rgb(40,169,224)]">
                        <MousePointerClick size={14}/> 
                        <span>Click hoặc kéo thả ghim</span>
                    </div>
                 </div>
            </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Step1_Location;