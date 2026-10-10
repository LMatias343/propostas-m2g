import type { jsPDF } from "jspdf";
import type { Termo } from "@/app/proposta/_components/aceite";

/**
 * Gera o contrato em PDF a partir do mesmo termo que o cliente acabou de ler
 * na tela.
 *
 * Existe porque aceitar num modal e sair pro checkout não deixa nada na mão de
 * ninguém. Aqui o cliente sai da proposta com o documento no computador dele,
 * com o aceite marcado, a data e a hora do registro. É a mesma fonte de dados
 * da página, então não tem como o PDF divergir do que foi aceito.
 *
 * A fonte é a Helvetica embutida do jsPDF, que codifica em WinAnsi. Isso cobre
 * o português inteiro mas não cobre símbolo fora do latin-1: por isso o check
 * do aceite é `[X]` e não `✓`. `sanear()` derruba o que sobrar, senão o glifo
 * ausente vira caractere errado no lugar de falhar visivelmente.
 */

/**
 * Sua marca no PDF. Troque pelos seus dados: é o que aparece no cabeçalho, no
 * rodapé e no nome do arquivo que o cliente baixa.
 */
const EMISSOR = {
  /** Aparece em caixa alta no topo da primeira página. */
  marca: "M2G CONSULTORIA",
  /** Linha do rodapé. Razão social, se tiver. */
  rodape: "M2G Consultoria · 62.705.065 Luciano Matias Drescher - ME · CNPJ 62.705.065/0001-90 · documento confidencial",
  /** Prefixo do arquivo baixado: contrato-{prefixo}-{slug}.pdf */
  prefixoArquivo: "m2g",
};

/** Margens e medidas da página A4, em milímetros. */
const PAG = { larg: 210, alt: 297, margem: 18 };
const UTIL = PAG.larg - PAG.margem * 2;

const COR = {
  tinta: [26, 26, 26] as const,
  corpo: [64, 64, 64] as const,
  suave: [122, 122, 122] as const,
  destaque: [127, 61, 190] as const,
  linha: [219, 219, 219] as const,
};

/** WinAnsi não tem tudo: troca o que o Helvetica do jsPDF não sabe desenhar. */
function sanear(texto: string): string {
  return texto
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[✓✔]/g, "-")
    .replace(/[^\x20-\xFF\n]/g, "");
}

/** Estado da escrita: onde o cursor está e em que página. */
interface Cursor {
  y: number;
}

export interface DadosAceite {
  /** Momento do aceite, já formatado para leitura humana. */
  aceitoEm: string;
  /** Endereço da página onde o aceite aconteceu. */
  origem: string;
}

export function gerarContratoPdf(
  jsPDFClass: typeof jsPDF,
  termo: Termo,
  dados: DadosAceite,
): void {
  const doc = new jsPDFClass({ unit: "mm", format: "a4" });
  const cur: Cursor = { y: PAG.margem };

  /** Quebra de página quando o próximo bloco não cabe no que sobrou. */
  const cabe = (altura: number) => {
    if (cur.y + altura <= PAG.alt - PAG.margem - 12) return;
    rodape(doc);
    doc.addPage();
    cur.y = PAG.margem;
  };

  const texto = (
    conteudo: string,
    {
      tam = 9.5,
      estilo = "normal",
      cor = COR.corpo,
      recuo = 0,
      espaco = 4.6,
      depois = 2,
    }: {
      tam?: number;
      estilo?: "normal" | "bold" | "italic";
      cor?: readonly [number, number, number];
      recuo?: number;
      espaco?: number;
      depois?: number;
    } = {},
  ) => {
    doc.setFont("helvetica", estilo);
    doc.setFontSize(tam);
    doc.setTextColor(cor[0], cor[1], cor[2]);
    const linhas: string[] = doc.splitTextToSize(sanear(conteudo), UTIL - recuo);
    for (const linha of linhas) {
      cabe(espaco);
      // o rodapé da página anterior mexeu na fonte: reaplica antes de escrever
      doc.setFont("helvetica", estilo);
      doc.setFontSize(tam);
      doc.setTextColor(cor[0], cor[1], cor[2]);
      doc.text(linha, PAG.margem + recuo, cur.y);
      cur.y += espaco;
    }
    cur.y += depois;
  };

  /** Item de lista com marcador próprio, alinhado na segunda linha. */
  const item = (conteudo: string, marcador = "-") => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(COR.corpo[0], COR.corpo[1], COR.corpo[2]);
    const recuo = 5.5;
    const linhas: string[] = doc.splitTextToSize(sanear(conteudo), UTIL - recuo);
    linhas.forEach((linha, i) => {
      cabe(4.6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      if (i === 0) {
        doc.setTextColor(COR.destaque[0], COR.destaque[1], COR.destaque[2]);
        doc.text(marcador, PAG.margem, cur.y);
      }
      doc.setTextColor(COR.corpo[0], COR.corpo[1], COR.corpo[2]);
      doc.text(linha, PAG.margem + recuo, cur.y);
      cur.y += 4.6;
    });
    cur.y += 1;
  };

  let seq = 0;
  const artigo = (titulo: string) => {
    const n = String(++seq).padStart(2, "0");
    cabe(16);
    cur.y += 3;
    doc.setDrawColor(COR.linha[0], COR.linha[1], COR.linha[2]);
    doc.setLineWidth(0.2);
    doc.line(PAG.margem, cur.y, PAG.larg - PAG.margem, cur.y);
    cur.y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(COR.destaque[0], COR.destaque[1], COR.destaque[2]);
    doc.text(n, PAG.margem, cur.y);
    doc.setTextColor(COR.tinta[0], COR.tinta[1], COR.tinta[2]);
    doc.text(sanear(titulo), PAG.margem + 8, cur.y);
    cur.y += 6;
  };

  /* ─── Cabeçalho ─── */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COR.destaque[0], COR.destaque[1], COR.destaque[2]);
  doc.text(EMISSOR.marca, PAG.margem, cur.y);
  cur.y += 9;

  texto("Termo de aceite da proposta comercial", {
    tam: 17,
    estilo: "bold",
    cor: COR.tinta,
    espaco: 7,
    depois: 1,
  });
  texto(
    `${termo.contratada} e ${termo.contratante} · proposta emitida em ${termo.emitidoEm}`,
    { tam: 9, cor: COR.suave, depois: 4 },
  );

  const temCronograma = Boolean(termo.prazoTotal || termo.fases?.length);
  texto(
    `Este documento resume o que foi combinado na reunião de alinhamento. Ao aceitar, o contratante confirma que leu e concorda com o escopo${
      temCronograma ? ", o prazo" : ""
    } e o investimento descritos abaixo. O contrato formal, com estas mesmas condições, é assinado na sequência.`,
    { tam: 9, cor: COR.suave, depois: 3 },
  );

  /* ─── Artigos ─── */

  artigo("Partes e objeto");
  texto(`Contratante: ${termo.contratante}`, { estilo: "bold", cor: COR.tinta, depois: 0 });
  texto(`Contratada: ${termo.contratada}`, { estilo: "bold", cor: COR.tinta, depois: 2 });
  texto(termo.objeto);

  artigo("Escopo da entrega");
  texto(
    termo.rotuloBlocos ??
      `A implantação contempla os ${termo.blocos.length} blocos abaixo, detalhados na proposta:`,
  );
  for (const b of termo.blocos) {
    const rotulo = `${b.n}. ${b.title}${b.bonus ? " (bônus, sem custo adicional)" : ""}`;
    texto(rotulo, { estilo: "bold", cor: COR.tinta, recuo: 0, depois: 0, tam: 9.5 });
    if (b.tagline) texto(b.tagline, { tam: 9, cor: COR.suave, recuo: 0, depois: 2.5 });
  }

  if (temCronograma) {
    artigo("Prazo e cronograma");
    if (termo.prazoTotal) texto(termo.prazoTotal);
    for (const f of termo.fases ?? []) {
      texto(`${f.n} · ${f.title}`, {
        estilo: "bold",
        cor: COR.tinta,
        depois: 0,
        tam: 9.5,
      });
      texto(`Entrega ao fim: ${f.entrega}`, { tam: 9, cor: COR.suave, depois: 2.5 });
    }
  }

  artigo("Investimento e forma de pagamento");
  texto(`Valor total: ${termo.investimento.implantacao}`, {
    tam: 12,
    estilo: "bold",
    cor: COR.tinta,
    espaco: 6,
    depois: 1,
  });
  texto(termo.investimento.parcelado, { tam: 9, cor: COR.suave, depois: 2 });
  if (termo.investimento.mensal) {
    texto(`Sustentação mensal: ${termo.investimento.mensal}`, {
      estilo: "bold",
      cor: COR.tinta,
      depois: 0,
    });
    if (termo.investimento.inicioMensal) {
      texto(termo.investimento.inicioMensal, { tam: 9, cor: COR.suave, depois: 2 });
    }
  }
  texto(termo.investimento.condicoes);
  for (const p of termo.investimento.parcelas ?? []) {
    texto(`${p.label}: ${p.valor}`, {
      estilo: "bold",
      cor: COR.tinta,
      depois: 0,
      tam: 10,
    });
    texto(`Vencimento em ${p.quando} · ${p.parcelado}`, {
      tam: 9,
      cor: COR.suave,
      depois: 2.5,
    });
  }

  artigo("O que está incluso");
  for (const i of termo.incluso) item(i);

  artigo("O que não está incluso");
  for (const i of termo.naoIncluso) item(i);

  artigo("O que precisamos do contratante");
  texto(
    termo.fases?.length
      ? "O cronograma acima depende destas contrapartidas. É o que segura o prazo de entrega:"
      : "A entrega depende destas contrapartidas. É o que segura o prazo:",
  );
  for (const c of termo.contrapartidas) item(`${c.o} (${c.quando})`);

  if (termo.garantias?.length) {
    artigo("Garantias");
    for (const g of termo.garantias) {
      texto(g.title, { estilo: "bold", cor: COR.tinta, depois: 0 });
      texto(g.text, { tam: 9, cor: COR.suave, depois: 2.5 });
    }
  }

  artigo("Observações");
  for (const r of termo.ressalvas) item(r);

  /* ─── Aceite ─── */

  artigo("Aceite");
  cabe(30);
  const topo = cur.y - 3;
  doc.setDrawColor(COR.destaque[0], COR.destaque[1], COR.destaque[2]);
  doc.setLineWidth(0.4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COR.destaque[0], COR.destaque[1], COR.destaque[2]);
  doc.text("[X]", PAG.margem + 3, cur.y + 4);
  doc.setTextColor(COR.tinta[0], COR.tinta[1], COR.tinta[2]);
  const marcado: string[] = doc.splitTextToSize(
    sanear(
      `Li o termo acima e concordo com o escopo,${
        temCronograma ? " o prazo," : ""
      } as contrapartidas e o investimento descritos.`,
    ),
    UTIL - 18,
  );
  let ya = cur.y + 4;
  for (const linha of marcado) {
    doc.text(linha, PAG.margem + 13, ya);
    ya += 4.8;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(COR.suave[0], COR.suave[1], COR.suave[2]);
  doc.text(sanear(`Aceito por: ${termo.contratante}`), PAG.margem + 13, ya + 1.5);
  doc.text(sanear(`Data e hora do aceite: ${dados.aceitoEm}`), PAG.margem + 13, ya + 6);
  doc.text(sanear(`Registrado em: ${dados.origem}`), PAG.margem + 13, ya + 10.5);

  doc.roundedRect(PAG.margem, topo, UTIL, ya + 14 - topo, 2, 2, "S");
  cur.y = ya + 20;

  texto(
    "O aceite foi registrado eletronicamente no momento indicado acima, com data, hora e endereço de origem. Este documento é a cópia do termo aceito e vale como prova do que foi combinado até a assinatura do contrato formal.",
    { tam: 8.5, cor: COR.suave },
  );

  rodape(doc);

  doc.save(nomeArquivo(termo.slug));
}

/** Rodapé com paginação, aplicado ao fechar cada página. */
function rodape(doc: jsPDF): void {
  const pagina = doc.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(COR.suave[0], COR.suave[1], COR.suave[2]);
  doc.text(
    EMISSOR.rodape,
    PAG.margem,
    PAG.alt - 10,
  );
  doc.text(String(pagina), PAG.larg - PAG.margem, PAG.alt - 10, { align: "right" });
}

function nomeArquivo(slug: string): string {
  return `contrato-${EMISSOR.prefixoArquivo}-${slug}.pdf`;
}
