import { clsx, type ClassValue } from "clsx";

/** Junta classes condicionais. Usado por todas as primitivas da proposta. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
