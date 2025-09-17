"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

interface UseHeatmapDataParams {
  zoom: number;
  status?: string;
  bounds?: Record<string, unknown> | null;
  refetchInterval?: number;
}

type HeatmapResponse =
  | {
      points?: Array<{
        lat: number;
        lng: number;
        weight?: number;
        status?: string;
      }>;
      clusters?: Array<Record<string, unknown>>;
      summary?: Record<string, unknown>;
    }
  | unknown;

export function useHeatmapData({
  zoom,
  status = "all",
  bounds,
  refetchInterval = 30000,
}: UseHeatmapDataParams) {
  const queryOptions: UseQueryOptions<
    HeatmapResponse,
    Error,
    HeatmapResponse,
    (string | number | null)[]
  > = {
    queryKey: ["heatmap", zoom, status, bounds ? JSON.stringify(bounds) : null],
    queryFn: async () => {
      const params = new URLSearchParams({ zoom: String(zoom), status });
      if (bounds) params.append("bounds", JSON.stringify(bounds));

      const res = await apiClient.get(
        `/complaints/heatmap?${params.toString()}`
      );
      return res.data?.data ?? res.data;
    },
    refetchInterval,
    staleTime: 60000,
    retry: 2,
  };

  return useQuery(queryOptions);
}
