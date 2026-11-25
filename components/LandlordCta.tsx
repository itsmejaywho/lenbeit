import { landingPageContent } from "../lib/placeholder-data";

export function LandlordCta() {
  const { landlord } = landingPageContent;

  return (
    <section className="landlord-cta page-shell" id="landlords">
      <div className="landlord-copy">
        <span className="eyebrow">{landlord.eyebrow}</span>
        <h2>{landlord.heading}</h2>
      </div>
      <a className="button button-light" href="/login">
        {landlord.button}
      </a>
    </section>
  );
}
