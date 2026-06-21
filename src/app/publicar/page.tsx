import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Layers,
  ExternalLink,
  FileText,
  CircleCheck,
  Zap,
  Globe,
  Printer,
  Star,
  Sparkles,
  QrCode,
  BookMarked,
} from "lucide-react";

const plans = [
  {
    id: "ebook-sem-diagramacao",
    icon: BookOpen,
    title: "E-book sem Diagramação",
    subtitle: "Autor envia o arquivo pronto",
    price: "R$ 249,90",
    priceNote: "Preço único",
    href: "/publicar/ebook",
    features: [
      "ISBN Digital",
      "Ficha Catalográfica",
      "Capa Profissional",
      "QR Code",
      "Conselho Editorial",
    ],
    featured: false,
  },
  {
    id: "ebook-com-diagramacao",
    icon: BookOpen,
    title: "E-book com Diagramação",
    subtitle: "Diagramação profissional inclusa",
    price: "R$ 269,90",
    priceNote: "até 60 pág. | R$ 329,90 até 150 | R$ 349,90 300+",
    href: "/publicar/ebook",
    features: [
      "Diagramação profissional",
      "ISBN Digital",
      "Ficha Catalográfica",
      "Capa Profissional",
      "QR Code",
      "Conselho Editorial",
    ],
    featured: false,
  },
  {
    id: "impressao",
    icon: Printer,
    title: "Arquivo para Impressão",
    subtitle: "Pronto para gráfica",
    price: "R$ 289,90",
    priceNote: "até 60 pág. | R$ 339,90 até 150 | R$ 379,90 300+",
    href: "/publicar/impressao",
    features: [
      "Arquivo para Impressão",
      "ISBN Físico",
      "Ficha Catalográfica",
      "Capa Profissional",
      "QR Code",
      "Conselho Editorial",
    ],
    featured: true,
  },
  {
    id: "completo",
    icon: BookMarked,
    title: "Pacote Completo",
    subtitle: "E-book + Arquivo para Impressão",
    price: "R$ 329,90",
    priceNote: "até 60 pág. | R$ 349,90 até 150 | R$ 389,90 300+",
    href: "/publicar/completo",
    features: [
      "Diagramação profissional",
      "E-book",
      "Arquivo para Impressão",
      "ISBN Digital e Físico",
      "Ficha Catalográfica",
      "Capa Profissional",
      "QR Code",
      "Conselho Editorial",
    ],
    featured: true,
  },
  {
    id: "plus",
    icon: Sparkles,
    title: "Pacote Plus",
    subtitle: "Completo + Revisão + Kindle",
    price: "R$ 559,90",
    priceNote: "até 60 pág. | R$ 579,90 até 150 | R$ 619,90 300+",
    href: "/publicar/plus",
    features: [
      "Revisão Ortográfica e Gramatical",
      "Diagramação profissional",
      "E-book",
      "Arquivo para Impressão",
      "Conversão para Kindle (ePub)",
      "ISBN Digital e Físico",
      "Ficha Catalográfica",
      "Capa Profissional",
      "QR Code",
      "Conselho Editorial",
    ],
    featured: true,
  },
  {
    id: "capitulo",
    icon: Layers,
    title: "Capítulo em Coletânea",
    subtitle: "Até 30 páginas | 10 autores",
    price: "R$ 149,00",
    priceNote: "7 dias | R$ 190,00 urgência 2 dias",
    href: "/publicar/capitulo",
    features: [
      "DOI",
      "Certificado",
      "Carta de aceite",
      "Diagramação",
      "Template obrigatório",
    ],
    featured: false,
  },
] as const;

const services = [
  { icon: FileText, label: "DOI", price: "R$ 30,00" },
  { icon: Zap, label: "Conversão Kindle (ePub)", price: "R$ 89,90" },
  { icon: CircleCheck, label: "Revisão Ortográfica e Gramatical", price: "R$ 230,00" },
] as const;

const steps = [
  { number: "01", title: "Escolha o pacote", desc: "Selecione o plano ideal para sua obra." },
  { number: "02", title: "Envie seus arquivos", desc: "Faça upload do conteúdo pronto." },
  { number: "03", title: "Pague com segurança", desc: "Pix ou Cartão em até 5x sem acréscimo." },
  { number: "04", title: "Análise editorial", desc: "Revisamos e preparamos sua obra." },
  { number: "05", title: "Obra publicada", desc: "Disponível com ISBN, DOI e distribuição." },
] as const;

export default function PublicarPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pt-32 sm:pb-36 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/50 text-xs text-[var(--color-text-muted)] mb-6">
            Publicação
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-3xl mx-auto">
            Escolha o tipo de{" "}
            <span className="text-gradient-cyan">publicação</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
            Do e-book ao impresso, temos o pacote perfeito para sua obra.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Planos de publicação</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Escolha o plano ideal para sua obra</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`gradient-card rounded-[var(--radius-lg)] border p-6 flex flex-col transition-all hover:border-cyan-500/30 hover:shadow-cyan ${
                  plan.featured ? "border-cyan-500/30 bg-cyan-500/5" : "border-[var(--color-border)]"
                }`}
              >
                {plan.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500 text-black mb-3 self-start">
                    <Star className="w-3 h-3" /> Destaque
                  </span>
                )}
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{plan.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{plan.subtitle}</p>
                <p className="mt-3 text-2xl font-bold text-gradient-cyan">{plan.price}</p>
                <p className="text-xs text-[var(--color-text-subtle)] mt-1 leading-relaxed">{plan.priceNote}</p>
                <ul className="mt-5 flex flex-col gap-2 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                      <CircleCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
                >
                  Selecionar
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-28 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Serviços adicionais</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Adicione serviços complementares à sua publicação</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {services.map((svc) => (
              <div
                key={svc.label}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-center transition-all hover:border-cyan-500/30 hover:shadow-cyan"
              >
                <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                  <svc.icon className="w-4.5 h-4.5" />
                </div>
                <p className="mt-3 text-sm font-medium leading-snug">{svc.label}</p>
                <p className="mt-1 text-sm text-gradient-cyan font-semibold">{svc.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Como funciona</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Cinco passos para publicar sua obra</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-14 h-14 rounded-[var(--radius-full)] gradient-cyan flex items-center justify-center mx-auto shadow-cyan">
                  <span className="text-lg font-bold text-black">{step.number}</span>
                </div>
                <h3 className="mt-4 text-sm font-bold">{step.title}</h3>
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pronto para publicar?</h2>
          <p className="mt-3 text-[var(--color-text-muted)] max-w-lg mx-auto">
            Escolha um dos planos acima e comece agora mesmo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
            >
              <Globe className="w-4 h-4" />
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
