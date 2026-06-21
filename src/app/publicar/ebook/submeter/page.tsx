"use client";

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Upload, X, FileText, Image, Check, AlertCircle, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { AuthGate } from "@/components/AuthGate";

type Adicional = "doi" | "revisao" | "abnt" | "urgencia" | "kindle";

interface FileState {
  file: File | null;
  error: string | null;
}

const PRECO_DOI = 40;
const PRECO_URGENCIA = 169.9;

const faixasPrecoSem: Record<string, number> = {
  "60": 250, "150": 300, "250": 329.9, "300+": 359.9,
};
const faixasPrecosCom: Record<string, number> = {
  "60": 329.9, "150": 379.9, "250": 429.9, "300+": 489.9,
};

function calcPrecoRevisao(paginas: string): number {
  if (paginas === "60") return 200;
  if (paginas === "150") return 250;
  return 300;
}

function FormularioEbook() {
  const searchParams = useSearchParams();
  const modalidade = (searchParams.get("modalidade") ?? "sem") as "sem" | "com";
  const faixa = searchParams.get("faixa") ?? "60";

  const precoBase = modalidade === "sem"
    ? (faixasPrecoSem[faixa] ?? 250)
    : (faixasPrecosCom[faixa] ?? 350);

  const [titulo, setTitulo] = useState("");
  const [autores, setAutores] = useState("");
  const [resumo, setResumo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [openAccess, setOpenAccess] = useState(false);
  const [adicionais, setAdicionais] = useState<Set<Adicional>>(new Set());
  const [arquivoObra, setArquivoObra] = useState<FileState>({ file: null, error: null });
  const [arquivoCapa, setArquivoCapa] = useState<FileState>({ file: null, error: null });
  const [loading, setLoading] = useState(false);

  const obraRef = useRef<HTMLInputElement>(null);
  const capaRef = useRef<HTMLInputElement>(null);

  function toggleAdicional(id: Adicional) {
    setAdicionais((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleArquivo(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: FileState) => void,
    tiposPermitidos: string[],
    maxMb: number,
    label: string
  ) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!tiposPermitidos.includes(ext)) {
      setter({ file: null, error: `Formato inválido. Aceito: ${tiposPermitidos.join(", ")}` });
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setter({ file: null, error: `Arquivo muito grande. Máximo: ${maxMb}MB` });
      return;
    }
    setter({ file, error: null });
    toast.success(`${label} carregado com sucesso.`);
  }

  const precoRevisao = calcPrecoRevisao(faixa);
  const totalAdicionais =
    (adicionais.has("doi") ? PRECO_DOI : 0) +
    (adicionais.has("revisao") ? precoRevisao : 0) +
    (adicionais.has("abnt") ? precoRevisao : 0) +
    (adicionais.has("urgencia") ? PRECO_URGENCIA : 0);
  const total = precoBase + totalAdicionais;

  const tiposObra = modalidade === "com" ? ["docx", "doc"] : ["pdf", "docx", "doc"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { toast.error("Informe o título da obra."); return; }
    if (!autores.trim()) { toast.error("Informe o(s) autor(es)."); return; }
    if (!arquivoObra.file) { toast.error("Faça upload do arquivo da obra."); return; }
    if (!arquivoCapa.file) { toast.error("Faça upload da capa."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Pedido enviado! Redirecionando para o pagamento...");
  }

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/publicar/ebook?modalidade=${modalidade}&faixa=${faixa}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o pacote
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Submeter obra — Ebook</h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Preencha os dados da sua obra e faça upload dos arquivos.
          </p>
        </div>

        <AuthGate>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Dados da obra */}
            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-5">Dados da obra</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="titulo" className="text-sm font-medium">Título da obra <span className="text-red-500">*</span></label>
                  <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Fundamentos da Pesquisa Qualitativa" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="autores" className="text-sm font-medium">Autor(es) <span className="text-red-500">*</span></label>
                  <input id="autores" type="text" value={autores} onChange={(e) => setAutores(e.target.value)} placeholder="Ex.: Dra. Maria Silva, Prof. João Costa" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="categoria" className="text-sm font-medium">Categoria</label>
                  <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20">
                    <option value="">Selecione uma categoria</option>
                    <option>Acadêmico</option>
                    <option>Literatura</option>
                    <option>Infantil</option>
                    <option>Tecnologia</option>
                    <option>Direito</option>
                    <option>Gestão</option>
                    <option>Saúde</option>
                    <option>Educação</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="resumo" className="text-sm font-medium">Resumo da obra</label>
                  <textarea id="resumo" value={resumo} onChange={(e) => setResumo(e.target.value)} rows={3} placeholder="Breve descrição da obra (será exibida no catálogo)" className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 resize-none" />
                </div>
              </div>
            </div>

            {/* Open Access */}
            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-1">Disponibilidade da obra</h2>
              <label className={`flex items-center gap-4 px-4 py-4 rounded-[var(--radius-md)] border cursor-pointer transition-all mt-4 ${openAccess ? "border-cyan-500 bg-cyan-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"}`}>
                <input type="checkbox" checked={openAccess} onChange={() => setOpenAccess(!openAccess)} className="hidden" />
                <div className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 transition-all ${openAccess ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                  {openAccess && <Check className="w-3 h-3 text-black" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {openAccess ? <Globe className="w-4 h-4 text-cyan-500" /> : <Lock className="w-4 h-4 text-[var(--color-text-muted)]" />}
                    <p className="text-sm font-medium">Disponibilizar obra em Open Access</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 ml-6">
                    Se ativado, o PDF completo da obra será público no catálogo para download gratuito. Você pode alterar essa configuração a qualquer momento.
                  </p>
                </div>
              </label>
            </div>

            {/* Upload de arquivos */}
            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-1">Arquivos</h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-5">
                {modalidade === "com"
                  ? "Envie o arquivo Word (.docx) — o conteúdo não será alterado, apenas diagramado."
                  : "Envie o arquivo já finalizado nos formatos aceitos."}
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">
                  Arquivo da obra <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
                    {tiposObra.join(", ").toUpperCase()} · máx. 100MB
                  </span>
                </p>
                {arquivoObra.file ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5">
                    <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span className="text-sm truncate flex-1">{arquivoObra.file.name}</span>
                    <button type="button" onClick={() => { setArquivoObra({ file: null, error: null }); if (obraRef.current) obraRef.current.value = ""; }} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => obraRef.current?.click()} className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed transition-colors ${arquivoObra.error ? "border-red-400 bg-red-500/5" : "border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-cyan-500/5"}`}>
                    <Upload className="w-6 h-6 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Clique para selecionar o arquivo</span>
                  </button>
                )}
                {arquivoObra.error && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{arquivoObra.error}</p>
                )}
                <input ref={obraRef} type="file" accept={tiposObra.map((t) => `.${t}`).join(",")} className="hidden" onChange={(e) => handleArquivo(e, setArquivoObra, tiposObra, 100, "Arquivo da obra")} />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">
                  Capa <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">JPG, PNG · máx. 10MB</span>
                </p>
                {arquivoCapa.file ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5">
                    <Image className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span className="text-sm truncate flex-1">{arquivoCapa.file.name}</span>
                    <button type="button" onClick={() => { setArquivoCapa({ file: null, error: null }); if (capaRef.current) capaRef.current.value = ""; }} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => capaRef.current?.click()} className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed transition-colors ${arquivoCapa.error ? "border-red-400 bg-red-500/5" : "border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-cyan-500/5"}`}>
                    <Upload className="w-6 h-6 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Clique para selecionar a capa</span>
                  </button>
                )}
                {arquivoCapa.error && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{arquivoCapa.error}</p>
                )}
                <input ref={capaRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => handleArquivo(e, setArquivoCapa, ["jpg", "jpeg", "png"], 10, "Capa")} />
              </div>
            </div>

            {/* Serviços adicionais */}
            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-1">Serviços adicionais</h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-5">Opcionais — adicione o que precisar</p>
              <div className="flex flex-col gap-3">
                {[
                  { id: "doi" as Adicional, label: "DOI", desc: "Identificador digital para sua obra", preco: `+R$ ${PRECO_DOI.toFixed(2).replace(".", ",")}` },
                  { id: "revisao" as Adicional, label: "Revisão ortográfica e gramatical", desc: "Revisão profissional do texto", preco: `+R$ ${precoRevisao.toFixed(2).replace(".", ",")}` },
                  { id: "abnt" as Adicional, label: "Normalização ABNT", desc: "Adequação às normas acadêmicas", preco: `+R$ ${precoRevisao.toFixed(2).replace(".", ",")}` },
                  { id: "urgencia" as Adicional, label: "Urgência", desc: "Prazo reduzido para publicação", preco: `+R$ ${PRECO_URGENCIA.toFixed(2).replace(".", ",")}` },
                  { id: "kindle" as Adicional, label: "Arquivo para Kindle", desc: "Versão compatível com Kindle (+5 dias úteis)", preco: "Incluído" },
                ].map((item) => (
                  <label key={item.id} className={`flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${adicionais.has(item.id) ? "border-cyan-500 bg-cyan-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"}`}>
                    <input type="checkbox" checked={adicionais.has(item.id)} onChange={() => toggleAdicional(item.id)} className="hidden" />
                    <div className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 transition-all ${adicionais.has(item.id) ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                      {adicionais.has(item.id) && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                    </div>
                    <span className={`text-sm font-semibold whitespace-nowrap ${adicionais.has(item.id) ? "text-cyan-600" : "text-[var(--color-text-muted)]"}`}>{item.preco}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resumo e botão */}
            <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
              <h2 className="text-base font-bold mb-4">Resumo do pedido</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Pacote ebook ({modalidade === "sem" ? "sem diagramação" : "com diagramação"})</span>
                  <span>R$ {precoBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                {adicionais.has("doi") && <div className="flex justify-between text-[var(--color-text-muted)]"><span>DOI</span><span>R$ {PRECO_DOI.toFixed(2).replace(".", ",")}</span></div>}
                {adicionais.has("revisao") && <div className="flex justify-between text-[var(--color-text-muted)]"><span>Revisão ortográfica</span><span>R$ {precoRevisao.toFixed(2).replace(".", ",")}</span></div>}
                {adicionais.has("abnt") && <div className="flex justify-between text-[var(--color-text-muted)]"><span>Normalização ABNT</span><span>R$ {precoRevisao.toFixed(2).replace(".", ",")}</span></div>}
                {adicionais.has("urgencia") && <div className="flex justify-between text-[var(--color-text-muted)]"><span>Urgência</span><span>R$ {PRECO_URGENCIA.toFixed(2).replace(".", ",")}</span></div>}
                {openAccess && <div className="flex justify-between text-[var(--color-text-muted)]"><span>Open Access</span><span className="text-cyan-500">Ativado</span></div>}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--color-border)] mt-1">
                  <span>Total</span>
                  <span className="text-gradient-cyan">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-[var(--color-text-subtle)]">Pagamento em até 5x sem acréscimo</p>
              </div>
              <button type="submit" disabled={loading} className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-black transition-all shadow-cyan">
                {loading ? "Enviando pedido..." : (
                  <>Ir para pagamento — R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </AuthGate>
      </div>
    </section>
  );
}

export default function SubmeterEbookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--color-text-muted)]">Carregando...</div>}>
      <FormularioEbook />
    </Suspense>
  );
}
