"use client";

import { useState } from "react";
import { Settings, Save, DollarSign, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminConfigPage() {
  const [prazoNormal, setPrazoNormal] = useState("7");
  const [prazoUrgencia, setPrazoUrgencia] = useState("2");
  const [precoDOI, setPrecoDOI] = useState("40,00");
  const [precoUrgencia, setPrecoUrgencia] = useState("169,90");
  const [salvando, setSalvando] = useState(false);

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      toast.success("Configurações salvas com sucesso!");
    }, 800);
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-10">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium mb-2">
          <Settings className="size-3.5" />Configurações
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Configurações da plataforma</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Gerencie preços, prazos e configurações editoriais.</p>
      </div>

      <form onSubmit={handleSalvar} className="flex flex-col gap-6">
        {/* Prazos */}
        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="text-base font-bold mb-1 flex items-center gap-2"><Clock className="size-4 text-cyan-500" />Prazos editoriais</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-5">Prazos padrão para entrega dos serviços</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Prazo normal (dias úteis)</label>
              <input type="number" value={prazoNormal} onChange={(e) => setPrazoNormal(e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Prazo urgência (dias úteis)</label>
              <input type="number" value={prazoUrgencia} onChange={(e) => setPrazoUrgencia(e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="text-base font-bold mb-1 flex items-center gap-2"><DollarSign className="size-4 text-cyan-500" />Preços de serviços adicionais</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-5">Valores em R$</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">DOI</label>
              <input type="text" value={precoDOI} onChange={(e) => setPrecoDOI(e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Urgência</label>
              <input type="text" value={precoUrgencia} onChange={(e) => setPrecoUrgencia(e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-cyan-500/60" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={salvando} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black transition-all shadow-cyan">
          {salvando ? "Salvando..." : <><Save className="size-4" />Salvar configurações</>}
        </button>
      </form>
    </div>
  );
}
