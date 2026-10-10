import "server-only";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { avisar, origemDoRequest } from "./avisos";
import { cookieConfere, nomeCookie } from "./gate";
import { condicoesDoAceite, propostaComercial } from "./propostas";

/**
 * Grava o aceite do termo de uma proposta em `proposta_aceites`.
 *
 * O slug vem da própria rota, nunca do corpo do request: o endpoint mora em
 * `/proposta/<slug>/aceite` porque é o único caminho que o cookie da proposta
 * alcança (ele é emitido com `path: /proposta/<slug>`). Um endpoint em
 * `/api/...` não receberia o cookie e não teria como confirmar quem aceitou.
 *
 * Destinatário, versão do termo e valores saem do registro server-side, então
 * não existe caminho pro cliente gravar um aceite com condições diferentes das
 * que a página mostrou.
 */
export async function gravarAceite(
  slug: string,
  /** Qual caminho de compra foi aceito, nas propostas com mais de um. */
  opcao?: string,
): Promise<Response> {
  const proposta = propostaComercial(slug);
  if (!proposta) {
    return NextResponse.json({ error: "proposta desconhecida" }, { status: 404 });
  }

  // Só registra aceite de quem realmente abriu a proposta com a senha certa.
  const jar = await cookies();
  if (!cookieConfere(slug, jar.get(nomeCookie(slug))?.value)) {
    return NextResponse.json({ error: "sem acesso a esta proposta" }, { status: 403 });
  }

  const condicoes = condicoesDoAceite(proposta, opcao);
  if (!condicoes) {
    return NextResponse.json({ error: "opção de compra desconhecida" }, { status: 400 });
  }

  const h = await headers();

  const { error } = await createAdminClient()
    .from("proposta_aceites")
    .insert({
      slug,
      destinatario: proposta.destinatario,
      termo_versao: proposta.termoVersao,
      valor_implantacao: condicoes.implantacao,
      valor_mensal: condicoes.mensal ?? null,
      prazo: condicoes.prazo ?? null,
      ip: ipDoVisitante(h),
      user_agent: corta(h.get("user-agent"), 500),
      referer: corta(h.get("referer"), 500),
    });

  if (error) {
    console.error("[proposta/aceite] falha ao gravar", { slug, erro: error.message });
    return NextResponse.json({ error: "falha ao registrar" }, { status: 500 });
  }

  await avisar("aceite", slug, origemDoRequest(h));

  return NextResponse.json({ ok: true });
}

/** Primeiro salto do x-forwarded-for, que é o IP real do visitante. */
function ipDoVisitante(h: Headers): string | null {
  const encaminhado = h.get("x-forwarded-for");
  if (encaminhado) {
    const primeiro = encaminhado.split(",")[0]?.trim();
    if (primeiro) return primeiro.slice(0, 100);
  }
  const direto = h.get("cf-connecting-ip") ?? h.get("x-real-ip");
  return direto ? direto.trim().slice(0, 100) : null;
}

function corta(valor: string | null, max: number): string | null {
  return valor ? valor.slice(0, max) : null;
}
