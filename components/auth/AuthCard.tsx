import type { ReactNode } from "react";
import Link from "next/link";
import { landingPageContent } from "../../lib/placeholder-data";

type AuthCardProps = {
  heading: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "register";
  align?: "center";
};

export function AuthCard({ heading, description, children, icon, variant, align }: AuthCardProps) {
  return (
    <main className={`login-page${variant === "register" ? " login-page-register" : ""}`}>
      <section
        className={`login-card${align === "center" ? " login-card-center" : ""}`}
        style={align === "center" ? { textAlign: "center" } : undefined}
        aria-labelledby="auth-card-heading"
      >
        <Link className="brand login-brand" href="/" aria-label={landingPageContent.brand}>
          <span className="brand-mark" aria-hidden="true">{landingPageContent.brand.charAt(0)}</span>
          <span>{landingPageContent.brand}</span>
        </Link>
        {icon && <div className="auth-card-icon">{icon}</div>}
        <header className="login-heading">
          <h1 id="auth-card-heading">{heading}</h1>
          <p
            style={align === "center" ? { maxWidth: "34ch", marginInline: "auto", overflowWrap: "anywhere" } : undefined}
          >
            {description}
          </p>
        </header>
        {children}
      </section>
    </main>
  );
}
