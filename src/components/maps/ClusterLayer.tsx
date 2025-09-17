"use client";

import React, { useMemo } from "react";
import { CircleMarker, Popup } from "react-leaflet";

interface Cluster {
  lat: number;
  lng: number;
  count: number;
  status_breakdown: { pending: number; progress: number; resolved: number };
}

interface ClusterLayerProps {
  clusters: Cluster[];
  onClusterClick?: (cluster: Cluster) => void;
}

export default function ClusterLayer({
  clusters = [],
  onClusterClick,
}: ClusterLayerProps) {
  const clusterMarkers = useMemo(() => {
    return clusters.map((cluster, index) => {
      const { pending, progress, resolved } = cluster.status_breakdown;
      const total = pending + progress + resolved || 1;

      let color = "#10B981";
      if (pending / total > 0.5) color = "#DC2626";
      else if (progress / total > 0.3) color = "#F59E0B";

      const radius = Math.min(Math.max(cluster.count * 2, 8), 40);

      return (
        <CircleMarker
          key={index}
          center={[cluster.lat, cluster.lng]}
          radius={radius}
          pathOptions={{
            fillColor: color,
            color: "white",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.7,
          }}
          eventHandlers={{ click: () => onClusterClick?.(cluster) }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-2">
                {cluster.count} Denúncias
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-600">● Pendentes:</span>
                  <span className="font-medium">{pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">● Em progresso:</span>
                  <span className="font-medium">{progress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">● Resolvidas:</span>
                  <span className="font-medium">{resolved}</span>
                </div>
              </div>

              <button
                onClick={() => onClusterClick?.(cluster)}
                className="mt-3 w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Ver Detalhes
              </button>
            </div>
          </Popup>
        </CircleMarker>
      );
    });
  }, [clusters, onClusterClick]);

  return <>{clusterMarkers}</>;
}
