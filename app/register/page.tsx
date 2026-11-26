import { Suspense } from "react";
import { AuthCard } from "../../components/auth/AuthCard";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { safeNextPath } from "../../lib/auth";

type RegisterPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

async function RegisterContent({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  return <RegisterForm next={next} />;
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <AuthCard
      variant="register"
      heading="Create your account"
      description="It takes about a minute. Add your property details after confirming your email."
    >
      <Suspense fallback={<div className="auth-query-fallback auth-query-fallback-register" aria-hidden="true" />}>
        <RegisterContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
