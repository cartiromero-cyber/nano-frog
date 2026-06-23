# Analytics Setup

Tracking helpers live in `lib/analytics.ts` and fire to whatever is installed.

## Events emitted
- `form_submit` (assessment / insurance-review / contact)
- `click_to_call`
- `cta_click`
- `roof_health_score_interaction`
- `learning_center_click`
- `city_page_visit`

## GA4
1. Create a GA4 property; copy the Measurement ID (`G-XXXXXXX`).
2. Set `NEXT_PUBLIC_GA4_ID`.
3. Add the gtag snippet in `app/layout.tsx` via `next/script` (afterInteractive).

## Google Search Console
Verify the domain (DNS or the HTML meta tag in `app/layout.tsx` metadata), then submit
`https://YOUR-DOMAIN/sitemap.xml`.

## Microsoft Clarity
Set `NEXT_PUBLIC_CLARITY_ID` and add the Clarity snippet in `app/layout.tsx`.
`trackEvent` calls `clarity("event", name)` automatically when present.

## Meta Pixel (optional)
Set `NEXT_PUBLIC_META_PIXEL_ID` and add the Pixel base code; `trackEvent` forwards custom events via `fbq`.
