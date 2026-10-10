import Link from "next/link";
import { Logo } from "@/app/components/ui/logo";
import { PROPOSTAS } from "@/app/proposta/_lib/propostas";

/**
 * Índice interno das propostas. Serve pra você achar as suas em
 * desenvolvimento; o cliente nunca chega aqui, ele recebe o link direto.
 *
 * A página não mostra valor nem nome de cliente de propósito: se um dia o
 * domínio vazar, o que aparece aqui é uma lista de slugs, e cada um deles
 * ainda pede senha.
 */
export default function Home() {
  const slugs = Object.keys(PROPOSTAS);

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-3xl border border-border-strong bg-bg-card p-7">
          <h1 className="font-display text-2xl tracking-tight">Propostas</h1>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {slugs.length === 1
              ? "Uma proposta cadastrada."
              : `${slugs.length} propostas cadastradas.`}{" "}
            Cada uma abre com o WhatsApp de quem recebeu o link.
          </p>

          <ul className="mt-6 space-y-2">
            {slugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/proposta/${slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm transition-colors hover:border-border-accent hover:text-accent"
                >
                  <span className="font-mono">/proposta/{slug}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-xs leading-relaxed text-text-faint">
          Proposta nova: duplique <code className="font-mono">app/proposta/cliente-exemplo</code> e
          leia o README.
        </p>
      </div>
    </main>
  );
}
