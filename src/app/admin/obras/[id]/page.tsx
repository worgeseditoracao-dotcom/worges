"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft, BookOpen, Save, Globe, Lock, Upload, X, Image,
  Check, Eye, EyeOff, ExternalLink, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

function EditorObra() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [obra, setObra] = useState<any>(null);
  const [titulo, setTitulo] = useState("");
  const [autores, setAutores] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resumo, setResumo] = useState("");
  const [openAccess, setOpenAccess] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [doi, setDoi] = useState("");
  const [isbn, setIsbn] = useState("");
  const [salvando, setSalvando] = useState(false);
  const capaRef = useRef<HTMLInputElement>(null);
  const [capaFile, setCapaFile] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/obras/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        const o = data.obra;
        setObra(o);
        setTitulo(o.titulo ?? "");
        setAutores(o.autores ?? "");
        setCategoria(o.categoria ?? "");
        setResumo(o.resumo ?? "");
        setOpenAccess(o.open_access ?? false);
        setPublicado(o.publicado ?? false);
        try {
          const meta = JSON.parse(o.doi || "{}");
          setDoi(meta.doi || o.doi || "");
          setIsbn(meta.isbn || "");
        } catch {
          setDoi(o.doi || "");
          setIsbn("");
        }
      })
      .catch(() => setObra(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(`/api/obras/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          autores,
          categoria: categoria || null,
          resumo,
          open_access: openAccess,
          publicado,
          doi: JSON.stringify({ doi: doi || null, isbn: isbn || null }),
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      toast.success("Obra atualizada com sucesso!");
    } catch {
      toast.error("Erro ao salvar obra");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!obra) {
    return <div className="p-12 text-center text-[var(--color-text-muted)]">Obra não encontrada.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-10">
      <Link href="/admin/obras" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">
        <ArrowLeft className="size-4" />Voltar para obras
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Editar obra</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{obra.id?.slice(0, 8)}</p>
          </div>
        </div>
        <Link
          href={`/obra/${obra.slug}`}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-500 transition-colors"
        >
          <ExternalLink className="size-4" />
          Ver página da obra
        </Link>
      </div>

      <form onSubmit={handleSalvar} className="flex flex-col gap-6">
        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="text-base font-bold mb-5">Informações da obra</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Título</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Autor(es)</label>
              <input type="text" value={autores} onChange={(e) => setAutores(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Categoria</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60">
                    <option value="">Selecione</option>
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">ISBN</label>
                  <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-65-00-00001-1"
                    className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">DOI</label>
                  <input type="text" value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="10.0000/worges-xxxx"
                    className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
                </div>
              </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Resumo</label>
              <textarea rows={4} value={resumo} onChange={(e) => setResumo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60 resize-none" />
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="text-base font-bold mb-1">Capa da obra</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Faça upload de uma nova imagem de capa (JPG, PNG · máx. 10MB)</p>
          {capaFile ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-cyan-500/30 bg-cyan-500/5">
              <Image className="size-4 text-cyan-500 shrink-0" />
              <span className="text-sm truncate flex-1">{capaFile}</span>
              <button type="button" onClick={() => { setCapaFile(null); if (capaRef.current) capaRef.current.value = ""; }}
                className="text-[var(--color-text-muted)] hover:text-red-500"><X className="size-4" /></button>
            </div>
          ) : (
            <button type="button" onClick={() => capaRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-colors">
              <Upload className="size-6 text-[var(--color-text-muted)]" />
              <span className="text-sm text-[var(--color-text-muted)]">Clique para selecionar imagem</span>
            </button>
          )}
          <input ref={capaRef} type="file" accept=".jpg,.jpeg,.png" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setCapaFile(f.name); }} />
        </div>

        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="text-base font-bold mb-5">Configurações de publicação</h2>
          <div className="flex flex-col gap-4">
            <label className={`flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${openAccess ? "border-cyan-500 bg-cyan-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"}`}>
              <input type="checkbox" checked={openAccess} onChange={() => setOpenAccess(!openAccess)} className="hidden" />
              <div className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 ${openAccess ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                {openAccess && <Check className="size-3 text-black" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {openAccess ? <Globe className="size-4 text-cyan-500" /> : <Lock className="size-4 text-[var(--color-text-muted)]" />}
                  <p className="text-sm font-medium">Open Access</p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 ml-6">Disponibilizar PDF para download público no catálogo</p>
              </div>
            </label>

            <label className={`flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${publicado ? "border-green-500 bg-green-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"}`}>
              <input type="checkbox" checked={publicado} onChange={() => setPublicado(!publicado)} className="hidden" />
              <div className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 ${publicado ? "border-green-500 bg-green-500" : "border-[var(--color-border)]"}`}>
                {publicado && <Check className="size-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {publicado ? <Eye className="size-4 text-green-500" /> : <EyeOff className="size-4 text-[var(--color-text-muted)]" />}
                  <p className="text-sm font-medium">{publicado ? "Pública — Visível no catálogo" : "Privada — Apenas autor e admin"}</p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 ml-6">
                  {publicado
                    ? "Qualquer pessoa pode acessar esta página."
                    : "Somente o autor e administradores podem ver este perfil."}
                </p>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" disabled={salvando}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black transition-all shadow-cyan">
          {salvando ? <><Loader2 className="size-4 animate-spin" />Salvando...</> : <><Save className="size-4" />Salvar alterações</>}
        </button>
      </form>
    </div>
  );
}

export default function EditarObraPage() {
  return <EditorObra />;
}
