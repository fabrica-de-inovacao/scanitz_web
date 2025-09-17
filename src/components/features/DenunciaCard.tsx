import Badge from "@/components/ui/Badge";

export interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  status: "pendente" | "resolvida" | "em andamento";
  bairro: string;
  data: string;
}

interface Props {
  denuncia: Denuncia;
}

export default function DenunciaCard({ denuncia }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-gray-900">
          {denuncia.titulo}
        </h2>
        <Badge status={denuncia.status} />
      </div>
      <p className="text-gray-500 text-sm">{denuncia.descricao}</p>
      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span>Bairro: {denuncia.bairro}</span>
        <span>{denuncia.data}</span>
      </div>
    </div>
  );
}
