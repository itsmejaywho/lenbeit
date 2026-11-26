import { DashboardPlaceholderRoute } from "../../../components/dashboard/DashboardPlaceholderRoute";
import { dashboardCopy } from "../../../lib/dashboard-placeholder";

export default function InquiriesPage() {
  return <DashboardPlaceholderRoute page={dashboardCopy.inquiries} href="/dashboard/rooms" />;
}
