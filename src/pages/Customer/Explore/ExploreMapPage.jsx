import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";

// Components con
import MapHotelCard from "./components/MapHotelCard";
import MapHeader from "./components/MapHeader";
import MapUserLocationButton from "./components/MapUserLocationButton";
import MapLoadingOverlay from "./components/MapLoadingOverlay";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// ✅ 1. HÀM FORMAT GIÁ (Đầy đủ: 500.000 VND)
const formatFullPrice = (price) => {
  if (!price && price !== 0) return "Liên hệ";
  const formatted = new Intl.NumberFormat('vi-VN').format(price);
  return `${formatted} VND`;
};

export default function ExploreMapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const currentPopupRef = useRef(null);
  const navigate = useNavigate();

  // --- States ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [properties, setProperties] = useState([]);
  
  // Filter States
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState("all"); 

  // --- Init Map ---
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12", 
      center: [105.804817, 21.028511], // Default Hanoi
      zoom: 13,
      attributionControl: false,
      pitch: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false, showZoom: false }), "bottom-right");

    map.current.on("load", () => {
      setIsLoading(false);
      getUserLocation();
    });

    // Tự động tìm kiếm khi di chuyển bản đồ
    map.current.on("moveend", () => {
       const center = map.current.getCenter();
       fetchNearbyProperties(center.lat, center.lng);
    });

  }, []);

  // --- Filter Client-side ---
  useEffect(() => {
    if (properties.length > 0) {
        renderMarkers(properties);
    }
  }, [minRating, priceRange]);

  // --- Handle Search & Filter (ĐÃ SỬA LỖI CRASH) ---
  const handleFilterChange = useCallback(async (filters) => {
    setIsSearching(true);
    try {
        // 1. Geocoding: Bay tới địa điểm
        if (filters.keyword && map.current) {
            try {
                const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(filters.keyword)}.json?access_token=${MAPBOX_TOKEN}&country=vn&types=region,place,locality&limit=1`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (geoData.features && geoData.features.length > 0) {
                    const [lng, lat] = geoData.features[0].center;
                    map.current.flyTo({ center: [lng, lat], zoom: 12, essential: true });
                }
            } catch (geoError) {
                console.error("Geocoding error:", geoError);
            }
        }

        // 2. Search API Backend
        const res = await propertyService.searchProperties(filters.keyword, filters.guests);
        
        // [FIX] Kiểm tra cấu trúc dữ liệu trả về để lấy đúng mảng
        let hotels = [];
        
        // Trường hợp 1: API trả về ApiResponse bọc Page (Backend hiện tại) -> res.data.content
        if (res?.data?.content && Array.isArray(res.data.content)) {
            hotels = res.data.content;
        } 
        // Trường hợp 2: API trả về Page trực tiếp -> res.content
        else if (res?.content && Array.isArray(res.content)) {
            hotels = res.content;
        } 
        // Trường hợp 3: API trả về mảng trực tiếp -> res
        else if (Array.isArray(res)) {
            hotels = res;
        }

        setProperties(hotels);
        renderMarkers(hotels);

    } catch (error) {
        console.error("Search error:", error);
    } finally {
        setIsSearching(false);
    }
  }, []);

  // --- Map Utils ---
  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (map.current) {
            map.current.flyTo({ center: [longitude, latitude], zoom: 14, essential: true });
            
            // User Marker
            const el = document.createElement('div');
            el.innerHTML = `<div class="relative flex items-center justify-center w-6 h-6"><div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div><div class="absolute w-full h-full bg-blue-500/40 rounded-full animate-ping"></div></div>`;
            new mapboxgl.Marker({ element: el }).setLngLat([longitude, latitude]).addTo(map.current);
            
            fetchNearbyProperties(latitude, longitude);
        }
      },
      () => fetchNearbyProperties(21.028511, 105.804817)
    );
  };

const fetchNearbyProperties = async (lat, lng) => {
    setIsSearching(true);
    try {
      const res = await propertyService.findNearbyProperties(lat, lng, 15);
      
      // ✅ FIX: Kiểm tra và bóc tách dữ liệu mảng an toàn
      let hotels = [];
      if (res?.data && Array.isArray(res.data)) {
          hotels = res.data;
      } else if (res?.result && Array.isArray(res.result)) {
          hotels = res.result;
      } else if (Array.isArray(res)) {
          hotels = res;
      }

      setProperties(hotels);
      renderMarkers(hotels);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // --- RENDER MARKERS ---
  const renderMarkers = (data) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!data || !Array.isArray(data) || data.length === 0) return;

    // Filter Logic
    let filteredData = data.filter(p => (p.rating || 0) >= minRating);
    if (priceRange === 'low') filteredData = filteredData.filter(p => p.minPrice < 1000000);
    if (priceRange === 'mid') filteredData = filteredData.filter(p => p.minPrice >= 1000000 && p.minPrice < 3000000);
    if (priceRange === 'high') filteredData = filteredData.filter(p => p.minPrice >= 3000000);

    filteredData.forEach((hotel) => {
        const el = document.createElement("div");
        el.className = "custom-marker cursor-pointer hover:z-[999] relative";
        
        const priceText = formatFullPrice(hotel.minPrice);
        
        el.innerHTML = `
            <div class="flex flex-col items-center transition-transform duration-200 hover:scale-105 group">
                <div class="
                    bg-white text-gray-900 border-2 border-gray-100 
                    font-extrabold text-sm px-3 py-2 rounded-xl shadow-xl 
                    whitespace-nowrap 
                    group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 
                    transition-colors duration-200
                ">
                    ${priceText}
                </div>
                <div class="
                    w-0 h-0 
                    border-l-[8px] border-l-transparent 
                    border-r-[8px] border-r-transparent 
                    border-t-[8px] border-t-white 
                    group-hover:border-t-blue-600 
                    shadow-sm -mt-[2px] transition-colors duration-200
                "></div>
            </div>
        `;

        el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentPopupRef.current) currentPopupRef.current.remove();

            map.current.flyTo({ center: [hotel.longitude, hotel.latitude], zoom: 15, speed: 1.5, curve: 1 });

            const popupNode = document.createElement("div");
            const root = createRoot(popupNode);
            
            root.render(
                <MapHotelCard 
                    property={hotel} 
                    navigate={navigate} 
                    onClose={() => currentPopupRef.current?.remove()} 
                />
            );

            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                closeOnClick: true,
                maxWidth: 'none',
                className: 'modern-popup'
            })
            .setLngLat([hotel.longitude, hotel.latitude])
            .setDOMContent(popupNode)
            .addTo(map.current);

            currentPopupRef.current = popup;
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([hotel.longitude, hotel.latitude])
            .addTo(map.current);
        
        markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50 font-sans">
      
      <MapHeader 
        navigate={navigate}
        onFilterChange={handleFilterChange}
        isSearching={isSearching}
        minRating={minRating} setMinRating={setMinRating}
        priceRange={priceRange} setPriceRange={setPriceRange}
      />

      <div ref={mapContainer} className="w-full h-full focus:outline-none" />

      <MapUserLocationButton onClick={getUserLocation} />

      <MapLoadingOverlay isLoading={isLoading} />
      
      <style>{`
        .modern-popup .mapboxgl-popup-content {
            padding: 0 !important;
            border-radius: 16px !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        .modern-popup .mapboxgl-popup-tip {
            border-top-color: white !important;
            margin-bottom: -1px;
        }
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
      `}</style>
    </div>
  );
}