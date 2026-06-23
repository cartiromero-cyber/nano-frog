# Content Guide

## Marketing copy (homepage)
Each homepage section is a component in `components/` (e.g. `Hero.tsx`, `RoofHealthScore.tsx`)
that renders the approved markup. Edit the **text strings** inside a component to reword copy.
Do not change structure/classes \u2014 the design is locked by `styles/globals.css`.

## Reusable content (no redesign needed)
Edit these data files; pages and schema read from them:
- `content/cities.ts` \u2014 cities for upcoming local-SEO pages
- `content/faq.ts` \u2014 FAQ questions (also feeds FAQ schema)
- `content/articles.ts` \u2014 Learning Center articles
- `content/services.ts` \u2014 services + insurance sub-pages
- `content/trustPoints.ts` \u2014 trust/credibility points
- `content/formOptions.ts` \u2014 dropdown options for the lead forms

## Images & assets
Put files in `public/images/`. Approved brand assets live in `public/assets/`
(logo marks, lockups). Reference as `/images/your-file.jpg` or `/assets/...`.

## Forms
Lead forms are ready in `components/forms/` and post to `/api/...`. They are **not** mounted
on the approved homepage \u2014 add `<AssessmentForm />` etc. to a page when you build the
"Get a Free Assessment" route, or drop them into an existing section.

## Authority pages
The current insurance / roof-health-score / learning-center / faq pages are served as
static files from `public/`. They will be migrated to App Router pages using the `content/`
data so new ones can be added without redesigning.
