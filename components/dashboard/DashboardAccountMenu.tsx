"use client";

import { accountMenuCopy } from "../../lib/dashboard-placeholder";
import type { DashboardUserStatus } from "../../lib/mock-user";
import { Placeholder } from "../Placeholder";
import { Dropdown, type DropdownItem } from "../ui/Dropdown";
import { BellIcon, HelpIcon, LogoutIcon, SettingsIcon, UserIcon } from "../ui/icons";

const accountIcons = {
  profile: UserIcon,
  notification: BellIcon,
  settings: SettingsIcon,
  help: HelpIcon,
  logout: LogoutIcon,
};

export function DashboardAccountMenu({ userStatus, location }: { userStatus: DashboardUserStatus; location: "sidebar" | "header" }) {
  const items: DropdownItem[] = accountMenuCopy.map((item) => {
    const Icon = accountIcons[item.id];
    return {
      ...item,
      icon: <Icon />,
      onSelect: item.id === "logout" ? () => {
        // TODO: Connect this action to the logout helper when authentication is added.
      } : undefined,
    };
  });
  const initial = userStatus.name.trim().charAt(0).toUpperCase() || "R";
  const trigger = (
    <span className="dashboard-avatar" aria-hidden="true">
      <span className="dashboard-avatar-visual"><Placeholder tone="sand" ratio="1" /></span>
      <span className="dashboard-avatar-initial">{initial}</span>
    </span>
  );

  return (
    <div className={`dashboard-account dashboard-account-${location}`}>
      <Dropdown
        items={items}
        trigger={trigger}
        aria-label="Account menu"
        placement={location === "sidebar" ? "right-end" : "bottom-end"}
        variant="inline"
      />
    </div>
  );
}
