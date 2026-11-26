import type { DashboardNavItem } from "./dashboard-nav";

// Example of reusing the generic dashboard navigation with a smaller admin menu.
export const adminNavItems = [
  { id: "overview", label: "Overview", href: "/admin", icon: "home", group: "main", requires: null },
  { id: "users", label: "Users", href: "/admin/users", icon: "people", group: "main", requires: null },
] satisfies readonly DashboardNavItem[];
