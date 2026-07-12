import { PHONE, PHONE_TEL } from "@/content/site";

/** Growth-audit #5: mobile sticky call/book bar. 60%+ of home-services traffic converts
 *  by thumb. Renders only ≤700px (CSS); a spacer prevents footer overlap. Call button
 *  appears once NEXT_PUBLIC_PHONE is configured. Existing colors/typography only. */
export default function MobileCTABar() {
  return (
    <>
      <div className="mcta-spacer" aria-hidden="true" />
      <div className="mcta no-print">
        {PHONE ? <a className="m-call" href={PHONE_TEL}>Call {PHONE}</a> : null}
        <a className="m-book" href="/book">Book Free Assessment</a>
      </div>
    </>
  );
}
