"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Search, ClipboardList, Loader2 } from "lucide-react";

interface Pedido {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  data_criacao: string;
  valor_base: number;
  orcamento_final: number;
  status: string;
  usuario_id: string;
  pedido_servicos: { nome: string; valor: number }[];
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

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data.pedidos ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtrados = pedidos.filter((p) =>
    !busca || p.titulo.toLowerCase().includes(busca.toLowerCase()) || (p.codigo && p.codigo.toLowerCase().includes(busca.toLowerCase()))
  );

  function formatData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }

  function formatValor(v: number) {
    return `R$ ${v.toFixed(2).replace(".", ",")}`;
  }

  return (
    <div className="animate-fade-in mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            <ClipboardList className="size-3.5" />
            Administração
          </div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Gerencie todos os pedidos de publicação</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Buscar pedido..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-cyan-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Pedido</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Obra</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Valor</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {filtrados.map((pedido) => (
                  <tr key={pedido.id} className="transition-colors hover:bg-[var(--color-surface-alt)]/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${pedido.id}`}
                        className="font-medium text-cyan-600 transition-colors hover:text-cyan-500"
                      >
                        {pedido.codigo || pedido.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{pedido.titulo}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] capitalize">{pedido.tipo === "ebook-impressao" ? "Ebook+Impressão" : pedido.tipo}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: `${statusCor(pedido.status)}1a`, color: statusCor(pedido.status) }}
                      >
                        {statusLabel[pedido.status] || pedido.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatValor(pedido.orcamento_final)}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatData(pedido.data_criacao)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrados.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-[var(--color-text-muted)]">
              {busca ? "Nenhum pedido encontrado para esta busca." : "Nenhum pedido registrado ainda."}
            </div>
          )}
        </div>
      )}

      {!loading && (
        <p className="text-xs text-[var(--color-text-subtle)]">
          Mostrando {filtrados.length} de {pedidos.length} pedidos
        </p>
      )}
    </div>
  );
}
