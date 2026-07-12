import type { Lead } from "@/types";

/**
 * Growth-audit item #4: the 4-email nurture sequence, branded like the lead notification.
 * First-90-days workflow: a rep triggers each stage manually from the CRM lead page
 * (5 minutes/day); automation can come later. Env-gated like all email (Resend).
 *
 * Claims discipline applies throughout: educational insurance framing, no dollar-savings
 * promises, "designed to" language, and the doctrine footer on every send.
 */

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us";

export const NURTURE_STAGES = ["welcome", "insurance", "score", "decide"] as const;
export type NurtureStage = (typeof NURTURE_STAGES)[number];

export const NURTURE_META: Record<NurtureStage, { label: string; when: string; subject: string }> = {
  welcome: { label: "1 · What to expect", when: "immediately after booking", subject: "Your Roof Health Assessment — here's exactly what happens" },
  insurance: { label: "2 · Insurance & roof age", when: "day 2", subject: "Why insurers care about your roof's age (and what documentation does)" },
  score: { label: "3 · The 82→67 story", when: "day 5", subject: "A roof that scores 82 today can score 67 in four years" },
  decide: { label: "4 · Preserve vs. replace", when: "day 10", subject: "Preserve or replace? How to decide with the report in your hands" },
};

function shell(name: string | undefined, bodyHtml: string): string {
  const hello = name ? `Hi ${name.split(" ")[0]},` : "Hi,";
  return (
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;border:1px solid #E2EBF1;border-radius:12px;overflow:hidden">` +
    `<div style="background:#0B1320;border-bottom:4px solid #39B54A;padding:16px 22px">` +
    `<table style="border-collapse:collapse"><tr>` +
    `<td style="padding-right:12px"><img src="${SITE()}/assets/elytra-shield-icon.png" width="42" height="42" alt="Elytra Shield" style="display:block;border-radius:8px" /></td>` +
    `<td><div style="color:#fff;font-size:19px;font-weight:800">ELYTRA SHIELD</div>` +
    `<div style="color:#39B54A;font-size:9px;letter-spacing:.28em;margin-top:2px">ROOF PRESERVATION</div></td>` +
    `</tr></table></div>` +
    `<div style="padding:20px 22px;color:#16314A;font-size:14px;line-height:1.65">` +
    `<p style="margin:0 0 12px">${hello}</p>${bodyHtml}` +
    `<p style="font-size:10px;color:#5C6F7E;margin-top:18px;border-top:1px solid #E2EBF1;padding-top:10px">` +
    `No photo, no score · Inspectors are never paid on treatment sales · You receive the entire score.<br/>` +
    `Elytra Shield · <a href="${SITE()}" style="color:#39B54A">elytrashield.us</a> · methodology at <a href="${SITE()}/how-we-score" style="color:#39B54A">/how-we-score</a></p>` +
    `</div></div>`
  );
}

const btn = (href: string, label: string) =>
  `<p style="margin:16px 0"><a href="${href}" style="background:#39B54A;color:#fff;font-weight:700;padding:11px 20px;border-radius:8px;text-decoration:none;display:inline-block">${label}</a></p>`;

export function buildNurtureEmail(stage: NurtureStage, name?: string): { subject: string; html: string } {
  const s = SITE();
  const bodies: Record<NurtureStage, string> = {
    welcome:
      `<p style="margin:0 0 12px"><b>You're on the schedule.</b> Here's exactly what your free Roof Health Assessment looks like — no surprises:</p>` +
      `<p style="margin:0 0 12px">About 30 minutes, on the roof — photographed at every checkpoint. Then we sit down together: your six-factor Roof Health Score&trade;, computed in front of you, and a written verdict — <b>preserve, monitor, or replace</b>. If you need a roofer, we'll say so and hand you names we take nothing for.</p>` +
      `<p style="margin:0 0 12px">Everything we document is yours to keep, whatever you decide.</p>` +
      btn(`${s}/sample-report`, "See a sample report before we arrive") +
      `<p style="margin:0;color:#5C6F7E;font-size:12px">Tip: having both decision-makers home means nothing has to be repeated.</p>`,
    insurance:
      `<p style="margin:0 0 12px">A quiet shift is happening in home insurance: many carriers now look hard at roofs from about age 10–15 — some move older roofs to actual-cash-value coverage, and some non-renew.</p>` +
      `<p style="margin:0 0 12px">We can't promise anything about your coverage — nobody honestly can; insurers make their own decisions. What we can say: <b>walking into that conversation with dated photos, a measured score, and a written condition report is better than walking in with nothing.</b> Your assessment produces exactly that record, free.</p>` +
      btn(`${s}/roof-insurance/`, "Read the roof & insurance guides"),
    score:
      `<p style="margin:0 0 12px">Here's the number most homeowners find surprising: on our published standard, a roof that scores <b style="color:#39B54A">82</b> today can score <b style="color:#E0A12E">67</b> four years from now — <i>even if it never leaks</i>.</p>` +
      `<p style="margin:0 0 12px">Nothing dramatic happens. Granules wash a little each season, flexibility fades as oils evaporate, and the calendar does the rest. That's why we measure <b>condition, not just damage</b> — and why a roof never scores higher than it does today.</p>` +
      btn(`${s}/how-we-score`, "See exactly how we score roofs"),
    decide:
      `<p style="margin:0 0 12px">The preserve-or-replace question comes down to evidence: age, granules, flexibility, and what the photos actually show. Our guide walks the honest version of that decision — including when replacement is the right call.</p>` +
      `<p style="margin:0 0 12px">Two things worth remembering from your assessment: <b>your quoted price is locked for 12 months</b>, and there's never a deposit — you pay when the work is done and you've seen every photo.</p>` +
      btn(`${s}/learning-center/roof-preservation-vs-replacement/`, "Preserve vs. replace — the honest guide") +
      `<p style="margin:0;color:#5C6F7E;font-size:12px">Questions? Reply to this email — a person reads it.</p>`,
  };
  return { subject: NURTURE_META[stage].subject, html: shell(name, bodies[stage]) };
}

/** Send one nurture stage. Env-gated like every other email (no-op without Resend). */
export async function sendNurtureEmail(to: string, name: string | undefined, stage: NurtureStage): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Email is not configured (RESEND_API_KEY)." };
  const { subject, html } = buildNurtureEmail(stage, name);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL || "leads@elytrashield.us", to, subject, html }),
    });
    if (!r.ok) return { ok: false, error: `Send failed (${r.status}).` };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error sending email." };
  }
}

// Type-only import kept so the module reads naturally alongside lib/email.ts
export type { Lead };
