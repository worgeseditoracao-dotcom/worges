"use client";

import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Upload, X, FileText, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AuthGate } from "@/components/AuthGate";

type Adicional = "doi" | "certificado" | "urgencia";

interface Autor {
  nome: string;
  email: string;
  instituicao: string;
}

const PRECO_BASE_NORMAL = 149;
const PRECO_BASE_URGENTE = 190;
const PRECO_DOI = 40;
const PRECO_PAGINA_EXCEDENTE = 7;
const PRECO_AUTOR_EXCEDENTE = 10;
const LIMITE_PAGINAS = 30;
const LIMITE_AUTORES = 10;

function FormularioCapitulo() {
  const searchParams = useSearchParams();
  const paginasParam = parseInt(searchParams.get("paginas") ?? "30", 10);
  const autoresParam = parseInt(searchParams.get("autores") ?? "1", 10);
  const urgenciaParam = searchParams.get("urgencia") === "true";

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [paginas, setPaginas] = useState(paginasParam);
  const [autores, setAutores] = useState<Autor[]>(
    Array.from({ length: Math.min(autoresParam, 5) }, () => ({ nome: "", email: "", instituicao: "" }))
  );
  const [adicionais, setAdicionais] = useState<Set<Adicional>>(
    new Set(urgenciaParam ? (["urgencia"] as Adicional[]) : [])
  );
  const [arquivo, setArquivo] = useState<{ file: File | null; error: string | null }>({ file: null, error: null });
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleAdicional(id: Adicional) {
    setAdicionais((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addAutor() {
    setAutores((prev) => [...prev, { nome: "", email: "", instituicao: "" }]);
  }

  function removeAutor(idx: number) {
    if (autores.length <= 1) return;
    setAutores((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateAutor(idx: number, field: keyof Autor, value: string) {
    setAutores((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  }

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["docx", "doc"].includes(ext)) {
      setArquivo({ file: null, error: "Formato inválido. Use o template .docx da Worges." });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setArquivo({ file: null, error: "Arquivo muito grande. Máximo: 50MB." });
      return;
    }
    setArquivo({ file, error: null });
    toast.success("Arquivo carregado com sucesso.");
  }

  const paginasExcedentes = Math.max(0, paginas - LIMITE_PAGINAS);
  const autoresExcedentes = Math.max(0, autores.length - LIMITE_AUTORES);
  const custoPaginas = paginasExcedentes * PRECO_PAGINA_EXCEDENTE;
  const custoAutores = autoresExcedentes * PRECO_AUTOR_EXCEDENTE;
  const custoDOI = adicionais.has("doi") ? PRECO_DOI : 0;
  const precoBase = adicionais.has("urgencia") ? PRECO_BASE_URGENTE : PRECO_BASE_NORMAL;
  const total = precoBase + custoPaginas + custoAutores + custoDOI;
  const prazo = adicionais.has("urgencia") ? "2 dias úteis" : "7 dias úteis";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { toast.error("Informe o título do capítulo."); return; }
    if (autores.some((a) => !a.nome.trim())) { toast.error("Preencha o nome de todos os autores."); return; }
    if (!arquivo.file) { toast.error("Faça upload do arquivo do capítulo no template."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Capítulo enviado! Redirecionando para o pagamento...");
  }

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/publicar/capitulo"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o pacote
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Submeter capítulo</h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Use o template da Worges e preencha os dados abaixo.
          </p>
        </div>

        <AuthGate>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
            <h2 className="text-base font-bold mb-5">Dados do capítulo</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="titulo" className="text-sm font-medium">
                  Título do capítulo <span className="text-red-500">*</span>
                </label>
                <input
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Inteligência Artificial na Educação Básica"
                  className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="paginas" className="text-sm font-medium">
                  Número de páginas <span className="text-red-500">*</span>
                </label>
                <input
                  id="paginas"
                  type="number"
                  min={1}
                  max={300}
                  value={paginas}
                  onChange={(e) => setPaginas(Math.min(300, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                />
                {paginasExcedentes > 0 && (
                  <p className="text-xs text-[var(--color-warning)] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {paginasExcedentes} página(s) excedente(s) × R$ 7,00 = R$ {custoPaginas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="resumo" className="text-sm font-medium">Resumo</label>
                <textarea
                  id="resumo"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  rows={3}
                  placeholder="Breve resumo do capítulo"
                  className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Autores */}
          <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold">Autores</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {autores.length > LIMITE_AUTORES
                    ? `${autores.length - LIMITE_AUTORES} autor(es) excedente(s) × R$ 10,00`
                    : `Até ${LIMITE_AUTORES} incluídos`}
                </p>
              </div>
              <button
                type="button"
                onClick={addAutor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar autor
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {autores.map((autor, idx) => (
                <div key={idx} className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                      Autor {idx + 1}
                      {idx >= LIMITE_AUTORES && (
                        <span className="ml-2 text-[var(--color-warning)]">(excedente)</span>
                      )}
                    </p>
                    {autores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAutor(idx)}
                        className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={autor.nome}
                      onChange={(e) => updateAutor(idx, "nome", e.target.value)}
                      placeholder="Nome completo *"
                      required
                      className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60"
                    />
                    <input
                      type="email"
                      value={autor.email}
                      onChange={(e) => updateAutor(idx, "email", e.target.value)}
                      placeholder="E-mail"
                      className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60"
                    />
                    <input
                      type="text"
                      value={autor.instituicao}
                      onChange={(e) => updateAutor(idx, "instituicao", e.target.value)}
                      placeholder="Instituição"
                      className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 sm:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
            <h2 className="text-base font-bold mb-1">Arquivo do capítulo</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Obrigatório usar o template da Worges (.docx). Não serão aceitos arquivos fora do padrão.
            </p>

            {arquivo.file ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5">
                <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="text-sm truncate flex-1">{arquivo.file.name}</span>
                <button
                  type="button"
                  onClick={() => { setArquivo({ file: null, error: null }); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed transition-colors ${
                  arquivo.error
                    ? "border-red-400 bg-red-500/5"
                    : "border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-cyan-500/5"
                }`}
              >
                <Upload className="w-6 h-6 text-[var(--color-text-muted)]" />
                <span className="text-sm text-[var(--color-text-muted)]">Clique para selecionar (.docx)</span>
              </button>
            )}
            {arquivo.error && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {arquivo.error}
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".docx,.doc"
              className="hidden"
              onChange={handleArquivo}
            />
          </div>

          {/* Adicionais */}
          <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
            <h2 className="text-base font-bold mb-1">Serviços adicionais</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">Opcionais</p>

            <div className="flex flex-col gap-3">
              {[
                { id: "doi" as Adicional, label: "DOI", desc: "Identificador digital para o capítulo", preco: `+R$ ${PRECO_DOI.toFixed(2).replace(".", ",")}` },
                { id: "certificado" as Adicional, label: "Certificado de participação", desc: "Emitido para todos os autores listados", preco: "Incluído" },
                { id: "urgencia" as Adicional, label: "Urgência", desc: "Prazo de 2 dias úteis em vez de 7", preco: `R$ ${PRECO_BASE_URGENTE.toFixed(2).replace(".", ",")}` },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                    adicionais.has(item.id)
                      ? "border-cyan-500 bg-cyan-500/5"
                      : "border-[var(--color-border)] hover:border-cyan-500/30"
                  }`}
                >
                  <input type="checkbox" checked={adicionais.has(item.id)} onChange={() => toggleAdicional(item.id)} className="hidden" />
                  <div className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 transition-all ${adicionais.has(item.id) ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                    {adicionais.has(item.id) && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap ${adicionais.has(item.id) ? "text-cyan-600" : "text-[var(--color-text-muted)]"}`}>
                    {item.preco}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
            <h2 className="text-base font-bold mb-4">Resumo do pedido</h2>
            <div className="flex flex-col gap-2 text-sm">
              {custoPaginas > 0 && (
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>{paginasExcedentes} pág. excedentes × R$ 7,00</span>
                  <span>R$ {custoPaginas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {custoAutores > 0 && (
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>{autoresExcedentes} aut. excedentes × R$ 10,00</span>
                  <span>R$ {custoAutores.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {adicionais.has("doi") && (
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>DOI</span>
                  <span>R$ {PRECO_DOI.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              {adicionais.has("urgencia") && (
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Base urgente</span>
                  <span>R$ {PRECO_BASE_URGENTE.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              {!adicionais.has("urgencia") && (
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Base normal</span>
                  <span>R$ {PRECO_BASE_NORMAL.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              {total === 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">Dentro dos limites incluídos. O valor será definido conforme a coletânea.</p>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--color-border)] mt-1">
                <span>Total estimado</span>
                <span className="text-gradient-cyan">
                  {total > 0 ? `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "A confirmar"}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-subtle)]">Prazo: {prazo} · Pagamento em até 5x sem acréscimo</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-black transition-all shadow-cyan"
            >
              {loading ? "Enviando..." : (
                <>
                  Enviar capítulo
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          </form>
        </AuthGate>
      </div>
    </section>
  );
}

export default function SubmeterCapituloPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--color-text-muted)]">Carregando...</div>}>
      <FormularioCapitulo />
    </Suspense>
  );
}
