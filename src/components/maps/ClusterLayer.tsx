"use client";

import React, { useMemo } from "react";
import { CircleMarker, Popup, Tooltip } from "react-leaflet";

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
      const total = (pending ?? 0) + (progress ?? 0) + (resolved ?? 0) || 1;

      // color by dominant status but be more sensitive on small counts
      let color = "#10B981"; // green by default
      if ((pending ?? 0) / total > 0.4) color = "#DC2626"; // red
      else if ((progress ?? 0) / total > 0.25) color = "#F59E0B"; // amber

      // radius scale using sqrt for smoother growth on small datasets
      const raw = Math.sqrt(cluster.count) * 6;
      const radius = Math.min(Math.max(Math.round(raw), 10), 56);

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
          <Tooltip
            direction="center"
            permanent
            className="text-sm font-semibold"
          >
            {cluster.count}
          </Tooltip>
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
