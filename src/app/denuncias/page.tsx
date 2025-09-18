"use client";

import React, { useMemo, useState } from "react";
import DenunciasList from "@/components/features/DenunciasList";
import Button from "@/components/ui/Button";
import KPICard from "@/components/ui/KPICard";

import type { Denuncia } from "@/components/features/DenunciaCard";

const SAMPLE: Denuncia[] = [
  {
    id: 1,
    titulo: "Buraco na Rua A",
    descricao: "Buraco grande próximo ao cruzamento.",
    status: "pendente",
    bairro: "Centro",
    data: "2025-09-10",
  },
  {
    id: 2,
    titulo: "Lixo acumulado",
    descricao: "Lixo não recolhido há 3 dias.",
    status: "resolvida",
    bairro: "Nova Imperatriz",
    data: "2025-09-12",
  },
  {
    id: 3,
    titulo: "Iluminação pública apagada",
    descricao: "Poste sem luz na esquina.",
    status: "em andamento",
    bairro: "Bacuri",
    data: "2025-09-14",
  },
  // ... more sample entries can be added here
];

export default function DenunciasPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [bairro, setBairro] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // in a real app replace SAMPLE with real API data via a hook
  const data = SAMPLE;

  const filtered = useMemo(() => {
    return data
      .filter((d) =>
        query
          ? `${d.titulo} ${d.descricao}`
              .toLowerCase()
              .includes(query.toLowerCase())
          : true
      )
      .filter((d) => (status === "all" ? true : d.status === status))
      .filter((d) => (bairro === "all" ? true : d.bairro === bairro));
  }, [data, query, status, bairro]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  function exportCsv(items: Denuncia[]) {
    const header = ["id", "titulo", "descricao", "status", "bairro", "data"];
    const rows = items.map((r) => [
      r.id,
      r.titulo,
      r.descricao,
      r.status,
      r.bairro,
      r.data,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `denuncias_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // collect unique bairros for filter
  const bairros = useMemo(() => {
    const s = new Set<string>();
    data.forEach((d) => s.add(d.bairro));
    return Array.from(s).sort();
  }, [data]);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Denúncias Públicas
            </h1>
            <div className="text-sm text-gray-600">
              Últimas ocorrências e status
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => exportCsv(filtered)}>
              Exportar CSV
            </Button>
            <Button>Nova Denúncia</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 bg-white rounded-xl shadow p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Buscar
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Título ou descrição"
                className="mt-1 block w-full rounded border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="em andamento">Em andamento</option>
                <option value="resolvida">Resolvida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                {bairros.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="text-sm font-medium">Resumo</h4>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <KPICard title="Total" value={`${filtered.length}`} />
                <KPICard
                  title="Pendente"
                  value={`${
                    filtered.filter((d) => d.status === "pendente").length
                  }`}
                />
                <KPICard
                  title="Resolvida"
                  value={`${
                    filtered.filter((d) => d.status === "resolvida").length
                  }`}
                />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3 bg-white rounded-xl shadow p-6">
            <DenunciasList items={pageItems} loading={false} />

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {pageItems.length} de {filtered.length} denúncias
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  Anterior
                </Button>
                <div className="text-sm">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
