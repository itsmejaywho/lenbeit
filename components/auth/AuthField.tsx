"use client";

import { useState, type ReactNode, type Ref } from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "password";
  autoComplete: string;
  value: string;
  placeholder?: string;
  error?: string | null;
  validAfterBlur?: boolean;
  required?: boolean;
  inputMode?: "text" | "email" | "tel" | "numeric";
  inputRef?: Ref<HTMLInputElement>;
  helperText?: string;
  after?: ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m4.5 10.5 3.4 3.4 7.6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.6" />
      {hidden && <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
    </svg>
  );
}

export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  placeholder,
  error,
  validAfterBlur = false,
  required = false,
  inputMode,
  inputRef,
  helperText,
  after,
  disabled = false,
  onChange,
  onBlur,
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const hasPasswordToggle = type === "password";
  const actualType = hasPasswordToggle && showPassword ? "text" : type;
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="login-field">
      <label htmlFor={id}>{label}</label>
      <div className={`login-input-shell${hasPasswordToggle ? " login-input-shell-password" : ""}${error ? " login-input-shell-error" : ""}${validAfterBlur && value.trim() ? " login-input-shell-valid" : ""}`}>
        <input
          autoComplete={autoComplete}
          disabled={disabled}
          id={id}
          inputMode={inputMode}
          ref={inputRef}
          type={actualType}
          value={value}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        {validAfterBlur && value.trim() && <span className="login-valid-icon"><CheckIcon /></span>}
        {hasPasswordToggle && (
          <button
            className="login-eye-toggle"
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((shown) => !shown)}
          >
            <EyeIcon hidden={showPassword} />
          </button>
        )}
      </div>
      {helperText && <p className="login-field-help" id={helperId}>{helperText}</p>}
      {after}
      {error && <p className="login-error" id={errorId} aria-live="polite">{error}</p>}
    </div>
  );
}
