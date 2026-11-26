import { AuthCard } from "../../components/auth/AuthCard";

export default function VerifyEmailPage() {
  // TODO: Validate the confirmation token against the PHP backend before activating the account.
  return (
    <AuthCard
      align="center"
      heading="Confirming your email"
      description="Email confirmation is coming soon."
    >
      <p>Email confirmation is not available yet.</p>
    </AuthCard>
  );
}
