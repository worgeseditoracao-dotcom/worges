"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CircleCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { AuthGate } from "@/components/AuthGate";

const faixas = [
  { label: "Até 60 páginas", value: "60", price: 559.90 },
  { label: "Até 150 páginas", value: "150", price: 579.90 },
  { label: "300 páginas ou mais", value: "300+", price: 619.90 },
];

const servicosAdicionais = [
  { id: "doi", nome: "DOI", desc: "Identificador digital permanente", valor: 30.00 },
  { id: "kindle", nome: "Conversão Kindle (ePub)", desc: "Formato compatível com Amazon", valor: 89.90 },
  { id: "revisao", nome: "Revisão Ortográfica e Gramatical", desc: "Revisão completa do texto", valor: 230.00 },
];

export default function PlusSubmeterPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [faixa, setFaixa] = useState(faixas[0].value);
  const [openAccess, setOpenAccess] = useState(false);
  const [servicos, setServicos] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [emailContato, setEmailContato] = useState("");
  const [loading, setLoading] = useState(false);

  const faixaSelecionada = faixas.find((f) => f.value === faixa) ?? faixas[0];
  const servicosSelecionados = servicosAdicionais.filter((s) => servicos.includes(s.id));
  const total = faixaSelecionada.price + servicosSelecionados.reduce((acc, s) => acc + s.valor, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { toast.error("Digite o título da obra."); return; }
    if (!emailContato.trim()) { toast.error("Informe seu e-mail de contato."); return; }
    if (!whatsapp.trim()) { toast.error("Informe seu WhatsApp de contato."); return; }
    setLoading(true);
    const res = await fetch("/api/submeter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        tipo: "impressao",
        plano: "plus",
        faixa_paginas: faixa,
        valor_base: faixaSelecionada.price,
        orcamento_final: total,
        open_access: false,
        modalidade: JSON.stringify({ email: emailContato, whatsapp }),
        servicos: servicosSelecionados.map((s) => ({ nome: s.nome, valor: s.valor })),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { toast.error(data.error || "Erro ao enviar"); return; }
    toast.success(`Pedido ${data.codigo} criado! Acompanhe em Minha Conta.`);
    router.push("/minha-conta");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/publicar/plus" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="size-4" />Voltar
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center"><Sparkles className="w-5 h-5 text-black" /></div>
          <div><h1 className="text-xl font-bold">Pacote Plus</h1><p className="text-xs text-[var(--color-text-muted)]">Completo + Revisão + Kindle</p></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[var(--radius-xl)] border border-cyan-500/30 bg-cyan-500/5 p-6">
            <label className="text-sm font-bold mb-3 block">Título da obra</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Digite o título..."
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm outline-none focus:border-cyan-500/60" />
          </div>

          <div className="rounded-[var(--radius-xl)] border border-cyan-500/30 bg-cyan-500/5 p-6">
            <label className="text-sm font-bold mb-3 block">Contato</label>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--color-text-muted)]">E-mail <span className="text-red-500">*</span></label>
                <input type="email" value={emailContato} onChange={(e) => setEmailContato(e.target.value)} placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm outline-none focus:border-cyan-500/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--color-text-muted)]">WhatsApp <span className="text-red-500">*</span></label>
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm outline-none focus:border-cyan-500/60" />
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-cyan-500/30 bg-cyan-500/5 p-6">
            <label className="text-sm font-bold mb-3 block">Faixa de páginas</label>
            <div className="grid grid-cols-3 gap-2">
              {faixas.map((f) => (
                <button type="button" key={f.value} onClick={() => setFaixa(f.value)}
                  className={`p-3 rounded-[var(--radius-md)] border text-sm text-center transition-all ${
                    faixa === f.value ? "border-cyan-500 bg-cyan-500/10 text-cyan-500" : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/30"
                  }`}>
                  <p className="text-xs">{f.label}</p>
                  <p className="font-bold mt-1">R$ {f.price.toFixed(2).replace(".", ",")}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-cyan-500/30 bg-cyan-500/5 p-6">
            <label className="text-sm font-bold mb-3 block">Serviços adicionais</label>
            <div className="flex flex-col gap-2">
              {servicosAdicionais.map((s) => (
                <label key={s.id} className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                  servicos.includes(s.id) ? "border-cyan-500 bg-cyan-500/5" : "border-[var(--color-border)] hover:border-cyan-500/30"
                }`}>
                  <input type="checkbox" checked={servicos.includes(s.id)} onChange={() => setServicos((prev) => prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id])} className="hidden" />
                  <div className={`w-4 h-4 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 ${servicos.includes(s.id) ? "border-cyan-500 bg-cyan-500" : "border-[var(--color-border)]"}`}>
                    {servicos.includes(s.id) && <CircleCheck className="size-3 text-black" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{s.desc}</p>
                  </div>
                  <p className="text-sm font-bold text-gradient-cyan">R$ {s.valor.toFixed(2).replace(".", ",")}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-cyan-500/30 bg-cyan-500/5 p-6">
            <h3 className="text-sm font-bold mb-3">Resumo</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-[var(--color-text-muted)]"><span>Base ({faixaSelecionada.label})</span><span>R$ {faixaSelecionada.price.toFixed(2).replace(".", ",")}</span></div>
              {servicosSelecionados.map((s) => (
                <div key={s.id} className="flex justify-between text-[var(--color-text-muted)]"><span>+ {s.nome}</span><span>R$ {s.valor.toFixed(2).replace(".", ",")}</span></div>
              ))}
              <div className="flex justify-between font-bold text-base pt-3 border-t border-[var(--color-border)] mt-1"><span>Total</span><span className="text-gradient-cyan">R$ {total.toFixed(2).replace(".", ",")}</span></div>
            </div>
          </div>

          <AuthGate>
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black transition-all shadow-cyan">
              {loading ? <><Loader2 className="size-4 animate-spin inline mr-2" />Enviando...</> : "Enviar pedido"}
            </button>
          </AuthGate>
        </form>
      </div>
    </div>
  );
}
