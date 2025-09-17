import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";

export type RelevantActivity = {
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
  relevanceScore?: number;
};

type FetchParams = {
  limit?: number;
  minSimilar?: number;
  status?: number;
  city?: string;
};

function relativeTimeAgo(dateStr?: string | null) {
  if (!dateStr) return undefined;
  try {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000));
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

function normalizeComplaint(item: unknown): RelevantActivity {
  const it = (item as Record<string, unknown>) ?? {};
  const id = (it.id as string) ?? (it._id as string) ?? "";
  const description = (it.description as string) ?? "";
  const addressRaw = it.address as Record<string, unknown> | undefined;
  const address =
    addressRaw && typeof addressRaw === "object" ? addressRaw : {};

  let situationObj: Record<string, unknown> = {};
  if (Array.isArray(it.situation) && it.situation.length > 0) {
    situationObj = it.situation[0] as Record<string, unknown>;
  } else if (typeof it.situation === "object" && it.situation) {
    situationObj = it.situation as Record<string, unknown>;
  }

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
    (address.city as string) ?? (address.fallbackName as string) ?? "";
  const districtVal = (address.district as string) ?? "";

  const latVal =
    address && typeof address.latitude !== "undefined"
      ? Number(address.latitude)
      : null;
  const lngVal =
    address && typeof address.longitude !== "undefined"
      ? Number(address.longitude)
      : null;

  const relevanceScoreVal =
    typeof it.relevanceScore === "number"
      ? (it.relevanceScore as number)
      : Number(it.relevanceScore) || 0;

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
    relevanceScore: relevanceScoreVal,
  };
}

async function fetchRelevantActivities(
  params: FetchParams = {}
): Promise<RelevantActivity[]> {
  const { limit = 10, minSimilar, status, city } = params;
  const res = await client.get("/complaints/relevant", {
    params: {
      limit,
      minSimilar,
      status,
      city,
    },
  });
  const apiData = res?.data ?? res;
  const list = apiData?.data ?? apiData ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizeComplaint);
}

export function useRelevantActivities(options?: {
  enabled?: boolean;
  limit?: number;
  minSimilar?: number;
  status?: number;
  city?: string;
}) {
  const params: FetchParams = {
    limit: options?.limit,
    minSimilar: options?.minSimilar,
    status: options?.status,
    city: options?.city,
  };

  return useQuery<RelevantActivity[], Error>({
    queryKey: ["relevantActivities", params],
    queryFn: () => fetchRelevantActivities(params),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}
