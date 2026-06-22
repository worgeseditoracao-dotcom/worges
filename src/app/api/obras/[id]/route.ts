import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("obras")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });

    return NextResponse.json({ obra: data });
  } catch (err) {
    console.error("Erro ao buscar obra:", err);
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
    const adminClient = createSupabaseAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const perfil = await supabase.from("perfis").select("tipo").eq("id", user.id).maybeSingle();
    const isAdmin = perfil.data?.tipo === "admin";

    // Buscar obra para verificar propriedade (via admin client para bypass RLS)
    const { data: obraAtual, error: obraErr } = await adminClient
      .from("obras")
      .select("*, pedidos(usuario_id)")
      .eq("id", id)
      .single();

    if (obraErr || !obraAtual) {
      return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 });
    }

    const pedidoData = (obraAtual as any).pedidos;
    const autorId = (pedidoData && !Array.isArray(pedidoData)) ? pedidoData.usuario_id : (Array.isArray(pedidoData) ? pedidoData[0]?.usuario_id : null);
    const isOwner = autorId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const body = await request.json();

    // Campos que o autor pode editar no próprio perfil
    const camposAutor = ["titulo", "autores", "categoria", "resumo", "capa_url", "open_access"];
    // Campos restritos ao admin: slug, pdf_url, pedido_id, doi, publicado, data_publicacao, isbn

    const updateData: Record<string, any> = {};
    for (const key of Object.keys(body)) {
      if (isAdmin) {
        updateData[key] = body[key];
      } else if (camposAutor.includes(key)) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nenhum campo permitido para edição" }, { status: 400 });
    }

    // Usar admin client para bypass RLS no update
    const { data, error } = await adminClient
      .from("obras")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ obra: data });
  } catch (err) {
    console.error("Erro ao atualizar obra:", err);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
