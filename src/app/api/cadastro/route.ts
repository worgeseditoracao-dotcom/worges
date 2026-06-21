import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, e-mail e senha são obrigatórios." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      if (error.message?.includes("already registered") || error.code === "user_already_exists") {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: { id: data.user?.id, email: data.user?.email },
      message: "Conta criada com sucesso!",
    }, { status: 201 });
  } catch (err: any) {
    console.error("Erro ao criar conta:", err);
    return NextResponse.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}
