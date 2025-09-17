"use client";

import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";

// Normalized types for dashboard KPIs
export type Trend = "up" | "down" | "stable";

export interface NormalizedGrowth {
  current: number;
  previous: number;
  growthRate: number;
  trend: Trend;
}

export interface NormalizedComplaintsKPIs {
  total: number;
  new: number;
  resolved: number;
  pending: number;
  inProgress: number;
  resolutionRate: number; // percent value e.g. 12.5
  averageResolutionTime: number; // raw value from API
  growthRate: NormalizedGrowth;
}

export interface NormalizedUsersKPIs {
  total: number;
  new: number;
  active: number;
  verified: number;
  growthRate: NormalizedGrowth;
}

export interface NormalizedEngagementKPIs {
  complaintsPerUser: number;
  activeUsersPercentage: number;
  averageComplaintsPerActiveUser: number;
  topContributors: unknown[];
}

export interface NormalizedQualityKPIs {
  complaintsWithImages: number;
  averageDescriptionLength: number;
  completenessScore: number;
  duplicateRate: number;
}

export interface NormalizedKPIs {
  complaints: NormalizedComplaintsKPIs;
  users: NormalizedUsersKPIs;
  engagement: NormalizedEngagementKPIs;
  quality: NormalizedQualityKPIs;
}

export interface NormalizedDashboard {
  kpis: NormalizedKPIs;
  comparison?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

function toNumber(value: unknown, fallback = 0): number {
  if (value == null) return fallback;
  if (typeof value === "number") return value as number;
  if (typeof value === "string") {
    const parsed = parseFloat(
      (value as string).replace("%", "").replace(/,/g, ".")
    );
    return isNaN(parsed) ? fallback : parsed;
  }
  // Firestore timestamp-like objects (seconds)
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (typeof v.seconds === "number") return v.seconds;
    if (typeof v.total === "number") return v.total;
  }
  return fallback;
}

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

      // defensive extraction
      const apiKpis =
        (data && data.kpis) || (data && data.data && data.data.kpis) || {};
      const complaints = apiKpis.complaints || {};
      const users = apiKpis.users || {};
      const engagement = apiKpis.engagement || {};
      const quality = apiKpis.quality || {};

      const normalized: NormalizedDashboard = {
        kpis: {
          complaints: {
            total: toNumber(complaints.total, 0),
            new: toNumber(complaints.new, 0),
            resolved: toNumber(complaints.resolved, 0),
            pending: toNumber(complaints.pending, 0),
            inProgress: toNumber(complaints.inProgress, 0),
            resolutionRate: toNumber(complaints.resolutionRate, 0),
            averageResolutionTime: toNumber(
              complaints.averageResolutionTime,
              0
            ),
            growthRate: {
              current: toNumber(complaints.growthRate?.current, 0),
              previous: toNumber(complaints.growthRate?.previous, 0),
              growthRate: toNumber(complaints.growthRate?.growthRate, 0),
              trend: (complaints.growthRate?.trend as Trend) || "stable",
            },
          },
          users: {
            total: toNumber(users.total, 0),
            new: toNumber(users.new, 0),
            active: toNumber(users.active, 0),
            verified: toNumber(users.verified, 0),
            growthRate: {
              current: toNumber(users.growthRate?.current, 0),
              previous: toNumber(users.growthRate?.previous, 0),
              growthRate: toNumber(users.growthRate?.growthRate, 0),
              trend: (users.growthRate?.trend as Trend) || "stable",
            },
          },
          engagement: {
            complaintsPerUser: toNumber(engagement.complaintsPerUser, 0),
            activeUsersPercentage: toNumber(
              engagement.activeUsersPercentage,
              0
            ),
            averageComplaintsPerActiveUser: toNumber(
              engagement.averageComplaintsPerActiveUser,
              0
            ),
            topContributors: Array.isArray(engagement.topContributors)
              ? engagement.topContributors
              : [],
          },
          quality: {
            complaintsWithImages: toNumber(quality.complaintsWithImages, 0),
            averageDescriptionLength: toNumber(
              quality.averageDescriptionLength,
              0
            ),
            completenessScore: toNumber(quality.completenessScore, 0),
            duplicateRate: toNumber(quality.duplicateRate, 0),
          },
        },
        comparison: data?.comparison || data?.data?.comparison || {},
        meta: data?.meta || data?.data?.meta || {},
      };

      // attach normalized object to the original response for backward-compatibility
      if (data && typeof data === "object") {
        try {
          (data as Record<string, unknown>)["normalized"] = normalized;
        } catch {
          // ignore if not extensible
        }
      }

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
