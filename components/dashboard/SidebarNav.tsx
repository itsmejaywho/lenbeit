"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "../../lib/dashboard-nav";
import type { DashboardUserStatus } from "../../lib/mock-user";
import { landingPageContent } from "../../lib/placeholder-data";
import { DashboardAccountMenu } from "./DashboardAccountMenu";
import { NavItem } from "./NavItem";

export function SidebarNav({ items, userStatus }: { items: readonly DashboardNavItem[]; userStatus: DashboardUserStatus }) {
  const pathname = usePathname();
  const mainItems = items.filter((item) => item.group !== "bottom");
  const bottomItems = items.filter((item) => item.group === "bottom");

  return (
    <>
      <aside className="dashboard-sidebar" aria-label="Dashboard sidebar">
        <Link className="dashboard-sidebar-logo" href="/dashboard" aria-label={`${landingPageContent.brand} dashboard`}>
          <span className="brand-mark" aria-hidden="true">{landingPageContent.brand.charAt(0)}</span>
        </Link>
        <nav className="dashboard-nav" aria-label="Landlord dashboard">
          <div className="dashboard-nav-group">
            {mainItems.map((item) => <NavItem key={item.id} item={item} currentPath={pathname} userStatus={userStatus} mode="desktop" />)}
          </div>
          <div className="dashboard-nav-bottom">
            <div className="dashboard-nav-group">
              {bottomItems.map((item) => <NavItem key={item.id} item={item} currentPath={pathname} userStatus={userStatus} mode="desktop" />)}
            </div>
            <DashboardAccountMenu userStatus={userStatus} location="sidebar" />
          </div>
        </nav>
      </aside>
      <nav className="dashboard-mobile-nav" aria-label="Landlord dashboard" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => <NavItem key={item.id} item={item} currentPath={pathname} userStatus={userStatus} mode="mobile" />)}
      </nav>
    </>
  );
}
