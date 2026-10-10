import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Building2, Check, FileCheck2, MessageCircle, ShieldCheck, UserCheck } from "lucide-react";
import { Logo } from "@/app/components/ui/logo";
import { BotaoAceite, type Termo } from "@/app/proposta/_components/aceite";
import { PropostaGate } from "@/app/proposta/_components/gate";
import {
  Callout,
  CheckList,
  type Deliverable,
  DeliverableBlock,
  Eyebrow,
  Faq,
  Headline,
  Lead,
  Section,
  StatCard,
} from "@/app/proposta/_components/proposal-ui";
import { RolarPara } from "@/app/proposta/_components/rolar-para";
import { ancoraDoDestino, destinoValido } from "@/app/proposta/_lib/destinos";
import { cookieConfere, nomeCookie } from "@/app/proposta/_lib/gate";
import { minutosDeLeitura } from "@/app/proposta/_lib/leitura";
import { PROPOSTAS } from "@/app/proposta/_lib/propostas";

/**
 * Proposta da Easyone: reestruturação do Movidesk e treinamento de SenseData.
 * A copy aprovada fica em `propostas/easyone/copy.md` e os números vêm do
 * `propostas/easyone/dossie.md`.
 */

const SLUG = "easyone";

/** WhatsApp do Luciano, que assina a proposta. */
const WHATSAPP = "5511912549449";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}`;

/**
 * A M2G fecha por boleto, então não existe checkout. Depois do aceite do
 * termo, o botão abre a conversa com o pedido de emissão do boleto.
 */
const CHECKOUT_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Aceitei a proposta da M2G para a Easyone. Pode emitir o boleto.",
)}`;

export const metadata: Metadata = {
  title: "Proposta comercial",
  description: "Documento confidencial. O acesso é restrito ao destinatário.",
  robots: { index: false, follow: false, nocache: true },
};

/* ───────────────────────────── Conteúdo ───────────────────────────── */

const STATS = [
  { value: "5.781", label: "tickets analisados, de outubro de 2025 a setembro de 2026" },
  { value: "41%", label: "deles parados em Resolvido, sem nunca fechar" },
  { value: "32,9%", label: "estouraram o SLA de solução" },
  { value: "55%", label: "dos clientes atendidos recebem a pesquisa de satisfação, aproximadamente" },
];

const DIAGNOSTICO = [
  {
    title: "O que já funciona",
    text: "O time registra o que faz: 99,6% dos tickets têm horas apontadas, e foram 9.804 horas no último ano. A primeira resposta sai em 4,1 horas na mediana. O cliente usa o portal, que traz 55% da entrada, e o SAP da Easyone já conversa com o Movidesk e com o SenseData. A base está montada. Isso não se mexe.",
  },
  {
    title: "Onde a operação trava",
    text: "O ticket entra e é atendido, mas não sai. Sem fechamento não existe pesquisa, sem prazo por contrato não existe SLA que signifique alguma coisa, e sem classificação ninguém responde qual produto gera mais problema. No CS, o SenseData parou no dia em que a Viviana saiu, e o processo foi embora com ela.",
  },
];

const VAZAMENTOS = [
  {
    n: "01",
    title: "O ticket é resolvido e nunca fecha",
    text: "São 2.344 tickets parados em Resolvido, metade deles há mais de 183 dias. Nenhum gatilho leva de Resolvido para Fechado, e a pesquisa de satisfação só dispara no Fechado. Por isso os clientes nunca avaliam: a maioria nem recebe o convite.",
  },
  {
    n: "02",
    title: "Um SLA só para todo mundo",
    text: "O SLA Padrão vale para os 44 clientes com AMS e para quem não tem contrato nenhum. O urgente tem a mesma primeira resposta do médio, 8 horas úteis, e estoura mais na solução: 39,2% contra 31,4%. Em 17,9% dos tickets o prazo foi alterado à mão.",
  },
  {
    n: "03",
    title: "Dúvida em 69% dos tickets",
    text: "O segundo nível de serviço é quase sempre SAP e o terceiro nunca é usado. São 161 tags, com DEV escrito de quatro jeitos. Hoje não dá para responder qual módulo gera mais chamado nem quanto do AMS de cada cliente foi consumido.",
  },
  {
    n: "04",
    title: "A fila não tem dono, e o Desenvolvimento tem um só",
    text: "Nenhuma equipe está ligada a serviço e o e-mail, que traz 42% da entrada, chega sem serviço nem equipe. No Desenvolvimento, a Carolina responde sozinha por 924 tickets e 2.997 horas no ano. É a fila mais lenta: 38,1% de solução estourada.",
  },
  {
    n: "05",
    title: "O SenseData parou quando a Viviana saiu",
    text: "Nada foi registrado desde então. Projetos se encerraram sem a pesquisa de satisfação de fase, e quem ficou não sabe por onde começar. O conhecimento estava em uma pessoa.",
  },
];

const CONTRASTE: [string, string][] = [
  ["Pesquisa que quase ninguém responde", "Pesquisa que chega a todo cliente atendido"],
  ["Um prazo igual para AMS e para quem não tem contrato", "Prazo por contrato e por urgência"],
  ["Dúvida em 69% dos tickets", "Produto, módulo e tipo de demanda em cada ticket"],
  ["Fila que alguém precisa distribuir à mão", "Ticket que já chega na equipe certa"],
  ["SenseData que dependia de uma pessoa", "Um consultor da casa que sabe operar e ensinar"],
];

const DELIVERABLES: Deliverable[] = [
  {
    n: "01",
    title: "Encerramento e pesquisa de satisfação",
    tagline: "Todo cliente atendido passa a receber a pesquisa.",
    body: [
      "O atendimento termina de verdade. O ticket resolvido fecha sozinho depois de 3 dias úteis sem resposta, com e-mail de encerramento, e é esse fechamento que dispara a pesquisa. Os 2.344 tickets antigos saem da frente de uma vez.",
    ],
    items: [
      "Gatilho Resolvido para Fechado após 3 dias úteis sem resposta do cliente",
      "Fechamento em lote dos 2.344 tickets parados em Resolvido",
      "Fechamento por falta de retorno passando por Resolvido, para o cliente receber a pesquisa",
      "Fornecedor Add-on movido para Aguardando, com pausa de SLA também em Aguardando Terceiros e Infraestrutura",
      "Reabertura limitada a 7 dias depois da resolução",
      "Renovação da chave de API, que hoje aparece em texto aberto nos Parâmetros",
    ],
    callout: {
      label: "Compromisso importante",
      text: "O fechamento em lote não envia pesquisa retroativa. Nenhum cliente recebe e-mail sobre um ticket de seis meses atrás.",
    },
    media: {
      id: "B1",
      aspect: "16:9",
      brief: "Ticket em Resolvido, contador de 3 dias úteis chegando ao fim, status virando Fechado e o e-mail de pesquisa saindo para o cliente.",
    },
  },
  {
    n: "02",
    title: "SLA por contrato",
    tagline: "Quem tem AMS passa a ter prazo de quem tem AMS.",
    body: [
      "O prazo deixa de ser um número único. Cada tipo de cliente ganha o seu contrato de SLA e a urgência volta a significar alguma coisa. Os prazos são definidos com você e com o Leonardo antes de entrar em produção.",
    ],
    items: [
      "Contratos de SLA separados: AMS, consultoria pontual ou sem AMS, e Free",
      "Primeira resposta diferente por urgência",
      "Revisão do prazo de solução do urgente, que hoje estoura em 39,2% dos casos",
      "Bloqueio da alteração manual do prazo, ou exigência de justificativa",
      "Corpus Christi incluído no calendário do SLA",
    ],
    callout: {
      label: "Compromisso importante",
      text: "Nenhum prazo entra no ar sem a validação da liderança da Easyone.",
    },
    media: {
      id: "B2",
      aspect: "16:9",
      brief: "Dois tickets abertos no mesmo minuto, um de cliente AMS e um sem contrato, cada um recebendo um vencimento diferente.",
    },
  },
  {
    n: "03",
    title: "Árvore de serviços e classificação",
    tagline: "Você passa a saber qual produto e qual módulo geram mais chamado.",
    body: [
      "A classificação é refeita para responder pergunta de gestão. O agente escolhe produto, módulo e tipo de demanda, e o cliente abre o chamado por um formulário que já pede o que importa.",
    ],
    items: [
      "Serviços em três níveis: produto, módulo e tipo de demanda, com o terceiro nível obrigatório na conclusão",
      "Categorias que separam incidente, dúvida de uso, solicitação de serviço e melhoria",
      "Tags unificadas, de 161 para cerca de 20, sem obrigatoriedade para o cliente",
      "Campos adicionais revistos: ficam só os que serão usados",
      "Formulários no portal por tipo de demanda",
    ],
    media: {
      id: "B3",
      aspect: "16:9",
      brief: "Agente concluindo um ticket e escolhendo SAP B1, Fiscal, Erro, e o painel por módulo atualizando ao lado.",
    },
  },
  {
    n: "04",
    title: "Roteamento e equipes",
    tagline: "O ticket chega na equipe certa sem ninguém distribuir.",
    body: [
      "Cada equipe passa a ser dona de um conjunto de serviços e a distribuição vira automática. O e-mail, que hoje chega sem destino, entra com serviço, equipe e urgência definidos.",
    ],
    items: [
      "Equipes vinculadas a serviços: Suporte SAP, Desenvolvimento, Infra, Comercial e Orçamento",
      "Distribuição automática por equipe",
      "Regras para a caixa de e-mail, que responde por 42% da entrada",
      "Administradores deixa de ser fila de atendimento, e as equipes vazias saem",
      "Desenho de uma segunda referência ou rodízio para a fila de Desenvolvimento",
    ],
    media: {
      id: "B4",
      aspect: "16:9",
      brief: "E-mail de cliente chegando, virando ticket já com serviço e equipe preenchidos e caindo na fila do Suporte SAP.",
    },
  },
  {
    n: "05",
    title: "Alertas, horas e painéis",
    tagline: "Os números do suporte em uma tela, prontos para mostrar à diretoria.",
    body: [
      "É aqui que a meta de 2027 ganha prova. Com encerramento, SLA e classificação no lugar, os painéis passam a mostrar a operação como ela é.",
    ],
    items: [
      "Painéis por equipe e por produto: entrada, backlog, SLA, reabertura e satisfação",
      "Alerta de SLA a vencer para o responsável e para a liderança",
      "Revisão dos 26 gatilhos: duplicados unificados, nomes corrigidos e menos cópias para a caixa do suporte",
      "Macros para as respostas mais frequentes, além das 3 que existem hoje",
      "Contratos de horas revisados, para comparar o consumo de cada cliente com o contratado",
      "Rotina mensal de revisão dos indicadores",
    ],
    media: {
      id: "B5",
      aspect: "16:9",
      brief: "Painel com SLA, backlog e satisfação por equipe, e um alerta de ticket a vencer aparecendo para o responsável.",
    },
  },
  {
    n: "06",
    title: "Treinamento completo de SenseData",
    tagline: "O conhecimento fica na Easyone, não em uma pessoa.",
    body: [
      "Treinamos o consultor que você indicar para operar o SenseData e para ensinar quem vier depois. O treinamento é feito na base da Easyone, com os clientes e os projetos de vocês, e começa pelo que está parado.",
    ],
    items: [
      "Navegação e rotina de uso da plataforma",
      "As fases de projeto e as ações que a Easyone já tem configuradas",
      "Disparo das pesquisas de satisfação de fase dos projetos que se encerraram no período parado",
      "Health score e acompanhamento do onboarding, que estavam em construção",
      "Registro de reuniões e contatos com o cliente",
      "Sessões gravadas e um roteiro escrito para o consultor repassar o conteúdo",
    ],
    media: {
      id: "B6",
      aspect: "16:9",
      brief: "Consultor abrindo um projeto encerrado no SenseData, disparando a pesquisa de fase e vendo a resposta entrar no painel do cliente.",
    },
  },
];

const FASES = [
  {
    n: "Semanas 1 e 2",
    title: "Encerramento e início do SenseData",
    text: "Higiene no Movidesk: gatilho de fechamento, fechamento em lote, justificativas e status. Em paralelo, as primeiras sessões de SenseData com o consultor indicado.",
    entrega: "Resolvido fecha sozinho, os 2.344 tickets antigos saem do backlog e a pesquisa passa a chegar. O consultor já opera o SenseData e dispara as pesquisas de fase pendentes.",
  },
  {
    n: "Semanas 3 e 4",
    title: "SLA por contrato",
    text: "Definição dos contratos e dos prazos com a liderança, configuração e associação por tipo de cliente.",
    entrega: "Prazos novos em produção, por tipo de cliente e por urgência.",
  },
  {
    n: "Semanas 5 a 7",
    title: "Classificação e roteamento",
    text: "Nova árvore de serviços, categorias, tags, formulários do portal, equipes por serviço e distribuição automática.",
    entrega: "Tickets classificados por produto e módulo e distribuídos por equipe.",
  },
  {
    n: "Semana 8",
    title: "Alertas, horas e painéis",
    text: "Alertas de SLA, macros, contratos de horas e painéis. Fechamento do treinamento de SenseData.",
    entrega: "Painéis por equipe e por produto no ar, e o roteiro do SenseData entregue ao consultor.",
  },
];

/** Metas sugeridas no diagnóstico, medidas 90 dias depois do início. */
const METAS = [
  { indicador: "Tickets parados em Resolvido há mais de 7 dias", hoje: "2.294", meta: "0" },
  { indicador: "SLA de solução estourado", hoje: "32,9%", meta: "abaixo de 15%" },
  { indicador: "SLA de primeira resposta estourado", hoje: "15,9%", meta: "abaixo de 10%" },
  { indicador: "Tickets com prazo alterado à mão", hoje: "17,9%", meta: "abaixo de 5%" },
  { indicador: "Clientes atendidos que recebem a pesquisa", hoje: "cerca de 55%", meta: "100%" },
];

const PRECISAMOS = [
  {
    o: "E-mail à Zenvia pedindo a transição do atendimento Movidesk para a franquia M2G",
    porque: "Sem ele a M2G não atua no Movidesk da Easyone. O Anderson manda o texto pronto",
    quando: "Antes da semana 1",
  },
  {
    o: "Acesso de administrador ao Movidesk",
    porque: "O diagnóstico foi feito em modo leitura",
    quando: "Antes da semana 1",
  },
  {
    o: "O nome do consultor que será treinado",
    porque: "Para marcar as sessões de SenseData",
    quando: "Antes da semana 1",
  },
  {
    o: "Validação dos prazos de SLA por contrato",
    porque: "São compromissos da Easyone com os clientes dela",
    quando: "Semana 3",
  },
  {
    o: "Validação da árvore de serviços e dos campos adicionais",
    porque: "Só vocês sabem como os produtos e os add-ons se dividem",
    quando: "Semana 5",
  },
  {
    o: "Quem cobre a fila de Desenvolvimento além da Carolina",
    porque: "É uma decisão de gestão",
    quando: "Semana 5",
  },
  {
    o: "Horas contratadas de cada AMS",
    porque: "Hoje 61 dos 79 contratos estão com 0 hora cadastrada",
    quando: "Semana 8",
  },
  {
    o: "Aprovação em até 48 horas nos pontos de decisão",
    porque: "É o que segura o prazo de 8 semanas",
    quando: "Todo o projeto",
  },
];

const INVESTIMENTO_ITENS = [
  "80 horas de consultoria, a R$ 200,00 a hora",
  "Projeto fechado, sem mensalidade",
  "Pagamento por boleto, em até 3 vezes, com vencimentos em 30, 60 e 90 dias",
  "Nenhum custo de ferramenta nova: tudo é feito no Movidesk e no SenseData que a Easyone já contrata",
];

const INCLUSO = [
  "As cinco frentes de reestruturação do Movidesk descritas nos blocos 01 a 05",
  "O fechamento em lote dos tickets parados em Resolvido",
  "Treinamento completo de SenseData para um consultor da Easyone, com sessões gravadas e roteiro escrito",
  "Reuniões de acompanhamento durante as 8 semanas",
  "Documentação do que foi configurado",
];

const NAO_INCLUSO = [
  "Acompanhamento continuado de CS depois das 8 semanas, que é uma proposta à parte",
  "Agentes de IA no Movidesk, como o auditor de tickets, o resumo diário de SLA e o Instant Support",
  "Integração de WhatsApp ao atendimento",
  "Desenvolvimento no SAP da Easyone ou mudança nas integrações do SAP com o Movidesk e o SenseData",
  "Controle dos chamados que não integraram com o SAP",
  "Licenças de Movidesk e de SenseData, que seguem no contrato atual com a Zenvia",
  "Horas além das 80 contratadas. Se forem necessárias, custam R$ 200,00 a hora e só são feitas com a sua aprovação",
];

const GARANTIAS = [
  {
    icon: FileCheck2,
    title: "Tudo fica com vocês",
    text: "Gatilhos, contratos de SLA, árvore de serviços e painéis são configurados no Movidesk da Easyone e continuam lá depois do projeto, com a documentação.",
  },
  {
    icon: Building2,
    title: "Os dados não saem das plataformas",
    text: "O trabalho é feito dentro do Movidesk e do SenseData. A chave de API que hoje está exposta nos Parâmetros é renovada na primeira semana.",
  },
  {
    icon: UserCheck,
    title: "Nada muda sem validação",
    text: "Prazo de SLA, árvore de serviços e regra de roteamento só entram em produção depois de aprovados por você e pelo Leonardo.",
  },
  {
    icon: ShieldCheck,
    title: "Confidencialidade",
    text: "As informações dos clientes da Easyone são usadas só para este projeto.",
  },
];

const FAQ_ITENS = [
  {
    q: "A diretoria não vinha liberando verba para CS. Como eu defendo este projeto?",
    a: "É um projeto fechado, de 8 semanas, com valor único e sem mensalidade. Ele termina com metas medidas em 90 dias, e os painéis do bloco 05 são o material para mostrar o resultado.",
  },
  {
    q: "E se a pessoa treinada sair, como aconteceu com a Viviana?",
    a: "Por isso o treinamento é para um consultor técnico, que vai ensinar os próximos, e por isso as sessões ficam gravadas e o roteiro fica escrito. O processo deixa de morar na cabeça de uma pessoa.",
  },
  {
    q: "Preciso trocar de ferramenta para o cliente responder a pesquisa?",
    a: "Não. O que medimos é que a pesquisa nem chega a quase metade dos clientes, porque o ticket não fecha. O primeiro passo é ela chegar a todos. O formato da pesquisa é revisto dentro do que o Movidesk oferece.",
  },
  {
    q: "Meu time vai precisar parar para isso?",
    a: "Não. A configuração é feita pela M2G. De vocês, precisamos das validações listadas acima, com resposta em até 48 horas.",
  },
  {
    q: "E os agentes de IA que vocês mostraram na call?",
    a: "Eles dependem de ticket bem classificado e bem encerrado, que é o que este projeto entrega. São a etapa seguinte e não estão nesta proposta.",
  },
];

const PASSOS: { n: string; title: string; text: string; estado: "feito" | "agora" | "proximo" }[] = [
  { n: "1", title: "Call de alinhamento", text: "Em 30 de setembro, você trouxe o momento da Easyone e a meta de 2027.", estado: "feito" },
  { n: "2", title: "Diagnóstico do Movidesk", text: "Apresentado, com os 5.781 tickets do último ano.", estado: "feito" },
  { n: "3", title: "Aceite desta proposta", text: "Você revisa o termo e aceita o escopo.", estado: "agora" },
  { n: "4", title: "Boleto e transição", text: "Emissão do boleto e e-mail de transição à Zenvia.", estado: "proximo" },
  { n: "5", title: "Semana 1", text: "Encerramento no Movidesk e primeira sessão de SenseData.", estado: "proximo" },
];

const COMERCIAL = PROPOSTAS[SLUG];

const TERMO: Termo = {
  slug: SLUG,
  contratante: COMERCIAL.destinatario,
  contratada: "M2G Consultoria",
  emitidoEm: COMERCIAL.emitidoEm,
  origem:
    "Este documento resume o que foi combinado na call de alinhamento de 30 de setembro de 2026 e na apresentação do diagnóstico do Movidesk.",
  objeto:
    "Reestruturação do Movidesk da Easyone em cinco frentes (encerramento e pesquisa, SLA por contrato, classificação, roteamento e painéis) e treinamento completo de SenseData para um consultor indicado pela Easyone, em 80 horas de consultoria.",
  blocos: DELIVERABLES.map(({ n, title, tagline, bonus }) => ({ n, title, tagline, bonus })),
  fases: FASES.map(({ n, title, entrega }) => ({ n, title, entrega })),
  prazoTotal:
    "Oito semanas a partir do início do projeto, que depende do e-mail de transição à Zenvia e do acesso de administrador ao Movidesk. Ao fim de cada etapa existe uma entrega funcionando.",
  investimento: {
    implantacao: COMERCIAL.implantacao,
    parcelado: COMERCIAL.parcelado,
    condicoes:
      "Valor único pelo projeto, correspondente a 80 horas de consultoria a R$ 200,00 a hora, sem mensalidade. O pagamento é feito por boleto, em até 3 vezes, com vencimentos em 30, 60 e 90 dias, emitido depois deste aceite.",
  },
  incluso: INCLUSO,
  naoIncluso: NAO_INCLUSO,
  contrapartidas: PRECISAMOS.map(({ o, quando }) => ({ o, quando })),
  garantias: GARANTIAS.map(({ title, text }) => ({ title, text })),
  ressalvas: [
    "Horas além das 80 contratadas custam R$ 200,00 a hora e só são executadas com aprovação prévia da Easyone.",
    "As licenças de Movidesk e de SenseData seguem no contrato atual da Easyone com a Zenvia e não fazem parte deste valor.",
    "Esta proposta é válida por 15 dias a partir do envio.",
  ],
  checkoutUrl: CHECKOUT_URL,
};

const LEITURA_MIN = minutosDeLeitura(
  STATS, DIAGNOSTICO, VAZAMENTOS, DELIVERABLES, FASES, METAS, PRECISAMOS,
  INVESTIMENTO_ITENS, INCLUSO, NAO_INCLUSO, GARANTIAS, FAQ_ITENS, PASSOS,
  CONTRASTE,
);

/* ───────────────────────────── Página ───────────────────────────── */

export default async function PropostaEasyonePage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; ir?: string }>;
}) {
  const { erro, ir } = await searchParams;
  const destino = destinoValido(ir);

  // A proposta só é montada depois que o cookie confere. Sem isso o conteúdo
  // não sai do servidor: não vai no HTML nem no bundle.
  const jar = await cookies();
  if (!cookieConfere(SLUG, jar.get(nomeCookie(SLUG))?.value)) {
    return (
      <PropostaGate
        slug={SLUG}
        destinatario="Nicole"
        leituraMin={LEITURA_MIN}
        erro={Boolean(erro)}
        ir={destino}
      />
    );
  }

  return (
    <main className="mesh-bg min-h-screen">
      {destino && <RolarPara alvo={ancoraDoDestino(destino)} />}

      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Logo size="sm" />
          <a
            href="#investimento"
            className="rounded-full border border-border-strong px-4 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-accent hover:text-accent"
          >
            Ver investimento
          </a>
        </div>
      </header>

      {/* 1 · Abertura */}
      <section id="abertura" className="relative overflow-hidden">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl space-y-10 px-5 py-20 md:px-8 md:py-28">
          <Eyebrow>Proposta exclusiva · 10 de outubro de 2026</Eyebrow>
          <Headline as="h1">
            O melhor suporte do Brasil em SAP Business One precisa de{" "}
            <em className="text-accent">número para provar</em>.
          </Headline>
          <Lead className="max-w-3xl">
            A Easyone já atende bem. O que falta é o Movidesk mostrar isso: hoje ele registra o
            trabalho, mas não fecha o atendimento, não diferencia o prazo de quem tem AMS e não
            entrega a pesquisa a quase metade dos clientes. Em 8 semanas a gente arruma a casa no
            Movidesk e devolve o SenseData para as mãos do seu time.
          </Lead>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* 2 · Diagnóstico */}
      <Section id="diagnostico">
        <div className="space-y-4">
          <Eyebrow>Diagnóstico</Eyebrow>
          <Headline>O que a gente viu antes de falar de solução.</Headline>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {DIAGNOSTICO.map((d) => (
            <div key={d.title} className="rounded-2xl border border-border bg-bg-card p-6">
              <h3 className="mb-2 font-display text-xl tracking-tight">{d.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{d.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 3 · Gargalo */}
      <Section id="gargalo" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Onde vaza</Eyebrow>
          <Headline>Cinco pontos que escondem o bom atendimento que vocês já fazem.</Headline>
        </div>
        <div className="mt-10 space-y-4">
          {VAZAMENTOS.map((v) => (
            <div
              key={v.n}
              className="flex gap-5 rounded-2xl border border-border bg-bg-card p-6"
            >
              <span className="font-mono text-sm text-accent">{v.n}</span>
              <div className="space-y-2">
                <h3 className="font-display text-xl leading-tight tracking-tight">{v.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 · Tese */}
      <Section id="tese">
        <div className="space-y-4">
          <Eyebrow>A diferença</Eyebrow>
          <Headline>
            Não é trocar de ferramenta. É fazer a que vocês já pagam{" "}
            <em className="text-accent">trabalhar</em>.
          </Headline>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-border">
          {CONTRASTE.map(([sem, com], i) => (
            <div
              key={sem}
              className={`grid gap-px md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="bg-bg-card p-5 text-sm leading-snug text-text-subtle line-through decoration-text-faint">
                {sem}
              </div>
              <div className="bg-bg-elevated p-5 text-sm leading-snug text-text">{com}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 · Entregáveis */}
      <Section id="entregaveis" width="wide">
        <div className="space-y-4">
          <Eyebrow>O que entra</Eyebrow>
          <Headline>Seis blocos, cada um resolvendo um ponto do diagnóstico.</Headline>
        </div>
        <div className="mt-10 space-y-6">
          {DELIVERABLES.map((b) => (
            <DeliverableBlock key={b.n} block={b} />
          ))}
        </div>
      </Section>

      {/* 6 · Quem implementa */}
      <Section id="quem" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Quem implementa</Eyebrow>
          <Headline>Quem vai estar com vocês.</Headline>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg-card p-6">
            <h3 className="mb-2 font-display text-xl tracking-tight">Anderson Vaz e Luciano Drescher</h3>
            <p className="text-sm leading-relaxed text-text-muted">
              O diagnóstico que você já viu foi feito pelo Anderson, nosso CS mais especialista em
              Movidesk. É ele quem conduz a reestruturação, com o Luciano, sócio e diretor da M2G.
              Os dois passaram a última década trabalhando com ERP.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-bg-card p-6">
            <h3 className="mb-2 font-display text-xl tracking-tight">Franquia Zenvia</h3>
            <p className="text-sm leading-relaxed text-text-muted">
              A M2G é a única consultoria de CS e CX do mercado com selo Franquia Zenvia. A Zenvia
              fornece o software. A gente entra com a camada de serviço.
            </p>
          </div>
        </div>
      </Section>

      {/* 7 · Cronograma */}
      <Section id="fases">
        <div className="space-y-4">
          <Eyebrow>Cronograma</Eyebrow>
          <Headline>Oito semanas, com entrega funcionando ao fim de cada etapa.</Headline>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FASES.map((f) => (
            <div key={f.n} className="rounded-2xl border border-border bg-bg-card p-6">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                {f.n}
              </p>
              <h3 className="mb-2 font-display text-xl tracking-tight">{f.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-text-muted">{f.text}</p>
              <p className="border-t border-border pt-3 text-xs leading-relaxed text-text-muted">
                <span className="text-text">Ao fim: </span>
                {f.entrega}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-12 font-display text-xl tracking-tight">Metas para 90 dias</h3>
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-bg-card">
          {METAS.map((m) => (
            <div
              key={m.indicador}
              className="grid gap-1 p-5 sm:grid-cols-[1fr_110px_140px] sm:items-baseline sm:gap-6"
            >
              <p className="text-sm font-medium leading-snug">{m.indicador}</p>
              <p className="text-sm text-text-muted">
                <span className="text-text-subtle sm:hidden">Hoje: </span>
                {m.hoje}
              </p>
              <p className="text-sm font-medium text-accent">
                <span className="font-normal text-text-subtle sm:hidden">Meta: </span>
                {m.meta}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 8 · O que precisamos de você */}
      <Section id="precisamos" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Contrapartidas</Eyebrow>
          <Headline>O que a gente precisa de você.</Headline>
        </div>
        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-bg-card">
          {PRECISAMOS.map((p) => (
            <div key={p.o} className="p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <p className="text-sm font-medium leading-snug">{p.o}</p>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  {p.quando}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{p.porque}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 9 · Investimento */}
      <Section id="investimento">
        <div className="space-y-4">
          <Eyebrow>Investimento</Eyebrow>
          <Headline>
            A casa arrumada em 8 semanas, e os números para defender a{" "}
            <em className="text-accent">meta de 2027</em>.
          </Headline>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-bg-card p-7 md:p-9">
            <div className="pointer-events-none absolute -top-24 left-1/2 size-[320px] -translate-x-1/2 rounded-full bg-accent/10 blur-[80px]" />
            <div className="relative space-y-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
                Projeto completo
              </p>
              <p className="font-display text-5xl leading-[0.9] tracking-tighter text-accent md:text-6xl">
                {COMERCIAL.implantacao}
              </p>
              <p className="font-mono text-sm text-text">{COMERCIAL.parcelado}</p>
              <p className="text-sm leading-relaxed text-text-muted">
                Cobre os 6 blocos, as 8 semanas e o treinamento do consultor.
              </p>
              <div className="space-y-2.5 pt-1">
                <BotaoAceite
                  termo={TERMO}
                  label="Aceitar a proposta"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
                />
                <p className="text-center text-xs leading-relaxed text-text-subtle">
                  Você revisa e aceita o escopo completo. Depois o boleto é combinado pelo WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border-accent bg-bg-card p-7 md:p-9">
            <div className="space-y-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                Como é cobrado
              </p>
              <CheckList items={INVESTIMENTO_ITENS} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Callout label="Comparação que vale fazer">
            O time da Easyone apontou 9.804 horas no Movidesk no último ano. Este projeto equivale
            a menos de 1% disso, para que as outras 99% passem a aparecer nos números.
          </Callout>
        </div>
      </Section>

      {/* 10 · Escopo */}
      <Section id="escopo" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Clareza</Eyebrow>
          <Headline>Para não sobrar dúvida depois do aceite.</Headline>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg-card p-6">
            <p className="mb-4 text-sm font-medium text-accent">Está incluso</p>
            <CheckList items={INCLUSO} />
          </div>
          <div className="rounded-2xl border border-border bg-bg-card p-6">
            <p className="mb-4 text-sm font-medium text-text-subtle">Não está incluso</p>
            <ul className="space-y-2.5">
              {NAO_INCLUSO.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-text-faint" />
                  <span className="leading-snug text-text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 11 · Garantias */}
      <Section id="garantias">
        <div className="space-y-4">
          <Eyebrow>Garantias</Eyebrow>
          <Headline>O que é configurado é da Easyone.</Headline>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {GARANTIAS.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border bg-bg-card p-6">
              <span className="mb-4 flex size-10 items-center justify-center rounded-xl border border-border-accent bg-accent/15 text-accent">
                <g.icon className="size-4" strokeWidth={1.75} />
              </span>
              <h3 className="mb-2 font-display text-xl tracking-tight">{g.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{g.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 12 · FAQ */}
      <Section id="faq" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Dúvidas</Eyebrow>
          <Headline>O que você perguntaria na próxima call.</Headline>
        </div>
        <div className="mt-10">
          <Faq items={FAQ_ITENS} />
        </div>
      </Section>

      {/* 13 · Próximos passos */}
      <Section id="proximos">
        <div className="space-y-4">
          <Eyebrow>Vamos começar</Eyebrow>
          <Headline>
            Dois passos já estão feitos. Falta <em className="text-accent">um</em> para o projeto
            começar.
          </Headline>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PASSOS.map((p) => (
            <div
              key={p.n}
              className={
                p.estado === "agora"
                  ? "rounded-2xl border border-border-accent bg-accent-soft p-5"
                  : "rounded-2xl border border-border bg-bg-card p-5"
              }
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={
                    p.estado === "feito"
                      ? "flex size-8 items-center justify-center rounded-full border border-success/50 bg-success/15 text-success"
                      : p.estado === "agora"
                        ? "flex size-8 items-center justify-center rounded-full bg-accent font-mono text-sm text-on-accent"
                        : "flex size-8 items-center justify-center rounded-full border border-border-strong bg-bg-elevated font-mono text-sm text-text-subtle"
                  }
                >
                  {p.estado === "feito" ? <Check className="size-4" strokeWidth={2.5} /> : p.n}
                </span>
                <span
                  className={
                    p.estado === "feito"
                      ? "text-[10px] font-medium uppercase tracking-[0.18em] text-success"
                      : p.estado === "agora"
                        ? "text-[10px] font-medium uppercase tracking-[0.18em] text-accent"
                        : "text-[10px] font-medium uppercase tracking-[0.18em] text-text-subtle"
                  }
                >
                  {p.estado === "feito" ? "Concluído" : p.estado === "agora" ? "Agora" : "Próximo"}
                </span>
              </div>
              <h3 className="mb-1.5 text-sm font-medium leading-snug">{p.title}</h3>
              <p className="text-xs leading-relaxed text-text-muted">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border-accent bg-accent-soft p-8 text-center md:p-12">
          <p className="max-w-2xl font-display text-2xl leading-tight tracking-tight md:text-3xl">
            Nicole, o diagnóstico está feito e o plano está na mesa. Com o seu aceite, a semana 1
            começa.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <BotaoAceite
              termo={TERMO}
              label="Aceitar a proposta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-7 py-3.5 text-sm font-medium text-text transition-colors hover:border-border-accent hover:text-accent"
            >
              <MessageCircle className="size-4" strokeWidth={1.75} />
              Tirar uma dúvida no WhatsApp
            </a>
          </div>
        </div>
      </Section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-10 text-center md:px-8">
          <Logo size="sm" />
          <p className="text-xs text-text-faint">
            Proposta preparada para Nicole Rosa em 10 de outubro de 2026. Válida por 15 dias.
            Documento confidencial.
          </p>
        </div>
      </footer>
    </main>
  );
}
