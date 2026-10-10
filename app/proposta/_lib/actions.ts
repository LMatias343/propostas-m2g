"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { destinoValido, queryDoDestino } from "./destinos";
import { nomeCookie, senhaConfere, valorCookie } from "./gate";

/**
 * Recebe o WhatsApp digitado, confere e libera a proposta.
 *
 * Errou, volta com `?erro=1`. Acertou, grava o cookie httpOnly no escopo
 * daquela proposta e redireciona limpo. Sem JS de cliente envolvido.
 *
 * O `ir` atravessa o formulário porque hash não sobrevive a redirect de
 * servidor: sem isso, quem abre o link de pagamento cairia no topo da proposta
 * depois de digitar a senha.
 */
export async function entrarNaProposta(slug: string, formData: FormData) {
  const digitado = String(formData.get("senha") ?? "");
  const destino = destinoValido(String(formData.get("ir") ?? "") || undefined);

  if (!senhaConfere(slug, digitado)) {
    redirect(`/proposta/${slug}${queryDoDestino(destino, "erro=1")}`);
  }

  const jar = await cookies();
  jar.set(nomeCookie(slug), valorCookie(slug), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/proposta/${slug}`,
    maxAge: 60 * 60 * 24 * 60, // 60 dias
  });

  redirect(`/proposta/${slug}${queryDoDestino(destino)}`);
}
