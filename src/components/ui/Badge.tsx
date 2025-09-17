interface BadgeProps {
  status: "pendente" | "resolvida" | "em andamento";
}

const statusMap = {
  pendente: {
    label: "Pendente",
    color: "bg-red-500 text-white",
  },
  resolvida: {
    label: "Resolvida",
    color: "bg-green-500 text-white",
  },
  "em andamento": {
    label: "Em andamento",
    color: "bg-yellow-400 text-gray-900",
  },
};

export default function Badge({ status }: BadgeProps) {
  const { label, color } = statusMap[status];
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
      {label}
    </span>
  );
}
