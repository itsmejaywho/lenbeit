export function safeNextPath(value: string | string[] | undefined): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return undefined;
  }

  try {
    const destination = new URL(candidate, "https://rentora.invalid");
    return destination.origin === "https://rentora.invalid"
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : undefined;
  } catch {
    return undefined;
  }
}
