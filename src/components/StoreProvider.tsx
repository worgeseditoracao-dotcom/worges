"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchTipo(session.user.id, session.user.email ?? "", session.user.user_metadata?.name ?? "Usuário");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchTipo(session.user.id, session.user.email ?? "", session.user.user_metadata?.name ?? "Usuário");
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  async function fetchTipo(id: string, email: string, name: string) {
    const { data } = await supabase
      .from("perfis")
      .select("tipo")
      .eq("id", id)
      .maybeSingle();
    setUser({
      id,
      email,
      name,
      tipo: (data?.tipo as "autor" | "admin") ?? "autor",
    });
  }

  return <>{children}</>;
}
