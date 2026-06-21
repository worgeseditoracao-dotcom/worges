import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createSupabaseServerClient();

    // Usar admin client para bypass RLS e buscar obra
    const adminClient = createSupabaseAdminClient();
    const { data: obra, error } = await adminClient
      .from("obras")
      .select("*, pedidos(usuario_id)")
      .eq("slug", slug)
      .single();

    if (error || !obra) {
      return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });
    }

    // Se estiver publicada, qualquer um pode ver
    if (obra.publicado) {
      return NextResponse.json({
        obra,
        pode_gerenciar: false,
        is_owner_or_admin: false,
      });
    }

    // Se não estiver publicada, só autor ou admin podem ver
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });
    }

    const perfil = await supabase.from("perfis").select("tipo").eq("id", user.id).maybeSingle();
    const isAdmin = perfil.data?.tipo === "admin";
    const pedidoData = (obra as any).pedidos;
    const autorId = (pedidoData && !Array.isArray(pedidoData)) ? pedidoData.usuario_id : (Array.isArray(pedidoData) ? pedidoData[0]?.usuario_id : null);
    const isOwner = autorId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      obra,
      pode_gerenciar: true,
      is_owner_or_admin: true,
    });
  } catch (err) {
    console.error("Erro ao buscar obra por slug:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
