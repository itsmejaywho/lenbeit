export function validateEmailAddress(value: string) {
  if (!value.trim()) return "Enter your email address.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? null
    : "Enter a valid email address.";
}

export function validateNonEmptyPassword(value: string) {
  return value.trim() ? null : "Enter your password.";
}
