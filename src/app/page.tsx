import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BookOpen, Layers, Award, FileText, Clock, CircleCheck, BookMarked, Zap, ExternalLink, Globe, Lock, Search, SlidersHorizontal } from "lucide-react";

const plans = [
  {
    icon: BookOpen,
    iconColor: "text-cyan-400",
    title: "Ebook",
    subtitle: "Para obras digitais",
    description: "ISBN, DOI, diagramação profissional e distribuição em plataformas digitais.",
    price: "R$ 200,00",
    priceNote: "até 100 páginas",
    href: "/publicar/ebook",
  },
  {
    icon: BookOpen,
    iconColor: "text-cyan-400",
    title: "Ebook + Impressão",
    subtitle: "Para obras físicas e digitais",
    description: "Ebook com ISBN e DOI + versão impressa com tiragem sob demanda.",
    price: "R$ 350,00",
    priceNote: "",
    href: "/publicar/ebook-impressao",
  },
  {
    icon: Layers,
    iconColor: "text-teal-400",
    title: "Capítulo em Coletânea",
    subtitle: "Para obras coletivas",
    description: "Publique seu capítulo em uma coletânea organizada por especialistas.",
    price: "R$ 7,00",
    priceNote: "por página excedente",
    href: "/publicar/capitulo",
  },
] as const;

const services = [
  { icon: FileText, label: "DOI", price: "+R$ 40,00" },
  { icon: CircleCheck, label: "Revisão ortográfica", price: "+R$ 200,00" },
  { icon: BookMarked, label: "Normalização ABNT", price: "+R$ 200,00" },
  { icon: Zap, label: "Urgência", price: "+R$ 169,90" },
] as const;

const steps = [
  { number: "01", title: "Escolha o pacote", desc: "Selecione o plano ideal para sua obra." },
  { number: "02", title: "Envie seus arquivos", desc: "Faça upload do conteúdo pronto ou agende uma diagramação." },
  { number: "03", title: "Pague com segurança", desc: "Pagamento processado com criptografia e segurança." },
  { number: "04", title: "Análise editorial", desc: "Nossa equipe revisa e prepara sua obra para publicação." },
  { number: "05", title: "Obra publicada", desc: "Sua obra disponível com ISBN, DOI e distribuição." },
] as const;

const catalogBooks = [
  {
    title: "Fundamentos da Pesquisa Qualitativa",
    authors: ["Dra. Marina Oliveira", "Prof. Carlos Santos"],
    access: "Acesso livre",
    accessIcon: Globe,
    cover: "/images/book-cover-1.jpg",
    category: "Acadêmico",
    isbn: "ISBN 978-65-00-00001-1",
  },
  {
    title: "Inteligência Artificial na Educação",
    authors: ["Prof. Rafael Mendes"],
    access: "Restrito",
    accessIcon: Lock,
    cover: "/images/book-cover-2.jpg",
    category: "Tecnologia",
    doi: "DOI 10.0000/worges-ia-educacao",
  },
  {
    title: "Direito Constitucional Avançado",
    authors: ["Dr. Paulo Ferreira"],
    access: "Acesso livre",
    accessIcon: Globe,
    cover: "/images/book-cover-3.jpg",
    category: "Direito",
    isbn: "ISBN 978-65-00-00002-8",
  },
  {
    title: "Gestão Empresarial Contemporânea",
    authors: ["Dra. Ana Luiza Costa", "Msc. Bruno Lima"],
    access: "Restrito",
    accessIcon: Lock,
    cover: "/images/book-cover-4.jpg",
    category: "Gestão",
    doi: "DOI 10.0000/worges-gestao",
  },
] as const;

const editorialDocs = [
  "Carta de aceite",
  "Certificado",
  "Ficha catalográfica",
  "Datas editoriais",
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pt-32 sm:pb-36 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/50 text-xs text-[var(--color-text-muted)] mb-6">
            <Star className="w-3.5 h-3.5 text-cyan-400" />
            Plataforma editorial completa
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-3xl mx-auto">
            Publique sua obra com{" "}
            <span className="text-gradient-cyan">excelência editorial</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
            Ebooks, livros impressos e capítulos de coletânea com ISBN, DOI, diagramação profissional e distribuição digital.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
            >
              Publicar obra
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
            >
              Ver catálogo
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Publishing Plans */}
      <section id="planos" className="py-20 sm:py-28 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Planos de publicação</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Escolha o plano ideal para sua obra</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className="gradient-card rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 flex flex-col transition-all hover:border-cyan-500/30 hover:shadow-cyan relative overflow-hidden"
              >
                <div className="cmyk-stripes absolute top-0 left-0 right-0 h-1" />
                <div className={`w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] flex items-center justify-center ${plan.iconColor}`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{plan.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{plan.subtitle}</p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">{plan.description}</p>
                <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                  <p className="text-2xl font-bold text-gradient-cyan">{plan.price}</p>
                  {plan.priceNote && (
                    <p className="text-xs text-[var(--color-text-subtle)] mt-1">{plan.priceNote}</p>
                  )}
                </div>
                <Link
                  href={plan.href}
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                >
                  Ver pacote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="py-20 sm:py-28 bg-[var(--color-bg-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Serviços adicionais</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Potencialize sua publicação com nossos serviços editoriais</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div
                key={svc.label}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center transition-all hover:border-cyan-500/30 hover:shadow-cyan"
              >
                <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] flex items-center justify-center mx-auto text-cyan-400">
                  <svc.icon className="w-4.5 h-4.5" />
                </div>
                <p className="mt-3 text-sm font-medium">{svc.label}</p>
                <p className="mt-1 text-sm text-gradient-cyan font-semibold">{svc.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="processo" className="py-20 sm:py-28 bg-[var(--color-bg)]">
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

      {/* Catalog */}
      <section id="catalogo" className="py-20 sm:py-28 bg-[var(--color-bg-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Catálogo de obras</h2>
            <p className="mt-3 text-[var(--color-text-muted)]">Conheça algumas obras publicadas pela Worges</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogBooks.map((book) => (
              <div
                key={book.title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-all hover:border-cyan-500/30 hover:shadow-cyan"
              >
                <div className="relative aspect-[3/4] bg-[var(--color-surface-alt)] overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-block px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-semibold bg-cyan-500/10 text-cyan-700 border border-cyan-500/20">
                      {book.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium bg-white/80 text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      <book.accessIcon className="w-3 h-3" />
                      {book.access}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-snug">{book.title}</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{book.authors.join(", ")}</p>
                  <p className="mt-2 text-[10px] text-[var(--color-text-subtle)]">
                    {"isbn" in book ? book.isbn : book.doi}
                  </p>
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

      {/* About */}
      <section id="sobre" className="py-20 sm:py-28 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Sua parceira editorial <span className="text-gradient-cyan">do início ao fim</span>
              </h2>
              <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">
                A Worges nasceu para democratizar a publicação editorial. Oferecemos suporte completo para autores independentes,
                instituições de ensino e pesquisadores que desejam publicar com qualidade profissional.
              </p>
              <p className="mt-3 text-[var(--color-text-muted)] leading-relaxed">
                Da diagramação à distribuição, passando por ISBN, DOI e normalização ABNT — cuidamos de cada etapa para que
                você foque no que importa: seu conteúdo.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Diagramação profissional",
                  "Registro de ISBN e DOI",
                  "Distribuição em plataformas digitais",
                  "Suporte editorial dedicado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]">
                    <CircleCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:p-8">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Documentos editoriais
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {editorialDocs.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]"
                  >
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pronto para publicar?</h2>
          <p className="mt-3 text-[var(--color-text-muted)] max-w-lg mx-auto">
            Comece agora e publique sua obra com todo o suporte editorial que você merece.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-cyan"
            >
              Publicar obra
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
            >
              Explorar catálogo
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
