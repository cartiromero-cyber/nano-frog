# ELYTRA SHIELD — DECISION REGISTER

**Purpose:** the single source of truth for what has been decided. Ideation is over; this file
protects the integrity of the approved system. Nothing in LOCKED changes without a formal
change request. Last updated: July 2026.

## Change-Request Protocol (required for anything touching LOCKED items)

Any proposed change to pricing, the Continuity Program, Preservation Refresh™, the Honest-No
Doctrine, the Roof Health Score™, or Passport structure must answer, in writing:

1. Why change?
2. What existing approvals does it affect?
3. Does it improve enterprise value?
4. Does it create contradictions?
5. Is there data supporting it?

Outcome is logged here as **APPROVED** (with a revision letter) or **REJECTED** (with the reason —
rejections are kept forever; they are institutional memory).

---

## 1. LOCKED — Operating Doctrine (change request required)

| ID | Decision | Locked in |
|---|---|---|
| DOC-1 | **Honest-No Doctrine:** the Score determines Preserve / Monitor / Replace — never billing status, never sales pressure. Every assessment ends in a written verdict. | Roadmap + Pricing Rev C/D |
| DOC-2 | **Claims discipline:** "designed to help" language; no durability numbers without substantiation; no insurance promises (educational only); no invented value anchors; no fictional data anywhere customer-visible. | Standing since first audit |
| DOC-3 | **Design Preservation Mandate:** colors, typography, layout, motion are v1.0-approved; conversion changes only, inside the existing design language. | Owner mandate |
| DOC-4 | **Category position:** "We help homeowners get the maximum life from the roof they already own." Roof Intelligence company, not a coating company. | Grand Slam Offer + Buyer's Review |
| DOC-5 | **Roof Lifecycle language** (owner-added at Rev D lock): Assessment → Protection → Continuity → Refresh. "Treatment/maintenance/retreatment" vocabulary retired from customer-facing use. Implementation: queued copy batch. | Rev D lock session |
| DOC-6 | **Score Disclosure Rule:** the customer always receives the overall score, full factor breakdown, all photos, and the written verdict. Never hidden, never "internal," never proprietary. The methodology is the moat — not secrecy. | S-001 lock session |
| S-001 | **Roof Health Score™ Standard v1 — LOCKED.** Factor anchors, verdict thresholds, no-photo-no-score, inspector-pay integrity rule (never compensated on conversion — sacred), calibration + second-scorer audits, version-pinned re-scores, Section-8 version control (v1.x anchors / v2.0 formula, code + doc + public page updated in the same commit). Three verdicts only — Preserve / Monitor / Replace. | Owner approval, no material changes |
| O-002 | **Pricing (Rev D, FINAL):** Bands $2,950 / $3,650 / $4,450 / from $5,400 + disclosed 10–15% complexity modifier · 25%-of-replacement cap · measured-not-negotiated · one price · NO discounts ever · reveal only at Investment slide · 12-month price-lock from assessment · 55% GM floor (Mode B), 62–68% target · full review gate at job 25. | Pricing Model Rev D |
| O-003 | **$249 a-la-carte / realtor assessment SKU** (flat, no professional discounts; makes "included free" honest). | Rev D §10 |
| LIFE-1 | **Free Assessment Model:** Free assessment → System → Complimentary Year-1 Reassessment → Continuity offer AT the year-1 visit. NEVER a membership pitch at close. "No subscription" stays literally true on treatment day. | Rev B→D |
| LIFE-2 | **Elytra Continuity Program™:** single tier, $259/yr, offered at year-1 reassessment only. Old three-tier structure retired to future B2B use. | Rev B→D |
| LIFE-3 | **Reliability Reapplication™ (defined):** localized maintenance, ≤2 squares/program-year, during/scheduled from the annual visit, no rollover; application defects covered separately and without limit under the Application Guarantee; beyond-allowance work quoted in writing first; the report states inside vs. outside allowance. | Rev D |
| LIFE-4 | **Preservation Refresh™:** the year-5 lifecycle event (replaces "re-treatment"). Continuous Continuity customers: original protected pricing. Lapsed: fresh score-driven evaluation at current band. | Rev D |
| LIFE-5 | **Lapse ladder (honesty-corrected):** lapse <36 mo → rejoin via paid $249 re-assessment, price-lock permanently lost. Lapse ≥36 mo → new-customer evaluation, verdict from the score. A lapse NEVER by itself requires purchasing anything. Language: "Passport continuity has lapsed" ✓; "certification expired" only if certification is publicly defined as score + unbroken documentation. | Rev C/D |
| O-009 | Front-end headline: "FREE ROOF HEALTH ASSESSMENT — Know exactly what your roof needs before spending a dollar." ($20K framing is mid-funnel only.) | Owner amendment |
| O-010 | Passport transfer-on-sale (record follows the house; realtor channel). Code component queued. | Owner approval |
| O-011 | Neighbor passes: 2 transferable free assessments per completed System. | Owner approval |
| O-013 | Preservation Refresh™ window scheduled in Passport at time of sale. | Owner approval |
| O-015 | Dataset policy from job #1: every assessment stored complete (score, factors, photos, verdict, re-score date), including untreated control-group roofs. | Owner approval |
| O-017 | KPI gate: assessment→close measured on first 25 assessments before scaling; Assessment Close Rate is dashboard metric #1. Floor 15% / healthy 20% / target 25%. | Owner approval |
| O-018 | Reliability-visit boundary rule: our-application issues = free under guarantee; new wear = honestly quoted; the report states which is which. | Rev B→D |
| GUAR-1 | Risk-reversal stack: Pay-on-completion · 3-day cancel stated proudly · Honest-No in writing · walk-the-roof photo review before payment. **GUAR-1a (owner flag, adopted):** public language scoped to "no deposits on residential preservation projects" — operationally maintainable at current ticket sizes; commercial/estate work negotiates terms separately. Revert to unscoped "ever" only by change request. | Grand Slam Offer + homepage verification session |
| LANG-1 | **"Assessment," never "inspection," in offer language.** Inspections are commodities; assessments imply methodology. "Inspection" permitted only when describing the physical act inside explanatory copy. LANG-1-FIX-01 (WhyElytraShield "inspection and a score" → "assessment and a score"): applied. | Homepage verification session |
| SSOT-1 | **Single source of truth for the standard's numbers:** WEIGHTS, VERDICT_GATES, and SCORING_STANDARD_VERSION are exported from the scoring engine, and /how-we-score renders from those exports — the public page structurally cannot drift from the math. Math audit verified: weights (sum 1.00), bands, and gates match the published standard exactly; 9/9 engine regression assertions pass; all 13 computing consumers import the one library. LANG-1-FIX-02 (change request APPROVED & applied): internal typed value "Needs Inspection" preserved for saved sessions/CRM; customer surfaces (Recommendation slide, printed report) map to "Monitor" via displayTier(); monitor-tier summary sentence rewritten in Monitor vocabulary. | Math integrity audit |

### 🔴 LAUNCH BLOCKERS (hard gates — deployment sequence is attorney → artifacts → launch, not the reverse)
| Gate | Why it now blocks |
|---|---|
| M4 — Founder section content (photo, story, industry experience, why Elytra exists, Honest-No commitment) | The homepage now makes doctrine-level trust claims (never paid on sales, full disclosure, Honest-No). Trust claims require a face. Slots are built and waiting in components/WhyElytraShield.tsx. |
| O-005/019 — Attorney-finalized written warranty | "Written warranty" is now a public representation in the homepage offer stack. It must exist as a document before the page that promises it goes live. |
| DEPLOY env values | Supabase keys · LEAD_STORE=supabase · Resend + verified domain · NEXT_PUBLIC_SITE_URL · NEXT_PUBLIC_PHONE (see DEPLOYMENT_CHECKLIST.md). |

### Implemented & shipped (code, committed locally)
- Website conversion batch: /book page + all CTAs wired, slim form (name/phone/address), phone config, dead links fixed, /sample-report, Why Elytra Shield section, booking confirmations (commits `8236a59`).
- Security/launch hardening C1–C3, H1–H3: no demo-admin, durable leads, header fix, placeholders removed, elytrashield.us domain, demo passport hidden (`ac0ed0a`).
- Sales deck P-001/002/003/006/007/008 + If-We-Do-Nothing slide: diagnosis-first order, Your Roof Today photo slide, verdict slide, scripts, claims suppressed (`5a5397b`).
- /sales-preview (temporary, dev-gated) (`96758dc`).
- PROTECTED shield animation on What-Is section (`6f7b733`, `d13ebfd`).
- R-001 "How We Score" public page v1.0, linked + sitemapped (`990b81c`).

---

## 2. IN PROGRESS — designed, awaiting approval or build

| ID | Item | Blocking on |
|---|---|---|
| — | ~~S-001 draft~~ → **LOCKED** (moved to Section 1). Public page upgraded to v1.1 to match (verdict thresholds, integrity rules, disclosure rule, worked example). | Done |
| P-004 | Investment slide (now UNBLOCKED by Rev D — Band table + pay-on-completion + price-lock) | Build approval |
| H-008 | Homepage offer-stack block (unblocked by Rev D) | Build approval |
| REVD-CODE | Rev D code batch: membership.ts → single Continuity Program, enrollment panel out of deck close, passport panel reframe, Lifecycle language pass (DOC-5) | Build approval |
| H-001…H-007 | Homepage conversion batch from the Hormozi audit (re-sequence, hero copy, outcome-first cards, we/you How-It-Works, final-CTA close, sample-report links, guarantee block, urgency line) | **Never formally approved — awaiting owner decision** |
| M4 | Founder section content (name, photo, license/insurance) | Owner provides materials |
| O-005/019 | Written warranty + guarantee language | Attorney |
| O-012→superseded | Original attach-at-completion rule REPLACED by LIFE-1/LIFE-2 (Rev B) | — |
| O-014 | Trademark filings (now incl. Reliability Reapplication™, Preservation Refresh™, Continuity Program™) | Owner/attorney action |
| O-016 | Second supplier source / volume terms | Owner action |
| REALTOR | Realtor program execution (direction approved; playbook not written) | Q3 per roadmap |
| DEPLOY | Production launch (checklist exists; env vars + push + build + test lead) | Owner runbook steps |

## 3. FUTURE — roadmap items, not yet in play

R-002 Roof Health Index™ (year-2 publication) · R-003 Market-2 criteria · R-004 franchise/license framework · Batch C website items (city pages 016, referral engine 017, large automation) · B2B/HOA portfolio contracts · drone documentation (requires drone + Part 107) · before/after gallery (requires 3 real documented jobs).

## 4. REJECTED — kept as institutional memory

| Decision | Why rejected |
|---|---|
| Mandatory "full system requalification" purchase on Continuity lapse (Rev C proposal, original form) | Verdict must come from the score, not billing status — contradicted Honest-No Doctrine, published standard, and consumer-protection common sense. Replaced by LIFE-5 lapse ladder. |
| Membership pitch at treatment close | Friction on the biggest decision day; contradicted the site's own "no subscription" promise. Replaced by LIFE-1. |
| Invented "$X value" anchors on bonuses | FTC/honesty risk. Anchors only at genuinely charged prices ($249 SKU exists for this). |
| "Manufacturer-approved imagery" for before/after | Dossier's own guardrail; footer declares manufacturer independence. Hold until real photos. |
| Fictional schema.org phone number / demo-admin fallback / fabricated demo passport | Removed in launch hardening. Nothing fake ships. |
| Publishing price figures on the website (007 original) | Owner decision: "pricing determined after your assessment" language instead. NOTE: Rev D bands + Investment slide may warrant revisiting via change request. |
| Three-tier membership at retail | Replaced by single-tier Continuity Program (kept for future B2B). |
