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

export function HomeIcon(props: IconProps) {
  return <IconFrame {...props}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></IconFrame>;
}

export function ShieldCheckIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></IconFrame>;
}

export function BoxIcon(props: IconProps) {
  return <IconFrame {...props}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></IconFrame>;
}

export function TagIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M20.6 13.4 13 21l-10-10V3h8l9.6 9.6a.6.6 0 0 1 0 .8Z" /><circle cx="7.5" cy="7.5" r="1" /></IconFrame>;
}

export function ChatIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" /></IconFrame>;
}

export function PeopleIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></IconFrame>;
}

export function CalendarIcon(props: IconProps) {
  return <IconFrame {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></IconFrame>;
}

export function RefreshIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.4-3" /></IconFrame>;
}

export function SearchIcon(props: IconProps) {
  return <IconFrame {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconFrame>;
}

export function FilterIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M4 7h16M7 12h10m-7 5h4" /><circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="11" cy="17" r="1.5" fill="currentColor" stroke="none" /></IconFrame>;
}

export function PlusIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M12 5v14M5 12h14" /></IconFrame>;
}

export function MoreIcon(props: IconProps) {
  return <IconFrame {...props}><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></IconFrame>;
}

export function LockIcon(props: IconProps) {
  return <IconFrame {...props}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></IconFrame>;
}

export function ExpandIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 8l6-5m12 5-6-5M3 16l6 5m12-5-6 5" /></IconFrame>;
}

export function ChevronRightIcon(props: IconProps) {
  return <IconFrame {...props}><path d="m9 18 6-6-6-6" /></IconFrame>;
}

export function WaterIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7Z" /></IconFrame>;
}

export function WifiIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01" /></IconFrame>;
}

export function BoltIcon(props: IconProps) {
  return <IconFrame {...props}><path d="m13 2-3 8H5l6 12 3-8h5L13 2Z" /></IconFrame>;
}

export function FanIcon(props: IconProps) {
  return <IconFrame {...props}><circle cx="12" cy="12" r="2" /><path d="M12 10c-1-7 5-8 6-5 1 2-1 4-4 6M14 12c7-1 8 5 5 6-2 1-4-1-6-4M12 14c1 7-5 8-6 5-1-2 1-4 4-6M10 12c-7 1-8-5-5-6 2-1 4 1 6 4" /></IconFrame>;
}

export function EyeIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></IconFrame>;
}

export function ClockIcon(props: IconProps) {
  return <IconFrame {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></IconFrame>;
}

export type DashboardNavIconName = "home" | "shield-check" | "box" | "tag" | "chat" | "people" | "help" | "settings";

export function DashboardNavIcon({ name, ...props }: IconProps & { name: DashboardNavIconName }) {
  switch (name) {
    case "home": return <HomeIcon {...props} />;
    case "shield-check": return <ShieldCheckIcon {...props} />;
    case "box": return <BoxIcon {...props} />;
    case "tag": return <TagIcon {...props} />;
    case "chat": return <ChatIcon {...props} />;
    case "people": return <PeopleIcon {...props} />;
    case "help": return <HelpIcon {...props} />;
    case "settings": return <SettingsIcon {...props} />;
  }
}
