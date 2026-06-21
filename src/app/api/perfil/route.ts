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
      .from("perfis")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ perfil: data });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
