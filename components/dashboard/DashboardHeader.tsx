"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { DashboardUserStatus } from "../../lib/mock-user";
import { CalendarIcon, RefreshIcon } from "../ui/icons";
import { DashboardAccountMenu } from "./DashboardAccountMenu";

export function DashboardHeader({ title, subtitle, userStatus, actions }: {
  title: string;
  subtitle: string;
  userStatus: DashboardUserStatus;
  actions?: ReactNode;
}) {
  const [dateLabel, setDateLabel] = useState("Today");

  useEffect(() => {
    const dateTimer = window.setTimeout(() => {
      setDateLabel(new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Singapore",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()));
    }, 0);
    return () => window.clearTimeout(dateTimer);
  }, []);

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-copy">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions && <div className="dashboard-header-actions">{actions}</div>}
      <div className="dashboard-header-tools">
        <span className="dashboard-date-chip"><CalendarIcon />{dateLabel}</span>
        <button className="dashboard-icon-button dashboard-refresh" type="button" aria-label="Refresh" title="Refresh">
          <RefreshIcon />
        </button>
        <DashboardAccountMenu userStatus={userStatus} location="header" />
      </div>
    </header>
  );
}
