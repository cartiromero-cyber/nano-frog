import type { SalesSession } from "@/types/sales";
import { computeRoofHealthScore, scoreBand, SCORING_STANDARD_VERSION } from "./sales/scoring";
import { recommend, displayTier } from "./sales/recommendation";
import { LOGO_JPEG_BASE64, LOGO_JPEG_W, LOGO_JPEG_H } from "./logoJpeg";

/**
 * Homeowner-facing Roof Health Report™ as a native, zero-dependency PDF —
 * emailed from the presentation finale. Same construction technique as
 * lib/leadPdf.ts: brand header with the real logo, score + verdict, factor
 * bars (vector rects), findings, quoted investment, doctrine footer. ~8 KB.
 * (Photos are delivered on-device at the visit; the PDF is the summary of record.)
 */

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const safe = (s: unknown) => esc(String(s ?? "—").replace(/[^\x20-\xFF]/g, "")).slice(0, 90) || "—";

const INK = "0.043 0.075 0.125";
const GREEN = "0.224 0.710 0.290";
const MUTED = "0.361 0.435 0.494";
const LINE = "0.886 0.922 0.945";
const AMBER = "0.878 0.631 0.180";
const RED = "0.753 0.325 0.180";

export function buildReportPdfBase64(session: SalesSession): string {
  const score = computeRoofHealthScore(session.score);
  const band = scoreBand(score);
  const rec = recommend(session.score);
  const verdict = displayTier(rec.tier);
  const h = session.homeowner;
  const inv = session.investment;
  const notCandidate = rec.tier === "Not Recommended";
  const date = new Date().toLocaleDateString("en-US", { dateStyle: "long" });

  let c = "";
  // brand header band + logo + wordmark
  c += `${INK} rg 0 712 612 80 re f\n`;
  c += `${GREEN} rg 0 708 612 4 re f\n`;
  c += `q 52 0 0 52 42 726 cm /Im1 Do Q\n`;
  c += `BT /F1 21 Tf 1 1 1 rg 106 756 Td (ELYTRA SHIELD) Tj ET\n`;
  c += `BT /F2 8 Tf ${GREEN} rg 106 740 Td (R O O F   P R E S E R V A T I O N) Tj ET\n`;
  c += `BT /F2 9 Tf 0.75 0.85 0.78 rg 430 748 Td (elytrashield.us) Tj ET\n`;
  // title + meta
  c += `BT /F1 16 Tf ${INK} rg 42 674 Td (Roof Health Report) Tj ET\n`;
  c += `BT /F2 9 Tf ${MUTED} rg 42 658 Td (${safe(date)}${session.inspector ? `  ·  Assessed by ${safe(session.inspector)}` : ""}  ·  Standard v${SCORING_STANDARD_VERSION}) Tj ET\n`;
  c += `BT /F1 11 Tf ${INK} rg 380 674 Td (${safe(h.name)}) Tj ET\n`;
  c += `BT /F2 9 Tf ${MUTED} rg 380 660 Td (${safe(h.address)}) Tj ET\n`;
  // score block
  c += `BT /F1 40 Tf ${GREEN} rg 42 600 Td (${score}) Tj ET\n`;
  c += `BT /F2 10 Tf ${MUTED} rg ${42 + String(score).length * 24} 600 Td (/ 100  ·  ${safe(band)}) Tj ET\n`;
  const vcol = notCandidate ? RED : rec.tier === "Needs Inspection" ? AMBER : GREEN;
  c += `${vcol} RG 1.4 w 42 560 200 26 re S\n`;
  c += `BT /F1 12 Tf ${vcol} rg 52 568 Td (VERDICT: ${safe(verdict).toUpperCase()}) Tj ET\n`;
  c += `BT /F2 9 Tf ${MUTED} rg 42 540 Td (${safe(rec.summary)}) Tj ET\n`;
  // factor bars
  const rows: [string, string, number][] = [
    ["Roof age", `${session.score.roofAge} yrs`, Math.max(0, 100 - (session.score.roofAge / 25) * 100)],
    ["Granule condition", "", session.score.granule],
    ["Flexibility", "", session.score.flexibility],
    ["Ventilation", "", session.score.ventilation],
    ["Repair history", "", session.score.repairHistory],
    ["Storm exposure", "", session.score.stormExposure],
  ];
  let y = 505;
  for (const [label, val, pct] of rows) {
    c += `BT /F2 9 Tf ${MUTED} rg 42 ${y} Td (${label.toUpperCase()}) Tj ET\n`;
    c += `${LINE} rg 190 ${y + 1} 300 5 re f\n`;
    c += `${GREEN} rg 190 ${y + 1} ${Math.max(6, Math.min(300, (pct / 100) * 300))} 5 re f\n`;
    c += `BT /F1 9 Tf ${INK} rg 502 ${y} Td (${safe(val || `${Math.round(pct)}`)}) Tj ET\n`;
    y -= 26;
  }
  // findings
  c += `BT /F1 10 Tf ${INK} rg 42 ${y - 4} Td (FINDINGS) Tj ET\n`;
  let fy = y - 20;
  for (const reason of rec.reasons.slice(0, 4)) {
    c += `BT /F2 9 Tf ${MUTED} rg 50 ${fy} Td (·  ${safe(reason)}) Tj ET\n`;
    fy -= 14;
  }
  // investment box (only when quoted and candidate)
  if (inv && !notCandidate) {
    const by = fy - 10;
    c += `${GREEN} RG 1.2 w 42 ${by - 62} 528 62 re S\n`;
    c += `BT /F1 11 Tf ${INK} rg 54 ${by - 20} Td (ROOF PRESERVATION SYSTEM — QUOTED INVESTMENT: $${inv.price.toLocaleString()}${inv.managerAdjust ? ` · MANAGER-AUTHORIZED (standard $${inv.managerAdjust.from.toLocaleString()})` : inv.modifierPct ? ` (incl. +${inv.modifierPct}% disclosed modifier)` : ""}) Tj ET\n`;
    c += `BT /F2 8.5 Tf ${MUTED} rg 54 ${by - 35} Td (Price locked for 12 months from this assessment  ·  Pay on completion — no deposit  ·  Written warranty) Tj ET\n`;
    c += `BT /F2 8.5 Tf ${MUTED} rg 54 ${by - 48} Td (Includes Roof Passport, photo documentation, and the complimentary annual reassessment.) Tj ET\n`;
  }
  // doctrine footer
  c += `${LINE} rg 42 64 528 0.8 re f\n`;
  c += `BT /F2 8 Tf ${MUTED} rg 42 50 Td (No photo, no score  ·  Inspectors are never paid on treatment sales  ·  You receive the entire score.) Tj ET\n`;
  c += `BT /F2 8 Tf ${MUTED} rg 42 38 Td (Methodology published at elytrashield.us/how-we-score  ·  Your photos were reviewed with you at the assessment.) Tj ET\n`;

  const logoBytes = Buffer.from(LOGO_JPEG_BASE64, "base64").toString("latin1");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /Im1 7 0 R >> >> >>",
    `<< /Length ${c.length} >>\nstream\n${c}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Type /XObject /Subtype /Image /Width ${LOGO_JPEG_W} /Height ${LOGO_JPEG_H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n${logoBytes}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1").toString("base64");
}
