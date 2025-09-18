"use client";

import KPICard from "@/components/ui/KPICard";
import Button from "@/components/ui/Button";
import ActivityList from "@/components/ui/ActivityList";
import Carousel from "@/components/ui/Carousel";
import dynamic from "next/dynamic";
import { useDashboardKPIs } from "@/lib/hooks/useComplaints";
import type { NormalizedDashboard } from "@/lib/hooks/useComplaints";

const HeatmapContainer = dynamic(
  () => import("@/components/maps/HeatmapContainer"),
  { ssr: false }
);

export default function DashboardClient() {
  const { data, isLoading, isError } = useDashboardKPIs();

  // prefer normalized KPIs when available (added by the hook)
  const payload = data as unknown as
    | { normalized?: NormalizedDashboard }
    | undefined;
  const normalized = payload?.normalized;

  type KPIItem = {
    title: string;
    value: string | number;
    iconName?: string;
    color?: string;
    delta?: string;
    trend?: "up" | "down" | "stable";
    sublabel?: string;
    lastUpdated?: string | Date;
    progress?: number | null;
  };

  let kpis: KPIItem[] = [];

  const safeGet = (obj: unknown, path: string[]): unknown => {
    let cur: unknown = obj;
    for (const p of path) {
      if (cur == null) return undefined;
      if (typeof cur === "object") {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }
    return cur;
  };

  const formatNumber = (v: unknown) => {
    if (v == null) return "—";
    if (typeof v === "number") return v.toLocaleString("pt-BR");
    if (typeof v === "string" && !isNaN(Number(v)))
      return Number(v).toLocaleString("pt-BR");
    return String(v);
  };

  if (normalized) {
    const c = normalized.kpis.complaints;
    const u = normalized.kpis.users;
    const e = normalized.kpis.engagement;
    const q = normalized.kpis.quality;
    const comp = normalized.comparison ?? ({} as Record<string, unknown>);
    const meta = normalized.meta ?? ({} as Record<string, unknown>);

    kpis = [
      {
        title: "Total de Denúncias",
        value: formatNumber(c.total ?? 0),
        iconName: "bi-flag-fill",
        color: "primary-red",
        delta:
          (safeGet(comp, ["complaints", "change"]) as string | undefined) ??
          `${c.growthRate?.growthRate ?? 0}%`,
        trend: (c.growthRate?.trend as "up" | "down" | "stable") ?? "stable",
        sublabel: (safeGet(meta, ["period"]) as string) ?? "Últimos 30 dias",
        lastUpdated:
          (safeGet(meta, ["generatedAt"]) as string | undefined) ?? undefined,
      },
      {
        title: "Resolvidas",
        value: formatNumber(c.resolved ?? 0),
        iconName: "bi-check-circle-fill",
        color: "secondary-red",
        delta:
          (safeGet(comp, ["resolution", "change"]) as string | undefined) ??
          undefined,
        trend: (c.growthRate?.trend as "up" | "down" | "stable") ?? "stable",
        sublabel: "",
        // use resolution rate as visual progress (0-100)
        progress:
          typeof c.resolutionRate === "number"
            ? Math.round(c.resolutionRate)
            : null,
      },
      {
        title: "Pendentes",
        value: formatNumber(c.pending ?? 0),
        iconName: "bi-hourglass-split",
        color: "modern-gray",
      },
      {
        title: "Tempo Médio de Resolução",
        value:
          c.averageResolutionTime == null
            ? "-"
            : `${c.averageResolutionTime} dias`,
        iconName: "bi-clock-fill",
        color: "soft-black",
      },
      // Users / engagement / quality KPIs
      {
        title: "Usuários Ativos",
        value: formatNumber(u.active ?? 0),
        iconName: "bi-people-fill",
        color: "primary-red",
        sublabel: "Usuários ativos nos últimos 30 dias",
      },
      {
        title: "Novos Usuários",
        value: formatNumber(u.new ?? 0),
        iconName: "bi-person-plus",
        color: "modern-gray",
      },
      {
        title: "Denúncias / Usuário",
        value:
          typeof e.complaintsPerUser === "number"
            ? e.complaintsPerUser.toFixed(2)
            : formatNumber(e.complaintsPerUser ?? "—"),
        iconName: "bi-bar-chart-line",
        color: "soft-black",
      },
      {
        title: "Índice de Completude",
        value: `${Math.round(q.completenessScore ?? 0)}%`,
        iconName: "bi-check2-square",
        color: "secondary-red",
        // visualize completeness as progress
        progress:
          typeof q.completenessScore === "number"
            ? Math.round(q.completenessScore)
            : null,
      },
      {
        title: "Denúncias com Imagens",
        value: formatNumber(q.complaintsWithImages ?? 0),
        iconName: "bi-image-fill",
        color: "modern-gray",
      },
    ];
  } else {
    // fallback to previous raw shape for backward-compatibility
    const kpiData = data?.data?.kpis?.complaints ?? null;
    kpis = kpiData
      ? [
          {
            title: "Total de Denúncias",
            value: kpiData.total ?? 0,
            iconName: "bi-flag-fill",
            color: "primary-red",
          },
          {
            title: "Resolvidas",
            value: kpiData.resolved ?? 0,
            iconName: "bi-check-circle-fill",
            color: "secondary-red",
          },
          {
            title: "Pendentes",
            value: kpiData.pending ?? 0,
            iconName: "bi-hourglass-split",
            color: "modern-gray",
          },
          {
            title: "Tempo Médio de Resolução",
            value: kpiData.averageResolutionTime ?? "-",
            iconName: "bi-clock-fill",
            color: "soft-black",
          },
        ]
      : [
          {
            title: "Total de Denúncias",
            value: "—",
            iconName: "bi-flag-fill",
            color: "primary-red",
          },
          {
            title: "Resolvidas",
            value: "—",
            iconName: "bi-check-circle-fill",
            color: "secondary-red",
          },
          {
            title: "Pendentes",
            value: "—",
            iconName: "bi-hourglass-split",
            color: "modern-gray",
          },
          {
            title: "Tempo Médio de Resolução",
            value: "—",
            iconName: "bi-clock-fill",
            color: "soft-black",
          },
        ];
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
              Painel de Transparência
            </h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Dados públicos e indicadores para monitoramento de denúncias. Use
              as visualizações abaixo para entender padrões espaciais e
              temporais, priorizar ações e acompanhar o atendimento.
            </p>

            <div className="flex items-center gap-3">
              <Button className="hidden sm:inline-flex" aria-label="Filtrar">
                <i className="bi bi-funnel-fill" />
                <span className="ml-2">Filtrar</span>
              </Button>
              <Button
                variant="secondary"
                className="hidden sm:inline-flex"
                aria-label="Exportar"
              >
                <i className="bi bi-file-earmark-arrow-down" />
                <span className="ml-2">Exportar</span>
              </Button>
              <Button className="bg-primary-red text-white">
                <i className="bi bi-plus-circle-fill" />
                <span className="ml-2">Denunciar</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs full-width responsive grid */}
      <section className="mb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-500 mb-3">
              Principais Indicadores
            </div>
            {/* Carousel compact single-line KPIs */}
            {isLoading ? (
              <div>Carregando KPIs...</div>
            ) : isError ? (
              <div className="text-red-600">Erro ao carregar KPIs</div>
            ) : (
              <div>
                <Carousel
                  itemMinWidth={220}
                  autoplay
                  interval={5000}
                  pauseOnHover
                  showControls={false}
                  speedFactor={0.45}
                >
                  {kpis.map((kpi) => (
                    <KPICard
                      key={kpi.title}
                      title={kpi.title}
                      value={kpi.value}
                      iconName={kpi.iconName}
                      color={kpi.color}
                      delta={kpi.delta}
                      trend={kpi.trend}
                      sublabel={kpi.sublabel}
                      lastUpdated={kpi.lastUpdated}
                      progress={kpi.progress ?? null}
                      compact
                    />
                  ))}
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Mapa de Incidência</h3>
              <div className="h-80">
                <HeatmapContainer initialZoom={12} height="h-full" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Série Temporal</h3>
              <div className="h-56">
                {/* Placeholder for chart component - implement when charts available */}
                <div className="w-full h-full rounded bg-gray-50 flex items-center justify-center text-gray-400">
                  Gráfico em construção
                </div>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Atividade Recente</h3>
            <ActivityList limit={6} status={1} />
          </aside>
        </div>
      </section>
    </main>
  );
}
