import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function TenantsPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.tenants} href="/dashboard" />;
}
