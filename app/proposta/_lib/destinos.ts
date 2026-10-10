/**
 * Destinos que o link da proposta pode pedir por query string.
 *
 * Serve pra mandar o cliente direto pro ponto certo do documento sem ele
 * precisar rolar 30 mil pixels. O caso real é o link de pagamento:
 * `/proposta/cliente-exemplo?ir=pagamento` abre já na seção de investimento.
 *
 * É lista fechada de propósito. O valor atravessa o formulário da senha e
 * volta num redirect, então nada que venha da URL pode virar destino livre.
 */

const DESTINOS = {
  pagamento: "investimento",
} as const;

export type Destino = keyof typeof DESTINOS;

/** O `?ir=` da URL é um destino conhecido? Se não for, vira `undefined`. */
export function destinoValido(bruto: string | undefined): Destino | undefined {
  if (!bruto) return undefined;
  return bruto in DESTINOS ? (bruto as Destino) : undefined;
}

/** Id da seção pra onde rolar. */
export function ancoraDoDestino(destino: Destino): string {
  return DESTINOS[destino];
}

/** Query string pronta pra colar num redirect, incluindo o `?`. */
export function queryDoDestino(destino: Destino | undefined, extra?: string): string {
  const partes = [destino && `ir=${destino}`, extra].filter(Boolean);
  return partes.length ? `?${partes.join("&")}` : "";
}
