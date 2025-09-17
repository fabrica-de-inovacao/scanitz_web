import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ReactQueryProvider from "../components/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scanitz - Painel de Transparência",
  description:
    "Plataforma de denúncias urbanas para a cidade de Imperatriz-MA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning={true} className={inter.className}>
        <ReactQueryProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
