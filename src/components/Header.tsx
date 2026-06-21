"use client";

import Link from "next/link";
import { BookOpen, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const user = useStore((s) => s.user);

  async function handleLogout() {
    setUserMenuOpen(false);
    setMenuOpen(false);
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient-cyan">Worges</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/catalogo" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">
              Catálogo
            </Link>
            <Link href="/publicar" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">
              Publicar
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md py-1 z-50">
                    <Link
                      href="/minha-conta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 hover:bg-[var(--color-bg-subtle)] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Minha conta
                    </Link>
                    {user.tipo === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-cyan-500 font-medium hover:bg-[var(--color-bg-subtle)] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-red-500 hover:bg-[var(--color-bg-subtle)] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors">
                Entrar
              </Link>
            )}

            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all"
            >
              Publicar obra
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-cyan-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--color-border)] pt-4 flex flex-col gap-3">
            <Link href="/catalogo" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
            <Link href="/publicar" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400" onClick={() => setMenuOpen(false)}>
              Publicar
            </Link>
            {user ? (
              <>
                <Link
                  href="/minha-conta"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Minha conta ({user.name})
                </Link>
                {user.tipo === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-cyan-500 font-medium hover:text-cyan-400"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-red-500 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="text-sm text-[var(--color-text-muted)] hover:text-cyan-400" onClick={() => setMenuOpen(false)}>
                Entrar
              </Link>
            )}
            <Link
              href="/publicar"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black"
              onClick={() => setMenuOpen(false)}
            >
              Publicar obra
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
