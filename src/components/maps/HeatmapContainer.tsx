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

interface HeatmapContainerProps {
  height?: string;
  showControls?: boolean;
  initialZoom?: number;
  className?: string;
}

export default function HeatmapContainer({
  height = "h-96",
  showControls = true,
  initialZoom = 12,
  className = "",
}: HeatmapContainerProps) {
  const [zoom, setZoom] = useState(initialZoom);
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

  const center: [number, number] = [-5.5292, -47.4622];

  const visualizationType = useMemo(() => {
    if (zoom >= 14) return "markers";
    if (zoom >= 11) return "clusters";
    return "heatmap";
  }, [zoom]);

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
        ref={mapRef}
        zoomControl={true}
        attributionControl={false}
      >
        <MapZoomSync onChange={setZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {visualizationType === "heatmap" && (
          <HeatmapLayer points={heatData.points || []} />
        )}
        {visualizationType === "clusters" && (
          <ClusterLayer
            clusters={heatData.clusters || []}
            onClusterClick={() => {}}
          />
        )}
        {visualizationType === "markers" && (
          <MarkerLayer
            points={heatData.points || []}
            onMarkerClick={() => {}}
          />
        )}
      </MapContainer>

      {/* sync initial zoom from map ref when available */}
      <>{/** useEffect below to update zoom once mapRef is set */}</>

      {showControls && (
        <>
          <div className="absolute top-4 left-4 z-[1000]">
            <MapControls
              filters={filters}
              onFiltersChange={setFilters}
              visualizationType={visualizationType}
            />
          </div>

          <div className="absolute bottom-4 right-4 z-[1000]">
            <MapLegend data={heatData.summary} />
          </div>
        </>
      )}

      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium text-gray-700">
        Zoom: {zoom} • {visualizationType}
      </div>
    </div>
  );
}
