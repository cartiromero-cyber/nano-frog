import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/sales", "/assessment", "/calculator", "/reports", "/rep", "/admin", "/passport", "/account"];

// C1 (approved): protected routes are NEVER open. If Supabase auth is not configured,
// they redirect to /login instead of falling through. No demo mode.
export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + "/"));

  if (!url || !anon) {
    if (isProtected) {
      const to = req.nextUrl.clone();
      to.pathname = "/login";
      to.searchParams.set("next", path);
      return NextResponse.redirect(to);
    }
    return res;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => list.forEach((c) => res.cookies.set(c.name, c.value, c.options)),
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (isProtected && !user) {
    const to = req.nextUrl.clone();
    to.pathname = "/login";
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }
  return res; // role gating (e.g. /admin) is enforced in the page server components
}

export const config = {
  matcher: ["/sales/:path*", "/assessment/:path*", "/calculator/:path*", "/reports/:path*", "/rep/:path*", "/admin/:path*", "/passport/:path*", "/account/:path*"],
};
