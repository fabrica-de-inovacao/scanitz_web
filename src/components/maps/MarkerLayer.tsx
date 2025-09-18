"use client";

import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Point {
  id?: string | number;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  status?: string;
}

interface MarkerLayerProps {
  points: Point[];
  onMarkerClick?: (point: Point) => void;
}

export default function MarkerLayer({
  points = [],
  onMarkerClick,
}: MarkerLayerProps) {
  const markers = useMemo(() => {
    return points.map((p) => {
      const status = p.status ?? "pending";
      const color =
        status === "resolved"
          ? "#10B981"
          : status === "progress"
          ? "#F59E0B"
          : "#DC2626";

      const icon = L.divIcon({
        className: "marker-div-icon",
        html: `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};color:#fff;"><i class=\"bi bi-geo-alt-fill\" style=\"font-size:14px;line-height:1\"></i></span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      return (
        <Marker
          key={p.id ?? `${p.lat}-${p.lng}`}
          position={[p.lat, p.lng]}
          icon={icon}
          eventHandlers={{ click: () => onMarkerClick?.(p) }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold">{p.title || "Denúncia"}</h3>
              {p.status ? (
                <div className="text-xs text-gray-500">Status: {p.status}</div>
              ) : null}
              <p className="text-sm text-gray-600 mt-1">{p.description}</p>
              {/** optionally show location meta */}
              {typeof (p as { district?: string }).district === "string" ? (
                <div className="text-xs text-gray-400 mt-2">
                  Bairro: {(p as { district?: string }).district}
                </div>
              ) : null}
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [points, onMarkerClick]);

  return <>{markers}</>;
}
