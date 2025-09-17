"use client";

import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";

export function useComplaintsPositions() {
  return useQuery({
    queryKey: ["complaints", "positions"],
    queryFn: async () => {
      const { data } = await client.get("/complaints/positions");
      return data;
    },
    staleTime: 1000 * 60, // 1 min
    retry: 2,
  });
}

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      const { data } = await client.get("/dashboard");
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useComplaintsHeatmap(options?: {
  zoom?: number;
  status?: string;
  bounds?: { north: number; south: number; east: number; west: number };
}) {
  const { zoom = 13, status = "all", bounds } = options || {};
  return useQuery({
    queryKey: [
      "complaints",
      "heatmap",
      zoom,
      status,
      bounds ? JSON.stringify(bounds) : undefined,
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = { zoom, status };
      if (bounds) params.bounds = JSON.stringify(bounds);
      const { data } = await client.get("/complaints/heatmap", { params });
      return data;
    },
    staleTime: 1000 * 30,
    retry: 1,
  });
}
