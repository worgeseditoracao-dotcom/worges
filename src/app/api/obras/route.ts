import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("obras")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ obras: data });
  } catch (err) {
    console.error("Erro ao buscar obras:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

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
    const { titulo, slug, autores, resumo, categoria, capa_url, pdf_url, open_access, publicado, data_publicacao, pedido_id } = body;

    const { data, error } = await supabase.from("obras").insert({
      titulo,
      slug: slug ?? titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      autores,
      resumo,
      categoria,
      capa_url,
      pdf_url,
      open_access: open_access ?? false,
      publicado: publicado ?? true,
      data_publicacao: data_publicacao ?? new Date().toISOString().split("T")[0],
      pedido_id,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ obra: data }, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar obra:", err);
    return NextResponse.json({ error: "Erro ao criar obra" }, { status: 500 });
  }
}
