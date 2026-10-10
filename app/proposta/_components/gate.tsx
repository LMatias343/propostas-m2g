import { ArrowRight, Clock, Lock } from "lucide-react";
import { Logo } from "@/app/components/ui/logo";
import { entrarNaProposta } from "@/app/proposta/_lib/actions";

/**
 * Tela de entrada das propostas.
 *
 * A senha é o WhatsApp de quem recebeu, então não tem nada pra memorizar nem
 * pra gerenciar. Todo o resto da página só existe depois que o servidor
 * confere o cookie.
 */
export function PropostaGate({
  slug,
  destinatario,
  leituraMin,
  erro,
  ir,
}: {
  slug: string;
  /** Primeiro nome de quem recebe, só pra tela não ficar anônima. */
  destinatario: string;
  /**
   * Tempo estimado de leitura, em minutos. Aparece antes da senha pra pessoa
   * saber o tamanho do compromisso antes de abrir, e não descobrir no meio.
   */
  leituraMin?: number;
  erro?: boolean;
  /** Destino pedido na URL, repassado pro redirect depois da senha. */
  ir?: string;
}) {
  const entrar = entrarNaProposta.bind(null, slug);

  return (
    <main className="mesh-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-3xl border border-border-strong bg-bg-card p-7 md:p-9">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl border border-border-accent bg-accent/15 text-accent">
              <Lock className="size-5" strokeWidth={1.75} />
            </span>

            {leituraMin && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-bg-input px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-text-muted">
                <Clock className="size-3.5" strokeWidth={1.75} />
                {leituraMin} min de leitura
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl leading-tight tracking-tight">
            Proposta de {destinatario}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Este documento é confidencial. Para abrir, digite o número de WhatsApp
            que recebeu o link.
          </p>

          <form action={entrar} className="mt-7 space-y-3">
            {ir && <input type="hidden" name="ir" value={ir} />}
            <label htmlFor="senha" className="sr-only">
              Número de WhatsApp
            </label>
            <input
              id="senha"
              name="senha"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              autoFocus
              required
              // exemplo genérico de propósito: o placeholder não pode entregar
              // o número que abre a proposta
              placeholder="(11) 91234-5678"
              aria-invalid={erro || undefined}
              className="w-full rounded-xl border border-border-strong bg-bg-input px-4 py-3.5 text-base text-text placeholder:text-text-faint focus:border-border-accent"
            />

            {erro && (
              <p className="text-sm leading-snug text-danger">
                Esse número não abre esta proposta. Confira e tenta de novo.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              Abrir proposta
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-text-subtle">
            Pode digitar com DDD, com +55, com traço ou sem nada disso.
          </p>
        </div>
      </div>
    </main>
  );
}
