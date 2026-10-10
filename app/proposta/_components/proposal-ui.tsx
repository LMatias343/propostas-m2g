import { Check, Film, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoVisivel } from "./video-visivel";

/**
 * Primitivas compartilhadas das páginas de proposta comercial (`/proposta/*`).
 *
 * A ideia é que uma proposta nova seja só uma pasta nova em `app/proposta/`
 * compondo esses blocos com a copy do cliente. Nada aqui é específico de um
 * cliente.
 *
 * ⚠️ MediaSlot é placeholder: renderiza a moldura tracejada enquanto não tem
 * `src`. Quando o vídeo/GIF existir, passa `src` e ele vira mídia de verdade.
 * Buscar por `data-media-slot` pra listar o que ainda falta.
 */

/* ───────────────────────────── Layout base ───────────────────────────── */

export function Section({
  id,
  children,
  className,
  tone = "default",
  width = "text",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** `raised` puxa um fundo levemente mais claro pra quebrar o ritmo. */
  tone?: "default" | "raised";
  /**
   * `text` mantém a medida boa de leitura. `wide` abre no desktop pras seções
   * que carregam vídeo: numa coluna estreita a animação fica ilegível.
   */
  width?: "text" | "wide";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-border",
        tone === "raised" && "bg-bg-elevated",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto px-5 py-16 md:px-8 md:py-24",
          width === "wide" ? "max-w-7xl" : "max-w-5xl",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-accent">
      <span className="inline-block size-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export function Headline({
  children,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-display tracking-tight leading-[1.1]",
        Tag === "h1"
          ? "text-4xl md:text-6xl lg:text-7xl"
          : "text-3xl md:text-5xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Parágrafo padrão do corpo da proposta. */
export function Lead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-base md:text-lg leading-relaxed text-text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ───────────────────────────── Media slot ───────────────────────────── */

const ASPECTS = {
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
} as const;

export type MediaAspect = keyof typeof ASPECTS;

/**
 * Espaço reservado pra vídeo/GIF de demonstração.
 * Sem `src` mostra a moldura tracejada com o roteiro do que gravar.
 */
export function MediaSlot({
  id,
  aspect = "16:9",
  brief,
  src,
  poster,
  className,
}: {
  /** Código do slot (A1, B7, C3...) pra casar com o markdown da copy. */
  id: string;
  aspect?: MediaAspect;
  /** O que esse vídeo precisa mostrar. Vira legenda do placeholder. */
  brief: string;
  /** Quando existir o arquivo, passa o caminho e o slot vira vídeo. */
  src?: string;
  poster?: string;
  className?: string;
}) {
  if (src) {
    return (
      <figure
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border-strong bg-black",
          ASPECTS[aspect],
          className,
        )}
      >
        <VideoVisivel src={src} poster={poster} />
      </figure>
    );
  }

  return (
    <div
      data-media-slot={id}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl p-6 text-center",
        "border-2 border-dashed border-border-strong",
        "bg-[repeating-linear-gradient(45deg,rgba(30,26,84,0.04),rgba(30,26,84,0.04)_12px,transparent_12px,transparent_24px)]",
        ASPECTS[aspect],
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full border border-border-strong bg-bg-card">
        <Film className="size-4 text-text-subtle" strokeWidth={1.5} />
      </span>
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
          Vídeo {id}
        </p>
        <p className="mx-auto max-w-[320px] text-xs leading-snug text-text-muted">
          {brief}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────── Cards & listas ───────────────────────────── */

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5">
      <p className="font-display text-3xl leading-none tracking-tight text-accent md:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-snug text-text-muted">{label}</p>
    </div>
  );
}

export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-bg-card p-6",
        className,
      )}
    >
      {title && (
        <h3 className="mb-2 font-display text-xl leading-tight tracking-tight">
          {title}
        </h3>
      )}
      <div className="space-y-3 text-sm leading-relaxed text-text-muted">
        {children}
      </div>
    </div>
  );
}

/** Aviso destacado dentro de um bloco (compromissos, ressalvas honestas). */
export function Callout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-accent bg-accent-soft p-4">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-text">{children}</p>
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
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

/* ───────────────────────────── Entregáveis ───────────────────────────── */

export interface Deliverable {
  n: string;
  title: string;
  tagline: string;
  /** Parágrafos de contexto do bloco. */
  body: string[];
  items: string[];
  /**
   * Conteúdo livre do bloco, renderizado em largura total entre o texto e o
   * vídeo. Para o que não cabe em bullet: um passo a passo, uma grade de
   * papéis, uma tabela. Quem monta é a página do cliente, a primitiva só
   * reserva o espaço.
   */
  extra?: React.ReactNode;
  /** Bloco extra opcional (ex.: "Por que isso importa"). */
  note?: { label: string; text: string };
  callout?: { label: string; text: string };
  bonus?: boolean;
  /**
   * Opcional. Sem media, o bloco simplesmente nao reserva espaco de video —
   * um modulo pode ser so texto. Com media e sem `src`, continua aparecendo a
   * moldura tracejada de "falta gravar" (o comportamento antigo).
   */
  media?: {
    id: string;
    aspect: MediaAspect;
    brief: string;
    src?: string;
    poster?: string;
    /**
     * Mockup animado no lugar do vídeo. Quando presente, substitui o
     * MediaSlot: a demonstração é renderizada em CSS em vez de arquivo .mp4.
     */
    node?: React.ReactNode;
  };
}

export function DeliverableBlock({ block }: { block: Deliverable }) {
  /**
   * Duas montagens, decididas pela orientação do vídeo:
   *
   * 16:9 — texto e checklist dividem a linha de cima, vídeo full width embaixo.
   *        É o que dá mais largura pra uma composição 1920x1080.
   * 9:16 — texto e checklist empilhados à esquerda, vídeo à direita na mesma
   *        linha. Um vertical full width viraria uma coluna gigante de vazio
   *        dos dois lados.
   *
   * No mobile as duas caem pra uma coluna só, na mesma ordem.
   */
  const vertical = block.media?.aspect === "9:16";

  const cabecalho = (
    <>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm",
            block.bonus
              ? "bg-accent text-on-accent"
              : "border border-border-strong bg-bg-elevated text-text-subtle",
          )}
        >
          {block.n}
        </span>
        {block.bonus && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-accent bg-accent/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            <Sparkles className="size-3" strokeWidth={2} />
            Bônus incluso
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
          {block.title}
        </h3>
        <p className="text-sm font-medium text-accent">{block.tagline}</p>
      </div>

      {block.body.map((p) => (
        <p key={p} className="text-sm leading-relaxed text-text-muted">
          {p}
        </p>
      ))}

      {block.note && (
        <div className="border-l-2 border-border-strong pl-4">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
            {block.note.label}
          </p>
          <p className="text-sm leading-relaxed text-text-muted">
            {block.note.text}
          </p>
        </div>
      )}

      {block.callout && (
        <Callout label={block.callout.label}>{block.callout.text}</Callout>
      )}
    </>
  );

  const checklist = (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-text-subtle">
        O que entra
      </p>
      <CheckList items={block.items} />
    </div>
  );

  const video = !block.media ? null : block.media.node ? (
    <div className={vertical ? "mx-auto w-full max-w-[380px]" : undefined}>
      {block.media.node}
    </div>
  ) : (
    <MediaSlot
      id={block.media.id}
      aspect={block.media.aspect}
      brief={block.media.brief}
      src={block.media.src}
      poster={block.media.poster}
      className={vertical ? "mx-auto w-full max-w-[380px]" : undefined}
    />
  );

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-bg-card p-6 md:p-9",
        block.bonus
          ? "border-border-accent bg-gradient-to-b from-accent-soft to-bg-card"
          : "border-border",
      )}
    >
      {vertical ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">
          <div className="space-y-5">
            {cabecalho}
            {checklist}
            {block.extra}
          </div>
          {video}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
            <div className="space-y-5">{cabecalho}</div>
            {checklist}
          </div>
          {block.extra}
          {video}
        </div>
      )}
    </article>
  );
}

/* ───────────────────────────── FAQ ───────────────────────────── */

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-bg-card">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium transition-colors hover:bg-bg-card-hover md:text-base">
            <span className="leading-snug">{item.q}</span>
            <span className="relative size-4 shrink-0 text-accent">
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform group-open:scale-y-0" />
            </span>
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

/* ───────────────────────────── Prova em vídeo ───────────────────────────── */

export interface Proof {
  id: string;
  aspect: MediaAspect;
  brief: string;
  /** O que a peça é. Sem isso o vídeo vira enfeite. */
  titulo: string;
  /** Uma linha dizendo o que está acontecendo na tela. */
  desc: string;
  src?: string;
  poster?: string;
}

/**
 * Vídeo de exemplo com legenda. As legendas existem porque uma animação sem
 * rótulo não se explica: o leitor precisa saber o que está vendo antes de
 * começar a olhar.
 */
export function ProofCard({ proof }: { proof: Proof }) {
  return (
    <figure className="space-y-3">
      <MediaSlot
        id={proof.id}
        aspect={proof.aspect}
        brief={proof.brief}
        src={proof.src}
        poster={proof.poster}
      />
      <figcaption className="space-y-1 px-0.5">
        <p className="text-sm font-medium text-accent">{proof.titulo}</p>
        <p className="text-xs leading-relaxed text-text-muted">{proof.desc}</p>
      </figcaption>
    </figure>
  );
}
