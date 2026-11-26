import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "../../../components/auth/AuthCard";
import { ResendEmailButton } from "../../../components/auth/ResendEmailButton";
import { safeNextPath } from "../../../lib/auth";

type CheckEmailPageProps = {
  searchParams: Promise<{ email?: string | string[]; next?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function MailIcon() {
  return (
    <div className="check-email-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

async function CheckEmailContent({ searchParams }: CheckEmailPageProps) {
  const params = await searchParams;
  const email = firstValue(params.email)?.trim() || "your email address";
  const next = safeNextPath(params.next);
  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : "/register";
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <AuthCard
      align="center"
      heading="Check your email"
      description={`We sent a confirmation link to ${email}. Click it to activate your account.`}
      icon={<MailIcon />}
    >
      <div className="check-email-actions">
        <ResendEmailButton />
        <div className="check-email-links" style={{ display: "grid", gap: 6 }}>
          <p><Link href={registerHref}>Wrong email? Go back</Link></p>
          <p><Link href={loginHref}>Back to login</Link></p>
        </div>
        <p className="check-email-note">Didn&apos;t get it? Check your spam folder.</p>
      </div>
    </AuthCard>
  );
}

export default function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  return (
    <Suspense fallback={<AuthCard align="center" heading="Check your email" description="We sent a confirmation link to your email address. Click it to activate your account." icon={<MailIcon />}><div className="auth-query-fallback auth-query-fallback-check" aria-hidden="true" /></AuthCard>}>
      <CheckEmailContent searchParams={searchParams} />
    </Suspense>
  );
}
