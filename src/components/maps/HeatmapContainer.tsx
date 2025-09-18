"use client";

import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useHeatmapData } from "@/lib/hooks/useHeatmapData";

// lazy load layers to avoid SSR issues
type HeatPoint = { lat: number; lng: number; weight?: number; status?: string };
type Cluster = {
  lat: number;
  lng: number;
  count: number;
  status_breakdown?: Record<string, number>;
};
type MapFiltersLocal = {
  status?: string;
  bounds?: Record<string, unknown> | null;
  period?: unknown;
  view?: "heatmap" | "clusters" | "markers";
};

const HeatmapLayer = dynamic(() => import("./HeatmapLayer"), {
  ssr: false,
}) as unknown as React.ComponentType<{
  points: HeatPoint[];
  options?: Record<string, unknown>;
}>;
const ClusterLayer = dynamic(() => import("./ClusterLayer"), {
  ssr: false,
}) as unknown as React.ComponentType<{
  clusters: Cluster[];
  onClusterClick?: (c: Cluster) => void;
}>;
const MarkerLayer = dynamic(() => import("./MarkerLayer"), {
  ssr: false,
}) as unknown as React.ComponentType<{
  points: HeatPoint[];
  onMarkerClick?: (p: HeatPoint) => void;
}>;
const MapControls = dynamic(() => import("./MapControls"), {
  ssr: false,
}) as unknown as React.ComponentType<{
  filters: MapFiltersLocal;
  onFiltersChange: React.Dispatch<React.SetStateAction<MapFiltersLocal>>;
  onBasemapChange?: (b: "osm" | "sat") => void;
  currentBasemap?: "osm" | "sat";
  visualizationType: "heatmap" | "clusters" | "markers";
  className?: string;
}>;
const MapLegend = dynamic(() => import("./MapLegend"), {
  ssr: false,
}) as unknown as React.ComponentType<{
  data?: Record<string, unknown> | undefined;
  className?: string;
}>;

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useRef, useEffect } from "react";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";

interface HeatmapContainerProps {
  height?: string;
  showControls?: boolean;
  initialZoom?: number;
  className?: string;
  controlsPosition?: "left" | "right";
}

export default function HeatmapContainer({
  height = "h-96",
  showControls = true,
  initialZoom = 13,
  className = "",
  controlsPosition = "right",
}: HeatmapContainerProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [basemap, setBasemap] = useState<"osm" | "sat">("osm");
  const [filters, setFilters] = useState<MapFiltersLocal>({
    status: "all",
    bounds: null,
    period: null,
  });

  const { data, isLoading, error } = useHeatmapData({
    zoom,
    status: filters.status,
    bounds: filters.bounds,
  });
  const mapRef = useRef<LeafletMap | null>(null);

  // normalize data shape for TypeScript
  const heatData = (data ?? {}) as {
    points?: HeatPoint[];
    clusters?: Cluster[];
    summary?: Record<string, unknown>;
  };

  const center: [number, number] = [-5.514639, -47.472239];

  const baseVisualization = useMemo(() => {
    if (zoom >= 13) return "markers";
    if (zoom >= 11) return "clusters";
    return "heatmap";
  }, [zoom]);

  // allow explicit override via filters.view
  const visualizationType = (filters.view as "heatmap" | "clusters" | "markers")
    ? (filters.view as "heatmap" | "clusters" | "markers")
    : baseVisualization;

  // Local component to sync zoom state using react-leaflet hooks
  function MapZoomSync({ onChange }: { onChange: (z: number) => void }) {
    const map = useMap();
    useEffect(() => {
      onChange(map.getZoom());
      const handler = () => onChange(map.getZoom());
      map.on("zoomend", handler);
      return () => void map.off("zoomend", handler);
    }, [map, onChange]);
    return null;
  }

  // MapRefSetter - attach map instance to mapRef via useMap
  function MapRefSetter() {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map as unknown as LeafletMap;
    }, [map]);
    return null;
  }

  if (isLoading)
    return <div className={`${height} bg-gray-100 animate-pulse rounded`} />;
  if (error)
    return (
      <div className={`${height} bg-red-50 rounded p-4`}>
        Erro ao carregar o mapa
      </div>
    );

  return (
    <div className={`relative ${height} ${className}`}>
      <MapContainer
        center={center}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg shadow-lg"
        zoomControl={true}
        attributionControl={false}
      >
        <MapRefSetter />
        <MapZoomSync onChange={setZoom} />
        <TileLayer
          url={
            basemap === "osm"
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          }
          attribution={
            basemap === "osm"
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              : '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
          }
        />

        {visualizationType === "heatmap" && (
          <HeatmapLayer points={heatData.points || []} />
        )}
        {visualizationType === "clusters" && (
          <ClusterLayer
            clusters={heatData.clusters || []}
            onClusterClick={(c) => {
              // zoom to cluster
              const m = mapRef.current;
              if (!m) return;
              const targetZoom = Math.min((m.getZoom() ?? 12) + 2, 18);
              m.setView([c.lat, c.lng], targetZoom, { animate: true });
            }}
          />
        )}
        {visualizationType === "markers" && (
          <MarkerLayer
            points={heatData.points || []}
            onMarkerClick={(p) => {
              const m = mapRef.current;
              if (!m) return;
              m.setView([p.lat, p.lng], Math.max(14, m.getZoom() ?? 14), {
                animate: true,
              });

              // open a temporary popup using Leaflet directly
              try {
                const title = (p as { title?: string }).title ?? "Denúncia";
                const description =
                  (p as { description?: string }).description ?? "";
                const popup = L.popup({ maxWidth: 300 })
                  .setLatLng([p.lat, p.lng])
                  .setContent(
                    `<div class="min-w-[200px]"><h3 class="font-semibold">${title}</h3><p class="text-sm text-gray-600">${description}</p></div>`
                  );
                popup.openOn(m);
              } catch {
                // ignore popup errors
              }
            }}
          />
        )}
      </MapContainer>

      {/* sync initial zoom from map ref when available */}
      <>{/** useEffect below to update zoom once mapRef is set */}</>

      {showControls && (
        <>
          <div
            className={`absolute top-4 ${
              controlsPosition === "left" ? "left-4" : "right-4"
            } z-[1000]`}
          >
            <MapControls
              filters={filters}
              onFiltersChange={setFilters}
              onBasemapChange={(b) => setBasemap(b)}
              currentBasemap={basemap}
              visualizationType={visualizationType}
              className={
                controlsPosition === "left"
                  ? "origin-top-left"
                  : "origin-top-right"
              }
            />
          </div>

          <div
            className={`absolute bottom-4 ${
              controlsPosition === "left" ? "left-4" : "right-4"
            } z-[1000]`}
          >
            <MapLegend
              data={heatData.summary}
              className={
                controlsPosition === "left"
                  ? "origin-bottom-left"
                  : "origin-bottom-right"
              }
            />
          </div>
        </>
      )}

      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium text-gray-700">
        Zoom: {zoom} • {visualizationType}
      </div>
    </div>
  );
}
