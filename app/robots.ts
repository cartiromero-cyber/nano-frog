import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us";

export default function robots(): MetadataRoute.Robots {
  return {
    // /api/ has nothing crawlable; internal tools already redirect + carry noindex.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
