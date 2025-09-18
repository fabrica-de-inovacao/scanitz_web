import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";

type SeriesPoint = { ts: string; value: number };

export function useComplaintsSeries(options?: {
  period?: string | "7d" | "30d" | "90d" | "1y";
  groupBy?: "day" | "week" | "month";
}) {
  const { period, groupBy = "day" } = options || {};

  return useQuery({
    queryKey: ["complaints", "series", period, groupBy],
    queryFn: async () => {
      const params: Record<string, unknown> = { groupBy };
      if (period) params.period = period;
      const { data } = await client.get("/complaints/analytics", { params });

      // defensive normalization: try multiple possible shapes
      const payload = data?.data ?? data ?? {};

      // common shape: payload.trends.items = [{ date, count }, ...]
      const trends = payload.trends ?? payload.trend ?? payload.trendsData;

      let items: Array<{
        date?: string;
        ts?: string;
        count?: number;
        value?: number;
      }> = [];

      if (Array.isArray(trends?.items)) items = trends.items;
      else if (Array.isArray(payload?.items)) items = payload.items;
      else if (Array.isArray(trends)) items = trends;

      const normalized: SeriesPoint[] = items.map((it) => {
        const ts = (it.date as string) || (it.ts as string) || String(it);
        const value =
          (it.count as number) ?? (it.value as number) ?? Number(it);
        return { ts, value: Number(value || 0) };
      });

      return normalized;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
