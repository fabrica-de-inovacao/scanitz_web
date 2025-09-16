const Footer = () => {
  return (
    <footer className="bg-soft-black text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Scanitz. Todos os direitos
          reservados.
        </p>
        <p className="text-sm text-modern-gray mt-2">
          Plataforma de transparência para a cidade de Imperatriz-MA.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
