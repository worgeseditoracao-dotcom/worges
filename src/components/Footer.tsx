import Link from "next/link";
import { BookOpen, Mail, Share2, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient-cyan">Worges</span>
            </Link>
            <p className="text-sm text-[var(--color-text-subtle)] leading-relaxed max-w-xs">
              Plataforma editorial para publicação e comercialização de obras autorais, acadêmicas e coletâneas.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="mailto:contato@worges.com.br" className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-cyan-400 hover:border-cyan-500/30 transition-colors" aria-label="E-mail">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-cyan-400 hover:border-cyan-500/30 transition-colors" aria-label="Instagram">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-cyan-400 hover:border-cyan-500/30 transition-colors" aria-label="LinkedIn">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] mb-4">Publicar</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/publicar/ebook" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Ebook</Link></li>
              <li><Link href="/publicar/ebook-impressao" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Ebook + Impressão</Link></li>
              <li><Link href="/publicar/capitulo" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Capítulo em Coletânea</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] mb-4">Serviços</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/publicar/ebook#servicos" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Revisão ortográfica</Link></li>
              <li><Link href="/publicar/ebook#servicos" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Normalização ABNT</Link></li>
              <li><Link href="/publicar/ebook#servicos" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">DOI</Link></li>
              <li><Link href="/publicar/ebook#servicos" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Urgência</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] mb-4">Institucional</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/#sobre" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Sobre a Worges</Link></li>
              <li><Link href="/catalogo" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Catálogo</Link></li>
              <li><Link href="/privacidade" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Política de privacidade</Link></li>
              <li><Link href="/termos" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">Termos de uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-subtle)]">© 2026 Worges. Todos os direitos reservados.</p>
          <p className="text-xs text-[var(--color-text-subtle)]">Pagamentos processados com segurança</p>
        </div>
      </div>
    </footer>
  );
}
