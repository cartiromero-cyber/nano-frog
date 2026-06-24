'use client';
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Browser-safe client (anon key only). Subject to RLS. Null when not configured. */
export const supabaseBrowser = url && anon ? createClient(url, anon, { auth: { persistSession: false } }) : null;
export const supabaseConfigured = Boolean(url && anon);
