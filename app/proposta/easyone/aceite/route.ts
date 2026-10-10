/**
 * POST /proposta/easyone/aceite
 *
 * Registra o aceite do termo antes do checkout. Fica aqui dentro, e não em
 * `/api`, porque o cookie da proposta só é enviado pra caminhos sob
 * `/proposta/easyone`. Proposta nova = pasta `aceite/` igual a esta.
 */
import { gravarAceite } from "@/app/proposta/_lib/aceite-servidor";

export const runtime = "nodejs";

export async function POST() {
  return gravarAceite("easyone");
}
