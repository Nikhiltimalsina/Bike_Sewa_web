"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bike } from "@/api/bike.api";

// Fix default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface BikeMapProps {
  bikes: Bike[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function BikeMap({ bikes, center = [27.7172, 85.324], zoom = 13, height = "480px" }: BikeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Create the map ONCE on mount. Do not depend on center/zoom here —
  // recreating the whole map on every render (e.g. when center/zoom are
  // inline array/number literals that change identity each render) can
  // tear it down mid zoom-animation and throw inside Leaflet's internals.
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // Wikimedia's osm-intl tiles support a lang param to force English
    // labels — plain OSM tiles always render local-language (Nepali) names
    // and have no language option.
    L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en", {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If center/zoom genuinely change later, just move the existing map
  // instead of destroying and rebuilding it.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView(center, zoom, { animate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);

  // Update markers when bikes change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each bike with coordinates
    bikes.forEach((bike) => {
      if (bike.latitude && bike.longitude) {
        const marker = L.marker([bike.latitude, bike.longitude]).addTo(map);

        const price = Number(bike.pricePerHour || 0).toLocaleString();
        const available = bike.isAvailable !== false ? "✅ Available" : "❌ Booked";

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 160px;">
            <strong style="font-size: 14px; color: #111;">${bike.name}</strong><br/>
            <span style="font-size: 12px; color: #555;">${bike.model || ""}</span><br/>
            <span style="font-size: 12px; color: #555;">📍 ${bike.location || "Kathmandu"}</span><br/>
            <span style="font-size: 13px; font-weight: bold; color: #2563eb;">NPR ${price}/hour</span><br/>
            <span style="font-size: 11px;">${available}</span><br/>
            <a href="/booking/${bike.id}" style="display: inline-block; margin-top: 6px; padding: 4px 12px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600;">Book Now →</a>
          </div>
        `);
      }
    });

    // If we have bikes with coordinates, fit bounds.
    // animate: false avoids a zoom-transition being interrupted by an
    // unmount/re-render, which is what triggers the _leaflet_pos crash.
    const bikesWithCoords = bikes.filter((b) => b.latitude && b.longitude);
    if (bikesWithCoords.length > 0) {
      const bounds = L.latLngBounds(
        bikesWithCoords.map((b) => [b.latitude!, b.longitude!])
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: false });
    }
  }, [bikes]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height, borderRadius: "16px", overflow: "hidden" }}
      className="border border-white/10"
    />
  );
}