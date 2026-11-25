"use client";

import { useState } from "react";
import { landingPageContent } from "../lib/placeholder-data";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header" id="home">
      <nav className="navbar page-shell" aria-label={landingPageContent.navigationLabel}>
        <a className="brand" href="#home" aria-label={landingPageContent.brand}>
          <span className="brand-mark" aria-hidden="true">{landingPageContent.brand.charAt(0)}</span>
          <span>{landingPageContent.brand}</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? landingPageContent.closeMenu : landingPageContent.menu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div
          className={`nav-content${menuOpen ? " nav-content-open" : ""}`}
          id="primary-navigation"
        >
          <div className="nav-links">
            {landingPageContent.navigation.map((item, index) => (
              <a
                className={index === 0 ? "nav-link nav-link-active" : "nav-link"}
                href={item.href}
                key={item.label}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a className="button button-dark nav-cta" href="/login">
            {landingPageContent.listProperty}
          </a>
        </div>
      </nav>
    </header>
  );
}
