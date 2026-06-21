"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const user = useStore((s) => s.user);
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (user) return <>{children}</>;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Preencha e-mail e senha."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.includes("Invalid login credentials")) toast.error("E-mail ou senha incorretos.");
      else toast.error(error.message);
      return;
    }
    toast.success("Bem-vindo de volta!");
    router.refresh();
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Preencha todos os campos."); return; }
    if (password.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      if (error.message.includes("already registered")) toast.error("Este e-mail já está cadastrado.");
      else toast.error(error.message);
      return;
    }
    toast.success("Conta criada! Verifique seu e-mail para confirmar.");
    router.refresh();
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-[var(--radius-md)] gradient-cyan flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Crie sua conta para continuar</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Você precisa estar logado para contratar um pacote e acompanhar suas obras.
        </p>
      </div>

      <div className="gradient-card rounded-[var(--radius-xl)] border border-[var(--color-border)] p-8">
        <div className="cmyk-stripes h-1 rounded-t-[var(--radius-xl)] -mx-8 -mt-8 mb-8 rounded-[var(--radius-xl)_var(--radius-xl)_0_0]" />

        {/* Abas */}
        <div className="flex gap-1 mb-6 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] p-1 border border-[var(--color-border)]">
          <button
            onClick={() => setModo("login")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${
              modo === "login" ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm" : "text-[var(--color-text-muted)]"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Entrar
          </button>
          <button
            onClick={() => setModo("cadastro")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${
              modo === "cadastro" ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm" : "text-[var(--color-text-muted)]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Cadastrar
          </button>
        </div>

        {modo === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-sm font-medium">E-mail</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password" className="text-sm font-medium">Senha</label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pr-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-cyan-500">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-1 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black transition-all shadow-cyan">
              {loading ? "Entrando..." : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCadastro} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-name" className="text-sm font-medium">Nome completo</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email2" className="text-sm font-medium">E-mail</label>
              <input
                id="auth-email2"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password2" className="text-sm font-medium">Senha</label>
              <div className="relative">
                <input
                  id="auth-password2"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pr-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none transition-colors focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-cyan-500">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-1 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black transition-all shadow-cyan">
              {loading ? "Criando conta..." : (
                <>Criar conta e continuar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
