import type { MetadataRoute } from "next";
import { cities } from "@/content/cities";
import { articles } from "@/content/articles";
import { insurancePages } from "@/content/services";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us";

// Honest lastModified: a real content date, bumped when content actually changes —
// stamping `new Date()` on every build tells Google every page changed daily, which
// erodes crawl trust. Update LAUNCH when meaningful site-wide content ships.
const LAUNCH = new Date("2026-07-12");

// The four roof-health-score guides live as static pages (SEO-audit fix: previously
// missing from the sitemap entirely).
const scorePages = ["what-is-a-good-roof-score", "roof-aging-signs", "roof-inspection-checklist", "roof-life-expectancy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: LAUNCH, priority: 1 },
    { url: `${SITE}/book`, lastModified: LAUNCH, priority: 0.9 },
    { url: `${SITE}/sample-report`, lastModified: LAUNCH, priority: 0.8 },
    { url: `${SITE}/how-we-score`, lastModified: LAUNCH, priority: 0.8 },
    { url: `${SITE}/roof-health-score/`, lastModified: LAUNCH, priority: 0.8 },
    { url: `${SITE}/roof-insurance/`, lastModified: LAUNCH, priority: 0.8 },
    { url: `${SITE}/learning-center/`, lastModified: LAUNCH, priority: 0.7 },
    { url: `${SITE}/faq/`, lastModified: LAUNCH, priority: 0.6 },
  ];
  for (const s of scorePages) urls.push({ url: `${SITE}/roof-health-score/${s}/`, lastModified: LAUNCH, priority: 0.6 });
  for (const p of insurancePages) urls.push({ url: `${SITE}/roof-insurance/${p.slug}/`, lastModified: LAUNCH, priority: 0.6 });
  for (const a of articles) urls.push({ url: `${SITE}/learning-center/${a.slug}/`, lastModified: LAUNCH, priority: 0.6 });
  // City pages are prepared in /content/cities.ts for the upcoming local-SEO buildout.
  for (const c of cities) urls.push({ url: `${SITE}/${c.slug}/`, lastModified: LAUNCH, priority: 0.5 });
  return urls;
}
