import DenunciaCard from "@/components/features/DenunciaCard";

import type { Denuncia } from "@/components/features/DenunciaCard";
import React from "react";

export default function DenunciasList({
  items = [],
  loading = false,
}: {
  items?: Denuncia[];
  loading?: boolean;
}) {
  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg p-4 h-36" />
        ))}
      </div>
    );

  if ((items ?? []).length === 0)
    return (
      <div className="text-sm text-gray-500">Nenhuma denúncia encontrada.</div>
    );

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(items ?? []).map((denuncia) => (
          <DenunciaCard key={denuncia.id} denuncia={denuncia} />
        ))}
      </div>
    </section>
  );
}
