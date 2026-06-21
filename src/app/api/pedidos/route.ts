import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const perfil = await supabase.from("perfis").select("*").eq("id", user.id).maybeSingle();
    const isAdmin = perfil.data?.tipo === "admin";

    let query = supabase
      .from("pedidos")
      .select("*, pedido_servicos(*), pedido_etapas(*)")
      .order("data_criacao", { ascending: false });

    if (!isAdmin) {
      query = query.eq("usuario_id", user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ pedidos: data });
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, tipo, plano, modalidade, faixa_paginas, valor_base, orcamento_final, open_access, servicos, arquivos } = body;

    // Gerar código sequencial
    const { count } = await supabase.from("pedidos").select("*", { count: "exact", head: true });
    const codigo = `ORD-${String((count ?? 0) + 1).padStart(3, "0")}`;

    // Inserir pedido
    const { data: pedido, error } = await supabase.from("pedidos").insert({
      codigo,
      usuario_id: user.id,
      titulo,
      tipo,
      plano,
      modalidade,
      faixa_paginas,
      valor_base,
      orcamento_final,
      open_access: open_access ?? false,
      status: "pedido_criado",
    }).select().single();

    if (error) throw error;

    // Inserir serviços adicionais
    if (servicos?.length) {
      await supabase.from("pedido_servicos").insert(
        servicos.map((s: { nome: string; valor: number }) => ({
          pedido_id: pedido.id,
          nome: s.nome,
          valor: s.valor,
        }))
      );
    }

    // Criar etapas padrão
    const etapas = [
      { label: "Pedido criado", descricao: "Pedido registrado", ordem: 0, atual: true, concluida: false },
      { label: "Pagamento", descricao: "Aguardando confirmação", ordem: 1, atual: false, concluida: false },
      { label: "Análise", descricao: "Conferência editorial", ordem: 2, atual: false, concluida: false },
      { label: "Diagramação", descricao: "Layout e formatação", ordem: 3, atual: false, concluida: false },
      { label: "Revisão", descricao: "Revisão técnica", ordem: 4, atual: false, concluida: false },
      { label: "Aprovado", descricao: "Pronto para produção", ordem: 5, atual: false, concluida: false },
      { label: "Produção", descricao: "Geração de arquivos", ordem: 6, atual: false, concluida: false },
      { label: "Publicado", descricao: "No catálogo", ordem: 7, atual: false, concluida: false },
    ];

    await supabase.from("pedido_etapas").insert(
      etapas.map((e) => ({ ...e, pedido_id: pedido.id }))
    );

    // Registrar mudança
    await supabase.from("pedido_mudancas").insert({
      pedido_id: pedido.id,
      acao: "Pedido criado",
      descricao: `Pedido ${codigo} registrado pelo autor.`,
      usuario: user.email ?? "Autor",
    });

    return NextResponse.json({ pedido, codigo }, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
