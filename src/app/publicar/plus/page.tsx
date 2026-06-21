
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, CircleCheck } from "lucide-react";

const faixas = [
  { label: "Até 60 páginas", price: 559.90 },
  { label: "Até 150 páginas", price: 579.90 },
  { label: "300 páginas ou mais", price: 619.90 },
];

const features = [
  "Revisão Ortográfica e Gramatical",
  "Diagramação profissional",
  "E-book",
  "Arquivo para Impressão",
  "Conversão para Kindle (ePub)",
  "ISBN Digital e Físico",
  "Ficha Catalográfica",
  "Capa Profissional (2 modelos)",
  "QR Code interativo",
  "Conselho Editorial",
];

export default function PlusPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/publicar" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="size-4" />Voltar para planos
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-[var(--radius-md)] gradient-cyan flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pacote Plus</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Completo + Revisão + Kindle</p>
          </div>
        </div>

        <div className="gradient-card rounded-[var(--radius-xl)] border border-cyan-500/30 bg-cyan-500/5 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {faixas.map((f) => (
              <div key={f.label} className="rounded-[var(--radius-md)] border border-cyan-500/30 bg-[var(--color-bg)] p-4 text-center">
                <p className="text-xs text-[var(--color-text-muted)]">{f.label}</p>
                <p className="text-lg font-bold text-gradient-cyan mt-1">R$ {f.price.toFixed(2).replace(".", ",")}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-[var(--radius-md)] border border-cyan-500/20 bg-cyan-500/5">
            <p className="text-xs font-medium text-cyan-500 mb-2">INCLUSO</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <CircleCheck className="w-4 h-4 text-cyan-400 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/publicar/plus/submeter"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
          >
            Continuar para submissão <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Aceitamos <span className="font-medium text-[var(--color-text)]">Pix</span> ou{" "}
            <span className="font-medium text-[var(--color-text)]">Cartão em até 5x sem acréscimo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
