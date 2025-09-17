import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";

export type RecentActivity = {
  id: string | number;
  title: string;
  timeAgo?: string;
  status: number;
  city?: string;
  district?: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
  createdAt?: string | null;
  userName?: string | null;
  similarCount?: number | null;
};

type FetchParams = {
  limit?: number;
  status?: number;
  city?: string;
};

function relativeTimeAgo(dateStr?: string | null) {
  if (!dateStr) return undefined;
  try {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000)); // seconds
    if (diff < 60) return `${diff}s`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  } catch {
    return undefined;
  }
}

function normalizeComplaint(item: unknown): RecentActivity {
  const it = (item as Record<string, unknown>) ?? {};
  const id = (it.id as string) ?? (it._id as string) ?? "";
  const description = (it.description as string) ?? "";
  const addressRaw = it.address as Record<string, unknown> | undefined;
  const address =
    addressRaw && typeof addressRaw === "object" ? addressRaw : {};

  // situation can be object or array in the response
  let situationObj: Record<string, unknown> = {};
  if (Array.isArray(it.situation) && it.situation.length > 0) {
    situationObj = it.situation[0] as Record<string, unknown>;
  } else if (typeof it.situation === "object" && it.situation) {
    situationObj = it.situation as Record<string, unknown>;
  }

  // createdAt can be Firestore timestamp object { seconds, nanoseconds } or ISO string
  let createdAt: string | null = null;
  const rawCreated =
    (it.createdAt as unknown) ?? (it.created_at as unknown) ?? null;
  if (rawCreated) {
    if (typeof rawCreated === "string") {
      createdAt = rawCreated as string;
    } else if (
      typeof rawCreated === "object" &&
      rawCreated !== null &&
      typeof (rawCreated as Record<string, unknown>).seconds === "number"
    ) {
      const secs = (rawCreated as Record<string, unknown>).seconds as number;
      createdAt = new Date(secs * 1000).toISOString();
    }
  }

  const imageUrl =
    (it.thumbnailUrl as string) ?? (it.imageUrl as string) ?? null;
  const userNameVal =
    (it.userName as string) ?? (it.user_name as string) ?? null;
  const similarCountVal =
    typeof it.similarCount === "number"
      ? (it.similarCount as number)
      : Number(it.similarCount) || 0;

  const statusVal =
    typeof situationObj?.status === "number"
      ? (situationObj.status as number)
      : Number(situationObj?.status) || 0;

  const cityVal =
    (address.city as string) ??
    (address.city as string) ??
    (address.fallbackName as string) ??
    "";
  const districtVal =
    (address.district as string) ?? (address.district as string) ?? "";

  const latVal =
    address && typeof address.latitude !== "undefined"
      ? Number(address.latitude)
      : null;
  const lngVal =
    address && typeof address.longitude !== "undefined"
      ? Number(address.longitude)
      : null;

  return {
    id,
    title:
      description ||
      (address.fallbackName as string) ||
      (address.street as string) ||
      "Sem descrição",
    timeAgo: relativeTimeAgo(createdAt),
    status: statusVal,
    city: cityVal,
    district: districtVal,
    latitude: latVal,
    longitude: lngVal,
    imageUrl,
    userName: userNameVal,
    similarCount: similarCountVal,
    createdAt,
  };
}

async function fetchRecentActivities(
  params: FetchParams = {}
): Promise<RecentActivity[]> {
  const { limit = 10, status, city } = params;
  const res = await client.get("/complaints/recent", {
    params: {
      limit,
      status,
      city,
    },
  });
  const apiData = res?.data ?? res;
  const list = apiData?.data ?? apiData ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizeComplaint);
}

export function useRecentActivities(options?: {
  enabled?: boolean;
  limit?: number;
  status?: number;
  city?: string;
}) {
  const params: FetchParams = {
    limit: options?.limit,
    status: options?.status,
    city: options?.city,
  };

  return useQuery<RecentActivity[], Error>({
    queryKey: ["recentActivities", params],
    queryFn: () => fetchRecentActivities(params),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}
