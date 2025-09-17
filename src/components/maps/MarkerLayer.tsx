'use client';

import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

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

export default function MarkerLayer({ points = [], onMarkerClick }: MarkerLayerProps) {
  const icon = L.divIcon({ className: 'text-red-600 text-xl', html: '<i class="bi bi-geo-alt-fill"></i>' });

  const markers = useMemo(() => {
    return points.map((p) => (
      <Marker key={p.id ?? `${p.lat}-${p.lng}`} position={[p.lat, p.lng]} icon={icon} eventHandlers={{ click: () => onMarkerClick?.(p) }}>
        <Popup>
          <div className="min-w-[200px]">
            <h3 className="font-semibold">{p.title || 'Denúncia'}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
          </div>
        </Popup>
      </Marker>
    ));
  }, [points, onMarkerClick, icon]);

  return <>{markers}</>;
}
