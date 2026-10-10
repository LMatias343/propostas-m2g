"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Vídeo de mockup que só roda enquanto está na tela.
 *
 * Por que existe: com `autoPlay` puro, o navegador tenta carregar e decodificar
 * TODOS os vídeos da página ao mesmo tempo. Numa proposta com 8 a 12 mockups em
 * 1080p, isso trava a aba — nenhum vídeo chega a carregar (`readyState 0`) e o
 * renderer engasga. Foi o que aconteceu na proposta do Lucas com 8 vídeos.
 *
 * A correção é simples: um IntersectionObserver dá play quando o vídeo entra na
 * tela e pause quando sai. Só o que está sendo visto consome decoder, e o resto
 * da página nem baixa o arquivo (`preload="none"`).
 *
 * O poster continua aparecendo antes do primeiro play, então nunca há buraco
 * preto — o que o leitor vê é sempre o primeiro quadro.
 */
export function VideoVisivel({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sem suporte a IntersectionObserver, cai no comportamento antigo.
    if (typeof IntersectionObserver === "undefined") {
      void el.play().catch(() => {});
      return;
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          // play() rejeita se a aba estiver oculta ou o autoplay for bloqueado.
          // Silenciar é correto aqui: o poster segue à mostra.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      // 25% visível já conta: o vídeo começa antes de estar todo na tela.
      { threshold: 0.25 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // No celular os vídeos 16:9 ficam pequenos demais pra ler o texto de dentro.
  // Um toque amplia: player nativo no iOS (que não tem requestFullscreen em
  // <video>) e fullscreen padrão no resto.
  const alternarTelaCheia = () => {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    const ios = el as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
    } else {
      ios.webkitEnterFullscreen?.();
    }
  };

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      onClick={alternarTelaCheia}
      title="Toque para ver em tela cheia"
      className={cn("size-full cursor-zoom-in object-contain", className)}
    />
  );
}
