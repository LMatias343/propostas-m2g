/**
 * Núcleo comercial de cada proposta, em um lugar só.
 *
 * Existe porque o registro de aceite não pode confiar no que o navegador
 * manda. Quando o cliente aceita, o servidor grava os valores DAQUI, não os
 * que vieram no corpo do POST. E como a página monta o termo a partir do mesmo
 * objeto, o que ele leu na tela é o que ficou gravado.
 *
 * Mudou preço, prazo ou destinatário: muda aqui e sobe a `termoVersao`. As
 * linhas já gravadas continuam com as condições da época, que é o ponto.
 *
 * ⚠️ Aqui vão valores e prazos, que é informação da PROPOSTA. A senha de
 * acesso NÃO entra aqui: ela é o WhatsApp do cliente, dado pessoal dele, e
 * vive em variável de ambiente (veja `gate.ts`).
 */

/**
 * Condições comerciais de um caminho de compra.
 *
 * `mensal` e `prazo` são opcionais porque nem toda proposta tem sustentação
 * recorrente ou cronograma acordado, e gravar "" nessas colunas seria pior
 * que deixá-las nulas.
 */
export interface CondicoesComerciais {
  implantacao: string;
  parcelado: string;
  mensal?: string;
  prazo?: string;
}

export interface PropostaComercial extends CondicoesComerciais {
  /** Como o cliente aparece no termo e no registro de aceite. */
  destinatario: string;
  /** Data de emissão, por extenso, pro cabeçalho do termo. */
  emitidoEm: string;
  /** Versão do termo em ISO. Sobe a cada mudança de condição comercial. */
  termoVersao: string;
  /**
   * Quando a mesma proposta oferece mais de um caminho de compra, com valores
   * diferentes. O cliente manda qual escolheu, mas os valores gravados saem
   * daqui: o navegador escolhe a porta, nunca o preço.
   *
   * Proposta de valor único não declara nada disso e segue como está abaixo.
   */
  opcoes?: Record<string, CondicoesComerciais>;
}

export const PROPOSTAS: Record<string, PropostaComercial> = {
  /**
   * Proposta de exemplo, com cliente fictício. Serve de molde: duplique a
   * pasta `app/proposta/cliente-exemplo/`, troque o slug aqui e escreva a sua.
   */
  "cliente-exemplo": {
    destinatario: "Marina Alves · Studio Alva",
    emitidoEm: "12 de março de 2026",
    termoVersao: "2026-03-12",
    implantacao: "R$ 9.800,00",
    parcelado: "ou até 12x R$ 975,80 no cartão",
    mensal: "R$ 1.900 / mês",
    prazo: "3 semanas",
  },
};

export function propostaComercial(slug: string): PropostaComercial | undefined {
  return PROPOSTAS[slug];
}

/**
 * Condições que devem ser gravadas no aceite.
 *
 * Numa proposta de opção única, são as da própria proposta. Numa de várias, é
 * a opção escolhida, e uma opção desconhecida devolve `undefined` em vez de
 * cair no valor de outra, porque gravar preço errado é pior que não gravar.
 */
export function condicoesDoAceite(
  proposta: PropostaComercial,
  opcao?: string,
): CondicoesComerciais | undefined {
  if (!proposta.opcoes) return proposta as CondicoesComerciais;
  return opcao ? proposta.opcoes[opcao] : undefined;
}
