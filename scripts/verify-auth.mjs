#!/usr/bin/env node
/**
 * Elytra Shield — auth production-configuration verifier (zero dependencies).
 * Run: node scripts/verify-auth.mjs   (wired as `npm run verify:auth`)
 *
 * Guards the invariants that keep staff auth safe. Source-assertion based, so if a
 * future edit weakens a guard, this script fails loudly in CI or locally.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let failures = 0;
const ok = (name) => console.log(`  ✓ ${name}`);
const fail = (name, why) => { failures++; console.error(`  ✗ ${name} — ${why}`); };
const read = (p) => readFileSync(p, "utf8");
const assert = (cond, name, why) => (cond ? ok(name) : fail(name, why));

console.log("verify-auth: Elytra Shield staff-auth invariants\n");

// 1 ── safe `next` redirect behavior (logic mirror + source guard must both hold)
const safeNext = (raw) => (raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("://")) ? raw : "/sales";
const cases = [
  ["https://malicious.example", "/sales"],
  ["//malicious.example", "/sales"],
  ["/a://b", "/sales"],
  [null, "/sales"],
  ["/sales", "/sales"],
  ["/rep/leads?x=1", "/rep/leads?x=1"],
  ["/admin", "/admin"],
];
assert(cases.every(([i, o]) => safeNext(i) === o), "safeNext: 7/7 behavior cases", "logic regression");
const login = read("components/sales/LoginForm.tsx");
assert(login.includes('!raw.startsWith("//")') && login.includes('!raw.includes("://")') && login.includes('"/sales"'),
  "LoginForm contains the same-site guard + /sales default", "guard expression missing from source");

// 2 ── env-variable name consistency (exactly the supported Supabase names)
const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(f)) out.push(p);
  }
  return out;
};
const files = ["app", "lib", "components"].flatMap((d) => walk(d)).concat(["middleware.ts"]);
const allSrc = files.map((f) => [f, read(f)]);
const supaEnv = new Set();
for (const [, src] of allSrc) for (const m of src.matchAll(/process\.env\.([A-Z_]*SUPABASE[A-Z_]*)/g)) supaEnv.add(m[1]);
const expected = new Set(["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_STORAGE_BUCKET"]);
assert([...supaEnv].every((v) => expected.has(v)), `Supabase env names are exactly the supported set (${[...supaEnv].join(", ")})`, "unexpected/stale env name in code");
assert(![...supaEnv].some((v) => v.includes("PUBLISHABLE")), "no PUBLISHABLE_KEY expected anywhere", "stale key name found");

// 3 ── service-role never reaches client bundles
const clientFilesUsingAdmin = allSrc.filter(([, s]) => s.includes("supabase/admin")).filter(([, s]) => s.includes("'use client'"));
assert(clientFilesUsingAdmin.length === 0, "service-role client never imported into 'use client' files",
  clientFilesUsingAdmin.map(([f]) => f).join(", "));
assert(!allSrc.some(([, s]) => /console\.[a-z]+\([^)]*SERVICE_ROLE/.test(s)), "service-role key never logged", "key appears in a console call");

// 4 ── middleware fails CLOSED when env is missing, and bounces signed-in users off /login
const mw = read("middleware.ts");
assert(!/demo mode: no auth configured -> no gate/.test(mw) && mw.includes("if (!url || !anon)") && mw.match(/if \(!url \|\| !anon\)[\s\S]{0,220}isProtected[\s\S]{0,220}redirect/),
  "middleware redirects protected routes even with NO Supabase env (fail-closed)", "open-when-unconfigured pattern detected");
assert(mw.includes('path === "/login" && user'), "signed-in visitors to /login are redirected", "missing /login bounce");
for (const route of ["/sales/:path*", "/rep/:path*", "/admin/:path*", "/passport/:path*", "/account/:path*", "/login"])
  assert(mw.includes(`"${route}"`), `matcher covers ${route}`, "route missing from matcher");

// 5 ── inactive users and profile-less auth users are denied
const auth = read("lib/sales/auth.ts");
assert(auth.includes("row.active === false") && auth.match(/if \(!row \|\| row\.active === false\)[\s\S]{0,120}return null/),
  "getCurrentRep denies inactive + no-profile users", "denial branch missing");
assert(!auth.includes("Demo Admin"), "no demo-admin fallback exists", "demo fallback re-introduced");

// 6 ── role mapping enforced server-side
assert(read("app/admin/layout.tsx").includes('ctx.role === "REP"'), "/admin layout redirects REPs", "role gate missing");
assert(read("app/rep/layout.tsx").includes("redirect(\"/login?next=/rep\")"), "/rep layout requires active staff", "gate missing");
assert(read("app/sales/layout.tsx").includes("redirect(\"/login?next=/sales\")"), "/sales layout requires active staff", "gate missing");
assert(read("supabase/auth.sql").includes("('REP','MANAGER','ADMIN')"), "role constraint permits exactly REP/MANAGER/ADMIN", "constraint changed");

// 7 ── internal APIs self-check auth (middleware does not cover /api)
for (const f of ["app/api/sales/passport/route.ts", "app/api/sales/session/route.ts", "app/api/upload/route.ts", "app/api/memberships/route.ts"])
  assert(read(f).includes("getCurrentRep"), `${f} enforces auth`, "no auth check");
assert((read("app/api/sales/passport/route.ts").match(/getCurrentRep/g) || []).length >= 2,
  "passport GET (homeowner PII lookup) requires staff auth", "GET is publicly enumerable");

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
