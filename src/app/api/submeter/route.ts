import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      titulo, tipo, plano, modalidade, faixa_paginas,
      valor_base, orcamento_final, open_access,
      servicos, autores, resumo, categoria
    } = body;

    // Validar
    if (!titulo || !tipo || !plano) {
      return NextResponse.json({ error: "Campos obrigatórios: titulo, tipo, plano" }, { status: 400 });
    }

    // Contar pedidos para código (usando admin client para bypass RLS)
    const adminClient = createSupabaseAdminClient();
    const { count } = await adminClient.from("pedidos").select("*", { count: "exact", head: true });
    const codigo = `ORD-${String((count ?? 0) + 1).padStart(3, "0")}`;

    // Inserir pedido
    const { data: pedido, error: pedidoErr } = await supabase.from("pedidos").insert({
      codigo,
      usuario_id: user.id,
      titulo,
      tipo,
      plano,
      modalidade,
      faixa_paginas,
      valor_base: valor_base ?? 0,
      orcamento_final: orcamento_final ?? valor_base ?? 0,
      open_access: open_access ?? false,
      status: "pedido_criado",
    }).select().single();

    if (pedidoErr) throw pedidoErr;

    // Serviços adicionais
    if (servicos?.length) {
      await supabase.from("pedido_servicos").insert(
        servicos.map((s: { nome: string; valor: number }) => ({
          pedido_id: pedido.id,
          nome: s.nome,
          valor: s.valor ?? 0,
        }))
      );
    }

    // Etapas padrão
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
      descricao: `Pedido ${codigo} registrado via submissão.`,
      usuario: user.email ?? "Autor",
    });

    return NextResponse.json({
      pedido,
      codigo,
      message: "Pedido criado com sucesso!",
    }, { status: 201 });

  } catch (err) {
    console.error("Erro na submissão:", err);
    return NextResponse.json({ error: "Erro ao processar submissão" }, { status: 500 });
  }
}
