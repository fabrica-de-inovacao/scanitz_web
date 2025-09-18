"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api/client";
import KPICard from "@/components/ui/KPICard";
import Sparkline from "@/components/ui/Sparkline";
import HeatmapContainer from "@/components/maps/HeatmapContainer";
import ActivityList from "@/components/ui/ActivityList";
import Button from "@/components/ui/Button";

type Point = { ts: string; value: number };

async function fetchLocalAnalytics(q: string | null) {
  // Prefer groupBy=district for neighborhood searches; fallback to generic trends
  const params: Record<string, unknown> = {
    groupBy: "district",
    period: "all",
  };
  if (q) params["q"] = q;

  const res = await client.get("/complaints/analytics", { params });
  return res.data ?? res;
}

function useLocalStats(q: string | null) {
  return useQuery({
    queryKey: ["localStats", q ?? "__all"],
    queryFn: () => fetchLocalAnalytics(q),
    // always enabled; server will fallback to city-wide when q is null
    staleTime: 1000 * 60 * 2,
  });
}

function normalizeSeries(payload: unknown): Point[] {
  const data =
    (payload as Record<string, unknown>)?.data ??
    (payload as Record<string, unknown>) ??
    {};
  const trends =
    (data as Record<string, unknown>)?.trends ??
    (data as Record<string, unknown>)?.trend ??
    (data as Record<string, unknown>)?.trendsData ??
    (data as Record<string, unknown>)?.series;
  let items: unknown[] = [];
  if (
    trends &&
    typeof trends === "object" &&
    Array.isArray((trends as Record<string, unknown>).items)
  ) {
    items = (trends as Record<string, unknown>).items as unknown[];
  } else if (Array.isArray(trends)) items = trends as unknown[];
  else if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as Record<string, unknown>).items)
  ) {
    items = (data as Record<string, unknown>).items as unknown[];
  }

  if (!items.length) return [];
  return items
    .map((it) => {
      let ts: string | undefined;
      let rawVal: unknown;
      if (it && typeof it === "object" && !Array.isArray(it)) {
        const obj = it as Record<string, unknown>;
        if ("date" in obj && obj.date) ts = String(obj.date);
        else if ("ts" in obj && obj.ts) ts = String(obj.ts);
        else if ("timestamp" in obj && obj.timestamp)
          ts = String(obj.timestamp);
        rawVal = obj.count ?? obj.value ?? obj["y"] ?? undefined;
      } else if (Array.isArray(it)) {
        ts = String(it[0]);
        rawVal = it[1];
      } else {
        ts = String(it ?? "");
        rawVal = undefined;
      }
      const value = Number(rawVal ?? 0) || 0;
      return { ts: String(ts ?? ""), value };
    })
    .filter((p) => !!p.ts);
}

export default function EstatisticasPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q");

  const { data, isLoading, isError } = useLocalStats(q);

  const series = useMemo(() => normalizeSeries(data), [data]);

  const total = useMemo(() => {
    try {
      return (
        data?.data?.summary?.total ??
        data?.summary?.total ??
        series.reduce((s, p) => s + p.value, 0)
      );
    } catch {
      return series.reduce((s, p) => s + p.value, 0);
    }
  }, [data, series]);

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <nav className="text-sm text-gray-500 mb-2">
              <a
                onClick={() => router.push("/")}
                className="cursor-pointer hover:underline"
              >
                Dashboard
              </a>
              <span className="mx-2">/</span>
              <span className="font-medium">Estatísticas</span>
              {q ? (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-gray-700">{q}</span>
                </>
              ) : null}
            </nav>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Estatísticas {q ? `— ${q}` : "da Cidade"}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Visão localizada de indicadores, série temporal e distribuição
              espacial. Use os controles do mapa para filtrar por período e
              status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="hidden sm:inline-flex"
              onClick={() => router.push("/mapas")}
            >
              Ver no Mapa
            </Button>
            <Button
              className="bg-primary-red text-white"
              onClick={() => router.push("/denunciar")}
            >
              Denunciar
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Principais Indicadores</h2>
              <div className="text-sm text-gray-500">
                {data?.data?.meta?.period ?? data?.meta?.period ?? "Período"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Total de Denúncias"
                value={
                  typeof total === "number"
                    ? total.toLocaleString("pt-BR")
                    : "—"
                }
                iconName="bi-flag-fill"
                color="primary-red"
                compact={false}
              />

              <KPICard
                title="Média Diária"
                value={
                  series && series.length
                    ? Math.round(
                        series.reduce((s, p) => s + p.value, 0) / series.length
                      ).toLocaleString("pt-BR")
                    : "—"
                }
                iconName="bi-bar-chart-line"
                color="secondary-red"
              />

              <KPICard
                title="Resolvidas (aprox)"
                value={
                  data?.data?.summary?.resolved ??
                  data?.summary?.resolved ??
                  "—"
                }
                iconName="bi-check-circle-fill"
                color="modern-gray"
              />

              <KPICard
                title="Tempo Médio de Resolução"
                value={
                  data?.data?.summary?.averageResolutionTime ??
                  data?.summary?.averageResolutionTime ??
                  "—"
                }
                iconName="bi-clock-fill"
                color="soft-black"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Série Temporal</h3>
              <div className="text-sm text-gray-500">
                {data?.data?.meta?.period ?? data?.meta?.period ?? "Período"}
              </div>
            </div>

            <div className="h-56">
              {isLoading ? (
                <div className="w-full h-full rounded bg-gray-50 flex items-center justify-center text-gray-400">
                  Carregando série...
                </div>
              ) : isError ? (
                <div className="text-red-600">Erro ao carregar dados</div>
              ) : series && series.length ? (
                <div className="w-full h-full">
                  <Sparkline data={series.map((s) => s.value)} height={56} />
                </div>
              ) : (
                <div className="w-full h-full rounded bg-gray-50 flex items-center justify-center text-gray-400">
                  Sem dados disponíveis
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Top categorias</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                (data?.data?.topCategories as unknown[]) ||
                (data?.topCategories as unknown[]) ||
                []
              ).map((c, idx) => {
                const item = c as Record<string, unknown> | null;
                const name = item?.name ?? item?.category ?? `#${idx + 1}`;
                const count = Number(item?.count ?? item?.value ?? 0) || 0;
                return (
                  <div
                    key={String(name) + idx}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{String(name)}</div>
                      <div className="text-sm text-gray-500">
                        {count.toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 font-semibold">
                      {count.toLocaleString("pt-BR")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">
              Mapa (filtro aplicado)
            </h3>
            <div className="h-72">
              <HeatmapContainer initialZoom={13} height="h-72" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Atividade Recente</h3>
            <ActivityList limit={6} status={1} />
          </div>
        </aside>
      </div>
    </main>
  );
}
