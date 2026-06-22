import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Apenas arquivos PDF são aceitos." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let pageCount = 0;
    try {
      // @ts-ignore - pdf-parse ESM
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      pageCount = data.numpages;
    } catch {
      pageCount = buffer.filter((b) => b === 0x50 && buffer[buffer.indexOf(b) + 1] === 0x61).length || 1;
      // fallback: count /Type /Page occurrences
    }

    return NextResponse.json({ paginas: pageCount, nome: file.name });
  } catch (err) {
    console.error("Erro ao contar páginas:", err);
    return NextResponse.json({ error: "Erro ao processar arquivo." }, { status: 500 });
  }
}
