"use client";

import { useEffect } from "react";

/**
 * Abre a proposta já posicionada numa seção.
 *
 * Existe porque o link de pagamento precisa cair direto no investimento, e
 * âncora `#` não sobrevive ao redirect do servidor depois da senha. O salto é
 * instantâneo de propósito: com `scroll-behavior: smooth` no html, uma rolagem
 * animada a partir do topo de um documento de 30 mil pixels demoraria segundos.
 */
export function RolarPara({ alvo }: { alvo: string }) {
  useEffect(() => {
    const el = document.getElementById(alvo);
    if (!el) return;

    // duas passadas: a primeira posiciona, a segunda corrige o desvio que os
    // vídeos e imagens acima causam ao entrar no layout
    const ir = () => el.scrollIntoView({ block: "start", behavior: "instant" });
    ir();
    const id = requestAnimationFrame(ir);
    return () => cancelAnimationFrame(id);
  }, [alvo]);

  return null;
}
