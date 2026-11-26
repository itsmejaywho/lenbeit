import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function RoomsPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.rooms} href="/dashboard" />;
}
