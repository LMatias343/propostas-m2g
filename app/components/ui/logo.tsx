import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Marca no cabeçalho, no rodapé e na tela de senha da proposta.
 *
 * O arquivo é o logo da M2G Consultoria, o mesmo dos modelos de proposta em
 * PowerPoint. Ele já traz o nome escrito, então não há texto ao lado.
 */
const MARCA = "M2G Consultoria";

/** Proporção do arquivo public/m2g-logo.png (883 x 420). */
const LARGURA = 883;
const ALTURA = 420;

const ALTURAS = { sm: "h-8", md: "h-10", lg: "h-14" };

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  /** Mantido por compatibilidade com o molde; o logo já inclui o nome. */
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/m2g-logo.png"
      alt={MARCA}
      width={LARGURA}
      height={ALTURA}
      priority
      className={cn("w-auto", ALTURAS[size], className)}
    />
  );
}
