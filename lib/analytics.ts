'use client';

/**
 * Thin tracking layer. Fires to GA4 (gtag), Microsoft Clarity, and Meta Pixel when
 * their IDs are present. Safe to call anywhere; no-ops on the server or when unconfigured.
 */
type Props = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") w.gtag("event", name, props);
  if (typeof w.clarity === "function") w.clarity("event", name);
  if (typeof w.fbq === "function") w.fbq("trackCustom", name, props);
}

export const trackFormSubmit = (form: string) => trackEvent("form_submit", { form });
export const trackCallClick = () => trackEvent("click_to_call");
export const trackCtaClick = (label: string) => trackEvent("cta_click", { label });
export const trackScoreInteraction = () => trackEvent("roof_health_score_interaction");
export const trackLearningClick = (article: string) => trackEvent("learning_center_click", { article });
export const trackCityVisit = (city: string) => trackEvent("city_page_visit", { city });
