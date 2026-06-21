import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/components/StoreProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worges — Plataforma Editorial",
  description: "Plataforma editorial para publicação e comercialização de obras autorais, acadêmicas e coletâneas.",
  keywords: ["publicação", "ebook", "ISBN", "DOI", "diagramação", "coletânea", "livro acadêmico", "publicação digital"],
  openGraph: {
    title: "Worges — Plataforma Editorial",
    description: "Publique seu ebook, livro ou capítulo de coletânea com suporte editorial completo.",
    siteName: "Worges",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
              },
              success: {
                iconTheme: { primary: "#00bce5", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#d93636", secondary: "#fff" },
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
