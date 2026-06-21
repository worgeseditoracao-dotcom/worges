import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const busca = searchParams.get("busca");

    let query = supabase
      .from("obras")
      .select("*")
      .eq("publicado", true)
      .order("data_publicacao", { ascending: false, nullsFirst: false });

    if (categoria) query = query.eq("categoria", categoria);
    if (busca) query = query.or(`titulo.ilike.%${busca}%,autores.ilike.%${busca}%,resumo.ilike.%${busca}%`);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ obras: data });
  } catch (err) {
    console.error("Erro no catálogo:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
