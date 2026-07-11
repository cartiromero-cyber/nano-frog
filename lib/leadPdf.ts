import type { Lead } from "@/types";

/**
 * Elytra Shield–branded lead PDF, generated natively (zero dependencies).
 * Builds a valid single-page PDF 1.4 by hand: brand header band, wordmark,
 * lead-capture fields, and the doctrine footer. Vector-only (rects + Helvetica),
 * so it renders identically everywhere and stays ~3 KB — safe to attach to the
 * instant lead-notification email.
 *
 * Colors match the design system: ink #0B1320, green #39B54A, muted #5C6F7E.
 */

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
// PDF text uses Latin-1; strip anything outside it so the file stays valid.
const safe = (s: unknown) => esc(String(s ?? "—").replace(/[^\x20-\xFF]/g, "")).slice(0, 90) || "—";

const INK = "0.043 0.075 0.125";   // #0B1320
const GREEN = "0.224 0.710 0.290"; // #39B54A
const MUTED = "0.361 0.435 0.494"; // #5C6F7E
const LINE = "0.886 0.922 0.945";  // #E2EBF1

export function buildLeadPdfBase64(lead: Lead): string {
  const d = lead.data as { name?: string; phone?: string; email?: string; address?: string; city?: string; message?: string };
  const when = new Date(lead.createdAt);
  const rows: [string, string][] = [
    ["Name", safe(d.name)],
    ["Phone", safe(d.phone)],
    ["Email", safe(d.email)],
    ["Property address", safe(d.address)],
    ["Received", safe(when.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }))],
    ["Lead type", safe(lead.type)],
    ["Lead ID", safe(lead.id)],
  ];

  // ── content stream ──────────────────────────────────────────────────────────
  let c = "";
  // header band (ink) + green accent rule
  c += `${INK} rg 0 712 612 80 re f\n`;
  c += `${GREEN} rg 0 708 612 4 re f\n`;
  // wordmark
  c += `BT /F1 21 Tf 1 1 1 rg 42 756 Td (ELYTRA SHIELD) Tj ET\n`;
  c += `BT /F2 8 Tf ${GREEN} rg 42 740 Td (R O O F   P R E S E R V A T I O N) Tj ET\n`;
  c += `BT /F2 9 Tf 0.75 0.85 0.78 rg 430 748 Td (elytrashield.us) Tj ET\n`;
  // title
  c += `BT /F1 15 Tf ${INK} rg 42 672 Td (New Roof Health Assessment Request) Tj ET\n`;
  c += `BT /F2 9.5 Tf ${MUTED} rg 42 656 Td (Booked at elytrashield.us/book · contact within one business day to confirm the window.) Tj ET\n`;
  // field rows
  let y = 615;
  for (const [label, value] of rows) {
    c += `${LINE} rg 42 ${y - 12} 528 0.8 re f\n`;
    c += `BT /F2 9 Tf ${MUTED} rg 42 ${y} Td (${label.toUpperCase()}) Tj ET\n`;
    c += `BT /F1 12 Tf ${INK} rg 190 ${y} Td (${value}) Tj ET\n`;
    y -= 34;
  }
  // next-steps box
  const by = y - 6;
  c += `${GREEN} RG 1.2 w 42 ${by - 58} 528 58 re S\n`;
  c += `BT /F1 10 Tf ${INK} rg 54 ${by - 20} Td (NEXT STEPS) Tj ET\n`;
  c += `BT /F2 9.5 Tf ${MUTED} rg 54 ${by - 34} Td (1. Call or text to confirm the assessment window.   2. Assign in the rep dashboard.) Tj ET\n`;
  c += `BT /F2 9.5 Tf ${MUTED} rg 54 ${by - 47} Td (3. Assessment -> Score -> written verdict: preserve, monitor, or replace.) Tj ET\n`;
  // doctrine footer
  c += `${LINE} rg 42 64 528 0.8 re f\n`;
  c += `BT /F2 8 Tf ${MUTED} rg 42 50 Td (No photo, no score  ·  Inspectors are never paid on treatment sales  ·  The homeowner receives the entire score.) Tj ET\n`;
  c += `BT /F2 8 Tf ${MUTED} rg 42 38 Td (Methodology published at elytrashield.us/how-we-score  ·  Elytra Shield · keep the roof you already paid for.) Tj ET\n`;

  // ── assemble the PDF with a correct xref table ──────────────────────────────
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${c.length} >>\nstream\n${c}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1").toString("base64");
}
