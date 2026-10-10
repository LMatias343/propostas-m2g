import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { propostaComercial } from "./propostas";

/**
 * Avisos de abertura e de aceite das propostas.
 *
 * Duas coisas acontecem aqui, e nenhuma pode atrapalhar o cliente: se o banco
 * ou o webhook falharem, a proposta abre e o aceite segue do mesmo jeito.
 *
 * 1. A abertura é gravada em `proposta_aberturas` (o aceite já tem tabela
 *    própria, gravada em `aceite-servidor.ts`).
 * 2. Se `PROPOSTA_AVISO_WEBHOOK` estiver definida, o evento é enviado pra essa
 *    URL em JSON. É ela que transforma o registro em mensagem pra quem vendeu.
 */

type Evento = "abertura" | "aceite";

interface Origem {
  ip: string | null;
  userAgent: string | null;
}

const LIMITE_MS = 3000;

/** Chamado quando a senha confere. Nunca lança erro. */
export async function registrarAbertura(slug: string, origem: Origem): Promise<void> {
  const destinatario = propostaComercial(slug)?.destinatario ?? null;

  try {
    const { error } = await createAdminClient()
      .from("proposta_aberturas")
      .insert({
        slug,
        destinatario,
        ip: origem.ip,
        user_agent: origem.userAgent,
      });
    if (error) console.error("[proposta/abertura] falha ao gravar", { slug, erro: error.message });
  } catch (erro) {
    // Sem Supabase configurado a proposta abre igual, só não fica registrado.
    console.error("[proposta/abertura] registro indisponível", { slug, erro: String(erro) });
  }

  await avisar("abertura", slug, origem);
}

/** Manda o evento pro webhook de aviso, se houver. Nunca lança erro. */
export async function avisar(evento: Evento, slug: string, origem: Origem): Promise<void> {
  const url = process.env.PROPOSTA_AVISO_WEBHOOK;
  if (!url) return;

  const proposta = propostaComercial(slug);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        evento,
        slug,
        destinatario: proposta?.destinatario ?? null,
        valor: proposta?.implantacao ?? null,
        ip: origem.ip,
        userAgent: origem.userAgent,
        quando: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(LIMITE_MS),
    });
  } catch (erro) {
    console.error("[proposta/aviso] webhook não respondeu", { evento, slug, erro: String(erro) });
  }
}

/** Primeiro salto do x-forwarded-for, que é o IP real do visitante. */
export function origemDoRequest(h: Headers): Origem {
  const encaminhado = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = encaminhado || h.get("cf-connecting-ip") || h.get("x-real-ip") || null;
  const userAgent = h.get("user-agent");
  return {
    ip: ip ? ip.trim().slice(0, 100) : null,
    userAgent: userAgent ? userAgent.slice(0, 500) : null,
  };
}
