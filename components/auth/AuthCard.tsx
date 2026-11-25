import type { ReactNode } from "react";
import Link from "next/link";
import { landingPageContent } from "../../lib/placeholder-data";

type AuthCardProps = {
  heading: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
};

export function AuthCard({ heading, description, children, icon }: AuthCardProps) {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="auth-card-heading">
        <Link className="brand login-brand" href="/" aria-label={landingPageContent.brand}>
          <span className="brand-mark" aria-hidden="true">{landingPageContent.brand.charAt(0)}</span>
          <span>{landingPageContent.brand}</span>
        </Link>
        {icon && <div className="auth-card-icon">{icon}</div>}
        <header className="login-heading">
          <h1 id="auth-card-heading">{heading}</h1>
          <p>{description}</p>
        </header>
        {children}
      </section>
    </main>
  );
}
