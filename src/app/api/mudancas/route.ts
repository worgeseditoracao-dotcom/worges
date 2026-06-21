import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { pedido_id, acao, descricao } = await request.json();
    if (!pedido_id || !acao) {
      return NextResponse.json({ error: "Campos obrigatórios: pedido_id, acao" }, { status: 400 });
    }

    const { data, error } = await supabase.from("pedido_mudancas").insert({
      pedido_id,
      acao,
      descricao: descricao ?? "",
      usuario: user.email ?? "Sistema",
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ mudanca: data }, { status: 201 });
  } catch (err) {
    console.error("Erro ao registrar mudança:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
