"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, BookOpen, Clock, Download } from "lucide-react";

type Faixa = "60" | "150" | "250" | "300+";
type Modalidade = "sem" | "com";

const precosSemDiagramacao: Record<Faixa, number> = {
  "60": 250,
  "150": 300,
  "250": 329.9,
  "300+": 359.9,
};

const precosComDiagramacao: Record<Faixa, number> = {
  "60": 329.9,
  "150": 379.9,
  "250": 429.9,
  "300+": 489.9,
};

const incluidosSem = [
  "ISBN digital",
  "Capa com 2 modelos",
  "Conferência técnica",
  "Ajustes básicos",
  "PDF final",
  "Suporte ao autor",
];

const incluidosCom = [
  "Diagramação profissional",
  "Capa profissional",
  "ISBN digital",
  "PDF final",
];

const faixas: { valor: Faixa; label: string }[] = [
  { valor: "60", label: "Até 60 páginas" },
  { valor: "150", label: "Até 150 páginas" },
  { valor: "250", label: "Até 250 páginas" },
  { valor: "300+", label: "300+ páginas" },
];

const prazos: Record<Modalidade, string> = {
  sem: "5 a 7 dias úteis",
  com: "10 a 15 dias úteis",
};

export default function EbookPage() {
  const [faixa, setFaixa] = useState<Faixa>("60");
  const [modalidade, setModalidade] = useState<Modalidade>("sem");

  const preco = modalidade === "sem"
    ? precosSemDiagramacao[faixa]
    : precosComDiagramacao[faixa];

  const incluidos = modalidade === "sem" ? incluidosSem : incluidosCom;

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Voltar para planos
        </Link>

        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
          <div className="cmyk-stripes h-1.5" />
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pacote Ebook</h1>
            </div>
            <p className="text-[var(--color-text-muted)]">
              Publique seu ebook com ISBN e distribuição digital.
            </p>

            {/* Modalidade */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Modalidade</p>
              <div className="grid grid-cols-2 gap-3">
                {(["sem", "com"] as Modalidade[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setModalidade(m)}
                    className={`px-4 py-3 rounded-[var(--radius-md)] border text-sm font-medium transition-all text-left ${
                      modalidade === m
                        ? "border-cyan-500 bg-cyan-500/5 text-cyan-600"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40"
                    }`}
                  >
                    <span className="font-semibold">{m === "sem" ? "Sem diagramação" : "Com diagramação"}</span>
                    <br />
                    <span className="text-xs opacity-70">
                      {m === "sem" ? "Você envia o arquivo pronto" : "Diagramamos seu conteúdo"}
                    </span>
                  </button>
                ))}
              </div>
              {modalidade === "com" && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] rounded-[var(--radius-sm)] px-3 py-2 border border-[var(--color-border)]">
                  O conteúdo não será alterado, apenas diagramado. Envie o arquivo em Word (.docx).
                </p>
              )}
            </div>

            {/* Faixa de páginas */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Faixa de páginas</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {faixas.map((f) => (
                  <button
                    key={f.valor}
                    onClick={() => setFaixa(f.valor)}
                    className={`px-3 py-2.5 rounded-[var(--radius-md)] border text-xs font-medium transition-all ${
                      faixa === f.valor
                        ? "border-cyan-500 bg-cyan-500/5 text-cyan-600"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preço calculado */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex items-end gap-4 flex-wrap">
              <div>
                <p className="text-3xl font-bold text-gradient-cyan">
                  R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                  Aceitamos Pix ou Cartão em até 5x sem acréscimo
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] ml-auto">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Prazo: {prazos[modalidade]}
              </div>
            </div>

            {/* Inclusos */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">O que está incluído</p>
              <ul className="flex flex-col gap-2">
                {incluidos.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Template */}
            <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <Download className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Template de formatação</p>
                <p className="text-xs text-[var(--color-text-muted)]">Use o modelo para garantir que seu arquivo está no padrão correto</p>
              </div>
              <button className="text-xs font-medium text-cyan-600 hover:text-cyan-500 transition-colors whitespace-nowrap">
                Baixar
              </button>
            </div>

            <Link
              href={`/publicar/ebook/submeter?modalidade=${modalidade}&faixa=${faixa}`}
              className="mt-8 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
            >
              Contratar pacote — R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
