import type { ReactNode } from "react";
import type { DashboardUserStatus } from "../../lib/mock-user";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardPage({ title, subtitle, userStatus, children, actions }: {
  title: string;
  subtitle: string;
  userStatus: DashboardUserStatus;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <>
      <DashboardHeader title={title} subtitle={subtitle} userStatus={userStatus} actions={actions} />
      <main className="dashboard-content">{children}</main>
    </>
  );
}
