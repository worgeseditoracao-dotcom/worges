import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, LayoutDashboard, ClipboardList, Layers, ChartColumn, Settings, LogOut } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
  { label: "Obras", href: "/admin/obras", icon: BookOpen },
  { label: "Coletâneas", href: "/admin/obras", icon: Layers },
  { label: "Relatórios", href: "/admin/relatorios", icon: ChartColumn },
  { label: "Configurações", href: "/admin/config", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userNome = user?.user_metadata?.name ?? "Admin";
  const userEmail = user?.email ?? "admin@worges.com.br";
  const userIniciais = userNome.slice(0, 2).toUpperCase();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const perfil = await supabase.from("perfis").select("tipo").eq("id", user.id).maybeSingle();
  if (perfil.data?.tipo !== "admin") {
    redirect("/minha-conta");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <aside className="w-60 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex flex-col">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] gradient-cyan flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient-cyan">Worges Admin</span>
        </div>

        <nav className="flex-1 py-4 px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-sm font-semibold text-[var(--color-text)]">
              {userIniciais}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-text)]">{userNome}</span>
              <span className="text-xs text-[var(--color-text-subtle)]">{userEmail}</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Voltar ao site
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
