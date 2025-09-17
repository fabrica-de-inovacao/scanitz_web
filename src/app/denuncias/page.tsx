import DenunciasList from "@/components/features/DenunciasList";

export default function DenunciasPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Denúncias Públicas
          </h1>
          <div className="text-sm text-gray-600">
            Últimas ocorrências e status
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <DenunciasList />
        </div>
      </div>
    </main>
  );
}
