import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/sales", "/assessment", "/calculator", "/reports", "/rep", "/admin", "/passport", "/account"];

/** Trim accidental whitespace/quotes from pasted env values and reject non-URLs.
 *  A malformed NEXT_PUBLIC_SUPABASE_URL must degrade to "auth unconfigured"
 *  (fail-closed redirects), never to a 500 that takes down every matched route. */
function cleanEnv(v: string | undefined): string | undefined {
  const t = v?.trim().replace(/^["']|["']$/g, "");
  return t || undefined;
}

// C1 (approved): protected routes are NEVER open. If Supabase auth is not configured —
// or misconfigured, or unreachable — they redirect to /login instead of falling through
// or crashing. No demo mode, no 500s from this file.
export async function middleware(req: NextRequest) {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + "/"));
  const toLogin = () => {
    const to = req.nextUrl.clone();
    to.pathname = "/login";
    to.search = "";
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  };

  let valid = false;
  try { valid = Boolean(url && anon) && new URL(url!).protocol.startsWith("http"); } catch { valid = false; }
  if (!valid) {
    if (url || anon) console.error("[MIDDLEWARE] Supabase env present but malformed — check NEXT_PUBLIC_SUPABASE_URL format (https://<ref>.supabase.co, no quotes/whitespace).");
    return isProtected ? toLogin() : res;
  }

  let user: unknown = null;
  try {
    const supabase = createServerClient(url!, anon!, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => list.forEach((c) => res.cookies.set(c.name, c.value, c.options)),
      },
    });
    ({ data: { user } } = await supabase.auth.getUser());
  } catch (err) {
    // Supabase unreachable or client construction failed: fail CLOSED, never 500.
    console.error("[MIDDLEWARE] auth check failed:", err instanceof Error ? err.message : err);
    return isProtected ? toLogin() : res;
  }

  if (isProtected && !user) return toLogin();
  // Signed-in users have no business on /login — send them to the presentation.
  if (path === "/login" && user) {
    const to = req.nextUrl.clone();
    to.pathname = "/sales";
    to.search = "";
    return NextResponse.redirect(to);
  }
  return res; // role + active gating is enforced server-side (layouts + getCurrentRep)
}

export const config = {
  matcher: ["/sales/:path*", "/assessment/:path*", "/calculator/:path*", "/reports/:path*", "/rep/:path*", "/admin/:path*", "/passport/:path*", "/account/:path*", "/login"],
};
