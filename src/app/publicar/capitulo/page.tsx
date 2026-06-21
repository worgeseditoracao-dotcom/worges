"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Layers, Clock, Download, Plus, Minus, AlertCircle } from "lucide-react";

const LIMITE_PAGINAS = 30;
const LIMITE_AUTORES = 10;
const PRECO_PAGINA_EXCEDENTE = 7;
const PRECO_AUTOR_EXCEDENTE = 10;
const PRECO_BASE_NORMAL = 149;
const PRECO_BASE_URGENTE = 190;

const regras = [
  "Até 30 páginas incluídas (R$ 7,00 por página excedente)",
  "Até 10 autores incluídos (R$ 10,00 por autor excedente)",
  "Arquivo obrigatório no template da Worges (disponível para download)",
  "Prazo normal: 7 dias úteis",
  "Prazo com urgência: 2 dias úteis",
];

export default function CapituloPage() {
  const [paginas, setPaginas] = useState(30);
  const [autores, setAutores] = useState(1);
  const [urgencia, setUrgencia] = useState(false);

  const paginasExcedentes = Math.max(0, paginas - LIMITE_PAGINAS);
  const autoresExcedentes = Math.max(0, autores - LIMITE_AUTORES);
  const custoExcedentePaginas = paginasExcedentes * PRECO_PAGINA_EXCEDENTE;
  const custoExcedenteAutores = autoresExcedentes * PRECO_AUTOR_EXCEDENTE;
  const precoBase = urgencia ? PRECO_BASE_URGENTE : PRECO_BASE_NORMAL;
  const total = precoBase + custoExcedentePaginas + custoExcedenteAutores;

  const prazo = urgencia ? "2 dias úteis" : "7 dias úteis";

  function ajustar(setter: (v: number) => void, valor: number, min: number, max: number) {
    setter(Math.min(max, Math.max(min, valor)));
  }

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
                <Layers className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Capítulo em Coletânea</h1>
            </div>
            <p className="text-[var(--color-text-muted)]">
              Publique seu capítulo em uma obra coletiva com ISBN, DOI e carta de aceite.
            </p>

            {/* Info Banner */}
            <div className="mt-6 rounded-[var(--radius-lg)] border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-sm font-medium text-[var(--color-text)]">
                Até 30 páginas &nbsp;|&nbsp; Até 10 autores &nbsp;|&nbsp; Template obrigatório
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                R$ 7,00/página excedente &nbsp;|&nbsp; R$ 10,00/autor excedente
              </p>
            </div>

            {/* Regras */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Regras editoriais</p>
              <ul className="flex flex-col gap-2">
                {regras.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculadora */}
            <div className="mt-8 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-5">Calcule o valor do seu capítulo</p>

              {/* Páginas */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Número de páginas</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {paginasExcedentes > 0
                      ? `${paginasExcedentes} pág. excedentes × R$ 7,00 = R$ ${custoExcedentePaginas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : `Dentro do limite (até ${LIMITE_PAGINAS} pág.)`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => ajustar(setPaginas, paginas - 1, 1, 300)}
                    className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums">{paginas}</span>
                  <button
                    onClick={() => ajustar(setPaginas, paginas + 1, 1, 300)}
                    className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Autores */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Número de autores</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {autoresExcedentes > 0
                      ? `${autoresExcedentes} aut. excedentes × R$ 10,00 = R$ ${custoExcedenteAutores.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : `Dentro do limite (até ${LIMITE_AUTORES} aut.)`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => ajustar(setAutores, autores - 1, 1, 30)}
                    className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums">{autores}</span>
                  <button
                    onClick={() => ajustar(setAutores, autores + 1, 1, 30)}
                    className="w-8 h-8 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Urgência */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
                <div>
                  <p className="text-sm font-medium">Urgência</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Prazo de 2 dias úteis (R$ 190,00)</p>
                </div>
                <button
                  onClick={() => setUrgencia(!urgencia)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    urgencia ? "bg-cyan-500" : "bg-[var(--color-border)]"
                  }`}
                  aria-pressed={urgencia}
                  aria-label="Ativar urgência"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      urgencia ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Resumo de preço */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Base {urgencia ? "urgente" : "normal"}</p>
                  <p className="text-3xl font-bold text-gradient-cyan">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-1 space-y-0.5 text-xs text-[var(--color-text-subtle)]">
                    <p>Base: R$ {precoBase.toFixed(2).replace(".", ",")}</p>
                    {paginasExcedentes > 0 && <p>{paginasExcedentes} pág. excedentes × R$ 7,00 = R$ {custoExcedentePaginas.toFixed(2).replace(".", ",")}</p>}
                    {autoresExcedentes > 0 && <p>{autoresExcedentes} aut. excedentes × R$ 10,00 = R$ {custoExcedenteAutores.toFixed(2).replace(".", ",")}</p>}
                  </div>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-2">
                    Aceitamos Pix ou Cartão em até 5x sem acréscimo
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Prazo: {prazo}
                </div>
              </div>

              {(paginasExcedentes > 0 || autoresExcedentes > 0) && (
                <div className="mt-4 flex items-start gap-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5 border border-[var(--color-border)]">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--color-warning)] mt-0.5 shrink-0" />
                  <span>O valor final pode variar conforme conferência editorial do arquivo enviado.</span>
                </div>
              )}
            </div>

            {/* Template */}
            <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <Download className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Template obrigatório para capítulo</p>
                <p className="text-xs text-[var(--color-text-muted)]">Baixe e use o modelo antes de enviar o arquivo</p>
              </div>
              <button className="text-xs font-medium text-cyan-600 hover:text-cyan-500 transition-colors whitespace-nowrap">
                Baixar
              </button>
            </div>

            <Link
              href={`/publicar/capitulo/submeter?paginas=${paginas}&autores=${autores}&urgencia=${urgencia}`}
              className="mt-8 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
            >
              Submeter capítulo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Pagamento */}
        <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Aceitamos <span className="font-medium text-[var(--color-text)]">Pix</span> ou{" "}
            <span className="font-medium text-[var(--color-text)]">Cartão em até 5x sem acréscimo</span>
          </p>
        </div>
      </div>
    </section>
  );
}
