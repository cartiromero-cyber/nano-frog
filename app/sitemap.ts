import type { MetadataRoute } from "next";
import { cities } from "@/content/cities";
import { articles } from "@/content/articles";
import { insurancePages } from "@/content/services";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, priority: 1 },
    { url: `${SITE}/book`, lastModified: now, priority: 0.9 },
    { url: `${SITE}/sample-report`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/how-we-score`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/roof-health-score/`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/roof-insurance/`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/learning-center/`, lastModified: now, priority: 0.7 },
    { url: `${SITE}/faq/`, lastModified: now, priority: 0.6 },
  ];
  for (const p of insurancePages) urls.push({ url: `${SITE}/roof-insurance/${p.slug}/`, lastModified: now, priority: 0.6 });
  for (const a of articles) urls.push({ url: `${SITE}/learning-center/${a.slug}/`, lastModified: now, priority: 0.6 });
  // City pages are prepared in /content/cities.ts for the upcoming local-SEO buildout.
  for (const c of cities) urls.push({ url: `${SITE}/${c.slug}/`, lastModified: now, priority: 0.5 });
  return urls;
}
