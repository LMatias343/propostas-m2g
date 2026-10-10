/**
 * Normalização de número de WhatsApp, isolada de propósito: é função pura, sem
 * `server-only`, então dá pra testar direto e reaproveitar no cliente se um dia
 * a gente quiser mascarar o input.
 *
 *   +55 (47) 99256-3366 → 47992563366
 *   047 99256 3366      → 47992563366
 */
export function normalizarWhats(bruto: string): string {
  let d = (bruto ?? "").replace(/\D+/g, "");
  d = d.replace(/^0+/, ""); // zero de interurbano
  // 55 só é código de país quando sobra número demais: DDD 55 (Santa Maria) em
  // celular dá 11 dígitos e não pode ser cortado.
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  return d;
}
