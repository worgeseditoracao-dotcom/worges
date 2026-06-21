import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Layers,
  ExternalLink,
  FileText,
  CircleCheck,
  BookMarked,
  Zap,
  Clock,
  Globe,
} from "lucide-react";

const plans = [
  {
    id: "ebook",
    icon: BookOpen,
    title: "Ebook",
    price: "R$ 200,00",
    priceNote: "até 100 páginas",
    href: "/publicar/ebook",
    features: [
      "ISBN",
      "DOI",
      "Diagramação profissional",
      "Capa personalizada",
      "Ficha catalográfica",
      "Certificado",
    ],
  },
  {
    id: "ebook-impressao",
    icon: BookOpen,
    title: "Ebook + Impressão",
    price: "R$ 350,00",
    priceNote: "até 100 páginas",
    href: "/publicar/ebook-impressao",
    features: [
      "Tudo do Ebook +",
      "Impressão sob demanda",
      "Formato A5/B5",
      "Lombada personalizada",
    ],
  },
  {
    id: "capitulo",
    icon: Layers,
    title: "Capítulo em Coletânea",
    price: "R$ 7,00/página excedente",
    priceNote: "",
    href: "/publicar/capitulo",
    features: [
      "DOI",
      "Certificado",
      "Carta de aceite",
      "10 páginas grátis",
      "Diagramação",
    ],
  },
] as const;

const services = [
  { icon: FileText, label: "DOI", price: "R$ 40,00" },
  { icon: CircleCheck, label: "Revisão", price: "R$ 200,00" },
  { icon: BookMarked, label: "ABNT", price: "R$ 200,00" },
  { icon: Zap, label: "Urgência", price: "R$ 169,90" },
] as const;

const steps = [
  { number: "01", title: "Escolha o pacote", desc: "Selecione o plano ideal para sua obra." },
  { number: "02", title: "Envie seus arquivos", desc: "Faça upload do conteúdo pronto." },
  { number: "03", title: "Pague com segurança", desc: "Pagamento processado com segurança." },
  { number: "04", title: "Análise editorial", desc: "Revisamos e preparamos sua obra." },
  { number: "05", title: "Obra publicada", desc: "Disponível com ISBN, DOI e distribuição." },
] as const;

const catalogBooks = [
  {
    title: "Fundamentos da Pesquisa Qualitativa",
    authors: ["Dra. Marina Oliveira", "Prof. Carlos Santos"],
    category: "Acadêmico",
    isbn: "ISBN 978-65-00-00001-1",
    cover: "/images/book-cover-1.jpg",
  },
  {
    title: "Inteligência Artificial na Educação",
    authors: ["Prof. Rafael Mendes"],
    category: "Tecnologia",
    isbn: "ISBN 978-65-00-00002-8",
    cover: "/images/book-cover-2.jpg",
  },
  {
    title: "Direito Constitucional Avançado",
    authors: ["Dr. Paulo Ferreira"],
    category: "Direito",
    isbn: "ISBN 978-65-00-00003-5",
    cover: "/images/book-cover-3.jpg",
  },
  {
    title: "Gestão Empresarial Contemporânea",
    authors: ["Dra. Ana Luiza Costa", "Msc. Bruno Lima"],
    category: "Gestão",
    isbn: "ISBN 978-65-00-00004-2",
    cover: "/images/book-cover-4.jpg",
  },
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
            Temos o plano perfeito para sua obra, seja ela digital, impressa ou em coletânea.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="gradient-card rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col transition-all hover:border-cyan-500/30 hover:shadow-cyan"
              >
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{plan.title}</h3>
                <p className="mt-3 text-2xl font-bold text-gradient-cyan">{plan.price}</p>
                {plan.priceNote && (
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">{plan.priceNote}</p>
                )}
                <ul className="mt-5 flex flex-col gap-2.5 flex-1">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div
                key={svc.label}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-center transition-all hover:border-cyan-500/30 hover:shadow-cyan"
              >
                <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                  <svc.icon className="w-4.5 h-4.5" />
                </div>
                <p className="mt-3 text-sm font-medium">{svc.label}</p>
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

      {/* Catalog Preview */}
      <section className="py-20 sm:py-28 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Obras publicadas</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Conheça alguns títulos do nosso catálogo</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogBooks.map((book) => (
              <div
                key={book.title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden transition-all hover:border-cyan-500/30 hover:shadow-cyan"
              >
                <div className="relative aspect-[3/4] bg-[var(--color-surface)] overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-block px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-semibold bg-white/90 text-cyan-700 border border-cyan-500/20">
                      {book.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-snug">{book.title}</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{book.authors.join(", ")}</p>
                  <p className="mt-2 text-[10px] text-[var(--color-text-subtle)]">{book.isbn}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
            >
              Ver catálogo completo
              <ExternalLink className="w-4 h-4" />
            </Link>
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
