import { redirect } from "next/navigation";

export default function EbookImpressaoRedirect() {
  redirect("/publicar/impressao");
}

type Faixa = "60" | "150" | "250" | "300+";
type Modalidade = "sem" | "com";

const precosSem: Record<Faixa, number> = {
  "60": 329.9,
  "150": 369.9,
  "250": 409.9,
  "300+": 449.9,
};

const precosCom: Record<Faixa, number> = {
  "60": 389.9,
  "150": 469.9,
  "250": 549.9,
  "300+": 629.9,
};

const incluidosSem = [
  "Capa com 2 modelos",
  "ISBN digital",
  "ISBN físico",
  "Ficha catalográfica",
  "Adequação para impressão",
  "PDF final",
];

const incluidosCom = [
  "Diagramação profissional",
  "Capa profissional com 2 modelos",
  "ISBN digital",
  "ISBN físico",
  "Ficha catalográfica",
  "Arquivo pronto para impressão",
  "PDF do ebook",
];

const faixas: { valor: Faixa; label: string }[] = [
  { valor: "60", label: "Até 60 páginas" },
  { valor: "150", label: "Até 150 páginas" },
  { valor: "250", label: "Até 250 páginas" },
  { valor: "300+", label: "300+ páginas" },
];

const prazos: Record<Modalidade, string> = {
  sem: "7 a 10 dias úteis",
  com: "15 a 20 dias úteis",
};

export default function EbookImpressaoPage() {
  const [faixa, setFaixa] = useState<Faixa>("60");
  const [modalidade, setModalidade] = useState<Modalidade>("sem");

  const preco = modalidade === "sem" ? precosSem[faixa] : precosCom[faixa];
  const incluidos = modalidade === "sem" ? incluidosSem : incluidosCom;

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Voltar para planos
        </Link>

        <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
          <div className="cmyk-stripes h-1.5" />
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center">
                <Printer className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Ebook + Impressão</h1>
            </div>
            <p className="text-[var(--color-text-muted)]">
              Publique nas versões digital e física com ISBN, ficha catalográfica e arquivo para impressão.
            </p>

            {/* Modalidade */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Modalidade</p>
              <div className="grid grid-cols-2 gap-3">
                {(["sem", "com"] as Modalidade[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setModalidade(m)}
                    className={`px-4 py-3 rounded-[var(--radius-md)] border text-sm font-medium transition-all text-left ${
                      modalidade === m
                        ? "border-cyan-500 bg-cyan-500/5 text-cyan-600"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40"
                    }`}
                  >
                    <span className="font-semibold">{m === "sem" ? "Sem diagramação" : "Com diagramação"}</span>
                    <br />
                    <span className="text-xs opacity-70">
                      {m === "sem" ? "Você envia o arquivo pronto" : "Diagramamos seu conteúdo"}
                    </span>
                  </button>
                ))}
              </div>
              {modalidade === "com" && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] rounded-[var(--radius-sm)] px-3 py-2 border border-[var(--color-border)]">
                  A capa física pode ser adaptada para impressão se você enviar a versão base.
                </p>
              )}
            </div>

            {/* Faixa de páginas */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Faixa de páginas</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {faixas.map((f) => (
                  <button
                    key={f.valor}
                    onClick={() => setFaixa(f.valor)}
                    className={`px-3 py-2.5 rounded-[var(--radius-md)] border text-xs font-medium transition-all ${
                      faixa === f.valor
                        ? "border-cyan-500 bg-cyan-500/5 text-cyan-600"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preço calculado */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex items-end gap-4 flex-wrap">
              <div>
                <p className="text-3xl font-bold text-gradient-cyan">
                  R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                  Aceitamos Pix ou Cartão em até 5x sem acréscimo
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] ml-auto">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Prazo: {prazos[modalidade]}
              </div>
            </div>

            {/* Inclusos */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">O que está incluído</p>
              <ul className="flex flex-col gap-2">
                {incluidos.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Diferenciais */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium">Versão digital</p>
                  <p className="text-xs text-[var(--color-text-muted)]">PDF para distribuição digital</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                <Printer className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium">Versão física</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Arquivo pronto para gráfica</p>
                </div>
              </div>
            </div>

            {/* Template */}
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <Download className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Template de formatação</p>
                <p className="text-xs text-[var(--color-text-muted)]">Use o modelo para garantir o padrão correto</p>
              </div>
              <button className="text-xs font-medium text-cyan-600 hover:text-cyan-500 transition-colors whitespace-nowrap">
                Baixar
              </button>
            </div>

            <Link
              href={`/publicar/ebook-impressao/submeter?modalidade=${modalidade}&faixa=${faixa}`}
              className="mt-8 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
            >
              Contratar pacote — R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
