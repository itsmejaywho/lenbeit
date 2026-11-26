import type { DashboardNavIconName } from "../components/ui/icons";

export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
  icon: DashboardNavIconName;
  group?: "main" | "bottom";
  requires?: "emailVerified" | "approved" | null;
  comingSoon?: boolean;
};

export const dashboardNavItems = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: "home", group: "main", requires: null },
  { id: "verification", label: "Verification", href: "/dashboard/verification", icon: "shield-check", group: "main", requires: null },
  { id: "rooms", label: "Rooms", href: "/dashboard/rooms", icon: "box", group: "main", requires: "approved" },
  { id: "listings", label: "Listings", href: "/dashboard/listings", icon: "tag", group: "main", requires: "approved", comingSoon: true },
  { id: "inquiries", label: "Inquiries", href: "/dashboard/inquiries", icon: "chat", group: "main", requires: "approved", comingSoon: true },
  { id: "tenants", label: "Tenants and rent", href: "/dashboard/tenants", icon: "people", group: "main", comingSoon: true },
  { id: "help", label: "Help", href: "/dashboard/help", icon: "help", group: "bottom" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings", group: "bottom" },
] satisfies readonly DashboardNavItem[];
