import Link from "next/link"
import Image from "next/image"
import { Search, SlidersHorizontal, BookOpen, Layers, Globe, Lock, ExternalLink } from "lucide-react"

const books = [
  {
    title: "Fundamentos da Pesquisa Qualitativa",
    authors: "Dra. Marina Oliveira, Prof. Carlos Santos",
    access: "open",
    tags: ["Metodologia", "Pesquisa"],
    doi: "10.1234/worges.2024.001",
    slug: "fundamentos-da-pesquisa-qualitativa",
    cover: "/images/book-cover-1.jpg",
  },
  {
    title: "Inteligência Artificial na Educação",
    authors: "Prof. Rafael Mendes",
    access: "restricted",
    tags: ["Educação", "Tecnologia"],
    slug: "inteligencia-artificial-na-educacao",
    cover: "/images/book-cover-2.jpg",
  },
  {
    title: "Direito Constitucional Avançado",
    authors: "Dr. Paulo Ferreira",
    access: "open",
    tags: ["Direito", "Constituição"],
    doi: "10.1234/worges.2024.003",
    slug: "direito-constitucional-avancado",
    cover: "/images/book-cover-3.jpg",
  },
  {
    title: "Gestão Empresarial Contemporânea",
    authors: "Dra. Ana Luiza Costa, Msc. Bruno Lima",
    access: "restricted",
    tags: ["Administração", "Gestão"],
    slug: "gestao-empresarial-contemporanea",
    cover: "/images/book-cover-4.jpg",
  },
]

const collections = [
  {
    title: "Inovação e Tecnologia na Saúde",
    organizers: "Org. Dra. Fernanda Castro",
    chapters: 2,
    isbn: "978-65-5432-010-4",
    slug: "inovacao-e-tecnologia-na-saude",
  },
  {
    title: "Educação Inclusiva: Perspectivas Atuais",
    organizers: "Org. Profa. Juliana Matos, Prof. Marcos Vinicius",
    chapters: 0,
    isbn: "978-65-5432-011-1",
    slug: "educacao-inclusiva-perspectivas-atuais",
  },
]

const categories = [
  "Todos",
  "Metodologia",
  "Educação",
  "Tecnologia",
  "Direito",
  "Saúde",
  "Ciências Sociais",
  "Administração",
  "IA",
]

export default function CatalogoPage() {
  return (
    <div>
      <header className="border-b bg-[var(--color-bg-subtle)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            Catálogo
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Obras publicadas</h1>
          <p className="mt-1 text-[var(--color-muted-foreground)]">
            Explore livros, ebooks e coletâneas publicados pela Worges.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <input
                type="text"
                placeholder="Buscar por título, autor..."
                className="w-full rounded-lg border bg-[var(--color-bg)] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-subtle)]"
            >
              <SlidersHorizontal className="size-4" />
              Filtros
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  cat === "Todos"
                    ? "rounded-full bg-cyan-600 px-4 py-1.5 text-xs font-medium text-white"
                    : "rounded-full border px-4 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-bg-subtle)]"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="size-5" />
            <h2 className="text-xl font-semibold">Livros e Ebooks</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <Link
                key={book.slug}
                href={`/obra/${book.slug}`}
                className="group rounded-lg border bg-[var(--color-bg)] p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-md bg-[var(--color-bg-subtle)]">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-semibold leading-snug group-hover:text-cyan-600">
                  {book.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{book.authors}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {book.access === "open" ? (
                    <>
                      <Globe className="size-3 text-green-600" />
                      <span className="font-medium text-green-600">Acesso livre</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-3" />
                      <span className="font-medium">Restrito</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10px] text-[var(--color-muted-foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {book.doi && (
                  <p className="mt-2 text-[10px] text-[var(--color-muted-foreground)]">
                    DOI: {book.doi}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-center gap-2">
            <Layers className="size-5" />
            <h2 className="text-xl font-semibold">Coletâneas</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/obra/${col.slug}`}
                className="group rounded-lg bg-gradient-to-br from-[var(--color-bg-subtle)] to-[var(--color-bg)] p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold leading-snug group-hover:text-cyan-600">
                      {col.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                      {col.organizers}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                      {col.chapters} capítulo{col.chapters !== 1 ? "s" : ""}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <Globe className="size-3" />
                      <span className="font-medium">Acesso livre</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--color-muted-foreground)]">
                      ISBN {col.isbn}
                    </p>
                  </div>
                  <ExternalLink className="mt-1 size-4 text-[var(--color-muted-foreground)]" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
