"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary-red flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-lg font-semibold text-gray-900">Scanitz</span>
          </Link>
          <div className="hidden lg:block">
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-primary-red transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/mapas"
                className="text-sm text-gray-600 hover:text-primary-red transition-colors"
              >
                Mapa
              </Link>
              <Link
                href="/estatisticas"
                className="text-sm text-gray-600 hover:text-primary-red transition-colors"
              >
                Estatísticas
              </Link>
              <Link
                href="/denuncias"
                className="text-sm text-gray-600 hover:text-primary-red transition-colors"
              >
                Denúncias
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
            <i className="bi bi-search mr-2" aria-hidden />
            <input
              aria-label="Pesquisar"
              placeholder="Pesquisar bairro, rua..."
              className="bg-transparent outline-none text-sm"
            />
          </div>

          <Link
            href="/denunciar"
            className="hidden md:inline-block px-4 py-2 bg-primary-red text-white rounded-md text-sm font-semibold hover:opacity-95"
          >
            Denunciar
          </Link>

          {/* Mobile menu button */}
          <button
            aria-label="Abrir menu"
            className="inline-flex items-center justify-center p-2 rounded-md md:hidden text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden border-t bg-white ${open ? "block" : "hidden"}`}
      >
        <div className="px-4 py-3 space-y-2">
          <Link href="/" className="block text-gray-700 py-2 font-medium">
            Dashboard
          </Link>
          <Link href="/mapas" className="block text-gray-700 py-2 font-medium">
            Mapa
          </Link>
          <Link
            href="/estatisticas"
            className="block text-gray-700 py-2 font-medium"
          >
            Estatísticas
          </Link>
          <Link
            href="/denuncias"
            className="block text-gray-700 py-2 font-medium"
          >
            Denúncias
          </Link>
          <Link
            href="/denunciar"
            className="block mt-2 px-3 py-2 bg-primary-red text-white rounded-md text-center font-semibold"
          >
            Denunciar
          </Link>
        </div>
      </div>
    </header>
  );
}
