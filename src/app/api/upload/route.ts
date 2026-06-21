import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { pedido_id, nome, tipo, url } = body;

    if (!pedido_id || !nome || !tipo || !url) {
      return NextResponse.json({ error: "Campos obrigatórios: pedido_id, nome, tipo, url" }, { status: 400 });
    }

    const { data, error } = await supabase.from("pedido_arquivos").insert({
      pedido_id,
      nome,
      tipo,
      url,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ arquivo: data }, { status: 201 });
  } catch (err) {
    console.error("Erro ao salvar arquivo:", err);
    return NextResponse.json({ error: "Erro ao salvar arquivo" }, { status: 500 });
  }
}
