import type { Metadata } from "next";
import { Montserrat, Nunito } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Propostas · M2G Consultoria",
  description: "Documento confidencial.",
  // O site inteiro fica fora do índice: proposta comercial não é conteúdo
  // público, e você não quer o Google servindo a página de senha de um cliente.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${GeistMono.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
