import { Suspense } from "react";
import { AuthCard } from "../../components/auth/AuthCard";
import { LoginForm } from "../../components/auth/LoginForm";
import { safeNextPath } from "../../lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

async function LoginContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  return <LoginForm next={next} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthCard
      heading="Welcome back!"
      description="Enter the email and password you used to register."
    >
      <Suspense fallback={<div className="auth-query-fallback auth-query-fallback-login" aria-hidden="true" />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
