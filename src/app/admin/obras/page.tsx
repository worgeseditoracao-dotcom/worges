"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Globe, Lock, Search, Edit3, ExternalLink, Eye, Loader2 } from "lucide-react";

interface Obra {
  id: string;
  slug: string;
  titulo: string;
  autores: string;
  categoria: string | null;
  data_publicacao: string | null;
  publicado: boolean;
  open_access: boolean;
  capa_url: string | null;
}

export default function AdminObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    fetch("/api/obras")
      .then((res) => res.json())
      .then((data) => setObras(data.obras ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtradas = obras.filter((o) => {
    if (filtroStatus === "publicado" && !o.publicado) return false;
    if (filtroStatus === "rascunho" && o.publicado) return false;
    if (busca && !o.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-10">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium mb-2">
          <BookOpen className="size-3.5" />Catálogo
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Gerenciar obras</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Gerencie todas as obras do catálogo, edite informações e publique.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input type="text" placeholder="Buscar obra..." value={busca} onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500/50" />
        </div>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 px-3 text-sm outline-none focus:border-cyan-500/50">
          <option value="todos">Todas</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-cyan-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((obra) => (
            <div key={obra.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-cyan-500/30 transition-all">
              <div className="aspect-[3/2] bg-gradient-to-br from-cyan-400/10 to-cyan-600/5 flex items-center justify-center">
                {obra.capa_url ? (
                  <img src={obra.capa_url} alt={obra.titulo} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="size-10 text-cyan-500/30" />
                )}
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold leading-snug">{obra.titulo}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${obra.open_access ? "bg-green-500/10 text-green-600" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"}`}>
                    {obra.open_access ? <Globe className="size-2.5" /> : <Lock className="size-2.5" />}
                    {obra.open_access ? "Aberto" : "Restrito"}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{obra.autores}</p>
                <div className="flex items-center gap-2 mt-2">
                  {obra.categoria && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">{obra.categoria}</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${obra.publicado ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {obra.publicado ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
                  <Link href={`/admin/obras/${obra.id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
                    <Edit3 className="size-3" />Editar
                  </Link>
                  <Link href={`/obra/${obra.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors">
                    <ExternalLink className="size-3" />Ver
                  </Link>
                  {obra.data_publicacao && (
                    <span className="ml-auto text-[10px] text-[var(--color-text-subtle)]">
                      {new Date(obra.data_publicacao).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtradas.length === 0 && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Nenhuma obra encontrada.</p>
        </div>
      )}
    </div>
  );
}
