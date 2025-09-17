import React, { useState } from "react";
import Image from "next/image";

import {
  useRecentActivities,
  RecentActivity,
} from "@/lib/hooks/useRecentActivities";
import {
  useRelevantActivities,
  RelevantActivity,
} from "@/lib/hooks/useRelevantActivities";

export default function ActivityList({
  limit,
  status,
  city,
}: {
  limit?: number;
  status?: number;
  city?: string;
}) {
  const [mode, setMode] = useState<"recent" | "relevant">("relevant");

  const recentQuery = useRecentActivities({
    limit,
    status,
    city,
    enabled: mode === "recent",
  });
  const relevantQuery = useRelevantActivities({
    limit,
    status,
    city,
    enabled: mode === "relevant",
  });

  const isLoading =
    mode === "recent" ? recentQuery.isLoading : relevantQuery.isLoading;
  const isError =
    mode === "recent" ? recentQuery.isError : relevantQuery.isError;
  const data = mode === "recent" ? recentQuery.data : relevantQuery.data;

  return (
    <div className="bg-white p-3 rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Atividades</h3>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex bg-gray-100 p-1 rounded-full"
            role="tablist"
            aria-label="Modo de ordenação"
          >
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                mode === "relevant"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600"
              }`}
              onClick={() => setMode("relevant")}
              role="tab"
              aria-selected={mode === "relevant"}
            >
              Relevantes
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                mode === "recent"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600"
              }`}
              onClick={() => setMode("recent")}
              role="tab"
              aria-selected={mode === "recent"}
            >
              Recentes
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <ul className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 w-3/4 rounded mb-2" />
                <div className="h-3 bg-gray-200 w-1/4 rounded" />
              </div>
              <div className="w-12 h-3 bg-gray-200 rounded" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="text-sm text-red-600">Erro ao carregar atividades.</div>
      ) : (
        <ul className="space-y-3">
          {(data ?? []).length === 0 && (
            <li className="text-sm text-gray-500">
              Nenhuma atividade disponível.
            </li>
          )}

          {(data ?? []).map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {it.imageUrl ? (
                  <div className="w-12 h-12 rounded overflow-hidden relative">
                    <Image
                      src={it.imageUrl}
                      alt={it.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                    <i className="bi bi-geo-alt-fill" />
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {it.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {it.city || it.district
                      ? `${it.city}${it.city && it.district ? " · " : ""}${
                          it.district
                        }`
                      : "Local não informado"}
                    {" • "}
                    {it.createdAt ? it.timeAgo : "—"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {it.userName ?? ""}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 min-w-[88px]">
                <div className="flex flex-row items-center gap-2">
                  <div>
                    {it.status === 0 && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-800"
                        title="Pendente"
                        aria-label="Pendente"
                      >
                        <i className="bi bi-clock-fill" aria-hidden />
                      </span>
                    )}
                    {it.status === 1 && (
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-800"
                        title="Em Progresso"
                        aria-label="Em Progresso"
                      >
                        <i
                          className="bi bi-arrow-repeat text-orange-600"
                          aria-hidden
                        />
                      </span>
                    )}
                    {it.status === 2 && (
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800"
                        title="Resolvida"
                        aria-label="Resolvida"
                      >
                        <i className="bi bi-check-circle-fill" aria-hidden />
                      </span>
                    )}
                    {it.status === 3 && (
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-700"
                        title="Fechada"
                        aria-label="Fechada"
                      >
                        <i className="bi bi-lock-fill" aria-hidden />
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] text-gray-500">
                    {typeof it.similarCount === "number" &&
                    it.similarCount > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <i
                          className="bi bi-people-fill text-gray-500"
                          aria-hidden
                        />
                        <span className="font-medium">{it.similarCount}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                {mode === "relevant" &&
                  (() => {
                    // narrow type for relevanceScore
                    const candidate = it as RelevantActivity | RecentActivity;
                    const score =
                      typeof (candidate as RelevantActivity).relevanceScore ===
                      "number"
                        ? (candidate as RelevantActivity).relevanceScore
                        : undefined;
                    return score !== undefined ? (
                      <div className="text-xs text-right">
                        <span className="inline-flex items-center gap-2 px-2 py-0.5 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded">
                          <i
                            className="bi bi-star-fill text-indigo-600"
                            aria-hidden
                          />
                          <span className="font-medium">{`${Math.round(
                            score
                          )}`}</span>
                        </span>
                      </div>
                    ) : null;
                  })()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
