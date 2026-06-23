import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pedidoId = formData.get("pedido_id") as string;
    const tipo = formData.get("tipo") as string;
    const acao = formData.get("acao") as string;

    if (!file || !pedidoId || !tipo) {
      return NextResponse.json({ error: "Arquivo, pedido_id e tipo são obrigatórios." }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${pedidoId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { error: uploadError } = await adminClient.storage
      .from("arquivos")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Erro ao fazer upload do arquivo." }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage.from("arquivos").getPublicUrl(filePath);
    const url = urlData.publicUrl;

    const { error: dbError } = await adminClient.from("pedido_arquivos").insert({
      pedido_id: pedidoId,
      nome: file.name,
      tipo,
      url,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    if (acao) {
      await adminClient.from("pedido_mudancas").insert({
        pedido_id: pedidoId,
        acao,
        descricao: `Arquivo "${file.name}" (${tipo}) enviado.`,
        usuario: "Sistema",
      });
    }

    return NextResponse.json({
      url,
      nome: file.name,
      message: "Arquivo enviado com sucesso!",
    }, { status: 201 });
  } catch (err) {
    console.error("Erro no upload:", err);
    return NextResponse.json({ error: "Erro interno no upload." }, { status: 500 });
  }
}
