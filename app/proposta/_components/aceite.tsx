"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { jsPDF } from "jspdf";
import { ArrowRight, Check, Download, FileText, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gerarContratoPdf } from "@/app/proposta/_lib/contrato-pdf";

/**
 * Termo de aceite das propostas comerciais.
 *
 * O botão de compra não leva direto pro checkout. Antes ele abre o resumo do
 * que foi combinado em formato de termo: escopo, prazo, investimento,
 * contrapartidas e garantias. O cliente marca que concorda e só então segue.
 *
 * Serve pra duas coisas ao mesmo tempo: dar peso de documento ao momento da
 * compra e deixar registrado, na frente do cliente, exatamente o que ele está
 * contratando. Isso é o que evita a conversa de "mas eu achei que incluía".
 *
 * Ao seguir pro checkout, o contrato em PDF é baixado no computador do cliente
 * com o aceite marcado, a data e a hora. O cliente sai da proposta com o
 * documento na mão, não só com a memória de ter clicado em concordo.
 *
 * Os dados vêm da própria página da proposta, derivados das mesmas constantes
 * que montam as seções. Mudou o escopo na página, o termo muda junto.
 */

export interface Termo {
  /** Slug da rota. Identifica a proposta no registro de aceite. */
  slug: string;
  contratante: string;
  contratada: string;
  /** Data de emissão da proposta, por extenso. */
  emitidoEm: string;
  objeto: string;
  blocos: { n: string; title: string; tagline?: string; bonus?: boolean }[];
  /**
   * Cronograma, quando existe. Proposta de escopo fechado sem data acordada
   * omite: melhor não ter o artigo do que ter prazo que ninguém combinou.
   */
  fases?: { n: string; title: string; entrega: string }[];
  prazoTotal?: string;
  investimento: {
    implantacao: string;
    parcelado: string;
    condicoes: string;
    /** Só nas propostas com sustentação recorrente. */
    mensal?: string;
    inicioMensal?: string;
    /**
     * Pagamento dividido em datas acordadas. Quando existe, o termo lista cada
     * parte com valor, vencimento e condição de parcelamento próprios: é o que
     * evita a briga de "mas eu achei que era tudo na entrada".
     */
    parcelas?: { label: string; valor: string; quando: string; parcelado: string }[];
  };
  incluso: string[];
  naoIncluso: string[];
  contrapartidas: { o: string; quando: string }[];
  /** Garantias formais, quando a proposta as tem. */
  garantias?: { title: string; text: string }[];
  /** Ressalvas finais, no fecho do documento. */
  ressalvas: string[];
  checkoutUrl: string;
  /** Rótulo do primeiro artigo do escopo, quando "blocos" não descreve bem. */
  rotuloBlocos?: string;
  /**
   * Como o termo se apresenta na primeira linha.
   *
   * O padrão diz que o documento resume o que foi combinado na reunião de
   * alinhamento, porque foi assim que as primeiras propostas nasceram. Só que
   * nem toda proposta vem de reunião: algumas saem de uma conversa por áudio ou
   * de um contato por mensagem. Nesses casos afirmar reunião que não houve é
   * escrever mentira num documento que o cliente aceita formalmente, então a
   * página passa a origem verdadeira aqui.
   */
  origem?: string;
  /**
   * Qual caminho de compra este termo representa, nas páginas que oferecem
   * mais de um. Vai no registro do aceite pro servidor saber quais condições
   * gravar. Página de proposta única não precisa declarar.
   */
  opcao?: string;
}

export function BotaoAceite({
  termo,
  label,
  className,
}: {
  termo: Termo;
  label: string;
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);
  // estável de propósito: o modal usa isso como dependência de efeito
  const fechar = useCallback(() => setAberto(false), []);

  return (
    <>
      <button type="button" onClick={() => setAberto(true)} className={className}>
        {label}
        <ArrowRight className="size-4" strokeWidth={2} />
      </button>
      <ModalAceite termo={termo} aberto={aberto} fechar={fechar} />
    </>
  );
}

function ModalAceite({
  termo,
  aberto,
  fechar,
}: {
  termo: Termo;
  aberto: boolean;
  fechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [aceito, setAceito] = useState(false);
  const checkboxId = useId();

  /**
   * O jsPDF é carregado quando o modal abre, não no clique.
   *
   * O download precisa acontecer dentro do gesto do usuário: se a geração
   * ficasse esperando um `await import()`, o navegador trataria o `save()`
   * como download não solicitado e poderia bloquear. Carregando aqui, no
   * momento do clique a classe já está em mãos e a geração é síncrona.
   */
  const jspdf = useRef<typeof jsPDF | null>(null);
  useEffect(() => {
    if (!aberto || jspdf.current) return;
    let vivo = true;
    void import("jspdf").then((m) => {
      if (vivo) jspdf.current = m.jsPDF;
    });
    return () => {
      vivo = false;
    };
  }, [aberto]);

  /** Gera e baixa o contrato. Nunca impede o cliente de seguir pro checkout. */
  const baixarContrato = useCallback(() => {
    const Classe = jspdf.current;
    if (!Classe) return;
    try {
      gerarContratoPdf(Classe, termo, {
        aceitoEm: new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "America/Sao_Paulo",
        }).format(new Date()),
        origem: window.location.href.split("?")[0],
      });
    } catch (erro) {
      console.error("[proposta/aceite] falha ao gerar o contrato em PDF", erro);
    }
  }, [termo]);

  /**
   * Numeração dos artigos. Conta na ordem em que eles realmente aparecem, que
   * é o que evita buraco (01, 02, 04...) quando a proposta não tem cronograma
   * ou garantias. Zera a cada render porque vive no corpo do componente, e o
   * JSX abaixo é avaliado de cima pra baixo.
   */
  let seq = 0;
  const num = () => String(++seq).padStart(2, "0");

  /** Sem cronograma no termo, o documento não pode falar em "prazo acordado". */
  const temCronograma = Boolean(termo.prazoTotal || termo.fases?.length);

  /**
   * O efeito só age com o modal aberto, e a limpeza desfaz tudo. Assim as
   * quatro saídas (botão, Esc, clique no backdrop e o link do checkout) passam
   * pelo mesmo caminho: `fechar()` derruba o estado, a limpeza fecha o dialog
   * e devolve o scroll da página.
   *
   * O estado do React é a fonte da verdade, nunca o `open` do elemento. O
   * evento nativo `close` não é confiável em todo navegador, e quando ele não
   * dispara o `aberto` fica travado em true e a página nunca volta a rolar.
   * Por isso o Esc é interceptado antes de fechar sozinho.
   *
   * O conteúdo também só monta quando abre, então dois botões na mesma página
   * não deixam duas cópias do termo no DOM.
   */
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !aberto) return;

    if (!dialog.open) dialog.showModal();
    // showModal não trava o scroll do body sozinho em todos os navegadores
    document.body.style.overflow = "hidden";

    // `cancel` é o Esc. Segurar o default evita que o dialog feche por fora do
    // React; `close` é só uma rede de segurança pra quem fechar por outro meio.
    const aoCancelar = (e: Event) => {
      e.preventDefault();
      fechar();
    };
    const aoFechar = () => fechar();
    dialog.addEventListener("cancel", aoCancelar);
    dialog.addEventListener("close", aoFechar);

    return () => {
      dialog.removeEventListener("cancel", aoCancelar);
      dialog.removeEventListener("close", aoFechar);
      if (dialog.open) dialog.close();
      document.body.style.overflow = "";
      setAceito(false);
    };
  }, [aberto, fechar]);

  return (
    <dialog
      ref={ref}
      // clique no backdrop fecha: o alvo do clique é o próprio dialog só
      // quando cai fora do conteúdo
      onClick={(e) => {
        if (e.target === ref.current) fechar();
      }}
      // Esc pelo React, que é o caminho que dispara em qualquer navegador
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          fechar();
        }
      }}
      className={cn(
        // no celular ocupa a tela inteira, que é onde o documento longo cabe
        // melhor. A partir de sm vira o cartão flutuante centralizado.
        "m-0 h-[100dvh] max-h-[100dvh] w-full max-w-none overflow-hidden rounded-none p-0",
        "sm:m-auto sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[min(100%-1.5rem,58rem)] sm:rounded-3xl sm:border sm:border-border-strong",
        "bg-bg-card text-text backdrop:bg-black/75 backdrop:backdrop-blur-sm",
      )}
    >
      {aberto && (
        <div className="flex h-full max-h-[100dvh] flex-col sm:max-h-[calc(100dvh-2rem)]">
          {/* Cabeçalho */}
          <header className="shrink-0 border-b border-border bg-bg-elevated px-6 py-5 md:px-9">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-accent bg-accent/15 text-accent">
                  <FileText className="size-4.5" strokeWidth={1.75} />
                </span>
                <div className="space-y-1">
                  <h2 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    Termo de aceite da proposta
                  </h2>
                  <p className="text-xs text-text-subtle">
                    {termo.contratada} e {termo.contratante} · emitida em{" "}
                    {termo.emitidoEm}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-subtle transition-colors hover:border-border-strong hover:text-text"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>
          </header>

          {/* Corpo do termo */}
          <div className="min-h-0 flex-1 space-y-9 overflow-y-auto px-6 py-7 md:px-9 md:py-9">
            <p className="rounded-xl border border-border bg-bg-elevated p-4 text-sm leading-relaxed text-text-muted">
              {termo.origem ??
                "Este documento resume o que foi combinado na reunião de alinhamento."}{" "}
              Ao aceitar, você confirma que leu e concorda com o escopo
              {temCronograma ? ", o prazo" : ""} e o investimento descritos
              abaixo. O contrato formal, com estas mesmas condições, é assinado
              na sequência.
            </p>

            <Artigo n={num()} titulo="Partes e objeto">
              <div className="grid gap-3 sm:grid-cols-2">
                <Parte label="Contratante" nome={termo.contratante} />
                <Parte label="Contratada" nome={termo.contratada} />
              </div>
              <p>{termo.objeto}</p>
            </Artigo>

            <Artigo n={num()} titulo="Escopo da entrega">
              <p>
                {termo.rotuloBlocos ??
                  `A implantação contempla os ${termo.blocos.length} blocos abaixo, detalhados na proposta:`}
              </p>
              <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {termo.blocos.map((b) => (
                  <li
                    key={b.n}
                    className={cn(
                      "flex gap-3.5 p-4",
                      b.bonus && "bg-accent-soft",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px]",
                        b.bonus
                          ? "bg-accent text-on-accent"
                          : "border border-border-strong bg-bg-elevated text-text-subtle",
                      )}
                    >
                      {b.n}
                    </span>
                    <div className="space-y-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium leading-snug text-text">
                        {b.title}
                        {b.bonus && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border-accent bg-accent/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-accent">
                            <Sparkles className="size-2.5" strokeWidth={2} />
                            Bônus
                          </span>
                        )}
                      </p>
                      {b.tagline && (
                        <p className="text-xs leading-relaxed text-text-muted">
                          {b.tagline}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Artigo>

            {temCronograma && (
            <Artigo n={num()} titulo="Prazo e cronograma">
              {termo.prazoTotal && <p>{termo.prazoTotal}</p>}
              <div className="space-y-2.5">
                {(termo.fases ?? []).map((f) => (
                  <div
                    key={f.n}
                    className="rounded-xl border border-border bg-bg-elevated p-4"
                  >
                    <p className="mb-1.5 flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                        {f.n}
                      </span>
                      <span className="text-sm font-medium text-text">
                        {f.title}
                      </span>
                    </p>
                    <p className="text-xs leading-relaxed text-text-muted">
                      <span className="text-text-subtle">Entrega ao fim: </span>
                      {f.entrega}
                    </p>
                  </div>
                ))}
              </div>
            </Artigo>
            )}

            <Artigo n={num()} titulo="Investimento e forma de pagamento">
              <div
                className={cn(
                  "grid gap-3",
                  termo.investimento.mensal && "sm:grid-cols-2",
                )}
              >
                <div className="rounded-xl border border-border-accent bg-accent-soft p-4">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                    {termo.investimento.parcelas?.length ? "Valor total" : "Implantação"}
                  </p>
                  <p className="font-display text-3xl leading-none tracking-tight">
                    {termo.investimento.implantacao}
                  </p>
                  <p className="mt-2 font-mono text-xs text-text-muted">
                    {termo.investimento.parcelado}
                  </p>
                  <p className="mt-2.5 text-xs leading-relaxed text-text-muted">
                    {termo.investimento.condicoes}
                  </p>
                </div>
                {termo.investimento.mensal && (
                  <div className="rounded-xl border border-border bg-bg-elevated p-4">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
                      Sustentação mensal
                    </p>
                    <p className="font-display text-3xl leading-none tracking-tight">
                      {termo.investimento.mensal}
                    </p>
                    <p className="mt-2.5 text-xs leading-relaxed text-text-muted">
                      {termo.investimento.inicioMensal}
                    </p>
                  </div>
                )}
              </div>

              {!!termo.investimento.parcelas?.length && (
                <>
                  <p>
                    O pagamento é feito em duas partes, nas datas abaixo. Cada uma pode
                    ser parcelada no cartão de forma independente:
                  </p>
                  <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                    {termo.investimento.parcelas.map((p) => (
                      <div
                        key={p.label}
                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                      >
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
                            {p.label}
                          </p>
                          <p className="font-display text-2xl leading-none tracking-tight">
                            {p.valor}
                          </p>
                        </div>
                        <div className="space-y-1 sm:text-right">
                          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                            {p.quando}
                          </p>
                          <p className="text-xs leading-snug text-text-muted">
                            {p.parcelado}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Artigo>

            <Artigo n={num()} titulo="O que está incluso">
              <ListaTermo items={termo.incluso} />
            </Artigo>

            <Artigo n={num()} titulo="O que não está incluso">
              <ul className="space-y-2.5">
                {termo.naoIncluso.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-text-faint" />
                    <span className="leading-snug text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </Artigo>

            <Artigo n={num()} titulo="O que precisamos de você">
              <p>
                {termo.fases?.length
                  ? "O cronograma acima depende destas contrapartidas. É o que segura o prazo de entrega:"
                  : "A entrega depende destas contrapartidas. É o que segura o prazo:"}
              </p>
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {termo.contrapartidas.map((c) => (
                  <div
                    key={c.o}
                    className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <p className="text-sm leading-snug text-text">{c.o}</p>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      {c.quando}
                    </span>
                  </div>
                ))}
              </div>
            </Artigo>

            {!!termo.garantias?.length && (
            <Artigo n={num()} titulo="Garantias">
              <div className="grid gap-3 sm:grid-cols-2">
                {termo.garantias?.map((g) => (
                  <div
                    key={g.title}
                    className="rounded-xl border border-border bg-bg-elevated p-4"
                  >
                    <p className="mb-1.5 text-sm font-medium text-accent">
                      {g.title}
                    </p>
                    <p className="text-xs leading-relaxed text-text-muted">
                      {g.text}
                    </p>
                  </div>
                ))}
              </div>
            </Artigo>
            )}

            <Artigo n={num()} titulo="Observações">
              <ul className="space-y-2.5">
                {termo.ressalvas.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-text-faint" />
                    <span className="leading-snug text-text-muted">{r}</span>
                  </li>
                ))}
              </ul>
            </Artigo>
          </div>

          {/* Aceite */}
          <footer className="shrink-0 space-y-3.5 border-t border-border bg-bg-elevated px-6 py-4 md:px-9 md:py-5">
            <label
              htmlFor={checkboxId}
              className="flex cursor-pointer items-start gap-3"
            >
              <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={aceito}
                  onChange={(e) => setAceito(e.target.checked)}
                  className="peer absolute size-full cursor-pointer appearance-none rounded-md border border-border-strong bg-bg-input checked:border-accent checked:bg-accent"
                />
                <Check
                  className="pointer-events-none relative size-3 text-on-accent opacity-0 peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm leading-snug text-text-muted">
                Li o termo acima e concordo com o escopo,
                {temCronograma ? " o prazo," : ""} as contrapartidas e o
                investimento descritos.
              </span>
            </label>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-text-subtle">
              <Download className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2} />
              Ao continuar, o contrato com estes termos é baixado no seu computador em
              PDF, já com o aceite marcado, a data e a hora do registro.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={fechar}
                className="order-2 rounded-full px-6 py-2 text-sm font-medium text-text-subtle transition-colors hover:text-accent sm:order-1 sm:border sm:border-border-strong sm:py-3 sm:text-text-muted sm:hover:border-border-accent"
              >
                Voltar para a proposta
              </button>

              {aceito ? (
                <a
                  href={termo.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // o PDF vem primeiro: é o único passo que depende do gesto
                    baixarContrato();
                    registrarAceite(termo.slug, termo.opcao);
                    fechar();
                  }}
                  className="order-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover sm:order-2"
                >
                  Aceitar e continuar
                  <ArrowRight className="size-4" strokeWidth={2} />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="order-1 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-accent/25 px-7 py-3 text-sm font-medium text-text-subtle sm:order-2"
                >
                  Aceitar e continuar
                  <ArrowRight className="size-4" strokeWidth={2} />
                </button>
              )}
            </div>
          </footer>
        </div>
      )}
    </dialog>
  );
}

/**
 * Registra o aceite no banco. Data, IP e condições comerciais são resolvidos
 * no servidor, então daqui não sai nada além do próprio request.
 *
 * O endpoint mora sob `/proposta/<slug>/` porque é o escopo do cookie que
 * prova quem abriu a proposta. Um `/api/...` não receberia esse cookie.
 *
 * Não é aguardado de propósito: se o banco estiver fora do ar, o cliente
 * continua conseguindo pagar. `keepalive` mantém o request vivo mesmo se a
 * navegação pro checkout roubar a aba.
 */
function registrarAceite(slug: string, opcao?: string) {
  void fetch(`/proposta/${slug}/aceite`, {
    method: "POST",
    keepalive: true,
    ...(opcao && {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opcao }),
    }),
  }).catch(() => {});
}

/* ───────────────────────────── Peças internas ───────────────────────────── */

function Artigo({
  n,
  titulo,
  children,
}: {
  n: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3.5">
      <h3 className="flex items-baseline gap-2.5 font-display text-lg leading-tight tracking-tight md:text-xl">
        <span className="font-mono text-xs text-accent">{n}</span>
        {titulo}
      </h3>
      <div className="space-y-3.5 text-sm leading-relaxed text-text-muted">
        {children}
      </div>
    </section>
  );
}

function Parte({ label, nome }: { label: string; nome: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated p-4">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
        {label}
      </p>
      <p className="text-sm leading-snug text-text">{nome}</p>
    </div>
  );
}

function ListaTermo({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border-accent bg-accent/15 text-accent">
            <Check className="size-3" strokeWidth={2.5} />
          </span>
          <span className="leading-snug text-text-muted">{item}</span>
        </li>
      ))}
    </ul>
  );
}
