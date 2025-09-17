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
