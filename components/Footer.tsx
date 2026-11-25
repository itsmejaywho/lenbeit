import { landingPageContent } from "../lib/placeholder-data";

export function Footer() {
  return (
    <footer className="site-footer page-shell" id="about">
      <a className="brand footer-brand" href="#home">
        <span className="brand-mark" aria-hidden="true">{landingPageContent.brand.charAt(0)}</span>
        <span>{landingPageContent.brand}</span>
      </a>
      <nav className="footer-links" aria-label={landingPageContent.footerNavigationLabel}>
        {landingPageContent.footerLinks.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>
      <p className="copyright">{landingPageContent.copyright}</p>
    </footer>
  );
}
