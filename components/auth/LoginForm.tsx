"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthField } from "./AuthField";
import { AuthGoogleButton } from "./AuthGoogleButton";
import { useFormField } from "../../lib/useFormField";
import { validateEmailAddress, validateNonEmptyPassword } from "../../lib/validation";

export function LoginForm({ next }: { next?: string }) {
  const email = useFormField(validateEmailAddress);
  const password = useFormField(validateNonEmptyPassword);
  const [status, setStatus] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : "/register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const emailError = email.validateForSubmit();
    const passwordError = password.validateForSubmit();
    if (emailError) {
      emailRef.current?.focus();
      return;
    }
    if (passwordError) {
      passwordRef.current?.focus();
      return;
    }
    setStatus("Sign in is not connected yet.");
  }

  return (
    <>
      <form className="login-form" noValidate onSubmit={handleSubmit}>
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email.value}
          placeholder="you@example.com"
          error={email.error}
          validAfterBlur={email.validAfterBlur}
          inputRef={emailRef}
          onChange={(value) => { email.handleChange(value); setStatus(""); }}
          onBlur={email.handleBlur}
        />

        <AuthField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password.value}
          placeholder="Enter your password"
          error={password.error}
          validAfterBlur={password.validAfterBlur}
          inputRef={passwordRef}
          onChange={(value) => { password.handleChange(value); setStatus(""); }}
          onBlur={password.handleBlur}
        />

        <div className="login-forgot-wrap">
          <a href="/forgot-password">Forgot your password?</a>
        </div>

        <button className="button button-dark login-submit" type="submit">Log in</button>
        {status && <p className="login-status" role="status" aria-live="polite">{status}</p>}
      </form>

      <div className="login-divider" aria-hidden="true"><span>or</span></div>
      <AuthGoogleButton onClick={() => setStatus("Google sign-in is coming soon.")} />
      <p className="login-signup">Haven&apos;t signed up yet? <Link href={registerHref}>Create an account</Link></p>
    </>
  );
}
