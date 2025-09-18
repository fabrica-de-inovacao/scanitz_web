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

    // adapt visual parameters when dataset is small to make heat more visible
    const pointCount = heatmapPoints.length;
    const defaultOptions = (() => {
      if (pointCount === 0) {
        return { radius: 25, blur: 15, maxZoom: 18, opacity: 0.8 };
      }

      // for small datasets, increase radius and blur so points blend
      if (pointCount < 100) {
        return {
          radius: 45,
          blur: 30,
          maxZoom: 18,
          opacity: 0.9,
          gradient: {
            0.0: "rgba(0,0,0,0)",
            0.2: "#60A5FA",
            0.4: "#34D399",
            0.6: "#F59E0B",
            0.9: "#EF4444",
          },
        };
      }

      // medium/large datasets - default tuned for density
      return {
        radius: 25,
        blur: 15,
        maxZoom: 18,
        opacity: 0.8,
        gradient: {
          0.0: "rgba(0,0,0,0)",
          0.2: "#60A5FA",
          0.4: "#34D399",
          0.6: "#F59E0B",
          0.9: "#EF4444",
        },
      };
    })();

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
