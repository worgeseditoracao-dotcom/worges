import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { data, error } = await supabase
      .from("pedidos")
      .select("*, pedido_servicos(*), pedido_etapas(*), pedido_arquivos(*), pedido_mudancas(*), obras(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

    return NextResponse.json({ pedido: data });
  } catch (err) {
    console.error("Erro ao buscar pedido:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await request.json();

    // Verificar se é admin para ações administrativas
    const perfil = await supabase.from("perfis").select("tipo").eq("id", user.id).maybeSingle();
    if (perfil.data?.tipo !== "admin" && ["status", "orcamento_final", "open_access"].some(k => k in body)) {
      return NextResponse.json({ error: "Apenas admin pode alterar status" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("pedidos")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Registrar mudança se status foi alterado
    if (body.status) {
      await supabase.from("pedido_mudancas").insert({
        pedido_id: id,
        acao: body.status.replace(/_/g, " "),
        descricao: `Status atualizado para "${body.status}"`,
        usuario: user.email ?? "Admin",
      });
    }

    return NextResponse.json({ pedido: data });
  } catch (err) {
    console.error("Erro ao atualizar pedido:", err);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
