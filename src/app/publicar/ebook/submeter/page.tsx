"use client";

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Upload, X, FileText, Check, Globe, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { AuthGate } from "@/components/AuthGate";

type Adicional = "doi" | "revisao" | "kindle";

const PRECO_DOI = 30;
const PRECO_REVISAO = 230;
const PRECO_KINDLE = 89.90;

const faixasPrecoSem: Record<string, number> = {};
const precoSemDiagramacao = 249.90;

const faixasPrecosCom: Record<string, number> = {
  "60": 269.90, "150": 329.90, "300+": 349.90,
};

const servicosAdicionais = [
  { id: "doi" as Adicional, nome: "DOI", desc: "Identificador digital permanente", valor: PRECO_DOI },
  { id: "revisao" as Adicional, nome: "Revisão Ortográfica e Gramatical", desc: "Revisão completa do texto", valor: PRECO_REVISAO },
  { id: "kindle" as Adicional, nome: "Conversão para Kindle (ePub)", desc: "Formato compatível com Amazon", valor: PRECO_KINDLE },
];

function FormularioEbook() {
  const searchParams = useSearchParams();
  const tipo = (searchParams.get("tipo") ?? "com-diagramacao") as string;
  const ehSem = tipo === "sem-diagramacao";
  const faixa = searchParams.get("faixa") ?? "60";

  const precoBase = ehSem
    ? precoSemDiagramacao
    : (faixasPrecosCom[faixa] ?? 269.90);

  const modalidadeLabel = ehSem ? "Sem Diagramação" : "Com Diagramação";

  const [titulo, setTitulo] = useState("");
  const [autores, setAutores] = useState("");
  const [resumo, setResumo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [openAccess, setOpenAccess] = useState(false);
  const [adicionais, setAdicionais] = useState<Set<Adicional>>(new Set());
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [emailContato, setEmailContato] = useState("");

  function toggleAdicional(id: Adicional) {
    setAdicionais((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalAdicionais =
    (adicionais.has("doi") ? PRECO_DOI : 0) +
    (adicionais.has("revisao") ? PRECO_REVISAO : 0) +
    (adicionais.has("kindle") ? PRECO_KINDLE : 0);
  const total = precoBase + totalAdicionais;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { toast.error("Informe o título da obra."); return; }
    if (!autores.trim()) { toast.error("Informe o(s) autor(es)."); return; }
    if (!emailContato.trim()) { toast.error("Informe seu e-mail de contato."); return; }
    if (!whatsapp.trim()) { toast.error("Informe seu WhatsApp."); return; }
    setLoading(true);
    const res = await fetch("/api/submeter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        tipo: "ebook",
        plano: ehSem ? "ebook_sem_diagramacao" : "ebook_com_diagramacao",
        faixa_paginas: ehSem ? null : faixa,
        valor_base: precoBase,
        orcamento_final: total,
        open_access: openAccess,
        servicos: [...adicionais].map((id) => {
          const s = servicosAdicionais.find((x) => x.id === id)!;
          return { nome: s.nome, valor: s.valor };
        }),
        autores,
        resumo,
        categoria: categoria || null,
        modalidade: JSON.stringify({ email: emailContato, whatsapp }),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { toast.error(data.error || "Erro ao enviar"); return; }
    toast.success(`Pedido ${data.codigo} criado! Acompanhe em Minha Conta.`);
    if (typeof window !== "undefined") window.location.href = "/minha-conta";
  }

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/publicar/ebook" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />Voltar para o pacote
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Submeter obra — Ebook</h1>
          <p className="mt-1 text-[var(--color-text-muted)]">{modalidadeLabel} · Preencha os dados da sua obra.</p>
        </div>

        <AuthGate>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-5">Dados da obra</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="titulo" className="text-sm font-medium">Título <span className="text-red-500">*</span></label>
                  <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título da obra" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="autores" className="text-sm font-medium">Autor(es) <span className="text-red-500">*</span></label>
                  <input id="autores" type="text" value={autores} onChange={(e) => setAutores(e.target.value)} placeholder="Ex.: Dra. Maria Silva, Prof. João Costa" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="categoria" className="text-sm font-medium">Categoria</label>
                  <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60">
                    <option value="">Selecione uma categoria</option>
                    <option>Acadêmico</option><option>Literatura</option><option>Infantil</option>
                    <option>Tecnologia</option><option>Direito</option><option>Gestão</option>
                    <option>Saúde</option><option>Educação</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="resumo" className="text-sm font-medium">Resumo</label>
                  <textarea id="resumo" value={resumo} onChange={(e) => setResumo(e.target.value)} rows={3} placeholder="Breve descrição (será exibida no catálogo)" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60 resize-none" />
                </div>
              </div>
            </div>

            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-5">Contato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">E-mail <span className="text-red-500">*</span></label>
                  <input type="email" value={emailContato} onChange={(e) => setEmailContato(e.target.value)} placeholder="seu@email.com" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">WhatsApp <span className="text-red-500">*</span></label>
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
                </div>
              </div>
            </div>

            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-1">Open Access</h2>
              <label className={`flex items-center gap-4 px-4 py-4 rounded-[var(--radius-md)] border cursor-pointer transition-all mt-4 ${openAccess ? "border-cyan-500 bg-cyan-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"}`}>
                <input type="checkbox" checked={openAccess} onChange={() => setOpenAccess(!openAccess)} className="hidden" />
                <div className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 ${openAccess ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                  {openAccess && <Check className="w-3 h-3 text-black" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {openAccess ? <Globe className="w-4 h-4 text-cyan-500" /> : <Lock className="w-4 h-4 text-[var(--color-text-muted)]" />}
                    <p className="text-sm font-medium">Disponibilizar obra em Open Access</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 ml-6">O PDF completo da obra será público no catálogo para download gratuito.</p>
                </div>
              </label>
            </div>

            {!ehSem && (
              <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
                <h2 className="text-base font-bold mb-3">Faixa de páginas</h2>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(faixasPrecosCom).map(([key, price]) => (
                    <button type="button" key={key} onClick={() => window.location.search = `?tipo=${tipo}&faixa=${key}`}
                      className={`p-3 rounded-[var(--radius-md)] border text-sm transition-all ${
                        faixa === key ? "border-cyan-500 bg-cyan-500/10 text-cyan-500" : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/30"
                      }`}>
                      <p className="text-xs">{key === "60" ? "Até 60 pág" : key === "150" ? "Até 150 pág" : "300+ pág"}</p>
                      <p className="font-bold mt-1">R$ {price.toFixed(2).replace(".", ",")}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-3">Serviços adicionais</h2>
              <div className="flex flex-col gap-2">
                {servicosAdicionais.map((s) => (
                  <label key={s.id} className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${adicionais.has(s.id) ? "border-cyan-500 bg-cyan-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"}`}>
                    <input type="checkbox" checked={adicionais.has(s.id)} onChange={() => toggleAdicional(s.id)} className="hidden" />
                    <div className={`w-4 h-4 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 ${adicionais.has(s.id) ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                      {adicionais.has(s.id) && <Check className="size-3 text-black" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.nome}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{s.desc}</p>
                    </div>
                    <p className="text-sm font-bold text-gradient-cyan">R$ {s.valor.toFixed(2).replace(".", ",")}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h3 className="text-sm font-bold mb-3">Resumo do pedido</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Ebook {modalidadeLabel}{!ehSem ? ` (${faixa === "60" ? "até 60" : faixa === "150" ? "até 150" : "300+"} pág)` : ""}</span><span>R$ {precoBase.toFixed(2).replace(".", ",")}</span></div>
                {[...adicionais].map((id) => {
                  const s = servicosAdicionais.find((x) => x.id === id)!;
                  return <div key={id} className="flex justify-between text-[var(--color-text-muted)]"><span>+ {s.nome}</span><span>R$ {s.valor.toFixed(2).replace(".", ",")}</span></div>;
                })}
                <div className="flex justify-between font-bold text-base pt-3 border-t border-[var(--color-border)] mt-1"><span>Total</span><span className="text-gradient-cyan">R$ {total.toFixed(2).replace(".", ",")}</span></div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-3">Aceitamos Pix ou Cartão em até 5x sem acréscimo</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black transition-all shadow-cyan">
              {loading ? <><Loader2 className="size-4 animate-spin inline mr-2" />Enviando pedido...</> : "Enviar pedido"}
            </button>
          </form>
        </AuthGate>
      </div>
    </section>
  );
}

export default function EbookSubmeterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="size-6 animate-spin text-cyan-500" /></div>}>
      <FormularioEbook />
    </Suspense>
  );
}
