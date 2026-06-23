import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pedido_id: string }> }
) {
  try {
    const { pedido_id } = await params;
    const adminClient = createSupabaseAdminClient();

    const { data: pedido, error } = await adminClient
      .from("pedidos")
      .select("*, perfis!pedidos_usuario_id_fkey(nome, email)")
      .eq("id", pedido_id)
      .single();

    if (error || !pedido) {
      return new NextResponse("Pedido não encontrado", { status: 404 });
    }

    const { data: obras } = await adminClient
      .from("obras")
      .select("doi, isbn, data_publicacao")
      .eq("pedido_id", pedido_id);

    const obra = obras?.[0];
    let doi = "";
    let isbn = "";
    try {
      const meta = JSON.parse(obra?.doi || "{}");
      doi = meta.doi || "";
      isbn = meta.isbn || "";
    } catch {
      doi = obra?.doi || "";
    }

    const autorNome = (pedido as any).perfis?.nome || "Autor";
    const dataPublicacao = obra?.data_publicacao
      ? new Date(obra.data_publicacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
      : new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

    const isCapitulo = pedido.tipo === "capitulo";
    const tipoObra = isCapitulo ? "Capítulo de Coletânea" : "Livro";

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Certificado de Publicação — Worges</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; background: #0a0a0f;
  }
  .cert {
    width: 297mm; height: 210mm;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border: 4px solid #06b6d4;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px; color: #e2e8f0;
  }
  .cert::before {
    content: ""; position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border: 2px solid rgba(6,182,212,0.15);
    border-radius: 50%;
  }
  .cert::after {
    content: ""; position: absolute;
    bottom: -40px; left: -40px;
    width: 140px; height: 140px;
    border: 2px solid rgba(6,182,212,0.1);
    border-radius: 50%;
  }
  .logo { font-size: 22px; font-weight: bold; letter-spacing: 6px; text-transform: uppercase; color: #06b6d4; margin-bottom: 16px; }
  .title { font-size: 28px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; color: #06b6d4; margin-bottom: 32px; }
  .subtitle { font-size: 14px; color: #94a3b8; margin-bottom: 40px; letter-spacing: 1px; }
  .work-title { font-size: 24px; font-style: italic; color: #fff; margin-bottom: 8px; text-align: center; max-width: 80%; }
  .author { font-size: 16px; color: #cbd5e1; margin-bottom: 24px; }
  .type { font-size: 13px; color: #06b6d4; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .meta { font-size: 12px; color: #64748b; text-align: center; line-height: 2; margin-bottom: 12px; }
  .footer { position: absolute; bottom: 24px; left: 0; right: 0; text-align: center; font-size: 10px; color: #475569; letter-spacing: 2px; }
  @media print {
    body { background: white; }
    .cert { border-color: #06b6d4; background: white !important; color: #1e293b !important; }
    .cert .title, .cert .logo, .cert .type { color: #06b6d4 !important; }
    .cert .work-title { color: #0f172a !important; }
    .cert .author { color: #334155 !important; }
    .cert .subtitle, .cert .meta, .cert .footer { color: #64748b !important; }
  }
</style>
</head>
<body>
<div class="cert">
  <div class="logo">W O R G E S</div>
  <div class="title">Certificado de Publicação</div>
  <div class="subtitle">A Worges Editora certifica que a obra abaixo foi publicada em seu catálogo editorial</div>
  <div class="type">${tipoObra}</div>
  <div class="work-title">${pedido.titulo}</div>
  <div class="author">Autor: ${autorNome}</div>
  <div class="meta">
    ${isbn ? `ISBN: ${isbn}<br>` : ""}
    ${doi ? `DOI: ${doi}<br>` : ""}
    Data de publicação: ${dataPublicacao}<br>
    Código do pedido: ${pedido.codigo}
  </div>
  <div class="footer">© ${new Date().getFullYear()} Worges Editora — Todos os direitos reservados</div>
</div>
<script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Erro ao gerar certificado:", err);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
