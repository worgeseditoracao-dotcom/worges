"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Globe,
  Lock,
  EyeOff,
  ExternalLink,
  Edit3,
  Download,
  FileText,
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Tag,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "@/lib/store";

interface Obra {
  id: string;
  titulo: string;
  autores: string;
  categoria: string | null;
  resumo: string | null;
  capa_url: string | null;
  pdf_url: string | null;
  publicado: boolean;
  open_access: boolean;
  data_publicacao: string | null;
  doi: string | null;
  slug: string;
  created_at: string | null;
}

interface ObraResponse {
  obra: Obra;
  pode_gerenciar: boolean;
  is_owner_or_admin: boolean;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ObraPublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const user = useStore((s) => s.user);

  const [data, setData] = useState<ObraResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/obras/slug/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json: ObraResponse) => {
        setData(json);
        setNotFound(false);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  async function togglePublicacao() {
    if (!data?.pode_gerenciar) return;
    setToggling(true);
    try {
      const novoEstado = !data.obra.publicado;
      const res = await fetch(`/api/obras/${data.obra.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicado: novoEstado,
          data_publicacao: novoEstado ? new Date().toISOString().split("T")[0] : null,
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      const json = await res.json();
      setData((prev) =>
        prev
          ? {
              ...prev,
              obra: {
                ...prev.obra,
                publicado: json.obra.publicado,
                data_publicacao: json.obra.data_publicacao,
              },
            }
          : null
      );
      toast.success(novoEstado ? "Obra tornada pública" : "Obra ocultada do público");
    } catch {
      toast.error("Erro ao alterar visibilidade");
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <BookOpen className="size-16 text-cyan-500/20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Obra não encontrada</h1>
        <p className="text-sm text-[var(--color-text-muted)] max-w-md mb-6">
          O perfil desta obra não está disponível publicamente ou não existe.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all"
        >
          <ArrowLeft className="size-4" />
          Ver catálogo
        </Link>
      </div>
    );
  }

  const { obra, pode_gerenciar, is_owner_or_admin } = data;
  const podeBaixar = obra.open_access || is_owner_or_admin;
  const capaUrl = obra.capa_url ?? "/images/book-cover-placeholder.svg";

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navegação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Voltar ao catálogo
          </Link>
          <div className="flex items-center gap-2">
            {obra.publicado ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                <Globe className="size-3.5" />
                Público
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                <EyeOff className="size-3.5" />
                Perfil privado
              </span>
            )}
            {obra.open_access && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-600">
                <Globe className="size-3.5" />
                Open Access
              </span>
            )}
          </div>
        </div>

        {/* Aviso de privacidade */}
        {!obra.publicado && is_owner_or_admin && (
          <div className="mb-6 rounded-[var(--radius-lg)] border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
            <EyeOff className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-500">Perfil visível apenas para você e administradores</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Esta obra ainda não foi autorizada a aparecer no catálogo público. Use o botão abaixo para torná-la pública quando desejar.
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da capa */}
          <div className="lg:col-span-1">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-sm sticky top-24">
              <div className="aspect-[2/3] bg-gradient-to-br from-cyan-400/10 to-cyan-600/5 relative">
                <img
                  src={capaUrl}
                  alt={`Capa de ${obra.titulo}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/book-cover-placeholder.svg";
                  }}
                />
              </div>
              <div className="p-4 space-y-3">
                {podeBaixar && obra.pdf_url ? (
                  <a
                    href={obra.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all"
                  >
                    <Download className="size-4" />
                    {obra.open_access ? "Baixar PDF (Open Access)" : "Baixar PDF"}
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    <Lock className="size-4" />
                    PDF restrito
                  </div>
                )}

                {pode_gerenciar && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={togglePublicacao}
                      disabled={toggling}
                      className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all disabled:opacity-60 ${
                        obra.publicado
                          ? "border border-red-500/30 text-red-500 hover:bg-red-500/5"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }`}
                    >
                      {toggling ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : obra.publicado ? (
                        <><EyeOff className="size-4" />Ocultar do público</>
                      ) : (
                        <><Globe className="size-4" />Tornar pública</>
                      )}
                    </button>
                    <Link
                      href={`/admin/obras/${obra.id}`}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors"
                    >
                      <Edit3 className="size-4" />
                      Editar página
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna das informações */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              {obra.categoria && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-600 mb-4">
                  <Tag className="size-3" />
                  {obra.categoria}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-4">{obra.titulo}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-4 text-cyan-500" />
                  {obra.autores}
                </span>
                {obra.data_publicacao && obra.publicado && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-cyan-500" />
                    Publicado em {formatDate(obra.data_publicacao)}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="size-5 text-cyan-500" />
                Resumo
              </h2>
              {obra.resumo ? (
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line">
                  {obra.resumo}
                </p>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)] italic">
                  Nenhum resumo cadastrado para esta obra.
                </p>
              )}
            </div>

            {obra.doi && (
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h2 className="text-sm font-bold mb-2">DOI</h2>
                <a
                  href={`https://doi.org/${obra.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  {obra.doi}
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}

            {/* Preview do PDF */}
            {podeBaixar && obra.pdf_url && (
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-cyan-500" />
                  Leitura online
                </h2>
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-subtle)] aspect-[16/9]">
                  <iframe
                    src={obra.pdf_url}
                    title={`PDF de ${obra.titulo}`}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-3">
                  {obra.open_access
                    ? "Este conteúdo está disponível em Open Access."
                    : "Visualização restrita ao autor e administradores."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
