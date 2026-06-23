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

    if (pedido.tipo !== "capitulo") {
      return new NextResponse("Carta de aceite disponível apenas para capítulos.", { status: 400 });
    }

    const statusAprovado = ["aprovado", "em_producao", "publicado"].includes(pedido.status);
    if (!statusAprovado) {
      return new NextResponse("O capítulo precisa ser aprovado pelo administrador para gerar a carta de aceite.", { status: 400 });
    }

    const autorNome = (pedido as any).perfis?.nome || "Autor";
    const autorEmail = (pedido as any).perfis?.email || "";
    const dataHoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const dataPedido = pedido.data_criacao
      ? new Date(pedido.data_criacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
      : dataHoje;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Carta de Aceite — Worges</title>
<style>
  @page { size: A4; margin: 2cm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', 'Georgia', serif;
    max-width: 210mm; margin: 0 auto; padding: 2cm;
    color: #1e293b; line-height: 1.6; font-size: 12pt;
  }
  .header { text-align: center; margin-bottom: 2cm; }
  .logo { font-size: 18pt; font-weight: bold; letter-spacing: 4px; color: #06b6d4; margin-bottom: 4pt; }
  .logo-sub { font-size: 10pt; color: #64748b; letter-spacing: 2px; }
  .title { font-size: 14pt; font-weight: bold; text-align: center; margin: 1.5cm 0 1cm; text-transform: uppercase; letter-spacing: 2px; }
  .content { text-align: justify; }
  .signature { margin-top: 2cm; text-align: center; }
  .sign-line { border-top: 1px solid #333; width: 60%; margin: 3cm auto 8px; }
  .sign-name { font-weight: bold; font-size: 11pt; }
  .sign-role { font-size: 10pt; color: #64748b; }
  .footer { margin-top: 1cm; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  @media print {
    body { padding: 2cm; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="logo">W O R G E S</div>
  <div class="logo-sub">Editora e Plataforma de Publicação</div>
</div>

<div class="title">Carta de Aceite</div>

<div class="content">
  <p>Prezado(a) <strong>${autorNome}</strong>,</p>
  <br>
  <p>A <strong>Worges Editora</strong> tem a satisfação de comunicar a ACEITAÇÃO do capítulo intitulado:</p>
  <br>
  <p style="text-align:center; font-size:13pt; font-style:italic; margin: 1cm 0;">
    <strong>"${pedido.titulo}"</strong>
  </p>
  <br>
  <p>
    O capítulo foi submetido em ${dataPedido} e, após análise do Conselho Editorial, foi considerado apto para compor a coletânea organizada pela Worges Editora.
  </p>
  <br>
  <p>
    O capítulo receberá os seguintes identificadores:
  </p>
  <ul style="margin-left: 2cm; margin-top: 8px;">
    <li>DOI (Digital Object Identifier)</li>
    <li>Certificado de publicação</li>
  </ul>
  <br>
  <p>
    Esta carta de aceite comprova a aprovação do capítulo para publicação. A versão final será disponibilizada na coletânea com todos os metadados editoriais.
  </p>
  <br>
  <p>Atenciosamente,</p>
</div>

<div class="signature">
  <div class="sign-line"></div>
  <div class="sign-name">Conselho Editorial</div>
  <div class="sign-role">Worges Editora</div>
</div>

<div class="footer">
  Worges Editora — ${dataHoje}<br>
  ${autorEmail ? `E-mail do autor: ${autorEmail}<br>` : ""}
  Código do pedido: ${pedido.codigo}
</div>
<script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Erro ao gerar carta de aceite:", err);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
