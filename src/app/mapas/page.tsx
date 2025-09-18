"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import KPICard from "@/components/ui/KPICard";
import ActivityList from "@/components/ui/ActivityList";
import Button from "@/components/ui/Button";
import Link from "next/link";

const HeatmapContainer = dynamic(
  () => import("@/components/maps/HeatmapContainer"),
  { ssr: false }
);

export default function MapPage() {
  const [period, setPeriod] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  return (
    <main className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="container mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Mapas de Incidência
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Visualize a distribuição espacial de denúncias, filtre por período
              e status, e navegue até áreas de interesse. O mapa inicia no modo
              Pontos para análise de ocorrências individuais.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/estatisticas" className="hidden sm:inline-flex">
              <Button variant="secondary">Ir para Estatísticas</Button>
            </Link>
            <Button className="bg-primary-red text-white">Denunciar</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-700">
                    Filtros
                  </div>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="text-sm px-2 py-1 border rounded bg-white"
                  >
                    <option value="all">Todo o período</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                  </select>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="text-sm px-2 py-1 border rounded bg-white"
                  >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendentes</option>
                    <option value="resolved">Resolvidas</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary">Exportar</Button>
                  <Button className="bg-primary-red text-white">Aplicar</Button>
                </div>
              </div>

              <div className="h-[70vh]">
                {/* Start map at zoom 13 so base visualization is 'markers' (Pontos) */}
                <HeatmapContainer
                  initialZoom={13}
                  height="h-full"
                  showControls
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Resumo rápido</h3>
              <div className="grid grid-cols-1 gap-3">
                <KPICard
                  title="Denúncias (total)"
                  value="—"
                  iconName="bi-flag-fill"
                />
                <KPICard
                  title="Resolvidas"
                  value="—"
                  iconName="bi-check2-square"
                />
                <KPICard
                  title="Média diária"
                  value="—"
                  iconName="bi-bar-chart-line"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Dica: clique em um marcador para ver detalhes.
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Atividade recente</h3>
              <ActivityList limit={6} status={1} />
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Legenda</h3>
              <div className="text-sm text-gray-600">
                Cores representam intensidade. Use o controle do mapa para
                ajustar a visualização.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
