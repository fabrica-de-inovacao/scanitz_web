"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { type Layer } from "leaflet";
// leaflet.heat registers on L.heatLayer
import "leaflet.heat";

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight?: number;
  status?: string;
}

interface HeatmapLayerProps {
  points: HeatmapPoint[];
  options?: Record<string, unknown>;
}

export default function HeatmapLayer({
  points,
  options = {},
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heatmapPoints: number[][] = points.map((p) => [
      p.lat,
      p.lng,
      Math.min(p.weight ?? 1, 1),
    ]);

    const defaultOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 18,
      opacity: 0.8,
      gradient: {
        0.0: "#10B981",
        0.1: "#F59E0B",
        0.2: "#EF4444",
        0.3: "#DC2626",
      },
    };

    const heatPlugin = L as unknown as {
      heatLayer: (pts: number[][], opts?: Record<string, unknown>) => Layer;
    };

    const layer = heatPlugin.heatLayer(heatmapPoints, {
      ...defaultOptions,
      ...(options as Record<string, unknown>),
    });
    layer.addTo(map);

    return () => {
      try {
        map.removeLayer(layer);
      } catch {
        // ignore
      }
    };
  }, [map, points, options]);

  return null;
}
