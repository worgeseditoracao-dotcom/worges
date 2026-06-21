import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — Worges",
};

export default function TermosPage() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-2">Termos de Uso</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">Última atualização: junho de 2026</p>

        <div className="prose prose-sm max-w-none text-[var(--color-text-muted)] [&_h2]:text-[var(--color-text)] [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-8 [&_h2]:mb-3">
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao utilizar a plataforma Worges, o usuário declara ter lido, compreendido e concordado com estes
            Termos de Uso. O uso da plataforma é condicionado à aceitação integral destes termos.
          </p>

          <h2>2. Serviços oferecidos</h2>
          <p>
            A Worges oferece serviços editoriais digitais, incluindo publicação de ebooks, geração de arquivos
            para impressão, publicação de capítulos em coletâneas, diagramação, revisão, normalização ABNT,
            registro de ISBN e DOI, emissão de carta de aceite e certificados.
          </p>

          <h2>3. Responsabilidades do autor</h2>
          <p>
            O autor é integralmente responsável pelo conteúdo enviado, declarando ser o legítimo titular
            dos direitos autorais ou possuir autorização para publicar o material. A Worges não se responsabiliza
            por violações de direitos de terceiros cometidas pelo autor.
          </p>

          <h2>4. Pagamento e cancelamento</h2>
          <p>
            Os serviços são cobrados conforme os pacotes selecionados. O pagamento pode ser realizado via Pix
            ou cartão de crédito em até 5x sem acréscimo. Pedidos cancelados antes do início da produção
            editorial são reembolsáveis conforme política de reembolso vigente.
          </p>

          <h2>5. Prazo de entrega</h2>
          <p>
            Os prazos informados são estimativas a partir da aprovação editorial e confirmação do pagamento.
            A Worges não se responsabiliza por atrasos causados pelo envio de arquivos fora do padrão ou
            informações incompletas pelo autor.
          </p>

          <h2>6. Propriedade intelectual</h2>
          <p>
            O autor mantém a titularidade dos direitos autorais sobre sua obra. A Worges recebe autorização
            para publicar, exibir e distribuir o conteúdo conforme o pacote contratado, sem transferência
            de direitos autorais.
          </p>

          <h2>7. Limitação de responsabilidade</h2>
          <p>
            A Worges não se responsabiliza por danos indiretos decorrentes do uso da plataforma. Nossa
            responsabilidade máxima fica limitada ao valor pago pelo serviço contratado.
          </p>

          <h2>8. Modificações</h2>
          <p>
            A Worges reserva-se o direito de modificar estes termos a qualquer momento, notificando os
            usuários cadastrados por e-mail com antecedência mínima de 15 dias.
          </p>

          <h2>9. Foro</h2>
          <p>
            Fica eleito o foro da comarca do domicílio da Worges para dirimir eventuais conflitos,
            com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>

          <h2>10. Contato</h2>
          <p>
            Dúvidas sobre estes termos:{" "}
            <a href="mailto:contato@worges.com.br" className="text-cyan-600 hover:text-cyan-500">
              contato@worges.com.br
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
