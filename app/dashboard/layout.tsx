import type { ReactNode } from "react";
import { DashboardFrame, DashboardProvider } from "../../components/dashboard/DashboardContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </DashboardProvider>
  );
}
