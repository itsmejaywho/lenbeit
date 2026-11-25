import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconFrame({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="20"
      {...props}
    >
      {children}
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c.4-3.5 2.7-5.5 6.5-5.5s6.1 2 6.5 5.5" />
    </IconFrame>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-2.5 7-2.5 9h17C20.5 16 18 16 18 9Z" />
      <path d="M10 21h4" />
    </IconFrame>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m10 2-.5 2.2a8 8 0 0 0-1.8 1L5.6 4.4 3.4 8.2l1.8 1.4a8 8 0 0 0 0 2L3.4 13l2.2 3.8 2.1-.8a8 8 0 0 0 1.8 1L10 19.2h4l.5-2.2a8 8 0 0 0 1.8-1l2.1.8 2.2-3.8-1.8-1.4a8 8 0 0 0 0-2l1.8-1.4-2.2-3.8-2.1.8a8 8 0 0 0-1.8-1L14 2Z" transform="translate(0 1) scale(.95)" />
      <circle cx="12" cy="12" r="3" />
    </IconFrame>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-1.1 1-1.9 1.4-1.9 3" />
      <path d="M12 17.5v.1" />
    </IconFrame>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M13 4H5v16h8" />
      <path d="M10 12h10m-4-4 4 4-4 4" />
    </IconFrame>
  );
}

export function ChevronIcon({ open = false, ...props }: IconProps & { open?: boolean }) {
  return (
    <IconFrame {...props}>
      <path d={open ? "m6 14 6-6 6 6" : "m6 9 6 6 6-6"} />
    </IconFrame>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconFrame width="16" height="16" {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconFrame>
  );
}
