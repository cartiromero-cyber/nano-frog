import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Cookie-bound Supabase client for server components & route handlers (reads the session). */
export function supabaseAuthServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const store = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => { try { list.forEach((c) => store.set(c.name, c.value, c.options)); } catch { /* RSC read-only */ } },
    },
  });
}
