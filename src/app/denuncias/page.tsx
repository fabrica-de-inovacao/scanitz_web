import DenunciasList from "@/components/features/DenunciasList";

export default function DenunciasPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Denúncias Públicas
      </h1>
      <DenunciasList />
    </main>
  );
}
