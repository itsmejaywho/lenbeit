"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardPage } from "../../components/dashboard/DashboardPage";
import { DashboardStatusCard } from "../../components/dashboard/DashboardStatusCard";
import { RoomsDashboard } from "../../components/dashboard/RoomsDashboard";
import { useDashboardUser } from "../../components/dashboard/DashboardContext";
import { dashboardCopy } from "../../lib/dashboard-placeholder";

function DashboardOverviewContent() {
  const { userStatus } = useDashboardUser();
  const showSavedNotice = Boolean(useSearchParams().get("saved"));
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
      {approved ? <RoomsDashboard showSavedNotice={showSavedNotice} /> : (
        <>
          {showSavedNotice && <p className="room-form-notice" role="status">Room saved locally.</p>}
          <DashboardStatusCard status={status} />
        </>
      )}
    </DashboardPage>
  );
}

export default function DashboardOverviewPage() {
  return <Suspense fallback={null}><DashboardOverviewContent /></Suspense>;
}
