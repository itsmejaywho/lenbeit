import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function SettingsPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.settings} href="/dashboard" />;
}
