"use client";

import { DashboardPage } from "../../components/dashboard/DashboardPage";
import { DashboardStatusCard } from "../../components/dashboard/DashboardStatusCard";
import { RoomsDashboard } from "../../components/dashboard/RoomsDashboard";
import { useDashboardUser } from "../../components/dashboard/DashboardContext";
import { dashboardCopy } from "../../lib/dashboard-placeholder";

export default function DashboardOverviewPage() {
  const { userStatus } = useDashboardUser();
  const status = !userStatus.emailVerified
    ? "unverified"
    : userStatus.verificationStatus === "approved"
      ? "not_submitted"
      : userStatus.verificationStatus;
  const approved = userStatus.emailVerified && userStatus.verificationStatus === "approved";
  const title = approved ? dashboardCopy.overview.title : "Overview";
  const subtitle = approved
    ? dashboardCopy.overview.subtitle
    : "Complete your verification to start listing.";
  return (
    <DashboardPage title={title} subtitle={subtitle} userStatus={userStatus}>
      {approved ? <RoomsDashboard /> : <DashboardStatusCard status={status} />}
    </DashboardPage>
  );
}
