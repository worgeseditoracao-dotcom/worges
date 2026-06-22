"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpen,
  Layers,
  Clock,
  CircleCheck,
  CircleAlert,
  ArrowRight,
  FileText,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Globe,
  EyeOff,
  Edit3,
  Lock,
  Download,
} from "lucide-react";

type TipoServico = "ebook" | "capitulo" | "impressao";

interface EtapaConfig {
  label: string;
  desc: string;
  done: boolean;
  current: boolean;
  data?: string | null;
}

interface Pedido {
  id: string;
  codigo: string;
  titulo: string;
  tipo: TipoServico;
  tipo_label: string;
  valor: string;
  valor_number: number;
  data: string;
  prazo?: string;
  openAccess?: boolean;
  servicosAdicionais: string[];
  orcamentoFinal: string;
  orcamento_number: number;
  etapas: EtapaConfig[];
  cartaAceite?: boolean;
  certificado?: boolean;
  link?: string;
  status: string;
}

interface Obra {
  id: string;
  slug: string;
  titulo: string;
  autores: string;
  categoria: string | null;
  publicado: boolean;
  open_access: boolean;
  capa_url: string | null;
  data_publicacao: string | null;
  pdf_url: string | null;
}

const statusLabel: Record<string, string> = {
  pedido_criado: "Pedido criado",
  pagamento: "Pagamento",
  em_analise: "Em análise",
  diagramacao: "Diagramação",
  revisao: "Revisão",
  ajustes_solicitados: "Ajustes solicitados",
  aprovado: "Aprovado",
  em_producao: "Em produção",
  publicado: "Publicado",
};

const etapaTimeline: { key: string; label: string; desc: string }[] = [
  { key: "pedido_criado", label: "Pedido criado", desc: "Pedido registrado e aguardando pagamento" },
  { key: "pagamento", label: "Pagamento confirmado", desc: "Pagamento aprovado pela operadora" },
  { key: "em_analise", label: "Em análise editorial", desc: "Equipe editorial conferindo arquivos e template" },
  { key: "diagramacao", label: "Diagramação", desc: "Profissional ajustando layout e formatação" },
  { key: "revisao", label: "Revisão", desc: "Revisão técnica e ortográfica em andamento" },
  { key: "aprovado", label: "Aprovado", desc: "Obra aprovada e pronta para produção" },
  { key: "em_producao", label: "Em produção", desc: "Geração dos arquivos finais" },
  { key: "publicado", label: "Publicado", desc: "Obra disponível no catálogo" },
];

const tipoLabel: Record<TipoServico, string> = { ebook: "Ebook", capitulo: "Capítulo", impressao: "Ebook + Impressão" };
const tipoIcon: Record<TipoServico, typeof BookOpen> = { ebook: BookOpen, capitulo: Layers, impressao: BookOpen };

function montarEtapas(statusAtual: string, dataCriacao: string): EtapaConfig[] {
  const idxAtual = etapaTimeline.findIndex((e) => e.key === statusAtual);
  const idx = idxAtual === -1 ? 0 : idxAtual;

  return etapaTimeline.map((etapa, i) => ({
    label: etapa.label,
    desc: etapa.desc,
    done: i < idx,
    current: i === idx,
    data: i <= idx ? dataCriacao : null,
  }));
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function MinhaContaPage() {
  const user = useStore((s) => s.user);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);
  const [togglingObra, setTogglingObra] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/pedidos"), fetch("/api/minhas-obras")])
      .then(async ([resPedidos, resObras]) => {
        const pedidosData = await resPedidos.json();
        const obrasData = await resObras.json();
        setObras(obrasData.obras ?? []);
        return pedidosData;
      })
      .then((data) => {
        const items = (data.pedidos ?? []).map((p: any) => {
          const tipo = p.tipo as TipoServico;
          const dataCriacao = formatDate(p.data_criacao);
          return {
            id: p.id,
            codigo: p.codigo,
            titulo: p.titulo,
            tipo,
            tipo_label: tipoLabel[tipo] || tipo,
            valor: `R$ ${(p.orcamento_final ?? 0).toFixed(2).replace(".", ",")}`,
            valor_number: p.orcamento_final ?? 0,
            data: dataCriacao,
            openAccess: p.open_access,
            servicosAdicionais: p.pedido_servicos?.map((s: any) => s.nome) ?? [],
            orcamentoFinal: `R$ ${(p.orcamento_final ?? 0).toFixed(2).replace(".", ",")}`,
            orcamento_number: p.orcamento_final ?? 0,
            etapas: montarEtapas(p.status, dataCriacao),
            status: p.status,
            cartaAceite: ["aprovado", "publicado"].includes(p.status),
            certificado: p.pedido_servicos?.some((s: any) => s.nome === "Certificado"),
          };
        });
        setPedidos(items);
        if (items.length > 0) setPedidoExpandido(items[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const emAndamento = pedidos.filter((p) => !["publicado", "cancelado"].includes(p.status));
  const concluidos = pedidos.filter((p) => p.status === "publicado");

  async function toggleOpenAccess(obra: Obra) {
    setTogglingObra(obra.id);
    try {
      const novoOA = !obra.open_access;
      const res = await fetch(`/api/obras/${obra.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ open_access: novoOA }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      setObras((prev) =>
        prev.map((o) =>
          o.id === obra.id ? { ...o, open_access: novoOA } : o
        )
      );
      toast.success(novoOA ? "Download público ativado" : "Download restrito");
    } catch {
      toast.error("Erro ao alterar acesso");
    } finally {
      setTogglingObra(null);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Painel do autor</p>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user?.name ?? "Autor"}</h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Acompanhe o processo editorial das suas obras em andamento.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total de obras", value: pedidos.length, icon: BookOpen },
            { label: "Em andamento", value: emAndamento.length, icon: Clock },
            { label: "Serviços adicionais", value: pedidos.reduce((acc, p) => acc + p.servicosAdicionais.length, 0), icon: FileText },
            { label: "Publicadas", value: concluidos.length, icon: CircleCheck },
          ].map((card) => (
            <div key={card.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-2">
                <card.icon className="w-4 h-4" />
              </div>
              <p className="text-xl sm:text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pedidos.length === 0 ? (
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
                <BookOpen className="w-10 h-10 text-[var(--color-text-subtle)] mx-auto mb-3" />
                <p className="text-[var(--color-text-muted)] text-sm">Você ainda não tem pedidos.</p>
                <Link href="/publicar" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all">
                  Publicar obra<ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              pedidos.map((pedido) => {
                const TipoIcon = tipoIcon[pedido.tipo] || BookOpen;
                const etapaAtual = pedido.etapas.find((e) => e.current) ?? pedido.etapas[pedido.etapas.length - 1];
                const expandido = pedidoExpandido === pedido.id;

                return (
                  <div key={pedido.id} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                    <button
                      onClick={() => setPedidoExpandido(expandido ? null : pedido.id)}
                      className="w-full text-left p-5 sm:p-6 hover:bg-[var(--color-bg-subtle)]/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center shrink-0">
                          <TipoIcon className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-sm">{pedido.titulo}</p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {pedido.tipo_label} · {pedido.codigo} · {pedido.data}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-gradient-cyan whitespace-nowrap">{pedido.valor}</span>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                etapaAtual.label === "Publicado" ? "bg-green-500/10 text-green-600" :
                                etapaAtual.label === "Ajustes solicitados" ? "bg-red-500/10 text-red-500" :
                                "bg-cyan-500/10 text-cyan-600"
                              }`}>
                                {etapaAtual.label === "Ajustes solicitados" ? <CircleAlert className="w-3 h-3" /> :
                                 etapaAtual.label === "Publicado" ? <CircleCheck className="w-3 h-3" /> :
                                 <Clock className="w-3 h-3" />}
                                {etapaAtual.label}
                              </span>
                              {expandido ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {pedido.openAccess !== undefined && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${pedido.openAccess ? "bg-green-500/10 text-green-600" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"}`}>
                                {pedido.openAccess ? "Open Access" : "Restrito"}
                              </span>
                            )}
                            {pedido.servicosAdicionais.map((s) => (
                              <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-bg-subtle)] text-[10px] font-medium text-[var(--color-text-muted)]">{s}</span>
                            ))}
                            {pedido.cartaAceite && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-[10px] font-medium text-cyan-600"><Award className="w-2.5 h-2.5" />Carta de aceite</span>}
                          </div>
                        </div>
                      </div>
                    </button>

                    {expandido && (
                      <div className="border-t border-[var(--color-border)] px-5 sm:px-6 py-6 bg-[var(--color-bg-subtle)]/30">
                        <h3 className="text-sm font-bold mb-5">Processo editorial</h3>
                        <div className="relative">
                          {pedido.etapas.map((etapa, i) => (
                            <div key={etapa.label} className="flex gap-3 pb-6 last:pb-0">
                              <div className="flex flex-col items-center">
                                <div className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                                  etapa.done ? "border-green-500 bg-green-500" :
                                  etapa.current ? "border-cyan-500 bg-transparent" :
                                  "border-[var(--color-border)] bg-[var(--color-surface)]"
                                }`}>
                                  {etapa.done && !etapa.current && (
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                  {etapa.current && <div className="size-2.5 rounded-full bg-cyan-500 animate-pulse" />}
                                </div>
                                {i < pedido.etapas.length - 1 && (
                                  <div className={`mt-1 w-0.5 flex-1 ${etapa.done ? "bg-green-400" : "bg-[var(--color-border)]"}`} />
                                )}
                              </div>
                              <div className="min-w-0 flex-1 pt-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`text-sm font-semibold ${
                                    etapa.done || etapa.current ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                                  }`}>
                                    {etapa.label}
                                  </p>
                                  {etapa.current && (
                                    <span className="text-[10px] font-medium text-cyan-600 bg-cyan-500/10 px-2 py-0.5 rounded-full">Em andamento</span>
                                  )}
                                </div>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{etapa.desc}</p>
                                {etapa.data && <p className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{etapa.data}</p>}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                          <div className="flex flex-wrap items-center gap-2">
                            {pedido.cartaAceite && (
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
                                <FileText className="w-3 h-3" />Carta de aceite
                              </button>
                            )}
                            {pedido.certificado && (
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
                                <Award className="w-3 h-3" />Certificado
                              </button>
                            )}
                            {pedido.link && (
                              <Link href={pedido.link} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5 text-xs font-medium text-cyan-600 transition-colors">
                                <ExternalLink className="w-3 h-3" />Ver obra publicada
                              </Link>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                              Orçamento: {pedido.orcamentoFinal}
                            </span>
                          </div>

                          {etapaAtual.label === "Ajustes solicitados" && (
                            <div className="mt-3 flex items-start gap-2 text-xs text-red-600 bg-red-500/5 border border-red-500/20 rounded-[var(--radius-sm)] px-3 py-2.5">
                              <CircleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>A equipe editorial solicitou ajustes na obra. Verifique seu e-mail para mais detalhes e reenvie o arquivo corrigido.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {obras.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Perfis das suas obras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {obras.map((obra) => {
                const downloadLabel = obra.open_access ? "Download livre" : "Download restrito";
                const downloadIcon = obra.open_access ? <Globe className="size-2.5" /> : <Lock className="size-2.5" />;
                const buttonContent = togglingObra === obra.id
                  ? <Loader2 className="size-3 animate-spin" />
                  : obra.open_access
                    ? <span className="inline-flex items-center gap-1"><Lock className="size-3" />Restringir</span>
                    : <span className="inline-flex items-center gap-1"><Globe className="size-3" />Liberar download</span>;
                return (
                  <div key={obra.id} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                    <div className="aspect-[3/2] bg-gradient-to-br from-cyan-400/10 to-cyan-600/5 flex items-center justify-center">
                      {obra.capa_url ? (
                        <img src={obra.capa_url} alt={obra.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="size-10 text-cyan-500/30" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold leading-snug">{obra.titulo}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${obra.open_access ? "bg-green-500/10 text-green-600" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"}`}>
                          {downloadIcon}{downloadLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">{obra.autores}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
                        <Link href={`/obra/${obra.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-cyan-500/30 text-xs font-medium text-cyan-600 hover:bg-cyan-500/5 transition-colors">
                          <ExternalLink className="size-3" />Ver perfil
                        </Link>
                        <button
                          onClick={() => toggleOpenAccess(obra)}
                          disabled={togglingObra === obra.id}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors disabled:opacity-60 ${obra.open_access ? "border border-green-500/30 text-green-500 hover:bg-green-500/5" : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500"}`}
                        >{buttonContent}</button>
                        {obra.pdf_url ? (
                          <a href={obra.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
                            <Download className="size-3" />Baixar
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 gradient-hero rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 text-center">
          <h3 className="font-bold text-base">Publique mais uma obra</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">Ebook, impressão ou capítulo de coletânea — com suporte editorial completo.</p>
          <Link href="/publicar" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan">
            Ver planos<ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
