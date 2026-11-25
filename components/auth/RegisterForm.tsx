"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthField } from "./AuthField";
import { AuthGoogleButton } from "./AuthGoogleButton";
import { useFormField } from "../../lib/useFormField";
import { validateEmailAddress } from "../../lib/validation";

function validateFullName(value: string) {
  if (!value.trim()) return "Enter your full name.";
  return value.trim().length >= 2 ? null : "Enter at least 2 characters.";
}

function validateMobileNumber(value: string) {
  if (!value.trim()) return "Enter your mobile number.";
  const normalized = value.replace(/[\s-]/g, "");
  return /^09\d{9}$/.test(normalized) || /^\+639\d{9}$/.test(normalized)
    ? null
    : "Enter a valid Philippine mobile number.";
}

function validateRegistrationPassword(value: string) {
  if (!value.trim()) return "Enter your password.";
  const meetsRules = value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
  return meetsRules ? null : "Use at least 8 characters with a letter and a number.";
}

function validateConfirmPassword(value: string, password: string) {
  if (!value.trim()) return "Confirm your password.";
  return value === password ? null : "Passwords do not match.";
}

function validateAgreement(value: string) {
  return value === "agreed" ? null : "You must agree to continue.";
}

function getPasswordStrength(value: string): "weak" | "okay" | "strong" | null {
  if (!value) return null;
  const meetsRules = value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
  if (!meetsRules) return "weak";
  return value.length >= 12 ? "strong" : "okay";
}

function PasswordStrength({ value }: { value: string }) {
  const strength = getPasswordStrength(value);
  if (!strength) return null;
  const activeBars = strength === "weak" ? 1 : strength === "okay" ? 2 : 3;

  return (
    <div className={`register-strength register-strength-${strength}`}>
      <div className="register-strength-bars" role="img" aria-label={`Password strength: ${strength}`}>
        {[1, 2, 3].map((bar) => <span className={bar <= activeBars ? "register-strength-active" : ""} key={bar} />)}
      </div>
      <span>Password strength: {strength}</span>
    </div>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const router = useRouter();
  const fullName = useFormField(validateFullName);
  const email = useFormField(validateEmailAddress);
  const mobile = useFormField(validateMobileNumber);
  const password = useFormField(validateRegistrationPassword);
  const confirm = useFormField((value) => validateConfirmPassword(value, password.value));
  const agreement = useFormField(validateAgreement);
  const [creating, setCreating] = useState(false);
  const [googleStatus, setGoogleStatus] = useState("");
  const creatingRef = useRef(false);
  const redirectTimer = useRef<number | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const agreementRef = useRef<HTMLInputElement>(null);
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  useEffect(() => () => {
    if (redirectTimer.current !== null) window.clearTimeout(redirectTimer.current);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creatingRef.current) return;
    setGoogleStatus("");

    const errors = [
      fullName.validateForSubmit(),
      email.validateForSubmit(),
      mobile.validateForSubmit(),
      password.validateForSubmit(),
      confirm.validateForSubmit(),
      agreement.validateForSubmit(),
    ];
    const firstInvalid = errors.findIndex(Boolean);
    const fields = [nameRef, emailRef, mobileRef, passwordRef, confirmRef, agreementRef];
    if (firstInvalid >= 0) {
      fields[firstInvalid].current?.focus();
      return;
    }

    creatingRef.current = true;
    setCreating(true);
    const query = new URLSearchParams();
    query.set("email", email.value);
    if (next) query.set("next", next);

    // TODO: Replace this simulated delay with the existing apiRequest helper once PHP POST support and the registration endpoint are ready. The backend must repeat all validation, check email uniqueness, and hash the password.
    // TODO: Switch the confirmation screen to read the email from the server session rather than this URL parameter once the backend exists.
    password.handleChange("");
    confirm.handleChange("");
    redirectTimer.current = window.setTimeout(() => {
      router.push(`/register/check-email?${query.toString()}`);
    }, 700);
  }

  function handlePasswordChange(value: string) {
    password.handleChange(value);
    if (confirm.value.trim()) {
      confirm.revalidateWith((confirmValue) => validateConfirmPassword(confirmValue, value));
    }
    setGoogleStatus("");
  }

  function handleAgreementChange(checked: boolean) {
    agreement.handleChange(checked ? "agreed" : "");
    setGoogleStatus("");
  }

  return (
    <>
      <form className="login-form register-form" noValidate onSubmit={handleSubmit}>
        <AuthField
          id="register-name"
          label="Full name"
          autoComplete="name"
          value={fullName.value}
          placeholder="Your full name"
          required
          error={fullName.error}
          validAfterBlur={fullName.validAfterBlur}
          inputRef={nameRef}
          disabled={creating}
          onChange={(value) => { fullName.handleChange(value); setGoogleStatus(""); }}
          onBlur={fullName.handleBlur}
        />

        <AuthField
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email.value}
          placeholder="you@example.com"
          required
          error={email.error}
          validAfterBlur={email.validAfterBlur}
          inputRef={emailRef}
          disabled={creating}
          onChange={(value) => { email.handleChange(value); setGoogleStatus(""); }}
          onBlur={email.handleBlur}
        />

        <AuthField
          id="register-mobile"
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={mobile.value}
          placeholder="09XX XXX XXXX"
          required
          error={mobile.error}
          validAfterBlur={mobile.validAfterBlur}
          inputRef={mobileRef}
          disabled={creating}
          onChange={(value) => { mobile.handleChange(value); setGoogleStatus(""); }}
          onBlur={mobile.handleBlur}
        />

        <AuthField
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password.value}
          placeholder="Create a password"
          helperText="At least 8 characters, with a letter and a number"
          required
          error={password.error}
          validAfterBlur={password.validAfterBlur}
          inputRef={passwordRef}
          disabled={creating}
          after={<PasswordStrength value={password.value} />}
          onChange={handlePasswordChange}
          onBlur={password.handleBlur}
        />

        <AuthField
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirm.value}
          placeholder="Re-enter your password"
          required
          error={confirm.error}
          validAfterBlur={confirm.validAfterBlur}
          inputRef={confirmRef}
          disabled={creating}
          onChange={(value) => { confirm.handleChange(value); setGoogleStatus(""); }}
          onBlur={confirm.handleBlur}
        />

        <div className="register-consent-field">
          <div className="register-consent-row">
            <input
              id="register-agreement"
              ref={agreementRef}
              type="checkbox"
              required
              checked={agreement.value === "agreed"}
              aria-invalid={agreement.error ? true : undefined}
              aria-describedby={agreement.error ? "register-agreement-error" : undefined}
              disabled={creating}
              onChange={(event) => handleAgreementChange(event.target.checked)}
              onBlur={agreement.handleBlur}
            />
            <label htmlFor="register-agreement">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>Terms</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>Privacy Policy</a>
            </label>
          </div>
          {agreement.error && <p className="login-error" id="register-agreement-error" aria-live="polite">{agreement.error}</p>}
        </div>

        <button className="button button-dark login-submit" type="submit" disabled={creating}>
          {creating ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="login-divider" aria-hidden="true"><span>or</span></div>
      <AuthGoogleButton onClick={() => setGoogleStatus("Google sign-in is coming soon.")} />
      {googleStatus && <p className="login-status" role="status" aria-live="polite">{googleStatus}</p>}
      <p className="login-signup">Already have an account? <Link href={loginHref}>Log in</Link></p>
    </>
  );
}
