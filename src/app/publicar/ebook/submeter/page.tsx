"use client";

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Upload, X, FileText, Check, Globe, Lock, Loader2, File, Image } from "lucide-react";
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
  const faixaParam = searchParams.get("faixa") ?? "60";

  const [faixa, setFaixa] = useState(faixaParam);

  const precoBase = ehSem
    ? precoSemDiagramacao
    : (faixasPrecosCom[faixa] ?? 269.90);

  function calcularFaixa(pag: number): string {
    if (pag <= 60) return "60";
    if (pag <= 150) return "150";
    return "300+";
  }

  function getFaixaLabel(f: string): string {
    const labels: Record<string, string> = { "60": "Até 60 pág", "150": "Até 150 pág", "300+": "300+ pág" };
    return labels[f] || f;
  }

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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [paginas, setPaginas] = useState<number | null>(null);
  const [contandoPaginas, setContandoPaginas] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const wordRef = useRef<HTMLInputElement>(null);
  const capaRef = useRef<HTMLInputElement>(null);

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Apenas arquivos PDF."); return; }
    setPdfFile(file);
    setContandoPaginas(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/contar-paginas", { method: "POST", body: fd });
    const data = await res.json();
    setContandoPaginas(false);
    if (res.ok) {
      setPaginas(data.paginas);
      const novaFaixa = calcularFaixa(data.paginas);
      setFaixa(novaFaixa);
      toast.success(`${data.paginas} páginas detectadas — faixa: ${getFaixaLabel(novaFaixa)}`);
    } else {
      toast.error("Erro ao contar páginas");
    }
  }

  function handleWordUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".doc") && !file.name.endsWith(".docx")) { toast.error("Apenas arquivos Word (.doc/.docx)."); return; }
    setWordFile(file);
  }

  function handleCapaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["png", "jpg", "jpeg", "pdf"].includes(ext || "")) { toast.error("Formatos aceitos: PNG, JPG, PDF."); return; }
    setCapaFile(file);
  }

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
    if (!pdfFile) { toast.error("Anexe o arquivo PDF da obra."); return; }
    if (!ehSem && !wordFile) { toast.error("Anexe o arquivo Word (.docx) da obra."); return; }
    if (!paginas) { toast.error("Aguardando contagem de páginas..."); return; }
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
        paginas: paginas,
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
                    <option>Acadêmico / Científico</option><option>Administração e Negócios</option><option>Arquitetura e Urbanismo</option>
                    <option>Artes</option><option>Autoajuda</option><option>Biografia / Memórias</option>
                    <option>Ciências Biológicas</option><option>Ciências Exatas</option><option>Ciências Sociais</option>
                    <option>Contabilidade e Finanças</option><option>Direito</option><option>Economia</option>
                    <option>Educação e Pedagogia</option><option>Engenharias</option><option>Esoterismo e Espiritualidade</option>
                    <option>Esportes e Lazer</option><option>Filosofia</option><option>Gastronomia e Culinária</option>
                    <option>Geografia e História</option><option>Infantil e Infanto-juvenil</option><option>Informática e Tecnologia</option>
                    <option>Letras e Linguística</option><option>Literatura (Ficção, Poesia, Romance)</option><option>Marketing e Comunicação</option>
                    <option>Medicina e Saúde</option><option>Meio Ambiente e Sustentabilidade</option><option>Política e Relações Internacionais</option>
                    <option>Psicologia</option><option>Religião e Teologia</option><option>Turismo e Hotelaria</option>
                    <option>Outros</option>
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

            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-1">Arquivos da obra</h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-5">
                {ehSem
                  ? "Envie o PDF da obra finalizada para contagem de páginas."
                  : "Envie o PDF + Word (.docx) — o Word é obrigatório para diagramação."}
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Arquivo PDF <span className="text-red-500">*</span></p>
                {pdfFile ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5">
                    <FileText className="size-4 text-cyan-500 shrink-0" />
                    <span className="text-sm truncate flex-1">{pdfFile.name}</span>
                    {contandoPaginas ? <Loader2 className="size-4 animate-spin text-cyan-500" /> : paginas ? <span className="text-xs font-medium text-cyan-500">{paginas} pág.</span> : null}
                    <button type="button" onClick={() => { setPdfFile(null); setPaginas(null); if (pdfRef.current) pdfRef.current.value = ""; }} className="text-[var(--color-text-muted)] hover:text-red-500"><X className="size-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => pdfRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-colors">
                    <Upload className="size-6 text-[var(--color-text-muted)]" /><span className="text-sm text-[var(--color-text-muted)]">Clique para enviar o PDF</span>
                  </button>
                )}
                <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
              </div>
              {!ehSem && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Arquivo Word (.docx) <span className="text-red-500">*</span></p>
                  {wordFile ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5">
                      <File className="size-4 text-blue-500 shrink-0" /><span className="text-sm truncate flex-1">{wordFile.name}</span>
                      <button type="button" onClick={() => { setWordFile(null); if (wordRef.current) wordRef.current.value = ""; }} className="text-[var(--color-text-muted)] hover:text-red-500"><X className="size-4" /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => wordRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-colors">
                      <Upload className="size-6 text-[var(--color-text-muted)]" /><span className="text-sm text-[var(--color-text-muted)]">Clique para enviar o Word</span>
                    </button>
                  )}
                  <input ref={wordRef} type="file" accept=".doc,.docx" className="hidden" onChange={handleWordUpload} />
                </div>
              )}
              <div>
                <p className="text-sm font-medium mb-2">Capa (PNG, JPG ou PDF)</p>
                {capaFile ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-purple-500/30 bg-purple-500/5">
                    <Image className="size-4 text-purple-500 shrink-0" /><span className="text-sm truncate flex-1">{capaFile.name}</span>
                    <button type="button" onClick={() => { setCapaFile(null); if (capaRef.current) capaRef.current.value = ""; }} className="text-[var(--color-text-muted)] hover:text-red-500"><X className="size-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => capaRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors">
                    <Image className="size-6 text-[var(--color-text-muted)]" /><span className="text-sm text-[var(--color-text-muted)]">Clique para enviar a capa (opcional)</span>
                  </button>
                )}
                <input ref={capaRef} type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={handleCapaUpload} />
              </div>
            </div>

            {!ehSem && (
              <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
                <h2 className="text-base font-bold mb-1">Faixa de páginas</h2>
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  {paginas
                    ? `${paginas} páginas detectadas — faixa selecionada automaticamente.`
                    : "Selecione manualmente ou anexe o PDF para detecção automática."}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(faixasPrecosCom).map(([key, price]) => (
                    <button type="button" key={key} onClick={() => setFaixa(key)}
                      className={`p-3 rounded-[var(--radius-md)] border text-sm transition-all ${
                        faixa === key ? "border-cyan-500 bg-cyan-500/10 text-cyan-500" : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/30"
                      }`}>
                      <p className="text-xs">{getFaixaLabel(key)}</p>
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
                {paginas && <div className="flex justify-between text-[var(--color-text-muted)]"><span>Páginas detectadas</span><span>{paginas} pág.</span></div>}
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
              {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin" />Enviando pedido...</span> : "Enviar pedido"}
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
