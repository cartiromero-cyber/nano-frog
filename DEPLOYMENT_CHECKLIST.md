# ELYTRA SHIELD — OWNER'S DEPLOYMENT CHECKLIST

**Written for a non-developer.** Follow top to bottom. Each section says exactly where to click.
Budget ~2 hours total, mostly waiting on DNS. Nothing here changes code.

> **Note on pushing the code:** the V2 fixes are committed on your computer but could not be
> pushed from the assistant's sandbox (GitHub is blocked there). **Step 0 is yours.**

---

## Step 0 — Push the code to GitHub (2 minutes, on your Mac)

1. Open the **Terminal** app.
2. Type (then Enter): `cd ~/Documents/elytra-shield.us`
3. Type (then Enter): `git push origin main`
4. If it asks you to sign in, follow the GitHub prompt in your browser.

Optional but recommended: your GitHub repo is still named **nano-frog** (the old brand).
To rename: github.com → your repo → **Settings** → Repository name → type `elytra-shield` → **Rename**.
(Git on your Mac keeps working; GitHub forwards the old name.)

---

## Step 1 — Master checklist (the order that avoids rework)

- [ ] 0. Push code to GitHub (above)
- [ ] 1. Create the Supabase project + run the 5 SQL files + create your admin login (Section 3)
- [ ] 2. Create the Resend account + start domain verification (Section 4) — start early, DNS takes time
- [ ] 3. Import the repo into Vercel + paste ALL environment variables (Section 2)
- [ ] 4. Point your domain's DNS at Vercel + add Resend's records (Section 5)
- [ ] 5. Deploy, then run every verification in Section 6
- [ ] 6. Only then: put the URL on business cards, yard signs, and door hangers

---

## Step 2 — Every environment variable

In Vercel: your project → **Settings** → **Environment Variables** → for each row below click
**Add**, paste the Name and Value, leave "All Environments" selected, click **Save**.

### Required — the site is not launch-ready without these

| Name | Value | Where it comes from |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://elytrashield.us` | ⚠️ Confirm spelling first — your note said `elytrashield.us`, the folder says `elytra-shield.us`. Use EXACTLY the domain you registered. |
| `NEXT_PUBLIC_PHONE` | e.g. `(478) 555-0123` | Your real business line. The moment this is set, click-to-call appears in the header, footer, CTA, and Google's structured data. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Project → **Settings** → **API** → "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | long string starting `eyJ…` | Same page → "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | long string starting `eyJ…` | Same page → "service_role" key. **Secret — never share, never put in any variable whose name starts with NEXT_PUBLIC_.** |
| `SUPABASE_STORAGE_BUCKET` | `roof-passports` | Type it exactly (Section 3 creates the bucket) |
| `LEAD_STORE` | `supabase` | Type it exactly. This is what makes booked leads land in your database. |
| `RESEND_API_KEY` | starts `re_…` | Resend → **API Keys** → Create (Section 4) |
| `LEAD_NOTIFY_EMAIL` | your real inbox | Where "New lead!" emails arrive. Can be gmail. |
| `LEAD_FROM_EMAIL` | `leads@` your domain | Must be on the domain you verify in Resend (Section 4). |

### Optional — skip for launch

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Analytics — add when you start measuring/ads |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Stronger spam rate-limiting — add when traffic grows |
| `DATABASE_URL`, `AIRTABLE_*` | Alternative lead stores — not needed, you're using Supabase |
| `UPLOAD_PROVIDER` | Leave as is until photo uploads to cloud storage are needed |

---

## Step 3 — Supabase setup (your database + rep logins), ~20 minutes

1. Go to **supabase.com** → **Start your project** → sign up (GitHub login is easiest).
2. Click **New project**. Name: `elytra-shield`. Database password: click **Generate** and save it
   in your password manager. Region: **East US**. Click **Create new project**; wait ~2 min.
3. **Run the 5 SQL files, in this exact order.** In the left sidebar click **SQL Editor** → **New query**.
   On your Mac, open the project folder → `supabase` folder. For each file below: open it in TextEdit,
   Select All, Copy, paste into the SQL Editor, click **Run**, confirm "Success":
   1. `schema.sql`
   2. `auth.sql`
   3. `crm.sql`
   4. `org.sql`
   5. `membership.sql`
4. **Create the photo bucket:** left sidebar → **Storage** → **New bucket** → name: `roof-passports`
   → leave "Public bucket" OFF → **Create**.
5. **Create YOUR admin login:**
   1. Left sidebar → **Authentication** → **Users** → **Add user** → enter your email + a strong
      password → **Create user**.
   2. Click the new user and copy their **UUID** (long id like `a1b2c3…`).
   3. Back to **SQL Editor** → New query → paste, replacing the three placeholders:
      ```sql
      insert into reps (user_id, name, email, role, territory, active)
      values ('PASTE-UUID-HERE', 'Your Name', 'your@email.com', 'ADMIN', 'Georgia', true);
      ```
   4. Click **Run**.
6. **Copy your three keys** for Section 2: **Settings** (gear icon) → **API** → copy Project URL,
   anon public key, and service_role key.

> After launch you never touch SQL again — new reps are created at `yoursite/admin/reps/new`.

---

## Step 4 — Resend setup (email that actually delivers), ~15 minutes + DNS wait

1. Go to **resend.com** → **Sign up** (free tier is fine: 3,000 emails/month).
2. Left sidebar → **Domains** → **Add Domain** → type your domain (e.g. `elytrashield.us`) → **Add**.
3. Resend shows **3–4 DNS records** (TXT and MX, names like `resend._domainkey`). Keep this tab open —
   you'll paste them at your registrar in Section 5, step 3.
4. After adding the DNS records, come back and click **Verify DNS Records**. Status must turn
   **Verified** (can take 15 min – a few hours). Emails will not send until it's green.
5. Left sidebar → **API Keys** → **Create API Key** → name `elytra-shield-production`,
   permission "Sending access" → **Create** → copy the key **now** (shown once) → it becomes
   `RESEND_API_KEY` in Section 2.

---

## Step 5 — DNS (pointing your domain at the site), ~15 minutes + wait

Do this at the company where you bought the domain (GoDaddy, Namecheap, Google Domains, etc.).
Log in there and find **DNS settings / Manage DNS** for your domain.

1. **First, connect the domain in Vercel:** Vercel → your project → **Settings** → **Domains** →
   type your domain → **Add**. Also add the `www.` version when prompted (Vercel will offer to
   redirect www → main automatically — accept).
2. **Vercel now shows you the exact records to create.** Typically:
   - Type **A**, Name/Host: `@`, Value: `76.76.21.21`
   - Type **CNAME**, Name/Host: `www`, Value: `cname.vercel-dns.com`
   At your registrar: **Add record** for each, paste exactly, save. Vercel's Domains page will
   flip to a green checkmark when it detects them (minutes to a few hours). SSL (the padlock) is
   automatic — do nothing.
3. **Add the Resend records** from Section 4 step 3 the same way (they're TXT and MX records —
   copy Name and Value exactly, including any dots).
4. **If you also own the other spelling** of the domain (hyphen/no-hyphen) or the old
   `elytrashieldroofing.com`: in Vercel → Settings → Domains, **Add** it too and choose
   **Redirect to** your main domain. Free insurance against typed-in traffic.
5. Don't delete existing records you don't recognize unless they're old website records on `@` or `www`
   that conflict (registrar support chat can confirm in 2 minutes).

---

## Step 6 — Deploy + post-deployment verification

**Deploy:** Vercel → **Add New… → Project** → **Import** your GitHub repo → framework auto-detects
Next.js → confirm the env vars from Section 2 are present → **Deploy** → wait for "Congratulations."

Then verify EVERY line. If any line fails, stop and fix before announcing the site.

### The money path (do this first)
- [ ] Open `https://yourdomain/book` on your **phone** — header readable, form loads.
- [ ] Submit a real test lead (your own name/phone/address).
- [ ] You see the confirmation message with next steps.
- [ ] Within a minute: "New Free Roof Assessment request" email arrives at `LEAD_NOTIFY_EMAIL`.
- [ ] If you entered an email in the form: the homeowner confirmation email also arrives (check spam the first time; if in spam, wait for domain verification to fully propagate).
- [ ] Supabase → **Table Editor** → `leads` table → your test row is there. **This is the line that proves revenue can't be lost.**

### Security (2 minutes, do it logged OUT — use a private/incognito window)
- [ ] `https://yourdomain/admin` → redirects to `/login` ✅
- [ ] `https://yourdomain/rep` → redirects to `/login` ✅
- [ ] `https://yourdomain/passport` → redirects to `/login` ✅
- [ ] Now log in at `/login` with your Section 3 admin account → you land on the dashboard ✅

### Public site click-through
- [ ] Homepage loads with animations; every button labeled "Schedule/Book/Get" lands on `/book`
- [ ] "View Sample Assessment" (top of homepage) shows the sample report page, header readable
- [ ] Tap the phone number in the header on your phone → your business line rings
- [ ] Click 2–3 Learning Center cards → real articles open (no dead links)
- [ ] `https://yourdomain/sitemap.xml` and `/robots.txt` load and mention YOUR domain
- [ ] Search the page source of the homepage (right-click → View Page Source) for "555" → no fictional phone anywhere

### First-week follow-ups (not launch blockers)
- [ ] Delete your test lead from Supabase (Table Editor → row → delete)
- [ ] Add founder name/photo/license to the "Why Elytra Shield" section (slots are ready — M4)
- [ ] Set up Google Business Profile pointing at the live domain
- [ ] Decide membership tier pricing (currently shows "determined after your assessment")

---

*Documentation only — no code was modified, nothing was committed or deployed with this checklist.*
