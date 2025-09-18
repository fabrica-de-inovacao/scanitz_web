"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import client from "@/lib/api/client";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // autocomplete state
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (debRef.current) window.clearTimeout(debRef.current);
    };
  }, []);

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
            <div className="relative">
              <input
                ref={inputRef}
                aria-label="Pesquisar"
                placeholder="Pesquisar bairro, rua..."
                className="bg-transparent outline-none text-sm w-64"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActiveIndex(-1);
                  if (debRef.current) window.clearTimeout(debRef.current);
                  const v = e.target.value;
                  if (!v || v.length < 2) {
                    setSuggestions([]);
                    return;
                  }
                  debRef.current = window.setTimeout(async () => {
                    setLoading(true);
                    try {
                      const res = await client.get("/search/autocomplete", {
                        params: { q: v, type: "all", limit: 8 },
                      });

                      // Normalize different possible payload shapes.
                      // Example payload reported by API:
                      // { success: true, statuscode: 200, data: { items: [{ type, text, value }] } }
                      const body = res.data ?? res;
                      let candidates: unknown[] = [];

                      if (body && typeof body === "object") {
                        const obj = body as Record<string, unknown>;
                        if (obj.data && typeof obj.data === "object") {
                          const d = obj.data as Record<string, unknown>;
                          if (Array.isArray(d.items))
                            candidates = d.items as unknown[];
                        }

                        if (!candidates.length && Array.isArray(obj.items))
                          candidates = obj.items as unknown[];
                        if (
                          !candidates.length &&
                          Array.isArray(obj.suggestions)
                        )
                          candidates = obj.suggestions as unknown[];
                        if (!candidates.length && Array.isArray(body))
                          candidates = body as unknown[];
                      }

                      const normalized = candidates
                        .map((it) => {
                          if (typeof it === "string") return it;
                          if (it && typeof it === "object") {
                            const o = it as Record<string, unknown>;
                            return String(o.value ?? o.text ?? "");
                          }
                          return String(it ?? "");
                        })
                        .filter((s) => typeof s === "string" && s.length > 0);

                      setSuggestions(normalized.slice(0, 8));
                    } catch {
                      setSuggestions([]);
                    } finally {
                      setLoading(false);
                    }
                  }, 220);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    setActiveIndex((i) =>
                      Math.min(i + 1, suggestions.length - 1)
                    );
                  } else if (e.key === "ArrowUp") {
                    setActiveIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") {
                    const pick =
                      activeIndex >= 0 ? suggestions[activeIndex] : q;
                    if (pick) {
                      setQ(pick);
                      setSuggestions([]);
                      setActiveIndex(-1);
                      router.push(
                        `/estatisticas?q=${encodeURIComponent(pick)}`
                      );
                    }
                  }
                }}
              />

              {/* dropdown */}
              {((suggestions && suggestions.length > 0) || loading) && (
                <div className="absolute left-0 mt-1 w-64 bg-white border rounded shadow z-50">
                  {loading ? (
                    <div className="p-2 text-sm text-gray-500">
                      Carregando...
                    </div>
                  ) : (
                    suggestions.map((s, idx) => (
                      <div
                        key={s + idx}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                          idx === activeIndex ? "bg-gray-100" : ""
                        }`}
                        onMouseDown={() => {
                          // use onMouseDown to prevent blur before click
                          // clear suggestions immediately so dropdown hides
                          setQ(String(s));
                          setSuggestions([]);
                          setActiveIndex(-1);
                          router.push(
                            `/estatisticas?q=${encodeURIComponent(String(s))}`
                          );
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        {s}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
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
