"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue with webpack/vite (same fix as BikeMap.tsx)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationMapProps {
  center: [number, number];
  zoom?: number;
  popupText?: string;
}

// A single-marker Leaflet map, styled the same way as BikeMap so every map
// across the app (Home, Find Bikes, Contact) uses the same look and is
// centered on a real Nepal location.
export default function LocationMap({ center, zoom = 15, popupText }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // Wikimedia's osm-intl tiles support a lang param to force English
    // labels — plain OSM tiles always render local-language (Nepali) names.
    L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en", {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(center).addTo(map);
    if (popupText) {
      marker.bindPopup(popupText).openPopup();
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}