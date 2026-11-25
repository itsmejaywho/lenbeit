import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
};

export function LinkButton({
  href,
  children,
  variant = "solid",
}: LinkButtonProps) {
  const variantClass = variant === "solid" ? "button-dark" : "button-outline";

  return (
    <a className={`button ${variantClass}`} href={href}>
      {children}
    </a>
  );
}
