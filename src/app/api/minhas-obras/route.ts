import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("obras")
      .select("*, pedidos!inner(usuario_id)")
      .eq("pedidos.usuario_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ obras: data });
  } catch (err) {
    console.error("Erro ao buscar obras do autor:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
