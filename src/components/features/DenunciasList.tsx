import DenunciaCard from "@/components/features/DenunciaCard";

import type { Denuncia } from "@/components/features/DenunciaCard";

const denuncias: Denuncia[] = [
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
];

export default function DenunciasList() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {denuncias.map((denuncia) => (
          <DenunciaCard key={denuncia.id} denuncia={denuncia} />
        ))}
      </div>
    </section>
  );
}
