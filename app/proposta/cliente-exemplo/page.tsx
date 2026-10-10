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
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  PROPOSTA DE EXEMPLO — este arquivo é o seu molde                        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Cliente fictício. Nada aqui é real, os números existem só pra mostrar o
 * formato.
 *
 * PRA CRIAR A SUA:
 *   1. Duplique esta pasta com o slug do seu cliente:
 *        cp -r app/proposta/cliente-exemplo app/proposta/maria-souza
 *   2. Troque `SLUG` abaixo e o slug dentro de `aceite/route.ts`
 *   3. Cadastre os valores em `_lib/propostas.ts`
 *   4. Ponha a senha (o WhatsApp dela) no `.env.local`:
 *        PROPOSTA_SENHA_MARIA_SOUZA=11987654321
 *   5. Troque o conteúdo das constantes abaixo pela proposta dela
 *
 * A ORDEM QUE FUNCIONA: escreva a copy inteira em markdown e aprove ANTES de
 * mexer neste arquivo. Editar copy dentro de JSX é lento e você acaba
 * decidindo texto por causa de layout, que é a ordem errada.
 *
 * OS VÍDEOS: todo `media` abaixo está sem `src`, então aparece a moldura
 * tracejada com o briefing do que aquele vídeo precisa mostrar. Isso é
 * proposital: a página fica publicável hoje, e as animações entram depois.
 */

const SLUG = "cliente-exemplo";

/** Para onde vai o botão de compra. Troque pelo checkout do seu produto. */
const CHECKOUT_URL = "https://exemplo.com.br/checkout/projeto-alva";

/** Seu WhatsApp, pro CTA de dúvida. */
const WHATSAPP_URL = "https://wa.me/5511900000000";

/**
 * Neutra de propósito. Ela aparece antes da senha, inclusive no card de
 * preview quando o link é colado no WhatsApp, então não pode descrever o
 * escopo nem citar dados do cliente.
 */
export const metadata: Metadata = {
  title: "Proposta comercial",
  description: "Documento confidencial. O acesso é restrito ao destinatário.",
  robots: { index: false, follow: false, nocache: true },
};

/* ───────────────────────────── Conteúdo ───────────────────────────── */

/**
 * Os números DELE, não os seus. É o que separa uma proposta de um orçamento:
 * mostra que você olhou a operação antes de falar de preço.
 */
const STATS = [
  { value: "312", label: "orçamentos pedidos no direct nos últimos 90 dias" },
  { value: "18%", label: "deles receberam resposta em menos de 24h" },
  { value: "4h", label: "por dia da equipe em tarefa manual de atendimento" },
  { value: "3x", label: "a capacidade de entrega com o time que já existe" },
];

const DIAGNOSTICO = [
  {
    title: "O que já funciona",
    text: "O Studio Alva fecha projeto por indicação e por Instagram, e a régua de qualidade do portfólio é o que segura o ticket. Isso não se mexe.",
  },
  {
    title: "Onde a operação trava",
    text: "Os 312 pedidos de orçamento do último trimestre chegaram por quatro portas diferentes e nenhuma delas guarda histórico. Quem responde primeiro fecha, e hoje a resposta depende de alguém estar com o celular na mão.",
  },
];

const VAZAMENTOS = [
  {
    n: "01",
    title: "Pedido de orçamento sem triagem",
    text: "Reforma de apartamento inteiro e troca de armário entram na mesma fila. São dois negócios com ticket e ciclo diferentes disputando a mesma atenção.",
  },
  {
    n: "02",
    title: "Nenhum histórico do contato",
    text: "Quando o lead volta três meses depois, ninguém lembra o que foi conversado, e a negociação recomeça do zero.",
  },
  {
    n: "03",
    title: "O conhecimento vive na cabeça de duas pessoas",
    text: "Critério de precificação, fornecedor de confiança, prazo real de cada etapa. Cada pessoa nova depende delas pra funcionar.",
  },
];

/**
 * SEÇÃO TESE (opcional). Use quando ele já tentou algo parecido e deu errado,
 * ou quando a solução óbvia do mercado é diferente da sua. Cada par é
 * [como é sem você, como fica com você]. Não usa? Apague a constante e a
 * seção `tese` lá embaixo.
 */
const CONTRASTE: [string, string][] = [
  ["Robô de resposta pronta, que erra o contexto", "Agente que conhece o seu catálogo e o seu histórico"],
  ["Cada pessoa do time responde de um jeito", "Regras, critérios e nível de acesso definidos"],
  ["Ninguém sabe o que foi feito ontem", "Tudo registrado e auditável"],
  ["Quando erra, erra em silêncio", "Quando não sabe, escala pra humano e pede aprovação"],
];

/**
 * SEÇÃO UM DIA (opcional). É a seção que mais gera resposta no WhatsApp,
 * porque tira a proposta do abstrato. Só escreva se você souber como é o dia
 * dele de verdade; inventado, tem efeito contrário. Não usa? Apague as duas.
 */
const DIA = [
  {
    hora: "08h00",
    text: "O resumo da noite já está no seu WhatsApp. Chegaram 11 mensagens novas, 4 são pedido de orçamento de projeto completo, 5 são serviço pontual e 2 são fornecedor. As 4 já entraram na sua fila com o histórico de cada contato.",
  },
  {
    hora: "11h30",
    text: "Entre uma visita e outra você manda um áudio de 40 segundos com o que combinou no apartamento da Rua X. Quando você senta no carro, a tarefa está criada, a ficha do projeto atualizada e o marceneiro já foi avisado.",
  },
  {
    hora: "16h00",
    text: "Um lead que sumiu em janeiro volta a escrever. O agente reconhece, puxa o que já tinha sido conversado e responde no seu tom, sem você precisar lembrar de nada.",
  },
  {
    hora: "19h00",
    text: "Você pergunta quantos orçamentos viraram projeto no mês e de qual canal vieram. A resposta vem em quinze segundos.",
  },
];

/**
 * O coração da proposta. Um bloco por entregável, com o que entra em bullets
 * e um vídeo mostrando aquilo funcionando.
 *
 * Regra dos vídeos: o vídeo MOSTRA, a página FALA. O briefing descreve a cena,
 * não o texto que vai aparecer nela.
 */
const DELIVERABLES: Deliverable[] = [
  {
    n: "01",
    title: "Central de comando",
    tagline: "O painel onde você enxerga o estúdio inteiro em uma tela.",
    body: [
      "Projetos, orçamentos em aberto, clientes e as tarefas do time no mesmo lugar. Você abre e vê o estado real da operação, sem depender de alguém montar relatório.",
    ],
    items: [
      "Estrutura por setores: Comercial, Projetos, Obra e Financeiro",
      "Quadro de tarefas com dono, prazo e status, alimentado pela IA",
      "Base única de clientes, com histórico e origem de cada um",
      "Memória do que já foi decidido, pra não redecidir toda semana",
    ],
    media: {
      id: "B1",
      aspect: "16:9",
      brief: "Navegação pela central: home com os setores, abrindo o quadro, abrindo a ficha de um cliente.",
    },
  },
  {
    n: "02",
    title: "Assistente no WhatsApp",
    tagline: "Você manda um áudio e o estúdio se move.",
    body: [
      "Seu braço direito no WhatsApp, com acesso a tudo que está na central. Pergunta como está o mês, ele responde. Manda um áudio depois da visita técnica, ele transforma em tarefa e atualiza a ficha do projeto.",
    ],
    items: [
      "Consulta em linguagem natural sobre qualquer dado da operação",
      "Criação e atualização de tarefas por texto ou áudio",
      "Cobrança automática das pendências do time",
      "Aprovação de ações sensíveis no chat, com um sim ou não",
    ],
    media: {
      id: "B2",
      aspect: "9:16",
      brief: "Tela de celular: áudio enviado no WhatsApp, o agente respondendo e a tarefa aparecendo na central em seguida.",
    },
  },
  {
    n: "03",
    title: "Triagem do primeiro contato",
    tagline: "Os 312 pedidos viram três filas organizadas.",
    body: [
      "O agente lê a mensagem, entende o que a pessoa quer de verdade e separa por tipo de projeto, porque reforma completa e serviço pontual não podem entrar pela mesma porta.",
    ],
    items: [
      "Leitura e classificação das mensagens por intenção",
      "Três trilhas: projeto completo, serviço pontual e fora do escopo",
      "Captura do contato com a origem registrada",
      "Lead de alto valor sinalizado na hora pra você",
      "Resposta no seu tom, escalando pra humano no que for técnico",
    ],
    callout: {
      label: "Compromisso importante",
      text: "Nada de proposta ou preço sai de forma autônoma. A IA organiza, qualifica e prepara, quem decide valor é você.",
    },
    media: {
      id: "B3",
      aspect: "9:16",
      brief: "Mensagem chegando, sendo classificada e caindo na fila certa, com o card do lead criado na central.",
    },
  },
];

const FASES = [
  {
    n: "Semana 1",
    title: "Fundação",
    text: "Imersão com você e com o time, mapeamento da operação e definição das regras. Montagem da central, estruturação dos setores e conexão com as ferramentas que vocês já usam.",
    entrega: "Central no ar com o seu contexto dentro e o assistente do WhatsApp respondendo sobre o seu negócio.",
  },
  {
    n: "Semana 2",
    title: "Atendimento e triagem",
    text: "Agente de primeiro contato treinado no seu tom, três trilhas configuradas, captura de contato com origem e integração com o quadro de tarefas.",
    entrega: "Todo pedido que chega entra qualificado e com a origem registrada.",
  },
  {
    n: "Semana 3",
    title: "Autonomia",
    text: "Rotinas de aprovação ajustadas ao seu dia, base de conhecimento estruturada e treinamento da equipe pra operar sem depender da gente.",
    entrega: "Operação rodando com o time atual, e você aprovando em vez de executando.",
  },
];

const PRECISAMOS = [
  {
    o: "Duas horas de imersão inicial com você",
    porque: "É onde a gente captura o que só existe na sua cabeça: critérios, precificação e o que você nunca deixaria a IA fazer",
    quando: "Semana 1",
  },
  {
    o: "Acesso às ferramentas que o time já usa",
    porque: "Base de conhecimento do sistema",
    quando: "Semana 1",
  },
  {
    o: "Uma pessoa do time como ponto focal",
    porque: "Pra destravar acesso e validar rotina no dia a dia",
    quando: "Todo o projeto",
  },
  {
    o: "Aprovação em até 48 horas nos pontos de decisão",
    porque: "É o que segura o cronograma",
    quando: "Todo o projeto",
  },
];

const MENSALIDADE_ITENS = [
  "Manutenção e monitoramento de todos os agentes, com correção do que quebrar",
  "Ajustes e otimizações conforme a operação muda",
  "Uma call por mês pra revisar métricas e priorizar o próximo ciclo",
  "Grupo no WhatsApp com o nosso time, sem chamado e sem fila",
  "Automações e fluxos novos conforme você precisar, sem orçamento novo a cada pedido",
];

const INCLUSO = [
  "Os 3 blocos descritos no escopo",
  "Toda a arquitetura, desenvolvimento, integração e configuração",
  "Os prompts, agentes e automações, todos documentados",
  "Treinamento da equipe e documentação de uso",
  "Ajustes durante a fase de testes de cada entrega, sem custo adicional",
];

const NAO_INCLUSO = [
  "Custos de APIs e serviços de terceiros, cobrados direto dos fornecedores",
  "Gestão de tráfego pago e verba de mídia",
  "Produção de conteúdo gravado com a sua presença física",
  "Desenvolvimento de produto digital fora do escopo dos 3 blocos, que entra como projeto à parte",
];

const GARANTIAS = [
  {
    icon: FileCheck2,
    title: "Propriedade integral",
    text: "Todo o sistema, os arquivos, os prompts e as automações pertencem a você. Se um dia quiser levar pra outro time, leva tudo, com documentação.",
  },
  {
    icon: Building2,
    title: "Seus dados na sua casa",
    text: "A base roda no seu ambiente, não numa plataforma fechada de terceiros. Você não fica preso a mensalidade de software pra continuar acessando o que é seu.",
  },
  {
    icon: ShieldCheck,
    title: "Confidencialidade",
    text: "Níveis de permissão por pessoa e por agente. Nada sensível circula sem regra explícita.",
  },
  {
    icon: UserCheck,
    title: "Humano no comando",
    text: "Toda ação sensível passa por aprovação sua. A IA organiza, prepara e sugere, você decide.",
  },
];

const FAQ_ITENS = [
  {
    q: "Minha equipe vai conseguir usar isso?",
    a: "Vai, e a resposta curta é que o sistema é o WhatsApp. Elas continuam trabalhando como já trabalham, mandando mensagem e áudio. Quem organiza e atualiza é a IA, então ninguém precisa aprender ferramenta nova pra operar.",
  },
  {
    q: "Isso substitui minha equipe?",
    a: "Não, e não é o objetivo. O que muda é o que elas fazem. Hoje boa parte do tempo vai em tarefa mecânica, e isso passa a ser da IA. Elas ficam com relacionamento e com o que precisa de julgamento humano.",
  },
  {
    q: "Por que existe mensalidade se o sistema já vai estar pronto?",
    a: "Porque sistema de IA não é obra entregue com a chave na porta. Modelo novo sai a cada poucas semanas, plataforma muda API e o seu negócio cresce. A mensalidade mantém tudo rodando e te dá um time técnico à disposição, sem virar orçamento novo a cada pedido.",
  },
  {
    q: "Se eu quiser encerrar, perco tudo?",
    a: "Não. O sistema é seu desde o dia um e a documentação também. A mensalidade cobre operação e evolução, não o direito de uso.",
  },
];

const PASSOS: { n: string; title: string; text: string; estado: "feito" | "agora" | "proximo" }[] = [
  { n: "1", title: "Call de diagnóstico", text: "Você trouxe a operação e os gargalos.", estado: "feito" },
  { n: "2", title: "Proposta enviada", text: "Escopo, cronograma e investimento por escrito.", estado: "feito" },
  { n: "3", title: "Aprovação do escopo", text: "Você aceita o termo e finaliza no checkout.", estado: "agora" },
  { n: "4", title: "Início do projeto", text: "Imersão em até 5 dias, e a Semana 1 começa em seguida.", estado: "proximo" },
];

const COMERCIAL = PROPOSTAS[SLUG];

/**
 * O termo que abre antes do checkout. Tudo aqui é derivado das constantes
 * acima, então escopo, cronograma e valores não têm como divergir do que está
 * escrito na página.
 */
const TERMO: Termo = {
  slug: SLUG,
  contratante: COMERCIAL.destinatario,
  contratada: "Seu Estúdio",
  emitidoEm: COMERCIAL.emitidoEm,
  objeto:
    "Implantação de um sistema de inteligência artificial na operação do Studio Alva, cobrindo central de comando, assistente no WhatsApp e triagem do primeiro contato. Depois da entrega, seguimos como braço técnico no modelo de sustentação mensal.",
  blocos: DELIVERABLES.map(({ n, title, tagline, bonus }) => ({ n, title, tagline, bonus })),
  fases: FASES.map(({ n, title, entrega }) => ({ n, title, entrega })),
  prazoTotal:
    "Três semanas a partir da imersão inicial, que acontece em até 5 dias após a aprovação. Ao fim de cada semana existe uma entrega funcionando, não um relatório de andamento.",
  investimento: {
    implantacao: COMERCIAL.implantacao,
    parcelado: COMERCIAL.parcelado,
    condicoes:
      "À vista, ou no cartão em até 12 vezes com os juros do parcelamento. O pagamento é feito na contratação e cobre os 3 blocos, as 3 semanas e o treinamento da equipe.",
    mensal: COMERCIAL.mensal!,
    inicioMensal:
      "Começa depois da entrega, a partir do segundo mês. Cobre manutenção, evolução, uma call por mês e automações novas conforme a operação pedir.",
  },
  incluso: INCLUSO,
  naoIncluso: NAO_INCLUSO,
  contrapartidas: PRECISAMOS.map(({ o, quando }) => ({ o, quando })),
  garantias: GARANTIAS.map(({ title, text }) => ({ title, text })),
  ressalvas: [
    "Custos de APIs e serviços de terceiros são cobrados direto dos fornecedores e proporcionais ao uso. A estimativa mensal é apresentada na Semana 1, antes de qualquer contratação.",
    "Ajustes de escopo podem ser combinados antes do início, sem custo. O contrato formal registra a versão final acordada.",
    "Todo o sistema, os arquivos e as automações são de propriedade do contratante desde o primeiro dia.",
  ],
  checkoutUrl: CHECKOUT_URL,
};

/**
 * Tempo de leitura, derivado do conteúdo, então não envelhece quando o texto muda.
 *
 * ⚠️ Apagou uma seção opcional? Tire a constante dela DAQUI TAMBÉM, além do JSX.
 * São três lugares: a constante lá em cima, a seção no JSX e esta lista. Esquecer
 * este aqui quebra o build com "Cannot find name".
 */
const LEITURA_MIN = minutosDeLeitura(
  STATS, DIAGNOSTICO, VAZAMENTOS, DELIVERABLES, FASES, PRECISAMOS,
  MENSALIDADE_ITENS, INCLUSO, NAO_INCLUSO, GARANTIAS, FAQ_ITENS, PASSOS,
  // opcionais: saem daqui junto com a seção
  CONTRASTE, DIA,
);

/* ───────────────────────────── Página ───────────────────────────── */

export default async function PropostaExemploPage({
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
        destinatario="Marina"
        leituraMin={LEITURA_MIN}
        erro={Boolean(erro)}
        ir={destino}
      />
    );
  }

  return (
    <main className="mesh-bg min-h-screen">
      {/* `?ir=pagamento` abre direto no investimento. É o link de checkout. */}
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
          <Eyebrow>Proposta exclusiva · 12 de março de 2026</Eyebrow>
          <Headline as="h1">
            Triplique a capacidade do estúdio sem{" "}
            <em className="text-accent">aumentar a folha</em>.
          </Headline>
          <Lead className="max-w-3xl">
            Em vez de contratar mais gente pra dar conta do volume, a gente coloca dentro da
            operação um sistema que conhece o Studio Alva por inteiro e assume o trabalho
            repetitivo, pra cada pessoa entregar o que hoje ela não consegue.
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
          <Headline>Três pontos que custam projeto todo mês.</Headline>
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

      {/* 4 · Tese — OPCIONAL. Apagar daqui, da constante CONTRASTE e do LEITURA_MIN. */}
      <Section id="tese">
        <div className="space-y-4">
          <Eyebrow>A diferença</Eyebrow>
          <Headline>
            Não é colocar um robô pra responder. É{" "}
            <em className="text-accent">dar contexto</em> pra máquina.
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

      {/* 4 · Entregáveis */}
      <Section id="entregaveis" width="wide">
        <div className="space-y-4">
          <Eyebrow>O que entra</Eyebrow>
          <Headline>Três blocos, cada um resolvendo um gargalo.</Headline>
        </div>
        <div className="mt-10 space-y-6">
          {DELIVERABLES.map((b) => (
            <DeliverableBlock key={b.n} block={b} />
          ))}
        </div>
      </Section>

      {/* 5 · Fases */}
      <Section id="fases" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Cronograma</Eyebrow>
          <Headline>Três semanas, com entrega ao fim de cada uma.</Headline>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
      </Section>

      {/* 5b · Um dia — OPCIONAL. Apagar daqui, da constante DIA e do LEITURA_MIN. */}
      <Section id="dia">
        <div className="space-y-4">
          <Eyebrow>Na prática</Eyebrow>
          <Headline>Um dia seu com o sistema rodando.</Headline>
        </div>
        <div className="mt-10 space-y-3">
          {DIA.map((d) => (
            <div
              key={d.hora}
              className="grid gap-3 rounded-2xl border border-border bg-bg-card p-5 md:grid-cols-[110px_1fr] md:gap-6"
            >
              <span className="font-mono text-sm text-accent">{d.hora}</span>
              <p className="text-sm leading-relaxed text-text-muted">{d.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6 · O que precisamos de você */}
      <Section id="precisamos">
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

      {/* 7 · Investimento */}
      <Section id="investimento" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Investimento</Eyebrow>
          <Headline>
            A operação construída em três semanas, e um{" "}
            <em className="text-accent">braço técnico</em> que fica com você depois disso.
          </Headline>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-bg-card p-7 md:p-9">
            <div className="pointer-events-none absolute -top-24 left-1/2 size-[320px] -translate-x-1/2 rounded-full bg-accent/10 blur-[80px]" />
            <div className="relative space-y-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
                Implantação
              </p>
              <div className="space-y-3">
                <p className="font-display text-6xl leading-[0.85] tracking-tighter text-accent md:text-7xl">
                  {COMERCIAL.implantacao}
                </p>
                <p className="font-mono text-lg text-text">{COMERCIAL.parcelado}</p>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">
                Cobre os 3 blocos, as 3 semanas e o treinamento da sua equipe.
              </p>
              <div className="space-y-2.5 pt-1">
                <BotaoAceite
                  termo={TERMO}
                  label="Quero avançar com a implementação"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
                />
                <p className="text-center text-xs leading-relaxed text-text-subtle">
                  Você revisa e aceita o escopo completo antes de ir para o pagamento.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border-accent bg-bg-card p-7 md:p-9">
            <div className="space-y-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                Sustentação mensal
              </p>
              <p className="font-display text-6xl leading-[0.85] tracking-tighter md:text-7xl">
                {COMERCIAL.mensal}
              </p>
              <p className="-mt-2 text-xs text-text-subtle">
                Começa depois da entrega, a partir do segundo mês.
              </p>
              <CheckList items={MENSALIDADE_ITENS} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Callout label="Comparação que vale fazer">
            Um projeto completo do Studio Alva paga a implantação inteira. E a triagem sozinha,
            organizando os 312 pedidos por trimestre, existe justamente pra gerar esses projetos.
          </Callout>
        </div>
      </Section>

      {/* 8 · Escopo */}
      <Section id="escopo">
        <div className="space-y-4">
          <Eyebrow>Clareza</Eyebrow>
          <Headline>Para não sobrar dúvida depois da assinatura.</Headline>
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

      {/* 9 · Garantias */}
      <Section id="garantias" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Garantias</Eyebrow>
          <Headline>O sistema é seu. Sem refém, sem caixa-preta.</Headline>
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

      {/* 10 · FAQ */}
      <Section id="faq">
        <div className="space-y-4">
          <Eyebrow>Dúvidas</Eyebrow>
          <Headline>Perguntas que sempre chegam.</Headline>
        </div>
        <div className="mt-10">
          <Faq items={FAQ_ITENS} />
        </div>
      </Section>

      {/* 11 · Próximos passos */}
      <Section id="proximos" tone="raised">
        <div className="space-y-4">
          <Eyebrow>Vamos começar</Eyebrow>
          <Headline>
            Dois passos já estão feitos. Falta <em className="text-accent">um</em> para o projeto
            começar.
          </Headline>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            Marina, o que falta no Studio Alva não é demanda nem qualidade de entrega, é a
            estrutura pra dar conta do que vocês já conquistaram.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <BotaoAceite
              termo={TERMO}
              label="Quero avançar com a implementação"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-7 py-3.5 text-sm font-medium text-text transition-colors hover:border-border-accent hover:text-accent"
            >
              <MessageCircle className="size-4" strokeWidth={1.75} />
              Tenho uma dúvida antes
            </a>
          </div>
        </div>
      </Section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-10 text-center md:px-8">
          <Logo size="sm" />
          <p className="text-xs text-text-faint">
            Proposta preparada para Marina Alves em 12 de março de 2026. Documento confidencial.
          </p>
        </div>
      </footer>
    </main>
  );
}
