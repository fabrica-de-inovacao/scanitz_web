import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary-red">
            Scanitz
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-modern-gray hover:text-primary-red transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/mapas"
            className="text-modern-gray hover:text-primary-red transition-colors"
          >
            Mapa Interativo
          </Link>
          <Link
            href="/estatisticas"
            className="text-modern-gray hover:text-primary-red transition-colors"
          >
            Estatísticas
          </Link>
          <Link
            href="/denuncias"
            className="text-modern-gray hover:text-primary-red transition-colors"
          >
            Denúncias
          </Link>
        </nav>
        <div className="md:hidden">{/* Mobile Menu Button */}</div>
      </div>
    </header>
  );
};

export default Header;
