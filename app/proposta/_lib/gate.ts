import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { normalizarWhats } from "./whats";

/**
 * Trava de acesso das páginas de proposta.
 *
 * A senha é o WhatsApp de quem recebeu o link. Ele vai digitar do jeito que
 * estiver acostumado, então normalizamos os dois lados antes de comparar: some
 * tudo que não é dígito, some o zero de interurbano e some o +55.
 *
 * A verificação é server-side. Sem o cookie válido a página nem monta a
 * proposta, então o conteúdo não vai no HTML nem no bundle.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * As senhas vivem em variáveis de ambiente, NUNCA no código.
 *
 * O número de WhatsApp de um cliente é dado pessoal dele. Se ficasse escrito
 * aqui, entraria no git e vazaria junto com o repositório. Cada proposta lê a
 * sua:
 *
 *   slug `cliente-exemplo`  →  PROPOSTA_SENHA_CLIENTE_EXEMPLO=11912345678
 *   slug `maria-souza`      →  PROPOSTA_SENHA_MARIA_SOUZA=11987654321
 *
 * Local, isso vai no `.env.local`. Publicado, vai em Settings → Environment
 * Variables no painel da Vercel.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** slug da rota → nome da variável de ambiente que guarda a senha. */
export function nomeDaVariavel(slug: string): string {
  return `PROPOSTA_SENHA_${slug.replace(/[^a-z0-9]/gi, "_").toUpperCase()}`;
}

function senhaDoSlug(slug: string): string | undefined {
  const bruta = process.env[nomeDaVariavel(slug)];
  const limpa = normalizarWhats(bruta ?? "");
  return limpa.length > 0 ? limpa : undefined;
}

export { normalizarWhats };

/** Esta proposta tem senha configurada? */
export function temSenha(slug: string): boolean {
  return senhaDoSlug(slug) !== undefined;
}

export function nomeCookie(slug: string): string {
  return `proposta_${slug.replace(/[^a-z0-9]/gi, "_")}`;
}

/** O cookie guarda um hash, não o número em si. */
function token(slug: string): string {
  const senha = senhaDoSlug(slug) ?? "";
  return createHash("sha256").update(`proposta:${slug}:${senha}`).digest("hex");
}

function iguais(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** A senha digitada abre esta proposta? */
export function senhaConfere(slug: string, digitado: string): boolean {
  const esperado = senhaDoSlug(slug);
  if (!esperado) return false;
  return iguais(normalizarWhats(digitado), esperado);
}

/** O cookie que veio no request é válido pra esta proposta? */
export function cookieConfere(slug: string, valor: string | undefined): boolean {
  if (!valor || !temSenha(slug)) return false;
  return iguais(valor, token(slug));
}

export function valorCookie(slug: string): string {
  return token(slug);
}
