import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const perfil = await supabase.from("perfis").select("tipo").eq("id", user.id).maybeSingle();
    if (perfil.data?.tipo !== "admin") {
      return NextResponse.json({ error: "Apenas admin" }, { status: 403 });
    }

    const body = await request.json();
    const { pedido_id, label, descricao } = body;

    if (!pedido_id || !label) {
      return NextResponse.json({ error: "Campos obrigatórios: pedido_id, label" }, { status: 400 });
    }

    // Concluir etapa atual
    await supabase
      .from("pedido_etapas")
      .update({ concluida: true, atual: false, data: new Date().toISOString() })
      .eq("pedido_id", pedido_id)
      .eq("atual", true);

    // Avançar para próxima etapa
    const { data: prox } = await supabase
      .from("pedido_etapas")
      .select("*")
      .eq("pedido_id", pedido_id)
      .eq("concluida", false)
      .eq("label", label)
      .order("ordem")
      .limit(1)
      .single();

    if (prox) {
      await supabase
        .from("pedido_etapas")
        .update({ atual: true, data: new Date().toISOString() })
        .eq("id", prox.id);
    }

    // Registrar mudança
    await supabase.from("pedido_mudancas").insert({
      pedido_id,
      acao: label,
      descricao: descricao ?? `Etapa "${label}" concluída.`,
      usuario: user.email ?? "Admin",
    });

    return NextResponse.json({ success: true, etapa: prox });
  } catch (err) {
    console.error("Erro ao avançar etapa:", err);
    return NextResponse.json({ error: "Erro ao avançar etapa" }, { status: 500 });
  }
}
