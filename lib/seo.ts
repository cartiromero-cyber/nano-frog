import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://elytrashieldroofing.com";

// NOTE: elytrashield.com is held by a cybersecurity brand (see
// REBRAND_AUDIT.md); using elytrashieldroofing.com. Confirm domain, phone, and legal entity
// before go-live. All brand values are centralized here.
export const BUSINESS = {
  name: "Elytra Shield",
  legalName: "Elytra Shield",
  url: SITE,
  telephone: "+1-478-555-0146",
  email: "info@elytrashieldroofing.com",
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
    telephone: BUSINESS.telephone,
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
