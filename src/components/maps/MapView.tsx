"use client";

import { useEffect, useState } from "react";
import { useComplaintsHeatmap } from "@/lib/hooks/useComplaints";
import type { ComplaintPosition } from "@/lib/types/complaint";

type Cluster = {
  lat: number;
  lng: number;
  count: number;
  status_breakdown?: Record<string, number>;
};

export default function MapView() {
  const { data, isLoading, error } = useComplaintsHeatmap({ zoom: 12 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modules, setModules] = useState<null | any>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // inject Leaflet CSS on the client only
      if (
        typeof document !== "undefined" &&
        !document.querySelector("link[data-leaflet]")
      ) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-leaflet", "1");
        link.href = new URL("leaflet/dist/leaflet.css", import.meta.url).href;
        document.head.appendChild(link);
      }

      const [{ MapContainer, TileLayer, Marker, Popup }, L] = await Promise.all(
        [import("react-leaflet"), import("leaflet")]
      );

      const iconUrl = new URL(
        "leaflet/dist/images/marker-icon.png",
        import.meta.url
      ).href;
      const iconRetinaUrl = new URL(
        "leaflet/dist/images/marker-icon-2x.png",
        import.meta.url
      ).href;
      const shadowUrl = new URL(
        "leaflet/dist/images/marker-shadow.png",
        import.meta.url
      ).href;

      // set default icon paths
      L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

      if (mounted) setModules({ MapContainer, TileLayer, Marker, Popup });
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <div className="p-6">Carregando mapa...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">Erro ao carregar dados do mapa.</div>
    );

  const points: ComplaintPosition[] = data?.data?.points ?? [];
  const clusters: Cluster[] = data?.data?.clusters ?? [];
  const center = data?.data?.summary?.center
    ? [data.data.summary.center.lat, data.data.summary.center.lng]
    : [-5.518, -47.487];

  if (!modules) return <div className="p-6">Inicializando mapa...</div>;

  const { MapContainer, TileLayer, Marker, Popup } = modules;

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {clusters.map((c, idx) => (
        <Marker key={`cluster-${idx}`} position={[c.lat, c.lng]}>
          <Popup>
            <div className="text-sm">Cluster: {c.count} denúncias</div>
          </Popup>
        </Marker>
      ))}

      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            <div className="text-sm">
              <strong>{p.title || "Denúncia"}</strong>
              <div>Bairro: {p.district}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
