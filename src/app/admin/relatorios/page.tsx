"use client";

import { useEffect, useState } from "react";
import { ChartColumn, Download, TrendingUp, DollarSign, BookOpen, Users, Loader2 } from "lucide-react";

interface Pedido {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  data_criacao: string;
  valor_base: number;
  orcamento_final: number;
  status: string;
  open_access: boolean;
  pedido_servicos: { nome: string; valor: number }[];
}

export default function AdminRelatoriosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data.pedidos ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const anoAtual = new Date().getFullYear();

  const pedidosPorMes = pedidos.reduce((acc, p) => {
    const mes = new Date(p.data_criacao).getMonth();
    if (!acc[mes]) acc[mes] = { mes: meses[mes], pedidos: 0, receita: 0, publicados: 0, aprovados: 0 };
    acc[mes].pedidos += 1;
    acc[mes].receita += p.orcamento_final;
    if (p.status === "publicado") acc[mes].publicados += 1;
    if (["aprovado", "publicado"].includes(p.status)) acc[mes].aprovados += 1;
    return acc;
  }, {} as Record<number, { mes: string; pedidos: number; receita: number; publicados: number; aprovados: number }>);

  const dadosMensais = Array.from({ length: 12 }, (_, i) => {
    const d = pedidosPorMes[i];
    if (!d) return { mes: meses[i], pedidos: 0, receita: 0, publicados: 0, taxaAprovacao: 0 };
    const total = d.pedidos;
    return {
      mes: d.mes,
      pedidos: d.pedidos,
      receita: d.receita,
      publicados: d.publicados,
      taxaAprovacao: total > 0 ? Math.round((d.aprovados / total) * 100 * 10) / 10 : 0,
    };
  });

  const dados = dadosMensais[mesSelecionado] ?? dadosMensais[new Date().getMonth()];

  const resumoAnual = {
    totalPedidos: dadosMensais.reduce((a, d) => a + d.pedidos, 0),
    totalReceita: dadosMensais.reduce((a, d) => a + d.receita, 0),
    totalPublicados: dadosMensais.reduce((a, d) => a + d.publicados, 0),
    mediaAprovacao: dadosMensais.filter((d) => d.pedidos > 0).reduce((a, d) => a + d.taxaAprovacao, 0) / Math.max(dadosMensais.filter((d) => d.pedidos > 0).length, 1),
  };

  const maxReceita = Math.max(...dadosMensais.map((d) => d.receita), 1);

  return loading ? (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="size-6 animate-spin text-cyan-500" />
    </div>
  ) : (
    <div className="animate-fade-in mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-10">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium mb-2">
          <ChartColumn className="size-3.5" />Relatórios
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Relatórios financeiros e operacionais</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Acompanhe a performance editorial e financeira da plataforma.</p>
      </div>

      {/* Seletor de mês */}
      <div className="flex items-center gap-3">
        <select value={mesSelecionado} onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 px-4 text-sm outline-none focus:border-cyan-500/50">
          {dadosMensais.map((d, i) => <option key={d.mes} value={i}>{d.mes}/2026</option>)}
        </select>
        <span className="text-xs text-[var(--color-text-subtle)]">{dados.pedidos} pedidos</span>
      </div>

      {/* Cards do mês */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: DollarSign, label: "Receita do mês", value: `R$ ${dados.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cor: "text-gradient-cyan" },
          { icon: BookOpen, label: "Pedidos", value: dados.pedidos.toString(), cor: "" },
          { icon: TrendingUp, label: "Publicados", value: dados.publicados.toString(), cor: "text-green-600" },
          { icon: Users, label: "Taxa de aprovação", value: `${dados.taxaAprovacao}%`, cor: "text-cyan-500" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-2 flex size-9 items-center justify-center rounded-[var(--radius-sm)] bg-cyan-500/10 text-cyan-500">
                <Icon className="size-4.5" />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
              <p className={`mt-1 text-lg sm:text-xl font-bold ${card.cor}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Gráfico de barras simplificado */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-sm font-bold mb-6">Receita mensal — 2026</h2>
        <div className="flex items-end gap-2 sm:gap-4 h-40">
          {dadosMensais.map((d, i) => {
            const altura = (d.receita / maxReceita) * 100;
            return (
              <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--color-text-subtle)]">R$ {(d.receita / 1000).toFixed(1)}k</span>
                <div
                  className={`w-full rounded-[var(--radius-sm)] transition-all duration-500 ${i === mesSelecionado ? "bg-gradient-to-t from-cyan-500 to-cyan-400" : "bg-cyan-500/20"}`}
                  style={{ height: `${Math.max(altura, 4)}%` }}
                />
                <span className="text-[10px] text-[var(--color-text-muted)]">{d.mes.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela mensal */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-bold">Detalhamento mensal</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Mês</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Pedidos</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Receita</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Publicados</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Aprovação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {dadosMensais.map((d, i) => (
                <tr key={d.mes} className={`hover:bg-[var(--color-surface-alt)]/50 ${i === mesSelecionado ? "bg-cyan-500/5" : ""}`}>
                  <td className="px-4 py-3 font-medium">{d.mes}</td>
                  <td className="px-4 py-3">{d.pedidos}</td>
                  <td className="px-4 py-3 font-medium">R$ {d.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">{d.publicados}</td>
                  <td className="px-4 py-3">
                    <span className="text-green-600">{d.taxaAprovacao}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[var(--color-bg-subtle)] font-semibold">
              <tr>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3">{resumoAnual.totalPedidos}</td>
                <td className="px-4 py-3 text-gradient-cyan">R$ {resumoAnual.totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">{resumoAnual.totalPublicados}</td>
                <td className="px-4 py-3 text-green-600">{resumoAnual.mediaAprovacao.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Exportar */}
      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
        <Download className="size-4" />Exportar relatório completo (CSV)
      </button>
    </div>
  );
}
