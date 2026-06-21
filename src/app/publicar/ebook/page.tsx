"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, CircleCheck,
  BookMarked, QrCode, Globe,
} from "lucide-react";

const baseFeatures = [
  "ISBN Digital",
  "Ficha Catalográfica",
  "Capa Profissional (2 modelos)",
  "QR Code interativo",
  "Conselho Editorial",
];

const semDiagramacao = {
  title: "E-book sem Diagramação",
  subtitle: "Você envia o arquivo pronto — nós publicamos",
  price: 249.90,
  priceLabel: "R$ 249,90",
  priceNote: "Preço único",
  features: baseFeatures,
};

const comDiagramacao = {
  title: "E-book com Diagramação",
  subtitle: "Diagramação profissional inclusa",
  faixas: [
    { label: "Até 60 páginas", price: 269.90 },
    { label: "Até 150 páginas", price: 329.90 },
    { label: "300 páginas ou mais", price: 349.90 },
  ],
  priceLabel: "a partir de R$ 269,90",
  priceNote: "Varia conforme páginas",
  features: [
    "Diagramação profissional",
    ...baseFeatures,
  ],
};

export default function EbookPage() {
  const [tab, setTab] = useState<"sem" | "com">("com");

  const active = tab === "sem" ? semDiagramacao : comDiagramacao;

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/publicar" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="size-4" />Voltar para planos
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-[var(--radius-md)] gradient-cyan flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">E-book</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Publicação digital profissional</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 mb-8">
          <button
            onClick={() => setTab("com")}
            className={`flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
              tab === "com" ? "bg-cyan-500 text-black shadow-cyan" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Com Diagramação
          </button>
          <button
            onClick={() => setTab("sem")}
            className={`flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all ${
              tab === "sem" ? "bg-cyan-500 text-black shadow-cyan" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Sem Diagramação
          </button>
        </div>

        {/* Card */}
        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 sm:p-8">
          <h2 className="text-xl font-bold">{active.title}</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{active.subtitle}</p>

          <div className="mt-6">
            {tab === "com" && "faixas" in active && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {active.faixas.map((f) => (
                  <div key={f.label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-center">
                    <p className="text-xs text-[var(--color-text-muted)]">{f.label}</p>
                    <p className="text-lg font-bold text-gradient-cyan mt-1">
                      R$ {f.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-3xl font-bold text-gradient-cyan">{active.priceLabel}</p>
            <p className="text-xs text-[var(--color-text-subtle)] mt-1">{active.priceNote}</p>
          </div>

          <div className="mt-5 p-4 rounded-[var(--radius-md)] border border-cyan-500/20 bg-cyan-500/5">
            <p className="text-xs font-medium text-cyan-500 mb-2">INCLUSO</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {active.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <CircleCheck className="w-4 h-4 text-cyan-400 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/publicar/ebook/submeter?tipo=${tab === "sem" ? "sem-diagramacao" : "com-diagramacao"}`}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
          >
            Continuar para submissão <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pagamento */}
        <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Aceitamos <span className="font-medium text-[var(--color-text)]">Pix</span> ou{" "}
            <span className="font-medium text-[var(--color-text)]">Cartão em até 5x sem acréscimo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
