export interface Article { title: string; slug: string; excerpt: string; }

// Mirrors the existing Learning Center pages under /public/learning-center.
export const articles: Article[] = [
  { title: "Is Roof Preservation a Scam?", slug: "is-roof-preservation-a-scam", excerpt: "An honest look at how preservation works and when it does (and doesn’t) make sense." },
  { title: "Does Roof Rejuvenation Work?", slug: "does-roof-rejuvenation-work", excerpt: "What the treatment is designed to do for eligible shingle roofs." },
  { title: "Roof Preservation vs. Replacement", slug: "roof-preservation-vs-replacement", excerpt: "How to weigh preserving a roof against a full replacement." },
  { title: "Roof Maxx Alternative", slug: "roof-maxx-alternative", excerpt: "How Nano Frog compares as a preservation option." },
  { title: "How to Choose a Roof Preservation Company", slug: "how-to-choose-a-roof-preservation-company", excerpt: "What to look for before hiring." },
  { title: "Roof Preservation Reviews", slug: "roof-preservation-reviews", excerpt: "What to make of preservation reviews online." },
];
