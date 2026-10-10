"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail, Star, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cenas animadas dos seis entregáveis da Easyone.
 *
 * Ocupam o lugar do vídeo de cada bloco. Seguem a regra do briefing de
 * animação: a cena mostra, a página fala. Nenhuma tem título, legenda ou frase
 * explicativa; todo texto que aparece é texto de tela (nome de campo, status,
 * rótulo de coluna).
 *
 * Cada cena é uma sequência de passos em laço. Ela só anda enquanto está
 * visível, e quem pede menos movimento no sistema vê o quadro final parado.
 */

function usePassos(total: number, intervaloMs = 1400) {
  const [passo, setPasso] = useState(0);
  const alvo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPasso(total - 1);
      return;
    }
    let visivel = false;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting;
      },
      { threshold: 0.35 },
    );
    if (alvo.current) observador.observe(alvo.current);
    const relogio = setInterval(() => {
      if (visivel) setPasso((p) => (p + 1) % total);
    }, intervaloMs);
    return () => {
      clearInterval(relogio);
      observador.disconnect();
    };
  }, [total, intervaloMs]);

  return { passo, alvo };
}

/* ───────────────────────────── Peças ───────────────────────────── */

/** Moldura de janela. O tamanho da letra acompanha a largura da moldura. */
function Janela({
  app,
  alvo,
  children,
}: {
  app: string;
  alvo: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={alvo}
      aria-hidden
      className="relative aspect-video overflow-hidden rounded-2xl border border-border-strong bg-white"
      style={{ containerType: "inline-size" }}
    >
      <div className="flex h-full flex-col" style={{ fontSize: "clamp(7px, 2.55cqw, 22px)" }}>
        <div className="flex items-center gap-[0.45em] border-b border-border bg-bg-elevated px-[1em] py-[0.65em]">
          <span className="size-[0.6em] rounded-full bg-text-faint/60" />
          <span className="size-[0.6em] rounded-full bg-text-faint/60" />
          <span className="size-[0.6em] rounded-full bg-text-faint/60" />
          <span className="ml-[0.8em] text-[0.8em] font-medium text-text-subtle">{app}</span>
        </div>
        <div className="relative min-h-0 flex-1 p-[1.3em]">{children}</div>
      </div>
    </div>
  );
}

const entra = (visivel: boolean) =>
  cn(
    "transition-all duration-500 ease-out",
    visivel ? "translate-y-0 opacity-100" : "translate-y-[0.7em] opacity-0",
  );

function Cartao({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[0.8em] border border-border bg-white p-[1em]", className)}>
      {children}
    </div>
  );
}

type Tom = "neutro" | "roxo" | "azul" | "verde" | "ambar";

const TONS: Record<Tom, string> = {
  neutro: "border-border-strong bg-bg-elevated text-text-muted",
  roxo: "border-border-accent bg-accent-soft text-accent",
  azul: "border-accent-2/40 bg-accent-2/10 text-accent-2",
  verde: "border-success/40 bg-success/10 text-success",
  ambar: "border-[#d98a00]/40 bg-[#ffbd58]/20 text-[#8a5a00]",
};

function Etiqueta({ tom = "neutro", children }: { tom?: Tom; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.3em] whitespace-nowrap rounded-full border px-[0.7em] py-[0.15em] text-[0.72em] font-medium transition-colors duration-500",
        TONS[tom],
      )}
    >
      {children}
    </span>
  );
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.62em] font-medium uppercase tracking-[0.14em] text-text-subtle">
      {children}
    </p>
  );
}

/** Linha cinza no lugar de um texto que não importa pra cena. */
function Traco({ largura }: { largura: string }) {
  return <span className="block h-[0.5em] rounded-full bg-border-strong/60" style={{ width: largura }} />;
}

function Barra({ valor, tom = "roxo" }: { valor: number; tom?: "roxo" | "azul" | "verde" }) {
  const cor = tom === "roxo" ? "bg-accent" : tom === "azul" ? "bg-accent-2" : "bg-success";
  return (
    <div className="h-[0.55em] w-full overflow-hidden rounded-full bg-bg-elevated">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", cor)}
        style={{ width: `${valor}%` }}
      />
    </div>
  );
}

/* ───────────────────────────── 01 · Encerramento ───────────────────────────── */

export function CenaEncerramento() {
  const { passo, alvo } = usePassos(9);
  const dias = Math.min(passo, 3);
  const fechado = passo >= 4;
  const email = passo >= 5;
  const avaliado = passo >= 6;

  return (
    <Janela app="Movidesk" alvo={alvo}>
      <div className="grid h-full grid-cols-[1.25fr_1fr] gap-[1.2em]">
        <Cartao className="flex flex-col gap-[0.9em]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.75em] text-text-subtle">#48213</span>
            <Etiqueta tom={fechado ? "verde" : "ambar"}>
              {fechado && <Check className="size-[1em]" strokeWidth={3} />}
              {fechado ? "Fechado" : "Resolvido"}
            </Etiqueta>
          </div>
          <div className="space-y-[0.35em]">
            <p className="text-[1em] font-medium leading-tight text-text">Erro na emissão de NF-e</p>
            <p className="text-[0.75em] text-text-muted">Friolack · Suporte SAP</p>
          </div>
          <div className="mt-auto space-y-[0.5em]">
            <Rotulo>Sem resposta do cliente</Rotulo>
            <div className="grid grid-cols-3 gap-[0.4em]">
              {[1, 2, 3].map((d) => (
                <div key={d} className="space-y-[0.3em]">
                  <div
                    className={cn(
                      "h-[0.55em] rounded-full transition-colors duration-500",
                      dias >= d ? "bg-accent" : "bg-bg-elevated",
                    )}
                  />
                  <p className="text-[0.62em] text-text-subtle">dia útil {d}</p>
                </div>
              ))}
            </div>
          </div>
        </Cartao>

        <Cartao className={cn("flex flex-col gap-[0.8em]", entra(email))}>
          <div className="flex items-center gap-[0.5em] text-text-subtle">
            <Mail className="size-[1.1em]" strokeWidth={1.75} />
            <span className="text-[0.7em]">Para: cliente</span>
          </div>
          <p className="text-[0.95em] font-medium leading-tight text-text">Como foi o seu atendimento?</p>
          <div className="space-y-[0.4em]">
            <Traco largura="90%" />
            <Traco largura="65%" />
          </div>
          <div className="mt-auto flex gap-[0.35em]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={cn(
                  "size-[1.6em] transition-colors duration-300",
                  avaliado ? "fill-[#ffbd58] text-[#ffbd58]" : "text-border-strong",
                )}
                style={{ transitionDelay: avaliado ? `${i * 90}ms` : "0ms" }}
                strokeWidth={1.5}
              />
            ))}
          </div>
        </Cartao>
      </div>
    </Janela>
  );
}

/* ───────────────────────────── 02 · SLA por contrato ───────────────────────────── */

function LinhaSla({
  contrato,
  tom,
  resposta,
  solucao,
  passo,
  entrada,
}: {
  contrato: string;
  tom: Tom;
  resposta: number;
  solucao: number;
  passo: number;
  entrada: number;
}) {
  const contratoVisivel = passo >= 3;
  const prazos = passo >= 4;
  return (
    <Cartao className={cn("space-y-[0.8em]", entra(passo >= entrada))}>
      <div className="flex items-center justify-between gap-[0.6em]">
        <div className="min-w-0 space-y-[0.3em]">
          <p className="truncate text-[0.95em] font-medium leading-tight text-text">
            Sistema parado no faturamento
          </p>
          <div className="flex items-center gap-[0.4em]">
            <Etiqueta tom="neutro">Urgente</Etiqueta>
            <span className={entra(contratoVisivel)}>
              <Etiqueta tom={tom}>{contrato}</Etiqueta>
            </span>
          </div>
        </div>
        <span className="font-mono text-[0.72em] text-text-subtle">09:00</span>
      </div>
      <div className="grid grid-cols-[5.5em_1fr] items-center gap-x-[0.8em] gap-y-[0.45em]">
        <Rotulo>1ª resposta</Rotulo>
        <Barra valor={prazos ? resposta : 0} tom="azul" />
        <Rotulo>Solução</Rotulo>
        <Barra valor={prazos ? solucao : 0} />
      </div>
    </Cartao>
  );
}

export function CenaSla() {
  const { passo, alvo } = usePassos(8);
  return (
    <Janela app="Movidesk" alvo={alvo}>
      <div className="flex h-full flex-col justify-center gap-[1em]">
        <LinhaSla contrato="SLA AMS" tom="roxo" resposta={22} solucao={40} passo={passo} entrada={1} />
        <LinhaSla contrato="SLA Sem AMS" tom="neutro" resposta={55} solucao={92} passo={passo} entrada={2} />
      </div>
    </Janela>
  );
}

/* ───────────────────────────── 03 · Classificação ───────────────────────────── */

function CampoEscolha({ rotulo, valor, preenchido }: { rotulo: string; valor: string; preenchido: boolean }) {
  return (
    <div className="space-y-[0.3em]">
      <Rotulo>{rotulo}</Rotulo>
      <div
        className={cn(
          "flex h-[2.2em] items-center rounded-[0.5em] border px-[0.7em] text-[0.85em] transition-colors duration-500",
          preenchido ? "border-border-accent bg-accent-soft text-text" : "border-border bg-white text-text-faint",
        )}
      >
        {preenchido ? valor : "Selecione"}
      </div>
    </div>
  );
}

const MODULOS = [
  { nome: "Fiscal", base: 46, depois: 58 },
  { nome: "Financeiro", base: 34, depois: 34 },
  { nome: "Estoque", base: 22, depois: 22 },
  { nome: "Vendas", base: 15, depois: 15 },
];

export function CenaClassificacao() {
  const { passo, alvo } = usePassos(8);
  const concluido = passo >= 4;
  return (
    <Janela app="Movidesk" alvo={alvo}>
      <div className="grid h-full grid-cols-[1fr_1.1fr] gap-[1.2em]">
        <Cartao className="flex flex-col gap-[0.7em]">
          <CampoEscolha rotulo="Produto" valor="SAP Business One" preenchido={passo >= 1} />
          <CampoEscolha rotulo="Módulo" valor="Fiscal" preenchido={passo >= 2} />
          <CampoEscolha rotulo="Tipo de demanda" valor="Erro" preenchido={passo >= 3} />
          <div
            className={cn(
              "mt-auto flex h-[2.2em] items-center justify-center gap-[0.4em] rounded-full text-[0.8em] font-medium transition-colors duration-500",
              concluido ? "bg-success text-white" : passo >= 3 ? "bg-accent text-on-accent" : "bg-bg-elevated text-text-faint",
            )}
          >
            {concluido && <Check className="size-[1em]" strokeWidth={3} />}
            {concluido ? "Concluído" : "Concluir ticket"}
          </div>
        </Cartao>

        <Cartao className="flex flex-col gap-[0.9em]">
          <Rotulo>Tickets por módulo</Rotulo>
          <div className="flex flex-1 flex-col justify-around">
            {MODULOS.map((m) => (
              <div key={m.nome} className="grid grid-cols-[5.5em_1fr] items-center gap-[0.8em]">
                <span
                  className={cn(
                    "text-[0.8em] transition-colors duration-500",
                    m.nome === "Fiscal" && passo >= 5 ? "font-medium text-accent" : "text-text-muted",
                  )}
                >
                  {m.nome}
                </span>
                <Barra valor={passo >= 5 ? m.depois : m.base} tom={m.nome === "Fiscal" ? "roxo" : "azul"} />
              </div>
            ))}
          </div>
        </Cartao>
      </div>
    </Janela>
  );
}

/* ───────────────────────────── 04 · Roteamento ───────────────────────────── */

const FILAS = ["Suporte SAP", "Desenvolvimento", "Infra"];

export function CenaRoteamento() {
  const { passo, alvo } = usePassos(9);
  const naFila = passo >= 5;
  return (
    <Janela app="Movidesk" alvo={alvo}>
      <div className="flex h-full flex-col gap-[1em]">
        <div
          className={cn(
            "flex items-center gap-[0.9em] rounded-[0.8em] border p-[0.8em] transition-all duration-500",
            passo < 1 ? "-translate-y-[0.6em] opacity-0" : naFila ? "translate-y-0 opacity-40" : "translate-y-0 opacity-100",
            passo >= 2 ? "border-border-accent bg-accent-soft" : "border-border bg-white",
          )}
        >
          <Mail className="size-[1.4em] shrink-0 text-text-subtle" strokeWidth={1.75} />
          <div className="min-w-0 flex-1 space-y-[0.25em]">
            <p className="truncate text-[0.9em] font-medium leading-tight text-text">Dúvida no fechamento do mês</p>
            <p className="truncate text-[0.7em] text-text-subtle">para suporte@easyone.com.br</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-[0.35em]">
            <span className={entra(passo >= 2)}>
              <Etiqueta tom="azul">SAP Business One</Etiqueta>
            </span>
            <span className={entra(passo >= 3)}>
              <Etiqueta tom="roxo">Suporte SAP</Etiqueta>
            </span>
            <span className={entra(passo >= 4)}>
              <Etiqueta>Média</Etiqueta>
            </span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-[0.8em]">
          {FILAS.map((fila, i) => (
            <div key={fila} className="flex flex-col gap-[0.5em] rounded-[0.8em] bg-bg-elevated p-[0.7em]">
              <Rotulo>{fila}</Rotulo>
              {i === 0 && (
                <div
                  className={cn(
                    "space-y-[0.35em] rounded-[0.6em] border border-border-accent bg-white p-[0.6em] transition-all duration-500",
                    naFila ? "translate-y-0 opacity-100" : "-translate-y-[1em] opacity-0",
                  )}
                >
                  <p className="truncate text-[0.72em] font-medium text-text">Dúvida no fechamento do mês</p>
                  <Traco largura="55%" />
                </div>
              )}
              {Array.from({ length: i === 0 ? 2 : i === 1 ? 2 : 1 }).map((_, n) => (
                <div key={n} className="space-y-[0.35em] rounded-[0.6em] border border-border bg-white p-[0.6em]">
                  <Traco largura={n === 0 ? "80%" : "65%"} />
                  <Traco largura="45%" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Janela>
  );
}

/* ───────────────────────────── 05 · Painéis ───────────────────────────── */

const EQUIPES = ["Suporte SAP", "Dev", "Infra"];
const PAINEIS = [
  { titulo: "SLA de solução", valores: [78, 54, 86], tom: "roxo" as const },
  { titulo: "Backlog", valores: [62, 88, 30], tom: "azul" as const },
  { titulo: "Satisfação", valores: [84, 70, 90], tom: "verde" as const },
];

export function CenaPaineis() {
  const { passo, alvo } = usePassos(8);
  const alerta = passo >= 4;
  return (
    <Janela app="Movidesk" alvo={alvo}>
      <div className="grid h-full grid-cols-3 gap-[0.9em]">
        {PAINEIS.map((painel, i) => (
          <Cartao key={painel.titulo} className={cn("flex flex-col gap-[0.8em]", entra(passo >= i + 1 || passo >= 3))}>
            <Rotulo>{painel.titulo}</Rotulo>
            <div className="flex flex-1 flex-col justify-around">
              {EQUIPES.map((equipe, e) => (
                <div key={equipe} className="space-y-[0.3em]">
                  <span className="text-[0.7em] text-text-muted">{equipe}</span>
                  <Barra valor={passo >= i + 1 ? painel.valores[e] : 0} tom={painel.tom} />
                </div>
              ))}
            </div>
          </Cartao>
        ))}
      </div>

      <div
        className={cn(
          "absolute bottom-[1.3em] right-[1.3em] flex items-center gap-[0.7em] rounded-[0.8em] border border-[#d98a00]/40 bg-white p-[0.8em] shadow-lg transition-all duration-500",
          alerta ? "translate-y-0 opacity-100" : "translate-y-[1.2em] opacity-0",
        )}
      >
        <TriangleAlert className="size-[1.4em] text-[#d98a00]" strokeWidth={1.75} />
        <div className="space-y-[0.2em]">
          <p className="text-[0.82em] font-medium leading-tight text-text">SLA a vencer</p>
          <p className="text-[0.68em] text-text-muted">75% do prazo · Suporte SAP</p>
        </div>
      </div>
    </Janela>
  );
}

/* ───────────────────────────── 06 · SenseData ───────────────────────────── */

export function CenaSenseData() {
  const { passo, alvo } = usePassos(9);
  const clicando = passo === 1;
  const enviada = passo >= 2;
  const respondida = passo >= 4;
  return (
    <Janela app="SenseData" alvo={alvo}>
      <div className="grid h-full grid-cols-[1fr_1.15fr] gap-[1.2em]">
        <Cartao className="flex flex-col gap-[0.8em]">
          <div className="space-y-[0.35em]">
            <Rotulo>Projeto</Rotulo>
            <p className="text-[1em] font-medium leading-tight text-text">Moageira Irati</p>
          </div>
          <div className="flex flex-wrap gap-[0.4em]">
            <Etiqueta tom="verde">
              <Check className="size-[1em]" strokeWidth={3} />
              Fase encerrada
            </Etiqueta>
          </div>
          <div
            className={cn(
              "mt-auto flex h-[2.3em] items-center justify-center gap-[0.4em] rounded-full text-[0.78em] font-medium transition-all duration-300",
              enviada ? "bg-success/10 text-success" : "bg-accent text-on-accent",
              clicando && "scale-95",
            )}
          >
            {enviada && <Check className="size-[1em]" strokeWidth={3} />}
            {enviada ? "Pesquisa enviada" : "Disparar pesquisa de fase"}
          </div>
        </Cartao>

        <Cartao className="flex flex-col gap-[0.8em]">
          <Rotulo>Painel do cliente</Rotulo>
          <div className="space-y-[0.4em]">
            <div className="flex items-center justify-between">
              <span className="text-[0.75em] text-text-muted">Health score</span>
            </div>
            <Barra valor={respondida ? 82 : 58} tom="verde" />
          </div>
          <div className="space-y-[0.5em]">
            <div className="flex items-center justify-between gap-[0.6em] rounded-[0.6em] border border-border p-[0.6em]">
              <Traco largura="45%" />
              <Traco largura="18%" />
            </div>
            <div
              className={cn(
                "flex items-center justify-between gap-[0.6em] rounded-[0.6em] border border-border-accent bg-accent-soft p-[0.6em]",
                entra(respondida),
              )}
            >
              <span className="text-[0.75em] font-medium text-text">Pesquisa de fase</span>
              <span className="flex gap-[0.2em]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-[1em] fill-[#ffbd58] text-[#ffbd58]" strokeWidth={1.5} />
                ))}
              </span>
            </div>
          </div>
          <div className={cn("mt-auto", entra(passo >= 3 && !respondida))}>
            <Etiqueta tom="neutro">Aguardando resposta</Etiqueta>
          </div>
        </Cartao>
      </div>
    </Janela>
  );
}
