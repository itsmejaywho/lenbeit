import { landingPageContent } from "../lib/placeholder-data";

export function Hero() {
  const { hero } = landingPageContent;

  return (
    <section className="hero page-shell" aria-labelledby="hero-title">
      <div className="hero-intro">
        <h1 id="hero-title">{hero.heading}</h1>
        <p>{hero.introduction}</p>
      </div>

      <div className="hero-panel" aria-label={hero.propertyTitle}>
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">{hero.eyebrow}</span>
          <h2>{hero.propertyTitle}</h2>
          <p>{hero.propertyDetails}</p>
        </div>

        <div className="hero-gallery" aria-label={hero.previewsLabel}>
          <div className="hero-thumbnails">
            {hero.thumbnails.map((thumbnail, index) => (
              <div
                className={`hero-thumbnail hero-thumbnail-${index + 1}`}
                aria-hidden="true"
                key={thumbnail}
              />
            ))}
          </div>
          <div className="hero-dashes" aria-hidden="true">
            <span className="hero-dash-active" />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
