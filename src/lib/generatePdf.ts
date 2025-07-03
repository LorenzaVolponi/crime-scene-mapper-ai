import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CrimeSceneData } from "@/pages/Index";

export async function generatePdf(scene: CrimeSceneData, element: HTMLElement) {
  const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  pdf.setFontSize(18);
  pdf.text(
    "Reconstituição Forense Automatizada",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 24;
  pdf.setFontSize(14);
  pdf.text(scene.titulo || "Relatório de Cena", pageWidth / 2, y, {
    align: "center",
  });
  y += 20;
  pdf.setFontSize(12);
  pdf.text("Gerado por IA – Sistema Aussy Scene", pageWidth / 2, y, {
    align: "center",
  });
  y += 32;

  pdf.setFontSize(12);
  pdf.text("Narrativa Forense:", margin, y);
  y += 16;
  const narrativeLines = pdf.splitTextToSize(
    scene.narrativa,
    pageWidth - margin * 2
  );
  pdf.text(narrativeLines, margin, y);
  y += narrativeLines.length * 14 + 20;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
  y += imgHeight + 20;

  pdf.text("Elementos:", margin, y);
  y += 16;
  scene.elementos.forEach((el) => {
    const pos = `(${Math.round(el.posicao[0])}, ${Math.round(el.posicao[1])})`;
    pdf.circle(margin + 2, y - 4, 2, "F");
    pdf.text(`${el.nome} - ${el.tipo} ${pos}`, margin + 8, y);
    y += 14;
  });

  if (scene.conexoes.length > 0) {
    y += 10;
    pdf.text("Conexões:", margin, y);
    y += 16;
    scene.conexoes.forEach((c) => {
      const line = `${c.de} → ${c.para}: ${c.descricao}`;
      const lines = pdf.splitTextToSize(line, pageWidth - margin * 2 - 10);
      lines.forEach((l) => {
        pdf.text(`• ${l}`, margin + 4, y);
        y += 14;
      });
    });
  }

  pdf.save("analise-forense.pdf");
}
