"use client";

import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPage } from "./DashboardPage";
import { useDashboardUser } from "./DashboardContext";

export function DashboardPlaceholderRoute({ page, href }: {
  page: { title: string; subtitle: string; message: string; action: string };
  href: string;
}) {
  const { userStatus } = useDashboardUser();
  return (
    <DashboardPage title={page.title} subtitle={page.subtitle} userStatus={userStatus}>
      <DashboardEmptyState message={page.message} action={page.action} href={href} />
    </DashboardPage>
  );
}
