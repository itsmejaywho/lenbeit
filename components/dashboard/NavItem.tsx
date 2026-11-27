"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import type { DashboardNavItem } from "../../lib/dashboard-nav";
import type { DashboardUserStatus } from "../../lib/mock-user";
import { DashboardNavIcon, LockIcon } from "../ui/icons";

type NavItemProps = {
  item: DashboardNavItem;
  currentPath: string;
  userStatus: DashboardUserStatus;
  mode: "desktop" | "mobile";
};

function isActive(item: DashboardNavItem, path: string) {
  return item.href === "/dashboard"
    ? path === "/dashboard" || path.startsWith("/dashboard/rooms/")
    : path === item.href || path.startsWith(`${item.href}/`);
}

function lockMessage(item: DashboardNavItem, userStatus: DashboardUserStatus) {
  if (item.requires === "emailVerified" && !userStatus.emailVerified) return "Available after your email is confirmed.";
  if (item.requires === "approved" && userStatus.verificationStatus !== "approved") return "Available after your account is approved.";
  return "";
}

export function NavItem({ item, currentPath, userStatus, mode }: NavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const active = isActive(item, currentPath);
  const message = lockMessage(item, userStatus);
  const locked = Boolean(message);
  const labelId = `dashboard-nav-label-${item.id}`;
  const tooltipId = `dashboard-nav-tip-${item.id}`;
  const classes = [
    "dashboard-nav-item",
    `dashboard-nav-item-${mode}`,
    active ? "is-active" : "",
    locked ? "is-locked" : "",
    showTooltip ? "show-message" : "",
  ].filter(Boolean).join(" ");
  const commonProps = {
    className: classes,
    "aria-label": item.label,
    "aria-current": active ? "page" as const : undefined,
    "aria-describedby": locked && showTooltip ? tooltipId : undefined,
    onMouseEnter: () => setShowTooltip(true),
    onMouseLeave: () => setShowTooltip(false),
    onFocus: () => setShowTooltip(true),
    onBlur: () => setShowTooltip(false),
    onClick: () => setShowTooltip(false),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        setShowTooltip(false);
        event.currentTarget.blur();
      }
    },
  };

  return (
    <span className="dashboard-nav-entry">
      {locked ? (
        <button type="button" {...commonProps}>
          <span className="dashboard-nav-icon"><DashboardNavIcon name={item.icon} /></span>
          {mode === "mobile" && <span className="dashboard-nav-mobile-label">{item.label}</span>}
          <span className="dashboard-nav-text" id={labelId}>{item.label}</span>
          <LockIcon className="dashboard-nav-lock" />
        </button>
      ) : (
        <Link href={item.href} {...commonProps}>
          <span className="dashboard-nav-icon"><DashboardNavIcon name={item.icon} /></span>
          {mode === "mobile" && <span className="dashboard-nav-mobile-label">{item.label}</span>}
          <span className="dashboard-nav-text" id={labelId}>{item.label}</span>
        </Link>
      )}
      <span className="dashboard-nav-tooltip" id={tooltipId} role="tooltip">
        {locked ? message : item.label}
        {item.comingSoon && <span className="dashboard-nav-soon">Soon</span>}
      </span>
    </span>
  );
}
