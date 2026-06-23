import type { NextRequest } from "next/server";

/**
 * Lightweight in-memory rate limit (per server instance) as spam protection.
 * For production across serverless instances, swap for Upstash Ratelimit using
 * UPSTASH_REDIS_REST_URL / _TOKEN. See docs/ARCHITECTURE.md.
 */
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX = 6;

export async function checkRateLimit(req: NextRequest): Promise<boolean> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  rec.count += 1;
  return rec.count <= MAX;
}
