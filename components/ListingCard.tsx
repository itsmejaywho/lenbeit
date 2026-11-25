import { landingPageContent } from "../lib/placeholder-data";
import { Placeholder } from "./Placeholder";

type Listing = (typeof landingPageContent.listings)[number];

export function ListingCard({
  listing,
  ratio,
}: {
  listing: Listing;
  ratio: string;
}) {
  return (
    <article className="listing-card">
      <Placeholder tone={listing.visual} ratio={ratio} />
      <div className="listing-details">
        <p className="listing-price">{listing.price}</p>
        <h3>{listing.title}</h3>
        <div className="listing-meta">
          <p>{listing.location}</p>
          <span className="verified-badge">
            <span aria-hidden="true">✓</span>
            {landingPageContent.verified}
          </span>
        </div>
      </div>
    </article>
  );
}
