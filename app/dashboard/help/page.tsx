import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function HelpPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.help} href="/dashboard" />;
}
