"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, BookOpen, DollarSign, TrendingUp, Clock, CircleCheck, CircleAlert, ArrowRight, Search, SlidersHorizontal, Loader2 } from "lucide-react";

interface ObraMes {
  id: string;
  codigo: string;
  titulo: string;
  autor: string;
  tipo: string;
  data_criacao: string;
  valor_base: number;
  orcamento_final: number;
  status: string;
  servicosAdicionais: string[];
  openAccess: boolean;
}

const statusLabel: Record<string, string> = {
  pedido_criado: "Pedido criado",
  pagamento: "Pagamento",
  em_analise: "Em análise",
  diagramacao: "Diagramação",
  revisao: "Revisão",
  ajustes_solicitados: "Ajustes",
  aprovado: "Aprovado",
  em_producao: "Produção",
  publicado: "Publicado",
  cancelado: "Cancelado",
};

function statusCor(status: string): string {
  if (["publicado", "aprovado"].includes(status)) return "var(--color-success)";
  if (status === "ajustes_solicitados" || status === "cancelado") return "var(--color-error)";
  if (status === "em_analise") return "var(--color-warning)";
  return "var(--color-cyan-500)";
}

export default function AdminDashboard() {
  const [obras, setObras] = useState<ObraMes[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then((data) => {
        const pedidos = (data.pedidos ?? []).map((p: any) => ({
          id: p.id,
          codigo: p.codigo,
          titulo: p.titulo,
          autor: "",
          tipo: p.tipo === "capitulo" ? "Capítulo" : p.tipo === "impressao" ? "Ebook+Impressão" : "Ebook",
          data_criacao: new Date(p.data_criacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
          valor_base: p.valor_base,
          orcamento_final: p.orcamento_final,
          status: p.status,
          servicosAdicionais: p.pedido_servicos?.map((s: any) => s.nome) ?? [],
          openAccess: p.open_access ?? false,
        }));
        setObras(pedidos);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const obrasFiltradas = obras.filter((o) => {
    if (filtroStatus !== "todos" && o.status !== filtroStatus) return false;
    if (busca && !o.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const vendasAprovadas = obras.filter((o) => ["aprovado", "publicado"].includes(o.status));
  const totalAprovado = vendasAprovadas.reduce((acc, o) => acc + o.orcamento_final, 0);
  const vendasPendentes = obras.filter((o) => !["aprovado", "publicado"].includes(o.status));
  const totalPendente = vendasPendentes.reduce((acc, o) => acc + o.orcamento_final, 0);
  const receitaMes = obras.reduce((acc, o) => acc + o.orcamento_final, 0);

  const statusOptions = Object.entries(statusLabel);

  return (
    <div className="animate-fade-in mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: DollarSign, label: "Receita do mês", value: `R$ ${receitaMes.toFixed(2).replace(".", ",")}`, sub: `${obras.length} pedidos` },
          { icon: TrendingUp, label: "Vendas aprovadas", value: `R$ ${totalAprovado.toFixed(2).replace(".", ",")}`, sub: `${vendasAprovadas.length} obras`, cor: "text-green-600" },
          { icon: Clock, label: "Vendas pendentes", value: `R$ ${totalPendente.toFixed(2).replace(".", ",")}`, sub: `${vendasPendentes.length} aguardando` },
          { icon: BookOpen, label: "Obras no mês", value: obras.length.toString(), sub: `${obras.filter((o) => o.status === "publicado").length} publicadas` },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-2 flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-cyan-500/10 text-cyan-500">
                <Icon className="size-4.5" />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
              <p className={`mt-1 text-lg sm:text-xl font-bold ${card.cor ?? ""}`}>{card.value}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Planilha */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Obras em andamento</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Planilha editorial com todas as obras</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)}
                  className="w-full sm:w-48 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-1.5 pl-8 pr-3 text-xs outline-none focus:border-cyan-500/50" />
              </div>
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-1.5 px-2.5 text-xs outline-none focus:border-cyan-500/50">
                <option value="todos">Todos</option>
                {statusOptions.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-cyan-500" />
          </div>
        ) : (
          <>
            {/* Tabela desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Pedido</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Obra</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Data</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Valor</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Serviços</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Acesso</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {obrasFiltradas.map((obra) => (
                    <tr key={obra.id} className="hover:bg-[var(--color-surface-alt)]/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{obra.codigo || obra.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 max-w-[160px] truncate">{obra.titulo}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{obra.tipo}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{obra.data_criacao}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: `${statusCor(obra.status)}1a`, color: statusCor(obra.status) }}>
                          {statusLabel[obra.status] || obra.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">R$ {obra.orcamento_final.toFixed(2).replace(".", ",")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {obra.servicosAdicionais.map((s) => (
                            <span key={s} className="inline-block px-1.5 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[10px] text-[var(--color-text-muted)]">{s}</span>
                          ))}
                          {obra.servicosAdicionais.length === 0 && <span className="text-[10px] text-[var(--color-text-subtle)]">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-medium ${obra.openAccess ? "text-green-600" : "text-[var(--color-text-muted)]"}`}>
                          {obra.openAccess ? "Aberto" : "Restrito"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${obra.id}`} className="text-cyan-600 hover:text-cyan-500 text-[10px] font-medium">Detalhes</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="sm:hidden divide-y divide-[var(--color-border-subtle)]">
              {obrasFiltradas.map((obra) => (
                <Link key={obra.id} href={`/admin/pedidos/${obra.id}`} className="block px-4 py-3 hover:bg-[var(--color-surface-alt)]/50">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium leading-snug">{obra.titulo}</p>
                    <span className="text-xs font-semibold ml-2 shrink-0">R$ {obra.orcamento_final.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{obra.tipo} · {obra.data_criacao}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: `${statusCor(obra.status)}1a`, color: statusCor(obra.status) }}>
                      {statusLabel[obra.status] || obra.status}
                    </span>
                    {obra.openAccess && <span className="text-[10px] text-green-600">Open Access</span>}
                  </div>
                </Link>
              ))}
            </div>

            {obrasFiltradas.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[var(--color-text-muted)]">Nenhuma obra encontrada.</div>
            )}

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
              <span>{obrasFiltradas.length} de {obras.length} obras</span>
              <div className="flex flex-wrap gap-3">
                <span>Total aprovado: <strong className="text-green-600">R$ {totalAprovado.toFixed(2).replace(".", ",")}</strong></span>
                <span>Total pendente: <strong className="text-[var(--color-warning)]">R$ {totalPendente.toFixed(2).replace(".", ",")}</strong></span>
                <span>Receita total: <strong className="text-gradient-cyan">R$ {receitaMes.toFixed(2).replace(".", ",")}</strong></span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pedidos pendentes", count: obras.filter((o) => o.status === "em_analise").length, href: "/admin/pedidos", cor: "text-[var(--color-warning)]" },
          { label: "Aprovações", count: obras.filter((o) => o.status === "pagamento").length, href: "/admin/pedidos", cor: "text-cyan-500" },
          { label: "Obras publicadas", count: obras.filter((o) => o.status === "publicado").length, href: "/admin/obras", cor: "text-green-600" },
          { label: "Relatórios", count: 0, href: "/admin/relatorios", cor: "text-[var(--color-text-muted)]" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-cyan-500/30 transition-colors">
            <p className="text-2xl font-bold">{item.count}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
