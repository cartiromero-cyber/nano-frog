import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashield.us";

// H2 (approved): canonical domain is elytrashield.us. All brand values centralized here.
// Phone is config-driven (NEXT_PUBLIC_PHONE) — never a fictional number in public
// schema.org markup; the telephone field is omitted from schema until configured.
export const BUSINESS = {
  name: "Elytra Shield",
  legalName: "Elytra Shield",
  url: SITE,
  telephone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.LEAD_NOTIFY_EMAIL || "",
  areaServed: "Georgia",
  tagline: "Protect What Protects Your Home.",
  description:
    "Advanced roof preservation — the smarter alternative to premature roof replacement for eligible roofs in Georgia and the Southeast.",
};

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    ...(BUSINESS.telephone ? { telephone: BUSINESS.telephone } : {}),
    areaServed: { "@type": "State", name: BUSINESS.areaServed },
    description: BUSINESS.description,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS.name,
    url: BUSINESS.url,
  };
}

export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    provider: { "@type": "RoofingContractor", name: BUSINESS.name, url: BUSINESS.url },
    areaServed: { "@type": "State", name: BUSINESS.areaServed },
    description,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function articleSchema(title: string, description: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE}/learning-center/${slug}/`,
    publisher: { "@type": "Organization", name: BUSINESS.name },
  };
}

export function buildMetadata(opts: { title: string; description: string; path?: string }): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path || "/" },
    openGraph: { title: opts.title, description: opts.description, url: opts.path || "/", type: "website" },
  };
}
