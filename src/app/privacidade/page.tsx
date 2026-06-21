import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — Worges",
};

export default function PrivacidadePage() {
  return (
    <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Política de Privacidade</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">Última atualização: junho de 2026</p>

        <div className="prose prose-sm max-w-none text-[var(--color-text-muted)] [&_h2]:text-[var(--color-text)] [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-8 [&_h2]:mb-3">
          <h2>1. Coleta de dados</h2>
          <p>
            A Worges coleta dados pessoais fornecidos pelo usuário no momento do cadastro (nome, e-mail)
            e durante o uso da plataforma (obras enviadas, pedidos realizados, arquivos carregados).
          </p>

          <h2>2. Uso dos dados</h2>
          <p>
            Os dados coletados são utilizados exclusivamente para prestação dos serviços editoriais contratados,
            comunicação sobre pedidos e publicações, emissão de documentos (carta de aceite, certificado, ISBN, DOI)
            e cumprimento de obrigações legais.
          </p>

          <h2>3. Compartilhamento</h2>
          <p>
            A Worges não vende nem compartilha dados pessoais com terceiros para fins comerciais.
            Poderemos compartilhar dados com parceiros estritamente necessários à execução dos serviços
            (ex.: gateway de pagamento, Crossref para DOI), sempre com as devidas garantias de confidencialidade.
          </p>

          <h2>4. Armazenamento e segurança</h2>
          <p>
            Os dados são armazenados em servidores seguros com criptografia em trânsito e em repouso.
            O acesso é restrito à equipe autorizada da Worges.
          </p>

          <h2>5. Direitos do usuário</h2>
          <p>
            De acordo com a LGPD (Lei nº 13.709/2018), o usuário tem direito a acessar, corrigir, portar e solicitar
            a exclusão de seus dados pessoais. Para exercer esses direitos, entre em contato pelo e-mail{" "}
            <a href="mailto:privacidade@worges.com.br" className="text-cyan-600 hover:text-cyan-500">
              privacidade@worges.com.br
            </a>.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Utilizamos cookies estritamente necessários para o funcionamento da plataforma e cookies de análise
            de uso para melhorar a experiência. Você pode desativar cookies nas configurações do seu navegador.
          </p>

          <h2>7. Alterações nesta política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Notificaremos usuários cadastrados sobre mudanças
            relevantes por e-mail.
          </p>

          <h2>8. Contato</h2>
          <p>
            Para dúvidas sobre privacidade, envie e-mail para{" "}
            <a href="mailto:privacidade@worges.com.br" className="text-cyan-600 hover:text-cyan-500">
              privacidade@worges.com.br
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
