/**
 * Estimativa de tempo de leitura das propostas, a partir dos caracteres.
 *
 * O selo aparece na tela da senha (`PropostaGate`), antes de a pessoa abrir,
 * pra ela saber o tamanho do compromisso. Antes desta função o número era
 * cravado na mão em cada proposta, e por isso não batia com o conteúdo: uma
 * proposta com 8x mais texto que a outra anunciava tempo menor. Derivar do
 * conteúdo resolve isso e não deixa o número envelhecer quando o texto muda.
 *
 * Conta caracteres, não palavras, porque é o que sobrevive a texto com número,
 * valor e sigla — que é metade de uma proposta comercial.
 */

/**
 * Leitura atenta de documento comercial em português.
 *
 * Vem de 200 palavras por minuto, que é a régua usual pra leitura cuidadosa,
 * vezes as ~6 letras por palavra (com o espaço) que o português dá na média.
 * Proposta se lê parando em preço e escopo, então não cabe régua de notícia.
 */
export const CARACTERES_POR_MINUTO = 1200;

/**
 * Soma os caracteres de todo texto encontrado, em qualquer nível.
 *
 * Aceita `unknown` de propósito: o que se passa aqui são as próprias constantes
 * da proposta, que têm formatos diferentes (lista de strings, objeto de FAQ,
 * tupla da tabela comparativa, item de bônus com flag). Descrever esse conjunto
 * num tipo só obrigaria cada constante a se moldar ao contador, quando é o
 * contador que existe pra servir a elas. O que não é texto é ignorado.
 */
export function contarCaracteres(...partes: unknown[]): number {
  let total = 0;

  const visitar = (v: unknown) => {
    if (typeof v === "string") total += v.length;
    else if (Array.isArray(v)) v.forEach(visitar);
    else if (v && typeof v === "object") Object.values(v).forEach(visitar);
  };

  partes.forEach(visitar);
  return total;
}

/**
 * Minutos de leitura do conteúdo passado, arredondado pra cima e nunca zero.
 *
 * Arredonda pra cima de propósito: prometer menos tempo do que a leitura leva
 * é o único erro que irrita quem recebe.
 */
export function minutosDeLeitura(...partes: unknown[]): number {
  const chars = contarCaracteres(...partes);
  return Math.max(1, Math.ceil(chars / CARACTERES_POR_MINUTO));
}
