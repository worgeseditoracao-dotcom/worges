"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, FileText, User, Mail, DollarSign, Clock, Download,
  CircleCheck, CircleAlert, AlertCircle, Check, X, ExternalLink, Edit3,
  History, Upload, Globe, Lock, Printer, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

interface Arquivo {
  nome: string;
  tipo: string;
  uploaded_at: string;
  url: string;
}

interface Servico {
  nome: string;
  valor: number;
}

interface Etapa {
  id: string;
  label: string;
  descricao: string;
  concluida: boolean;
  atual: boolean;
  data: string | null;
  ordem: number;
}

interface Mudanca {
  id: string;
  acao: string;
  descricao: string;
  usuario: string;
  created_at: string;
}

interface PerfilAutor {
  nome: string;
  email: string;
}

interface PedidoData {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  plano: string;
  modalidade: string | null;
  faixa_paginas: string | null;
  valor_base: number;
  orcamento_final: number;
  open_access: boolean;
  status: string;
  data_criacao: string;
  pedido_servicos: Servico[];
  pedido_arquivos: Arquivo[];
  pedido_etapas: Etapa[];
  pedido_mudancas: Mudanca[];
  perfil?: PerfilAutor;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function etapaLabel(key: string): string {
  const labels: Record<string, string> = {
    pedido_criado: "Pedido criado",
    pagamento: "Pagamento",
    em_analise: "Em análise",
    diagramacao: "Diagramação",
    revisao: "Revisão",
    ajustes_solicitados: "Ajustes solicitados",
    aprovado: "Aprovado",
    em_producao: "Em produção",
    publicado: "Publicado",
    cancelado: "Cancelado",
  };
  return labels[key] || key;
}

const etapaOrdem = [
  "pedido_criado", "pagamento", "em_analise", "diagramacao",
  "revisao", "ajustes_solicitados", "aprovado", "em_producao", "publicado"
];

function PedidoDetail() {
  const params = useParams();
  const id = params.id as string;
  const [pedido, setPedido] = useState<PedidoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [mudancas, setMudancas] = useState<Mudanca[]>([]);
  const [publicando, setPublicando] = useState(false);
  const [editandoPagina, setEditandoPagina] = useState(false);
  const [obraExistente, setObraExistente] = useState<{ id: string; slug: string; publicado: boolean } | null>(null);

  useEffect(() => {
    fetch(`/api/pedidos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        const p = data.pedido;
        setPedido(p);
        setEtapas((p.pedido_etapas ?? []).sort((a: Etapa, b: Etapa) => a.ordem - b.ordem));
        setMudancas(p.pedido_mudancas ?? []);
        const obra = (p.obras ?? [])[0];
        if (obra) {
          setObraExistente({ id: obra.id, slug: obra.slug, publicado: obra.publicado });
        }
      })
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [id]);

  async function avancarEtapa(label: string) {
    try {
      const res = await fetch("/api/etapas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedido_id: id, label, descricao: `Etapa "${label}" concluída pelo administrador.` }),
      });
      if (!res.ok) throw new Error("Erro");
      toast.success(`Etapa "${label}" concluída.`);
      // Recarregar dados
      const refresh = await fetch(`/api/pedidos/${id}`);
      const data = await refresh.json();
      const p = data.pedido;
      setPedido(p);
      setEtapas((p.pedido_etapas ?? []).sort((a: Etapa, b: Etapa) => a.ordem - b.ordem));
      setMudancas(p.pedido_mudancas ?? []);
    } catch {
      toast.error("Erro ao avançar etapa");
    }
  }

  async function criarPerfilObra() {
    setPublicando(true);
    try {
      const slugBase = pedido!.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const slug = `${slugBase}-${Date.now().toString(36)}`;
      const res = await fetch("/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: pedido!.titulo,
          slug,
          autores: pedido!.perfil?.nome ?? "Autor",
          resumo: "",
          categoria: "Acadêmico",
          open_access: pedido!.open_access,
          publicado: false,
          pedido_id: id,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar perfil");
      const json = await res.json();
      setObraExistente({ id: json.obra.id, slug: json.obra.slug, publicado: json.obra.publicado });
      toast.success("Perfil da obra criado! Agora ele só é visível para o autor e administradores.");
    } catch {
      toast.error("Erro ao criar perfil da obra");
    } finally {
      setPublicando(false);
    }
  }

  function solicitarAjustes() {
    avancarEtapa("ajustes_solicitados");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!pedido) return null;

  const servicos = pedido.pedido_servicos ?? [];
  const arquivos = pedido.pedido_arquivos ?? [];

  const tipoLabel: Record<string, string> = {
    ebook: "Ebook", capitulo: "Capítulo", impressao: "Ebook + Impressão",
  };

  return (
    <div className="animate-fade-in mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-cyan-400 hover:border-cyan-500/40 transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{pedido.codigo}</h1>
              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${pedido.status === "publicado" || pedido.status === "aprovado" ? "var(--color-success)" : pedido.status === "ajustes_solicitados" || pedido.status === "cancelado" ? "var(--color-error)" : "var(--color-warning)"}1a`,
                  color: pedido.status === "publicado" || pedido.status === "aprovado" ? "var(--color-success)" : pedido.status === "ajustes_solicitados" || pedido.status === "cancelado" ? "var(--color-error)" : "var(--color-warning)"
                }}>
                {etapaLabel(pedido.status)}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{pedido.titulo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditandoPagina(!editandoPagina)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
            <Edit3 className="size-3.5" />{editandoPagina ? "Fechar editor" : "Editar página"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><User className="size-4 text-cyan-500" />Informações</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-[var(--color-text-muted)]">Obra</dt><dd className="font-medium">{pedido.titulo}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Autor</dt><dd className="font-medium">{pedido.perfil?.nome ?? "—"}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">E-mail</dt><dd className="font-medium">{pedido.perfil?.email ?? "—"}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Tipo</dt><dd className="font-medium">{tipoLabel[pedido.tipo] || pedido.tipo}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Plano</dt><dd className="font-medium">{pedido.plano}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Modalidade</dt><dd className="font-medium">{pedido.modalidade ?? "—"}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Faixa de páginas</dt><dd className="font-medium">{pedido.faixa_paginas ?? "—"}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Data do pedido</dt><dd className="font-medium">{formatDate(pedido.data_criacao)}</dd></div>
              <div><dt className="text-xs text-[var(--color-text-muted)]">Acesso</dt><dd className="font-medium flex items-center gap-1">{pedido.open_access ? <><Globe className="size-3.5 text-green-500" /> Open Access</> : <><Lock className="size-3.5 text-[var(--color-text-muted)]" /> Restrito</>}</dd></div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><DollarSign className="size-4 text-cyan-500" />Orçamento final</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Valor base ({pedido.plano})</span>
                <span>R$ {(pedido.valor_base ?? 0).toFixed(2).replace(".", ",")}</span>
              </div>
              {servicos.map((s) => (
                <div key={s.nome} className="flex justify-between text-[var(--color-text-muted)]">
                  <span>{s.nome}</span>
                  <span>R$ {(s.valor ?? 0).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--color-border)] mt-1">
                <span>Total</span>
                <span className="text-gradient-cyan">R$ {(pedido.orcamento_final ?? 0).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><FileText className="size-4 text-cyan-500" />Arquivos</h2>
            <div className="flex flex-col gap-2">
              {arquivos.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)] py-2">Nenhum arquivo enviado.</p>
              )}
              {arquivos.map((arq) => (
                <div key={arq.nome} className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                  {arq.tipo === "word" && <FileText className="size-4 text-blue-500 shrink-0" />}
                  {arq.tipo === "pdf" && <FileText className="size-4 text-red-500 shrink-0" />}
                  {arq.tipo === "capa" && <FileText className="size-4 text-purple-500 shrink-0" />}
                  {arq.tipo === "impressao" && <Printer className="size-4 text-green-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{arq.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(arq.uploaded_at)}</p>
                  </div>
                  <a href={arq.url} className="text-cyan-600 hover:text-cyan-500 shrink-0" download><Download className="size-4" /></a>
                </div>
              ))}
              <button className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
                <Upload className="size-3.5" />Adicionar arquivo
              </button>
            </div>
          </div>

          {/* Editor de página */}
          {editandoPagina && (
            <div className="rounded-[var(--radius-lg)] border border-cyan-500/30 bg-cyan-500/5 p-5">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><ExternalLink className="size-4 text-cyan-500" />Editor da página da obra</h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium">Descrição / Resumo</label>
                  <textarea rows={3} className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60 resize-none" placeholder="Resumo da obra..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Open Access</label>
                    <select defaultValue={pedido.open_access ? "sim" : "nao"} className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60">
                      <option value="sim">Ativado</option>
                      <option value="nao">Desativado</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Categoria</label>
                    <select className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60">
                      <option>Acadêmico</option><option>Literatura</option><option>Infantil</option>
                      <option>Tecnologia</option><option>Direito</option><option>Gestão</option>
                      <option>Saúde</option><option>Educação</option>
                    </select>
                  </div>
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all">
                  <Check className="size-4" />Salvar alterações
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-bold mb-5 flex items-center gap-2"><History className="size-4 text-cyan-500" />Acompanhamento editorial</h2>
            <div className="relative">
              {etapas.map((etapa, i) => (
                <div key={etapa.id || etapa.label} className="flex gap-3 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      etapa.concluida ? "border-green-500 bg-green-500" :
                      etapa.atual ? "border-cyan-500 bg-transparent" :
                      "border-[var(--color-border)] bg-[var(--color-surface)]"
                    }`}>
                      {etapa.concluida && <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      {etapa.atual && <div className="size-2.5 rounded-full bg-cyan-500 animate-pulse" />}
                    </div>
                    {i < etapas.length - 1 && <div className={`mt-1 w-0.5 flex-1 ${etapa.concluida ? "bg-green-400" : "bg-[var(--color-border)]"}`} />}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className={`text-sm font-semibold ${etapa.concluida || etapa.atual ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>
                      {etapa.label}
                      {etapa.atual && !etapa.concluida && <span className="ml-2 text-[10px] font-medium text-cyan-600 bg-cyan-500/10 px-1.5 py-0.5 rounded-full">Atual</span>}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">{etapa.data ? formatDate(etapa.data) : "—"}</p>

                    {/* Botões de ação por etapa */}
                    {etapa.atual && !etapa.concluida && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {etapa.label === "Análise" && (
                          <>
                            <button onClick={() => avancarEtapa("diagramacao")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] bg-cyan-500 text-xs font-semibold text-black hover:bg-cyan-400 transition-all">Aprovar</button>
                            <button onClick={solicitarAjustes}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-red-500/30 text-xs font-medium text-red-500 hover:bg-red-500/5 transition-colors">
                              <CircleAlert className="size-3" />Solicitar ajustes
                            </button>
                          </>
                        )}
                        {etapa.label === "Diagramação" && (
                          <button onClick={() => avancarEtapa("revisao")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] bg-cyan-500 text-xs font-semibold text-black hover:bg-cyan-400 transition-all">
                            <Check className="size-3" />Concluir diagramação
                          </button>
                        )}
                        {etapa.label === "Revisão" && (
                          <button onClick={() => avancarEtapa("aprovado")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] bg-cyan-500 text-xs font-semibold text-black hover:bg-cyan-400 transition-all">
                            <Check className="size-3" />Concluir revisão
                          </button>
                        )}
                        {(etapa.label === "Aprovado" || etapa.label === "Produção") && (
                          obraExistente ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/obra/${obraExistente.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-cyan-500/30 text-xs font-medium text-cyan-600 hover:bg-cyan-500/5 transition-colors"
                              >
                                <ExternalLink className="size-3" />Ver perfil
                              </Link>
                              <Link
                                href={`/admin/obras/${obraExistente.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors"
                              >
                                <Edit3 className="size-3" />Editar
                              </Link>
                              <span className={`text-xs font-medium flex items-center gap-1 ${obraExistente.publicado ? "text-green-600" : "text-amber-600"}`}>
                                {obraExistente.publicado ? <><Globe className="size-3" />Pública</> : <><Lock className="size-3" />Privada</>}
                              </span>
                            </div>
                          ) : (
                            <button onClick={criarPerfilObra} disabled={publicando}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] bg-cyan-600 text-xs font-semibold text-white hover:bg-cyan-500 transition-all disabled:opacity-50">
                              {publicando ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                              {publicando ? "Criando..." : "Criar perfil da obra"}
                            </button>
                          )
                        )}
                        {etapa.label === "Publicado" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CircleCheck className="size-3" />Obra publicada
                            </span>
                            {obraExistente && (
                              <Link
                                href={`/obra/${obraExistente.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-cyan-500/30 text-xs font-medium text-cyan-600 hover:bg-cyan-500/5 transition-colors"
                              >
                                <ExternalLink className="size-3" />Ver no site
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><AlertCircle className="size-4 text-cyan-500" />Histórico de alterações</h2>
            <div className="flex flex-col gap-2">
              {mudancas.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)] py-2">Nenhuma alteração registrada.</p>
              )}
              {mudancas.map((m) => (
                <div key={m.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] ${
                  m.acao === "ajustes_solicitados" || m.acao === "Ajustes solicitados" ? "bg-red-500/5 border border-red-500/20" :
                  m.acao === "Obra publicada" || m.acao === "publicado" ? "bg-green-500/5 border border-green-500/20" :
                  "bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    m.acao === "ajustes_solicitados" || m.acao === "Ajustes solicitados" ? "bg-red-500/10 text-red-500" :
                    m.acao === "Obra publicada" || m.acao === "publicado" ? "bg-green-500/10 text-green-500" :
                    "bg-cyan-500/10 text-cyan-500"
                  }`}>
                    {m.acao === "ajustes_solicitados" || m.acao === "Ajustes solicitados" ? <CircleAlert className="size-3" /> :
                     m.acao === "Obra publicada" || m.acao === "publicado" ? <Check className="size-3" /> :
                     <CircleCheck className="size-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold">{m.acao}</p>
                      <span className="text-[10px] text-[var(--color-text-subtle)]">por {m.usuario}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{m.descricao}</p>
                    <p className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{formatDate(m.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <PedidoDetail />;
}
