import KPICard from "@/components/ui/KPICard";
import Button from "@/components/ui/Button";
import PlaceholderChart from "@/components/ui/PlaceholderChart";
import ActivityList from "@/components/ui/ActivityList";

export default function Home() {
  // Mock de dados para KPIs (será substituído pelo hook useDashboardKPIs)
  const kpis = [
    {
      title: "Total de Denúncias",
      value: 56,
      iconName: "bi-flag-fill",
      color: "primary-red",
    },
    {
      title: "Resolvidas",
      value: 32,
      iconName: "bi-check-circle-fill",
      color: "secondary-red",
    },
    {
      title: "Pendentes",
      value: 24,
      iconName: "bi-hourglass-split",
      color: "modern-gray",
    },
    {
      title: "Tempo Médio de Resolução",
      value: "2d 4h",
      iconName: "bi-clock-fill",
      color: "soft-black",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-primary-red">
          Painel de Transparência
        </h1>
        <p className="text-modern-gray">
          Dados públicos e indicadores sobre denúncias na cidade.
        </p>
      </header>

      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <KPICard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              iconName={kpi.iconName}
              color={kpi.color}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Visão Geral</h2>
          <div className="space-x-2">
            <Button>Filtrar</Button>
            <Button variant="secondary">Exportar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              {/* placeholder for map or charts */}
              <PlaceholderChart title="Mapa de Incidência" />
            </div>
            <div>
              <PlaceholderChart title="Série Temporal de Denúncias" />
            </div>
          </div>
          <div>
            <ActivityList />
          </div>
        </div>
      </section>
    </main>
  );
}
