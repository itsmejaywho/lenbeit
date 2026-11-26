import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function ListingsPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.listings} href="/dashboard/rooms" />;
}
