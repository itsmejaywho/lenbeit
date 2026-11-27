"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardPage } from "../../../components/dashboard/DashboardPage";
import { RoomsDashboard } from "../../../components/dashboard/RoomsDashboard";
import { useDashboardUser } from "../../../components/dashboard/DashboardContext";

function RoomsPageContent() {
  const { userStatus } = useDashboardUser();
  const searchParams = useSearchParams();
  return (
    <DashboardPage title="Rooms" subtitle="Manage your rooms, availability, and listings in one place." userStatus={userStatus}>
      <RoomsDashboard showSavedNotice={Boolean(searchParams.get("saved"))} />
    </DashboardPage>
  );
}

export default function RoomsPage() {
  return <Suspense fallback={null}><RoomsPageContent /></Suspense>;
}
