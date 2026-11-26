import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function VerificationPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.verification} href="/dashboard" />;
}
