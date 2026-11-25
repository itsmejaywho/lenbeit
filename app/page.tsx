import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { LandlordCta } from "../components/LandlordCta";
import { ListingCard } from "../components/ListingCard";
import { MasonryGrid } from "../components/MasonryGrid";
import { Navbar } from "../components/Navbar";
import { SearchBar } from "../components/SearchBar";
import { LinkButton } from "../components/ui/LinkButton";
import {
  LANDING_LISTING_LIMIT,
  landingPageContent,
} from "../lib/placeholder-data";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="available-section page-shell" id="browse">
          <div className="section-heading">
            <span className="eyebrow">{landingPageContent.listingsSection.eyebrow}</span>
            <h2>{landingPageContent.listingsSection.title}</h2>
            <p>{landingPageContent.listingsSection.subtitle}</p>
          </div>
          <SearchBar />
          <MasonryGrid
            items={landingPageContent.listings.slice(0, LANDING_LISTING_LIMIT)}
            desktopColumns={3}
            tabletColumns={2}
            mobileColumns={1}
            renderItem={(listing, index, ratio) => (
              <ListingCard
                listing={listing}
                ratio={ratio}
                key={`${index}-${listing.title}`}
              />
            )}
          />
          {landingPageContent.listings.length > LANDING_LISTING_LIMIT && (
            <div className="see-more-wrap">
              <LinkButton href="/listings" variant="solid">
                {landingPageContent.listingsSection.seeMore} (
                {landingPageContent.listings.length - LANDING_LISTING_LIMIT} more)
              </LinkButton>
            </div>
          )}
        </section>
        <LandlordCta />
      </main>
      <Footer />
    </>
  );
}
